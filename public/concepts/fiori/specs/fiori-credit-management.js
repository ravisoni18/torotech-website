/*! © 2026 Torotech Inc. All rights reserved. https://torotech.ca — may not be copied, reused or redistributed without written permission. See https://torotech.ca/legal */
FioriKit.run({
  title: "Manage Credit Accounts",
  start: "list",
  data: {
    rows: [
      { name: "Harbourline Foods", bp: "100245", risk: "C · High", riskState: "Error", limit: "500,000.00", exposure: "560,400.00", util: 112, utilState: "Error", overdue: "84,200.00", blocked: "3", review: "Nov 20, 2026" },
      { name: "Meridale Retail", bp: "100318", risk: "B · Medium", riskState: "Warning", limit: "1,200,000.00", exposure: "1,104,000.00", util: 92, utilState: "Warning", overdue: "12,900.00", blocked: "1", review: "Dec 02, 2026" },
      { name: "Copperline Hotels", bp: "100402", risk: "A · Low", riskState: "Success", limit: "750,000.00", exposure: "661,500.00", util: 88, utilState: "Warning", overdue: "0.00", blocked: "0", review: "Jan 15, 2027" },
      { name: "Westbrook Grocers", bp: "100133", risk: "B · Medium", riskState: "Warning", limit: "300,000.00", exposure: "254,100.00", util: 85, utilState: "Warning", overdue: "21,450.00", blocked: "0", review: "Nov 28, 2026" },
      { name: "Silverleaf Catering", bp: "100511", risk: "C · High", riskState: "Error", limit: "150,000.00", exposure: "124,800.00", util: 83, utilState: "Warning", overdue: "38,000.00", blocked: "2", review: "Nov 18, 2026" },
      { name: "Ridgeline Markets", bp: "100287", risk: "A · Low", riskState: "Success", limit: "2,000,000.00", exposure: "1,642,000.00", util: 82, utilState: "Warning", overdue: "0.00", blocked: "0", review: "Mar 01, 2027" },
    ],
    orders: [
      { so: "2210588", created: "Nov 10", value: "184,220.00", req: "Nov 18", reason: "Limit exceeded", reasonState: "Error" },
      { so: "2210601", created: "Nov 12", value: "42,880.00", req: "Nov 21", reason: "Overdue items", reasonState: "Warning" },
      { so: "2210617", created: "Nov 13", value: "18,450.00", req: "Nov 24", reason: "Limit exceeded", reasonState: "Error" },
    ],
  },
  pages: {
    list: {
      type: "list", title: "High utilisation · segment 1000",
      filters: [{ label: "Risk class", key: "risk", multi: true, items: ["A · Low", "B · Medium", "C · High"] }],
      table: {
        title: "Business partners", path: "/rows", nav: "detail", searchKeys: ["name", "bp"],
        columns: [{ label: "Business partner", key: "name", type: "id", sub: "bp" }, { label: "Risk class", key: "risk", type: "status" }, { label: "Credit limit", key: "limit", type: "number", unit: "USD" }, { label: "Exposure", key: "exposure", type: "number", unit: "USD", strong: true }, { label: "Utilisation", key: "util", type: "progress" }, { label: "Overdue", key: "overdue", type: "number", unit: "USD", minWidth: "1000px" }, { label: "Blocked orders", key: "blocked", align: "End", minWidth: "1100px" }, { label: "Next review", key: "review", minWidth: "1200px" }],
        actions: [{ text: "Change limit", emph: true, title: "Change credit limit", form: [{ label: "New limit (USD)", value: "650,000.00", required: true }, { label: "Valid until", type: "date", value: "2027-03-31" }, { label: "Reason", type: "select", options: ["Annual review", "Seasonal increase", "Collateral received"] }], submit: "Save", done: "Credit limit set to {New limit (USD)} USD",
          onSubmit: function (v, ctx, owner) { owner.selected().forEach(function (c) { ctx.model.setProperty(c.getPath() + "/limit", v["New limit (USD)"]); }); } }],
      },
    },
    detail: {
      type: "object", icon: "money-bills", title: "Harbourline Foods", subtitle: "Business partner 100245 · Credit segment 1000", status: ["Credit block", "err"],
      bind: function (r) { return { title: r.name, subtitle: "Business partner " + r.bp + " · Credit segment 1000", status: [r.util > 100 ? "Credit block" : "Within limit", r.util > 100 ? "err" : "ok"], attrs: [r.limit + " USD", r.exposure + " USD", r.risk] }; },
      attrs: [["Credit limit", "500,000.00 USD"], ["Exposure", "560,400.00 USD"], ["Risk class", "C · High"], ["Analyst", "Jamie Morgan"]],
      actions: [
        { text: "Change limit", emph: true, title: "Change credit limit", form: [{ label: "New limit (USD)", value: "650,000.00", required: true }, { label: "Valid until", type: "date", value: "2027-03-31" }, { label: "Reason", type: "select", options: ["Annual review", "Seasonal increase", "Collateral received"] }], submit: "Save", done: "Credit limit set to {New limit (USD)} USD" },
        { text: "Release order", setStatus: { text: "Released", state: "Success" }, object: "the blocked orders", done: "Blocked orders released for delivery" },
      ],
      sections: [
        { title: "Exposure", html: '<div style="max-width:720px">' + FioriKit.svgLine([310, 330, 352, 370, 360, 395, 420, 445, 470, 498, 530, 560], "#aa0808") + '<div style="display:flex;justify-content:space-between;font-size:.875rem;margin-top:.5rem"><span style="color:#556b82">12 months · limit 500,000 USD</span><b style="color:#aa0808">560,400 USD</b></div></div>' },
        { title: "Blocked orders", table: { title: "Blocked orders", path: "/orders", select: true, columns: [{ label: "Sales order", key: "so", type: "id" }, { label: "Created", key: "created" }, { label: "Net value", key: "value", type: "number", unit: "USD" }, { label: "Req. delivery", key: "req" }, { label: "Block reason", key: "reason", type: "status" }],
          actions: [{ text: "Release", emph: true, setStatus: { key: "reason", text: "Released", state: "Success" }, done: "{n} released for delivery" }] } },
        { title: "Open items by age", html: '<div style="display:grid;gap:.75rem;max-width:560px;font-size:.875rem">' + [["Not due", "312,600", 56, "#256f3a"], ["1–30 days", "163,600", 29, "#0064d9"], ["31–60 days", "58,200", 10, "#e76500"], ["> 60 days", "26,000", 5, "#aa0808"]].map(function (r) { return '<div style="display:grid;grid-template-columns:7rem 1fr 6rem;gap:.75rem;align-items:center"><span>' + r[0] + '</span><span style="height:.75rem;border-radius:4px;background:#eaecee"><span style="display:block;height:100%;width:' + r[2] + "%;border-radius:4px;background:" + r[3] + '"></span></span><b style="text-align:right">' + r[1] + "</b></div>"; }).join("") + "</div>" },
      ],
    },
  },
});
