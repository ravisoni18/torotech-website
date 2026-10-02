// Each result is checked against its tolerance as it is typed.
function qiChange(e) {
  var c = e.getSource().getBindingContext(), r = c.getObject(), m = c.getModel(), v = parseFloat(e.getParameter("value"));
  var lo = r.lo == null ? -Infinity : r.lo, hi = r.hi == null ? Infinity : r.hi;
  var out = isNaN(v) || v < lo || v > hi, near = !out && hi !== Infinity && (hi - v) / (hi - (lo === -Infinity ? 0 : lo)) < 0.1;
  m.setProperty(c.getPath() + "/val", out ? "Rejected" : near ? "Near limit" : "Accepted");
  m.setProperty(c.getPath() + "/valState", out ? "Error" : near ? "Warning" : "Success");
  m.setProperty(c.getPath() + "/resultVS", out ? "Error" : near ? "Warning" : "None");
}
FioriKit.run({
  title: "Record Inspection Results",
  start: "list",
  data: {
    rows: [
      { lot: "010000004412", mat: "RM-1102 · Resin pellets PP", origin: "Goods receipt", qty: "8,000 KG", src: "Granite Polymers", due: "Overdue", dueState: "Error", status: "Created", statusState: "None" },
      { lot: "010000004409", mat: "PK-4410 · Box 60×40", origin: "Goods receipt", qty: "40 PAL", src: "Lakeside Packaging", due: "Today", dueState: "Warning", status: "In process", statusState: "Information" },
      { lot: "040000001187", mat: "FG-2010 · Food tray 250 ml", origin: "Production", qty: "48,000 EA", src: "Order 1000412", due: "Today", dueState: "Warning", status: "Results recorded", statusState: "Success" },
      { lot: "010000004401", mat: "RM-1150 · Masterbatch blue", origin: "Goods receipt", qty: "500 KG", src: "Chromix Ltd.", due: "Tomorrow", dueState: "None", status: "Created", statusState: "None" },
      { lot: "040000001181", mat: "FG-2044 · Lid clear 250 ml", origin: "Production", qty: "71,000 EA", src: "Order 1000409", due: "Tomorrow", dueState: "None", status: "In process", statusState: "Information" },
    ],
    chars: [
      { c: "Wall thickness (mm)", method: "Caliper · 5 points", lo: 0.42, hi: 0.48, target: "0.45", result: "0.46", val: "Accepted", valState: "Success" },
      { c: "Weight (g)", method: "Scale", lo: 11.8, hi: 12.3, target: "12.0", result: "12.1", val: "Accepted", valState: "Success" },
      { c: "Rim flatness (mm)", method: "Feeler gauge", lo: 0, hi: 0.3, target: "0.00", result: "0.28", val: "Near limit", valState: "Warning", resultVS: "Warning" },
      { c: "Colour ΔE", method: "Spectrophotometer", lo: 0, hi: 1.5, target: "0.0", result: "0.6", val: "Accepted", valState: "Success" },
      { c: "Top-load strength (N)", method: "Compression test", lo: 180, hi: null, target: "220", result: "236", val: "Accepted", valState: "Success" },
    ],
  },
  pages: {
    list: {
      type: "list", title: "My inspection lots · Plant 1100",
      filters: [{ label: "Origin", key: "origin", items: ["Goods receipt", "Production"] }, { label: "Status", key: "status", multi: true, items: ["Created", "In process", "Results recorded", "Accepted"] }],
      table: {
        title: "Inspection lots", path: "/rows", nav: "detail", searchKeys: ["lot", "mat", "src"],
        columns: [{ label: "Inspection lot", key: "lot", type: "id", sub: "mat" }, { label: "Origin", key: "origin" }, { label: "Lot quantity", key: "qty", align: "End" }, { label: "Supplier / order", key: "src", minWidth: "1000px" }, { label: "Due", key: "due", type: "status" }, { label: "Status", key: "status", type: "status" }],
        actions: [{ text: "Record results", emph: true, nav: "detail" }],
      },
    },
    detail: {
      type: "object", icon: "quality-issue", title: "Inspection lot 040000001187", subtitle: "FG-2010 · Food tray 250 ml · Production order 1000412 · 48,000 EA", status: ["Results recorded", "ok"],
      bind: function (r) { return { title: "Inspection lot " + r.lot, subtitle: r.mat + " · " + r.src + " · " + r.qty, status: [r.status, r.statusState] }; },
      attrs: [["Inspection plan", "QP-2010 / 03"], ["Sample size", "125 EA"], ["Characteristics", "5 of 5 recorded"], ["Inspector", "Grace Liu"]],
      actions: [{ text: "Record defect", title: "Record defect", form: [{ label: "Defect code", type: "select", options: ["VIS-01 · Scratch", "VIS-04 · Flash on rim", "DIM-02 · Out of tolerance"] }, { label: "Quantity", value: "1" }, { label: "Note", type: "textarea" }], submit: "Record", done: "Defect recorded on the lot" }],
      footer: [
        { text: "Accept · unrestricted stock", emph: true, success: "Usage decision posted: lot accepted, 48,000 EA moved to unrestricted stock. Follow-up task created for rim flatness.", headerStatus: ["Accepted", "ok"] },
        { text: "Accept with deviation", success: "Usage decision posted with deviation; quality notification created.", headerStatus: ["Accepted with deviation", "warn"] },
        { text: "Reject", setStatus: { text: "Rejected · blocked stock", state: "Error" }, object: "this lot", note: true, done: "Lot rejected — stock moved to blocked" },
      ],
      sections: [
        { title: "Results", table: { title: "Characteristics", path: "/chars", columns: [{ label: "Characteristic", key: "c", type: "id", sub: "method" }, { label: "Target", key: "target", align: "End" }, { label: "Result", key: "result", type: "input", onChange: qiChange }, { label: "Valuation", key: "val", type: "status" }] } },
        { title: "Trend", html: '<div style="max-width:640px"><div style="font-size:.875rem;color:#556b82;margin-bottom:.5rem">Rim flatness · last 10 lots (limit 0.30 mm)</div>' + FioriKit.svgLine([0.12, 0.15, 0.14, 0.18, 0.2, 0.19, 0.23, 0.24, 0.26, 0.28], "#e76500") + "</div>" },
      ],
    },
  },
});
