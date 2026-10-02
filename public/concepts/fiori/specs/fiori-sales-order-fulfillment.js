FioriKit.run({
  title: "Sales Order Fulfillment",
  start: "list",
  data: {
    rows: [
      { id: "2210588", customer: "Harbourline Foods", req: "Nov 18", value: "184,220.00", issue: "Credit block", issueState: "Error", credit: "Blocked", stock: "Available", delivery: "Not created", status: "At risk", statusState: "Error" },
      { id: "2210571", customer: "Meridale Retail", req: "Nov 19", value: "92,410.00", issue: "Missing stock", issueState: "Warning", credit: "OK", stock: "Short 140 EA", delivery: "Partial", status: "At risk", statusState: "Warning" },
      { id: "2210566", customer: "Copperline Hotels", req: "Nov 19", value: "58,900.00", issue: "Shipping", issueState: "Information", credit: "OK", stock: "Available", delivery: "Route missing", status: "At risk", statusState: "Warning" },
      { id: "2210549", customer: "Westbrook Grocers", req: "Nov 20", value: "41,380.00", issue: "Missing stock", issueState: "Warning", credit: "OK", stock: "Short 60 CS", delivery: "Not created", status: "At risk", statusState: "Warning" },
      { id: "2210533", customer: "Silverleaf Catering", req: "Nov 21", value: "22,640.00", issue: "Credit block", issueState: "Error", credit: "Blocked", stock: "Available", delivery: "Not created", status: "At risk", statusState: "Error" },
      { id: "2210520", customer: "Ridgeline Markets", req: "Nov 22", value: "130,050.00", issue: "Incomplete data", issueState: "None", credit: "OK", stock: "Available", delivery: "Not created", status: "At risk", statusState: "Warning" },
    ],
    items: [
      { item: "10", product: "Frozen berries 10 kg", ordered: "400 CS", confirmed: "400 CS", plant: "1010", value: "58,400.00" },
      { item: "20", product: "Greek yoghurt 24×500 g", ordered: "250 CS", confirmed: "250 CS", plant: "1010", value: "41,250.00" },
      { item: "30", product: "Oat milk 12×1 L", ordered: "600 CS", confirmed: "600 CS", plant: "1020", value: "37,800.00" },
      { item: "40", product: "Granola 8×750 g", ordered: "320 CS", confirmed: "320 CS", plant: "1010", value: "28,160.00" },
    ],
  },
  pages: {
    list: {
      type: "list", title: "Orders at risk · next 14 days",
      kpis: [["Orders at risk", "128", "err", "▲ 14 vs last week"], ["Value blocked", "2.84", "warn", "41 customers", "M USD"], ["On-time rate", "93.1", "ok", "target 95 %", "%"], ["Avg. days late", "2.6", "warn", "▼ 0.4 days"]],
      charts: [
        { title: "At-risk value by issue", subtitle: "M USD", html: FioriKit.svgBars([1.21, 0.88, 0.46, 0.29], ["Credit", "Stock", "Shipping", "Data"], { highlight: 0, height: 170 }) },
        { title: "Orders due by day", subtitle: "next 14 days", html: FioriKit.svgBars([18, 22, 31, 26, 40, 12, 8, 35, 29, 44, 38, 20, 11, 9], ["15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"], { highlight: 9, height: 170 }) },
      ],
      filters: [{ label: "Issue", key: "issue", multi: true, items: ["Credit block", "Missing stock", "Shipping", "Incomplete data"] }],
      table: {
        title: "Sales orders", path: "/rows", nav: "detail", searchKeys: ["id", "customer"],
        columns: [{ label: "Sales order", key: "id", type: "id", sub: "customer" }, { label: "Req. delivery", key: "req" }, { label: "Net value", key: "value", type: "number", unit: "USD", strong: true }, { label: "Issue", key: "issue", type: "status" }, { label: "Credit", key: "credit", minWidth: "1000px" }, { label: "Stock", key: "stock", minWidth: "1000px" }, { label: "Delivery", key: "delivery", minWidth: "1100px" }],
        actions: [{ text: "Request release", emph: true, setStatus: { key: "issue", text: "Release requested", state: "Information" }, done: "Release requested for {n}" }, { text: "Notify customer", toast: "Delay notice drafted for the selected customers" }],
      },
    },
    detail: {
      type: "object", icon: "sales-order", title: "Sales order 2210588", subtitle: "Harbourline Foods · Standard order · 4 items", status: ["Credit block", "err"],
      bind: function (r) { return { title: "Sales order " + r.id, subtitle: r.customer + " · Standard order", status: [r.issue, r.issueState], attrs: [r.value + " USD", r.req + ", 2026"] }; },
      attrs: [["Net value", "184,220.00 USD"], ["Requested delivery", "Nov 18, 2026"], ["Credit exposure", "112 % of limit"], ["Sales rep", "Priya Shah"]],
      actions: [{ text: "Request release", emph: true, setStatus: { text: "Release requested", state: "Information" }, object: "this order", done: "Release request sent to the credit team" }, { text: "Contact customer", toast: "Email draft opened for Harbourline Foods" }],
      sections: [
        { title: "Process flow", timeline: [["Order created · 2210588", "Nov 10", "ok"], ["Credit check · blocked at 112 % of limit", "Nov 10", "err"], ["Delivery · not created", "Waiting for credit release", "none"], ["Goods issue · not started", "", "none"], ["Invoice · not started", "", "none"]] },
        { title: "Items", table: { title: "Items", path: "/items", columns: [{ label: "Item", key: "item" }, { label: "Product", key: "product" }, { label: "Ordered", key: "ordered" }, { label: "Confirmed", key: "confirmed" }, { label: "Plant", key: "plant" }, { label: "Net value", key: "value", type: "number", unit: "USD", strong: true }] } },
        { title: "Credit exposure", html: '<div style="max-width:640px">' + FioriKit.svgLine([310, 330, 352, 370, 360, 395, 420, 445, 470, 498, 530, 560], "#aa0808") + '<div style="display:flex;justify-content:space-between;font-size:.875rem;margin-top:.5rem"><span style="color:#556b82">Limit 500,000 USD</span><b style="color:#aa0808">Exposure 560,400 USD</b></div></div>' },
      ],
    },
  },
});
