/*! © 2026 Torotech Inc. All rights reserved. https://torotech.ca — may not be copied, reused or redistributed without written permission. See https://torotech.ca/legal */
FioriKit.run({
  title: "Approve Purchase Requisitions",
  start: "list",
  data: {
    rows: [
      { id: "10045821", desc: "Laptops for new hires (×8)", by: "Lena Ortiz", cc: "CC-4100", value: "14,320.00", budget: 62, budgetState: "Success", needed: "Nov 28, 2026", status: "Pending", statusState: "Warning" },
      { id: "10045819", desc: "Ergonomic chairs — floor 3", by: "Omar Haddad", cc: "CC-4200", value: "6,840.00", budget: 48, budgetState: "Success", needed: "Dec 05, 2026", status: "Pending", statusState: "Warning" },
      { id: "10045810", desc: "Annual licence renewal — CAD", by: "Mei Tan", cc: "CC-4100", value: "38,500.00", budget: 97, budgetState: "Error", needed: "Dec 01, 2026", status: "Over budget", statusState: "Error" },
      { id: "10045802", desc: "Safety boots & PPE restock", by: "Ravi Nair", cc: "CC-5300", value: "2,215.40", budget: 21, budgetState: "Success", needed: "Nov 22, 2026", status: "Pending", statusState: "Warning" },
      { id: "10045797", desc: "Conference room AV upgrade", by: "Julia Weber", cc: "CC-4200", value: "9,980.00", budget: 74, budgetState: "Warning", needed: "Jan 10, 2027", status: "Clarification", statusState: "Information" },
      { id: "10045790", desc: "Spare parts — conveyor line 2", by: "Tom Becker", cc: "CC-6100", value: "4,612.75", budget: 35, budgetState: "Success", needed: "Nov 20, 2026", status: "Pending", statusState: "Warning" },
      { id: "10045781", desc: "Printer toner — all sites", by: "Ana Silva", cc: "CC-4100", value: "1,180.00", budget: 12, budgetState: "Success", needed: "Nov 30, 2026", status: "Pending", statusState: "Warning" },
      { id: "10045774", desc: "Field tablets (×12) + cases", by: "Kofi Mensah", cc: "CC-5300", value: "11,040.00", budget: 81, budgetState: "Warning", needed: "Dec 15, 2026", status: "Pending", statusState: "Warning" },
    ],
    items: [
      { item: "10", material: "MAT-77120", text: "Laptop 14\" · 32 GB · 1 TB", qty: "8 EA", price: "1,640.00", value: "13,120.00", supplier: "Brightwave Supply" },
      { item: "20", material: "MAT-77188", text: "USB-C dock", qty: "8 EA", price: "120.00", value: "960.00", supplier: "Brightwave Supply" },
      { item: "30", material: "MAT-70511", text: "Laptop sleeve", qty: "8 EA", price: "30.00", value: "240.00", supplier: "Office Depot Co." },
    ],
  },
  pages: {
    list: {
      type: "list", title: "My open approvals",
      filters: [{ label: "Cost center", key: "cc", multi: true, items: ["CC-4100", "CC-4200", "CC-5300", "CC-6100"] }, { label: "Status", key: "status", items: ["Pending", "Over budget", "Clarification", "Approved", "Rejected"] }],
      table: {
        title: "Requisitions", path: "/rows", nav: "detail", searchKeys: ["id", "desc", "by"],
        columns: [{ label: "Requisition", key: "id", type: "id", sub: "desc" }, { label: "Requested by", key: "by", type: "person" }, { label: "Cost center", key: "cc", minWidth: "900px" }, { label: "Value", key: "value", type: "number", unit: "USD", strong: true }, { label: "Budget used", key: "budget", type: "progress", minWidth: "1100px" }, { label: "Needed by", key: "needed", minWidth: "1000px" }, { label: "Status", key: "status", type: "status" }],
        actions: [
          { text: "Approve", emph: true, setStatus: { key: "status", text: "Approved", state: "Success" }, done: "{n} approved" },
          { text: "Reject", setStatus: { key: "status", text: "Rejected", state: "Error" }, note: true, done: "{n} rejected" },
          { text: "Forward", form: [{ label: "Forward to", type: "select", options: ["Procurement team", "Finance controller", "Marco Ruiz (team lead)"] }, { label: "Note", type: "textarea" }], submit: "Forward", done: "Forwarded to {Forward to}" },
        ],
      },
    },
    detail: {
      type: "object", icon: "sales-document", title: "Laptops for new hires (×8)", subtitle: "Requisition 10045821 · requested by Lena Ortiz, IT Operations", status: ["Pending approval", "warn"],
      bind: function (r) { return { title: r.desc, subtitle: "Requisition " + r.id + " · requested by " + r.by, status: [r.status, r.statusState], attrs: [r.value + " USD", r.cc, r.needed] }; },
      attrs: [["Total value", "14,320.00 USD"], ["Cost center", "CC-4100 · IT Ops"], ["Needed by", "Nov 28, 2026"], ["Budget left after", "8,780.00 USD"]],
      actions: [
        { text: "Approve", emph: true, setStatus: { text: "Approved", state: "Success" }, object: "this requisition", done: "Requisition approved" },
        { text: "Reject", setStatus: { text: "Rejected", state: "Error" }, object: "this requisition", note: true, done: "Requisition rejected" },
      ],
      sections: [
        { title: "Items", table: { title: "Items", path: "/items", columns: [{ label: "Item", key: "item" }, { label: "Material", key: "material", type: "id", sub: "text" }, { label: "Quantity", key: "qty" }, { label: "Net price", key: "price", type: "number", unit: "USD" }, { label: "Net value", key: "value", type: "number", unit: "USD", strong: true }, { label: "Supplier", key: "supplier" }] } },
        { title: "Budget check", html: '<div style="display:flex;gap:2rem;align-items:center;padding:.5rem 0">' + FioriKit.svgDonut([[62, "#0070f2", "Spent"], [7, "#e76500", "This request"]], "69%") + '<div style="display:grid;gap:.5rem;font-size:.875rem">' + [["Annual budget", "200,000.00 USD"], ["Spent so far", "124,000.00 USD"], ["This request", "14,320.00 USD"], ["Remaining", "61,680.00 USD"]].map(function (r) { return '<div style="display:flex;justify-content:space-between;gap:3rem"><span style="color:#556b82">' + r[0] + "</span><b>" + r[1] + "</b></div>"; }).join("") + "</div></div>" },
        { title: "Approval flow", timeline: [["Submitted by Lena Ortiz", "Nov 12, 09:14", "ok"], ["Team lead approved — Marco Ruiz", "Nov 12, 11:02", "ok"], ["Cost center owner — you", "Waiting for your decision", "warn"], ["Procurement release", "Automatic under 25,000 USD", "none"]] },
      ],
    },
  },
});
