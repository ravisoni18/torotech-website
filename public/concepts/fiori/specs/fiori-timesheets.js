/*! © 2026 Torotech Inc. All rights reserved. https://torotech.ca — may not be copied, reused or redistributed without written permission. See https://torotech.ca/legal */
FioriKit.run({
  title: "My Timesheet",
  start: "week",
  data: {
    days: ["Mon 9", "Tue 10", "Wed 11", "Thu 12", "Fri 13", "Sat 14", "Sun 15"],
    ts: [
      { p: "S/4 upgrade · Data migration", code: "MIG-210", h: [6, 5, 4, 6, 3, 0, 0] },
      { p: "S/4 upgrade · Testing", code: "TST-110", h: [1, 2, 2, 1, 2, 0, 0] },
      { p: "Plant 1100 · Support", code: "SUP-001", h: [1, 1, 1.5, 0.5, 1, 0, 0] },
      { p: "Internal · Training", code: "INT-004", h: [0, 0, 0.5, 0, 0, 0, 0] },
    ],
    team: [
      { name: "Lena Ortiz", rec: "40.0 h", target: "40.0 h", ot: "0.0 h", projects: "MIG-210, TST-110", flag: "—", flagState: "None", status: "Submitted", statusState: "Information" },
      { name: "Omar Haddad", rec: "46.5 h", target: "40.0 h", ot: "6.5 h", projects: "MIG-210", flag: "Overtime > 5 h", flagState: "Warning", status: "Submitted", statusState: "Information" },
      { name: "Mei Tan", rec: "40.0 h", target: "40.0 h", ot: "0.0 h", projects: "TST-110, SUP-001", flag: "—", flagState: "None", status: "Submitted", statusState: "Information" },
      { name: "Ravi Nair", rec: "32.0 h", target: "32.0 h", ot: "0.0 h", projects: "MIG-210", flag: "—", flagState: "None", status: "Submitted", statusState: "Information" },
      { name: "Julia Weber", rec: "24.0 h", target: "40.0 h", ot: "0.0 h", projects: "SUP-001", flag: "Missing 2 days", flagState: "Error", status: "Submitted", statusState: "Information" },
      { name: "Tom Becker", rec: "40.0 h", target: "40.0 h", ot: "0.0 h", projects: "INT-004, MIG-210", flag: "Project closed", flagState: "Warning", status: "Submitted", statusState: "Information" },
    ],
  },
  pages: {
    week: {
      type: "custom",
      build: function (ctx) {
        var m = ctx.m, model = ctx.model;
        var totals = new m.Text(), summary = new m.ObjectStatus({ inverted: true });
        var dayTotals = model.getProperty("/days").map(function () { return new m.Text().addStyleClass("sapUiTinyMarginTop"); });
        function recompute() {
          var rows = model.getProperty("/ts"), cols = [0, 0, 0, 0, 0, 0, 0], all = 0;
          rows.forEach(function (r, i) { var t = r.h.reduce(function (a, b) { return a + (+b || 0); }, 0); model.setProperty("/ts/" + i + "/total", t.toFixed(1)); r.h.forEach(function (v, d) { cols[d] += +v || 0; }); all += t; });
          cols.forEach(function (v, d) { dayTotals[d].setText(v.toFixed(1)); dayTotals[d].toggleStyleClass("ts-short", d < 5 && v < 8); });
          totals.setText(all.toFixed(1) + " of 40.0 h");
          summary.setText(all >= 40 ? "Complete" : (40 - all).toFixed(1) + " h short"); summary.setState(all >= 40 ? "Success" : "Warning");
        }
        var columns = [new m.Column({ header: new m.Text({ text: "Project / task" }), width: "18rem", footer: new m.Text({ text: "Total" }) })].concat(model.getProperty("/days").map(function (d, i) {
          return new m.Column({ header: new m.Text({ text: d }), hAlign: "End", footer: dayTotals[i] });
        })).concat([new m.Column({ header: new m.Text({ text: "Total" }), hAlign: "End", footer: totals })]);
        var cells = [new m.ObjectIdentifier({ title: "{p}", text: "{code}" })].concat([0, 1, 2, 3, 4, 5, 6].map(function (d) {
          return new m.Input({ value: "{h/" + d + "}", type: "Number", width: "4.5rem", textAlign: "End", enabled: d < 5, liveChange: function () { setTimeout(recompute, 0); }, change: recompute });
        })).concat([new m.ObjectNumber({ number: "{total}", unit: "h", emphasized: true })]);
        var table = new m.Table({ columns: columns, headerToolbar: new m.OverflowToolbar({ content: [new m.Title({ text: "Week 46 · Nov 9 – 15, 2026" }), new m.ToolbarSpacer(),
          new m.Button({ icon: "sap-icon://navigation-left-arrow", tooltip: "Previous week", type: "Transparent", press: function () { ctx.toast("Week 45 was approved — read only"); } }),
          new m.Button({ icon: "sap-icon://navigation-right-arrow", tooltip: "Next week", type: "Transparent", press: function () { ctx.toast("Week 47 hasn't started yet"); } }),
          new m.Button({ text: "Copy last week", press: function () { model.setProperty("/ts/0/h", [6, 6, 5, 6, 5, 0, 0]); recompute(); ctx.toast("Last week's hours copied into week 46"); } }),
          new m.Button({ text: "Add row", icon: "sap-icon://add", press: function () { var r = model.getProperty("/ts"); r.push({ p: "Absence · Vacation", code: "ABS-VAC", h: [0, 0, 0, 0, 0, 0, 0] }); model.setProperty("/ts", r); recompute(); } })] }) });
        table.bindItems({ path: "/ts", template: new m.ColumnListItem({ cells: cells }), templateShareable: false });
        recompute();
        var page = new m.DynamicPage({
          title: new m.DynamicPageTitle({ heading: new m.Title({ text: "My timesheet" }), actions: [
            new m.Button({ text: "Submit week", type: "Emphasized", press: function () {
              var short = summary.getState() !== "Success";
              ctx.m.MessageBox[short ? "warning" : "success"](short ? "This week is " + summary.getText() + ". Submit anyway, or add the missing time first?" : "Week 46 submitted for approval to Marco Ruiz.",
                { title: short ? "Hours below target" : "Submitted", actions: short ? ["Submit anyway", ctx.m.MessageBox.Action.CANCEL] : ["Open team approvals", ctx.m.MessageBox.Action.CLOSE], emphasizedAction: short ? "Submit anyway" : "Open team approvals",
                  onClose: function (r) { if (r === "Submit anyway") ctx.m.MessageBox.success("Week 46 submitted with a note about the missing hours.", { actions: ["Open team approvals", ctx.m.MessageBox.Action.CLOSE], onClose: function (x) { if (x === "Open team approvals") ctx.nav("team"); } }); if (r === "Open team approvals") ctx.nav("team"); } });
            } }),
            new m.Button({ text: "Team approvals", press: function () { ctx.nav("team"); } })] }),
          header: new m.DynamicPageHeader({ content: [new m.HBox({ alignItems: "Center", items: [new m.VBox({ items: [new m.Label({ text: "This week" }), summary] }).addStyleClass("sapUiLargeMarginEnd"), new m.MessageStrip({ text: "Friday is under the 8-hour target. Weekend days are locked by your work schedule.", type: "Information", showIcon: true })] })] }),
          content: table,
        });
        var style = document.createElement("style"); style.textContent = ".ts-short{color:#e76500;font-weight:700}"; document.head.appendChild(style);
        return { control: page };
      },
    },
    team: {
      type: "list", title: "Approve timesheets · week 46",
      filters: [{ label: "Flag", key: "flag", items: ["Overtime > 5 h", "Missing 2 days", "Project closed"] }],
      table: {
        title: "Timesheets", path: "/team", searchKeys: ["name", "projects"],
        columns: [{ label: "Employee", key: "name", type: "person" }, { label: "Recorded", key: "rec", align: "End" }, { label: "Target", key: "target", align: "End" }, { label: "Overtime", key: "ot", align: "End", minWidth: "900px" }, { label: "Projects", key: "projects", minWidth: "1000px" }, { label: "Flags", key: "flag", type: "status" }, { label: "Status", key: "status", type: "status" }],
        actions: [{ text: "Approve", emph: true, setStatus: { key: "status", text: "Approved", state: "Success" }, done: "{n} approved" }, { text: "Return", setStatus: { key: "status", text: "Returned", state: "Warning" }, note: true, done: "{n} returned to the employee" }],
      },
    },
  },
});
