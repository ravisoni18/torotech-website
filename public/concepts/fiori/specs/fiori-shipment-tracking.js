/*! © 2026 Torotech Inc. All rights reserved. https://torotech.ca — may not be copied, reused or redistributed without written permission. See https://torotech.ca/legal */
var SHIP = {
  "SH-77120": { route: "Toronto → Montréal", carrier: "Corvane Freight · TRK-482", driver: "Luc Gagnon", eta: "16:40 today", progress: 62, stops: [["1", "Toronto DC · pickup", "07:00", "06:55", "22", "Departed", "Success"], ["2", "Belleville · drop", "09:30", "09:41", "6", "Delivered", "Success"], ["3", "Cornwall · drop", "13:15", "ETA 13:10", "8", "En route", "Information"], ["4", "Montréal DC · drop", "16:45", "ETA 16:40", "8", "Planned", "None"]] },
  "SH-77118": { route: "Hamilton → Ottawa", carrier: "Lakeline Transport · TRK-219", driver: "Amira Saleh", eta: "15:25 today (+40 min)", progress: 48, stops: [["1", "Hamilton plant · pickup", "06:30", "06:41", "18", "Departed", "Success"], ["2", "Kingston · drop", "10:45", "ETA 11:25", "10", "Delayed", "Warning"], ["3", "Ottawa · Store 4", "14:45", "ETA 15:25", "8", "Planned", "None"]] },
  "SH-77115": { route: "Toronto → Detroit", carrier: "Corvane Freight · TRK-507", driver: "Ben Okoro", eta: "13:10 today", progress: 70, stops: [["1", "Toronto DC · pickup", "05:30", "05:28", "26", "Departed", "Success"], ["2", "Ambassador Bridge · customs", "10:30", "In inspection", "—", "At border", "Information"], ["3", "Detroit DC · drop", "12:30", "ETA 13:10", "26", "Planned", "None"]] },
  "SH-77102": { route: "Toronto → Buffalo", carrier: "Corvane Freight · TRK-133", driver: "Sara Lind", eta: "Delivered with exception", progress: 100, stops: [["1", "Toronto DC · pickup", "06:00", "06:02", "14", "Departed", "Success"], ["2", "Buffalo DC · drop", "09:45", "09:52", "10 of 14", "Refused · damaged", "Error"]] },
};
FioriKit.run({
  title: "Track Shipments",
  start: "fcl",
  data: {
    list: [
      { id: "SH-77120", route: "Toronto → Montréal", mode: "Truck · 4 stops", status: "On time", statusState: "Success" },
      { id: "SH-77118", route: "Hamilton → Ottawa", mode: "Truck · 3 stops", status: "Delayed 40m", statusState: "Warning" },
      { id: "SH-77115", route: "Toronto → Detroit", mode: "Truck · customs", status: "At border", statusState: "Information" },
      { id: "SH-77102", route: "Toronto → Buffalo", mode: "Truck · 2 stops", status: "Exception", statusState: "Error" },
    ],
    sel: {}, stops: [], events: [
      { t: "13:02", e: "Geofence: 10 km from stop", s: "Information" }, { t: "12:41", e: "ETA updated to 13:10 (−5 min)", s: "Success" }, { t: "11:58", e: "Driver break ended", s: "None" },
      { t: "11:28", e: "Driver break started · 30 min", s: "None" }, { t: "09:41", e: "Stop 2 proof of delivery signed · 6 pallets", s: "Success" }, { t: "09:12", e: "Traffic delay on Hwy 401 · +11 min", s: "Warning" },
    ],
    exceptions: [
      { id: "SH-77102", stop: "Buffalo DC", exc: "Refused · damaged", excState: "Error", carrier: "Corvane Freight", rep: "Nov 13, 11:20", impact: "4 pallets", owner: "Kai Brooks", status: "Open", statusState: "Error" },
      { id: "SH-77118", stop: "Ottawa · Store 4", exc: "Delay", excState: "Warning", carrier: "Lakeline Transport", rep: "Nov 13, 10:05", impact: "+40 min", owner: "Nina Patel", status: "Monitoring", statusState: "Warning" },
      { id: "SH-77066", stop: "Kingston DC", exc: "Short delivery", excState: "Warning", carrier: "Corvane Freight", rep: "Nov 12, 15:42", impact: "1 pallet", owner: "Kai Brooks", status: "Claim filed", statusState: "Information" },
      { id: "SH-77041", stop: "Windsor · Store 9", exc: "Temperature", excState: "Error", carrier: "Polar Haul", rep: "Nov 11, 07:18", impact: "Chilled load", owner: "Leo Martin", status: "Open", statusState: "Error" },
      { id: "SH-77015", stop: "Montréal DC", exc: "Delay", excState: "Warning", carrier: "Lakeline Transport", rep: "Nov 10, 16:50", impact: "+1 h 20", owner: "Nina Patel", status: "Resolved", statusState: "Success" },
    ],
  },
  pages: {
    fcl: {
      type: "custom",
      build: function (ctx) {
        var m = ctx.m, model = ctx.model, fcl;
        function select(id) {
          var s = SHIP[id];
          model.setProperty("/sel", Object.assign({ id: id }, s));
          model.setProperty("/stops", s.stops.map(function (r) { return { n: r[0], loc: r[1], plan: r[2], act: r[3], pal: r[4], st: r[5], stState: r[6] }; }));
          fcl.setLayout("ThreeColumnsMidExpanded");
        }
        var list = new m.List({ mode: "SingleSelectMaster", selectionChange: function (e) { select(e.getParameter("listItem").getBindingContext().getProperty("id")); } });
        list.bindItems({ path: "/list", template: new m.StandardListItem({ title: "{id}", description: "{route} · {mode}", info: "{status}", infoState: "{statusState}", type: "Active" }), templateShareable: false });
        var begin = new m.Page({ title: "Shipments (38)", content: [list], headerContent: [new m.Button({ text: "Exceptions (9)", type: "Emphasized", press: function () { ctx.nav("exceptions"); } })] });
        var stopsTable = new m.Table({ columns: ["Stop", "Location", "Planned", "Actual / ETA", "Pallets", "Status"].map(function (h, i) { return new m.Column({ header: new m.Text({ text: h }), hAlign: i === 4 ? "End" : "Begin" }); }) });
        stopsTable.bindItems({ path: "/stops", template: new m.ColumnListItem({ type: "Active", press: function (e) { var r = e.getSource().getBindingContext().getObject(); endPage.setTitle("Stop " + r.n + " · " + r.loc.split(" · ")[0]); fcl.setLayout("ThreeColumnsMidExpanded"); },
          cells: [new m.Text({ text: "{n}" }), new m.Text({ text: "{loc}" }), new m.Text({ text: "{plan}" }), new m.Text({ text: "{act}" }), new m.Text({ text: "{pal}" }), new m.ObjectStatus({ text: "{st}", state: "{stState}" })] }), templateShareable: false });
        var mid = new m.Page({ title: "{/sel/id} · {/sel/route}", content: [
          new m.FlexBox({ wrap: "Wrap", items: [["Carrier", "{/sel/carrier}"], ["Driver", "{/sel/driver}"], ["ETA final stop", "{/sel/eta}"]].map(function (a) { return new m.VBox({ items: [new m.Label({ text: a[0] }), new m.Text({ text: a[1] })] }).addStyleClass("sapUiMediumMarginEnd sapUiSmallMarginBottom"); }) }).addStyleClass("sapUiSmallMargin"),
          new m.VBox({ items: [new m.Label({ text: "Route progress" }), new m.ProgressIndicator({ percentValue: "{/sel/progress}", displayValue: "{/sel/progress}% of distance", state: "Information", displayOnly: true })] }).addStyleClass("sapUiSmallMarginBeginEnd sapUiSmallMarginBottom"),
          stopsTable],
          headerContent: [new m.Button({ text: "Contact driver", icon: "sap-icon://call", press: function () { ctx.toast("Calling " + model.getProperty("/sel/driver") + "…"); } }),
            new m.Button({ icon: "sap-icon://full-screen", tooltip: "Full screen", type: "Transparent", press: function () { fcl.setLayout(fcl.getLayout() === "MidColumnFullScreen" ? "ThreeColumnsMidExpanded" : "MidColumnFullScreen"); } }),
            new m.Button({ icon: "sap-icon://decline", tooltip: "Close", type: "Transparent", press: function () { list.removeSelections(true); fcl.setLayout("OneColumn"); } })] });
        var events = new m.List({ showSeparators: "None" });
        events.bindItems({ path: "/events", template: new m.CustomListItem({ content: new m.HBox({ items: [new m.ObjectStatus({ icon: "sap-icon://circle-task-2", state: "{s}" }).addStyleClass("sapUiSmallMarginEnd"), new m.VBox({ items: [new m.Text({ text: "{e}" }), new m.Label({ text: "{t}" })] })] }).addStyleClass("sapUiSmallMarginBeginEnd sapUiTinyMarginTopBottom") }), templateShareable: false });
        var endPage = new m.Page({ title: "Stop 3 · Cornwall", content: [events, new m.MessageStrip({ text: "Call receiver 15 min before arrival. Chilled items first. Liftgate required.", type: "Information", showIcon: true }).addStyleClass("sapUiSmallMargin")],
          headerContent: [new m.Button({ icon: "sap-icon://decline", tooltip: "Close", type: "Transparent", press: function () { fcl.setLayout("TwoColumnsMidExpanded"); } })] });
        fcl = new m.FlexibleColumnLayout({ layout: "ThreeColumnsMidExpanded", beginColumnPages: [begin], midColumnPages: [mid], endColumnPages: [endPage] });
        select("SH-77120");
        setTimeout(function () { list.setSelectedItem(list.getItems()[0]); }, 0);
        return { control: fcl };
      },
    },
    exceptions: {
      type: "list", title: "Exceptions · last 7 days",
      kpis: [["Open exceptions", "9", "err"], ["Avg. delay", "38", "warn", "", "min"], ["On-time (7 days)", "94.8", "ok", "", "%"], ["PODs pending", "4", "info"]],
      filters: [{ label: "Exception", key: "exc", multi: true, items: ["Refused · damaged", "Delay", "Short delivery", "Temperature"] }, { label: "Status", key: "status", items: ["Open", "Monitoring", "Claim filed", "Resolved"] }],
      table: {
        title: "Exceptions", path: "/exceptions", searchKeys: ["id", "stop", "carrier", "owner"],
        columns: [{ label: "Shipment", key: "id", type: "id", sub: "stop" }, { label: "Exception", key: "exc", type: "status" }, { label: "Carrier", key: "carrier", minWidth: "900px" }, { label: "Reported", key: "rep", minWidth: "1000px" }, { label: "Impact", key: "impact" }, { label: "Owner", key: "owner", type: "person", minWidth: "1100px" }, { label: "Status", key: "status", type: "status" }],
        actions: [{ text: "Create claim", emph: true, setStatus: { key: "status", text: "Claim filed", state: "Information" }, done: "Claims filed for {n}" }, { text: "Resolve", setStatus: { key: "status", text: "Resolved", state: "Success" }, done: "{n} resolved" }],
      },
    },
  },
});
