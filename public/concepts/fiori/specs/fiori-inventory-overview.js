var stat = function (rows) { return '<div style="display:grid;gap:.375rem;font-size:.875rem">' + rows.map(function (r) { return '<div style="display:flex;justify-content:space-between;gap:1rem;border-top:1px solid #eaecee;padding-top:.375rem"><span>' + r[0] + '</span><span style="color:' + (r[2] || "#556b82") + ';font-weight:600">' + r[1] + "</span></div>"; }).join("") + "</div>"; };
FioriKit.run({
  title: "Inventory Overview",
  subtitle: "Plant 1100 · Riverside",
  start: "overview",
  data: {
    rows: [
      { id: "RM-1102", desc: "Resin pellets PP", abc: "A", unres: "0 KG", safety: "2,000 KG", demand: "640 KG", cov: "0 days", covState: "Error", next: "Nov 15 · 8,000 KG" },
      { id: "PK-4410", desc: "Corrugated box 60×40", abc: "A", unres: "1,200 EA", safety: "4,000 EA", demand: "900 EA", cov: "1.3 days", covState: "Error", next: "Today · 40 PAL" },
      { id: "RM-1150", desc: "Colour masterbatch blue", abc: "B", unres: "310 KG", safety: "200 KG", demand: "45 KG", cov: "6.9 days", covState: "Warning", next: "Nov 20 · 500 KG" },
      { id: "FG-2010", desc: "Food tray 250 ml", abc: "A", unres: "48,000 EA", safety: "30,000 EA", demand: "6,200 EA", cov: "7.7 days", covState: "Warning", next: "Production · Nov 14" },
      { id: "PK-4512", desc: "Stretch wrap 500 mm", abc: "B", unres: "26 RL", safety: "10 RL", demand: "3 RL", cov: "8.7 days", covState: "Warning", next: "Today · 18 PAL" },
      { id: "SP-0091", desc: "Bearing 6204-2RS", abc: "B", unres: "14 EA", safety: "10 EA", demand: "1.2 EA", cov: "11.7 days", covState: "Information", next: "—" },
      { id: "FG-2044", desc: "Lid clear 250 ml", abc: "A", unres: "71,000 EA", safety: "30,000 EA", demand: "5,400 EA", cov: "13.1 days", covState: "Information", next: "Production · Nov 16" },
    ],
  },
  pages: {
    overview: {
      type: "overview", title: "Inventory overview",
      titleActions: [{ text: "Stock coverage", emph: true, nav: "list" }, { text: "Manage cards", toast: "Card settings would open here" }],
      cards: [
        { title: "Stock value", subtitle: "Plant 1100 · USD", number: "18.42", scale: "M", state: "ok", trend: "Up", details: "▲ 3.1 % vs last month", html: FioriKit.svgLine([16.9, 17.2, 17.0, 17.6, 17.9, 17.7, 18.1, 18.42], "#0070f2"), cols: 4, rows: 4 },
        { title: "Stock-outs", subtitle: "Materials at zero", number: "14", state: "err", details: "6 with open sales orders", nav: "list", html: stat([["RM-1102 · Resin pellets", "2 orders", "#aa0808"], ["PK-4410 · Box 60×40", "1 order", "#aa0808"], ["SP-0091 · Bearing 6204", "3 orders", "#e76500"]]), cols: 4, rows: 4 },
        { title: "Stock by category", subtitle: "Share of value", html: '<div style="display:flex;gap:1rem;align-items:center">' + FioriKit.svgDonut([[44, "#0070f2", "Raw materials"], [27, "#5d36ff", "Finished goods"], [18, "#0f9d9d", "Packaging"], [11, "#e76500", "Spares"]], "18.4M") + stat([["Raw materials", "44 %"], ["Finished goods", "27 %"], ["Packaging", "18 %"], ["Spares", "11 %"]]) + "</div>", cols: 4, rows: 4 },
        { title: "Goods movements", subtitle: "Last 7 days", html: FioriKit.svgBars([182, 210, 195, 240, 228, 96, 74], ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"], { highlight: 3 }), cols: 6, rows: 4 },
        { title: "Slow movers", subtitle: "No movement > 180 days", number: "1.06", scale: "M USD", state: "warn", details: "212 materials", nav: "list", html: FioriKit.svgBars([12, 18, 9, 22, 30, 41], ["<90", "90", "120", "150", "180", ">365"], { highlight: 5, color: "#ffd8b0" }), cols: 6, rows: 4 },
      ],
    },
    list: {
      type: "list", title: "Stock coverage · Plant 1100",
      filters: [{ label: "ABC class", key: "abc", multi: true, items: ["A", "B", "C"] }],
      table: {
        title: "Materials", path: "/rows", searchKeys: ["id", "desc"],
        columns: [{ label: "Material", key: "id", type: "id", sub: "desc" }, { label: "ABC", key: "abc" }, { label: "Unrestricted", key: "unres", align: "End" }, { label: "Safety stock", key: "safety", align: "End", minWidth: "900px" }, { label: "Daily demand", key: "demand", align: "End", minWidth: "1000px" }, { label: "Coverage", key: "cov", type: "status" }, { label: "Next receipt", key: "next", minWidth: "1100px" }],
        actions: [
          { text: "Create stock transfer", emph: true, run: function (ctx, owner) { var n = owner.selected().length; ctx.toast(n ? "Stock transfer " + ctx.doc("49") + " created for " + n + " material(s)" : "Select at least one material first"); } },
          { text: "Plan order", run: function (ctx, owner) { var n = owner.selected().length; ctx.toast(n ? "Planned orders created for " + n + " material(s)" : "Select at least one material first"); } },
        ],
      },
    },
  },
});
