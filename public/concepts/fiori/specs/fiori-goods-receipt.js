/*! © 2026 Torotech Inc. All rights reserved. https://torotech.ca — may not be copied, reused or redistributed without written permission. See https://torotech.ca/legal */
// Received quantities are editable; under-deliveries are flagged as you type.
function grChange(e) {
  var ctx = e.getSource().getBindingContext(), row = ctx.getObject(), m = ctx.getModel(), v = +e.getParameter("value");
  var short = v < row.orderedN, over = v > row.orderedN;
  m.setProperty(ctx.getPath() + "/check", short ? "Under-delivery (" + (row.orderedN - v) + ")" : over ? "Over-delivery" : "OK");
  m.setProperty(ctx.getPath() + "/checkState", short ? "Warning" : over ? "Error" : "Success");
  m.setProperty(ctx.getPath() + "/recvVS", over ? "Error" : short ? "Warning" : "None");
}
FioriKit.run({
  title: "Post Goods Receipt",
  start: "list",
  data: {
    rows: [
      { id: "4500018840", supplier: "Brightwave Supply", items: "4", open: "1,240 EA", due: "Today 08:00", dock: "Door 2", status: "Arrived", statusState: "Success" },
      { id: "4500018836", supplier: "Lakeside Packaging", items: "2", open: "60 PAL", due: "Today 09:30", dock: "Door 1", status: "Arrived", statusState: "Success" },
      { id: "4500018829", supplier: "Granite Metals Ltd.", items: "6", open: "3.2 TO", due: "Today 10:00", dock: "Door 4", status: "Expected", statusState: "Information" },
      { id: "4500018822", supplier: "Northline Chemicals", items: "1", open: "40 DR", due: "Today 11:15", dock: "Door 3", status: "Delayed 2h", statusState: "Warning" },
      { id: "4500018817", supplier: "Pinecrest Foods", items: "3", open: "880 CS", due: "Today 13:00", dock: "Door 2", status: "Expected", statusState: "Information" },
      { id: "4500018810", supplier: "Atlas Fasteners", items: "9", open: "24,000 EA", due: "Today 14:30", dock: "Door 1", status: "Expected", statusState: "Information" },
    ],
    lines: [
      { item: "10", material: "PKG-4410", text: "Corrugated box 60×40", ordered: "40 PAL", orderedN: 40, recv: 40, sloc: "RCV1", batch: "B26-1113", check: "OK", checkState: "Success" },
      { item: "20", material: "PKG-4512", text: "Stretch wrap 500 mm", ordered: "20 PAL", orderedN: 20, recv: 18, sloc: "RCV1", batch: "—", check: "Under-delivery (2)", checkState: "Warning", recvVS: "Warning" },
    ],
  },
  pages: {
    list: {
      type: "list", title: "Due today · Plant 1100",
      filters: [{ label: "Status", key: "status", items: ["Arrived", "Expected", "Delayed 2h", "Received"] }, { label: "Dock", key: "dock", multi: true, items: ["Door 1", "Door 2", "Door 3", "Door 4"] }],
      table: {
        title: "Open purchase orders", path: "/rows", nav: "detail", searchKeys: ["id", "supplier"],
        columns: [{ label: "Purchase order", key: "id", type: "id", sub: "supplier" }, { label: "Items", key: "items", align: "End" }, { label: "Open quantity", key: "open", align: "End" }, { label: "Delivery", key: "due" }, { label: "Dock", key: "dock", minWidth: "900px" }, { label: "Status", key: "status", type: "status" }],
        actions: [{ text: "Mark arrived", emph: true, setStatus: { key: "status", text: "Arrived", state: "Success" }, done: "{n} marked as arrived" }],
      },
    },
    detail: {
      type: "object", icon: "shipping-status", title: "PO 4500018836 · Lakeside Packaging", subtitle: "Inbound delivery 1800004408 · Door 1 · arrived 09:12", status: ["Ready to post", "ok"],
      bind: function (r) { return { title: "PO " + r.id + " · " + r.supplier, subtitle: r.dock + " · due " + r.due, status: [r.status === "Arrived" ? "Ready to post" : r.status, r.statusState] }; },
      attrs: [["Movement type", "101 · GR for PO"], ["Posting date", "Nov 13, 2026"], ["Delivery note", "LP-77821"], ["Bill of lading", "BOL-55120"]],
      actions: [{ text: "Post", emph: true, success: "Material document {doc} posted. Remaining quantities stay open on the purchase order.", docPrefix: "500", headerStatus: ["Posted", "ok"] }, { text: "Hold", setStatus: { text: "On hold", state: "Warning" }, object: "this receipt", note: true, done: "Receipt put on hold" }],
      footer: [{ text: "Post goods receipt", emph: true, success: "Material document {doc} posted for 2 items.", docPrefix: "500", headerStatus: ["Posted", "ok"] }, { text: "Save draft", toast: "Draft saved" }],
      sections: [
        { title: "Items", table: { title: "Items", path: "/lines", columns: [{ label: "Item", key: "item" }, { label: "Material", key: "material", type: "id", sub: "text" }, { label: "Ordered", key: "ordered" }, { label: "Received now", key: "recv", type: "input", onChange: grChange }, { label: "Storage loc.", key: "sloc" }, { label: "Batch", key: "batch" }, { label: "Check", key: "check", type: "status" }] } },
        { title: "Dock checklist", control: function (ctx) { var m = ctx.m; return new m.VBox({ items: ["Seal intact and matches bill of lading", "Pallet labels scanned", "No visible damage"].map(function (t) { return new m.CheckBox({ text: t, selected: true }); }).concat([new m.CheckBox({ text: "Temperature log attached" })]) }); } },
      ],
    },
  },
});
