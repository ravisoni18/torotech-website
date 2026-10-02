FioriKit.run({
  title: "Manage Supplier Onboarding",
  start: "list",
  data: {
    rows: [
      { id: "SR-2291", name: "Evergreen Logistics Inc.", cat: "Freight & transport", country: "CA", progress: 80, progressState: "Information", docs: "6 / 7", risk: "Low", riskState: "Success", stage: "Finance review", stageState: "Information" },
      { id: "SR-2288", name: "Kestrel Components", cat: "Electronic parts", country: "US", progress: 55, progressState: "Information", docs: "4 / 7", risk: "Medium", riskState: "Warning", stage: "Docs pending", stageState: "Warning" },
      { id: "SR-2284", name: "Bluecrest Facility Services", cat: "Facility services", country: "CA", progress: 100, progressState: "Success", docs: "7 / 7", risk: "Low", riskState: "Success", stage: "Ready to approve", stageState: "Success" },
      { id: "SR-2279", name: "Oakmont Chemical Co.", cat: "Chemicals", country: "US", progress: 35, progressState: "Warning", docs: "3 / 8", risk: "High", riskState: "Error", stage: "Compliance check", stageState: "Error" },
      { id: "SR-2275", name: "Summit Print & Pack", cat: "Packaging", country: "CA", progress: 70, progressState: "Information", docs: "5 / 7", risk: "Low", riskState: "Success", stage: "Legal review", stageState: "Information" },
      { id: "SR-2270", name: "Ridgeway IT Partners", cat: "IT services", country: "US", progress: 20, progressState: "Warning", docs: "1 / 6", risk: "Medium", riskState: "Warning", stage: "Invited", stageState: "None" },
    ],
    docs: [
      { doc: "Certificate of insurance", up: "Nov 02", valid: "Oct 2027", s: "Verified", sState: "Success" },
      { doc: "Banking letter", up: "Nov 02", valid: "—", s: "Verified", sState: "Success" },
      { doc: "Safety certification (COR)", up: "Nov 04", valid: "Mar 2027", s: "Verified", sState: "Success" },
      { doc: "Code of conduct (signed)", up: "—", valid: "—", s: "Missing", sState: "Error" },
    ],
  },
  pages: {
    list: {
      type: "list", title: "Requests in progress",
      titleActions: [{ text: "Invite supplier", emph: true, icon: "sap-icon://add", title: "Invite supplier", form: [{ label: "Company name", required: true, placeholder: "Supplier Ltd." }, { label: "Contact email", required: true, placeholder: "ap@supplier.example" }, { label: "Category", type: "select", options: ["Freight & transport", "Packaging", "IT services", "Chemicals"] }], submit: "Send invitation", done: "Invitation sent to {Company name}",
        onSubmit: function (v, ctx) { var rows = ctx.model.getProperty("/rows"); rows.unshift({ id: "SR-2292", name: v["Company name"], cat: v.Category, country: "CA", progress: 5, progressState: "Warning", docs: "0 / 7", risk: "—", riskState: "None", stage: "Invited", stageState: "None" }); ctx.model.setProperty("/rows", rows); } }],
      filters: [{ label: "Country", key: "country", multi: true, items: ["CA", "US"] }, { label: "Risk", key: "risk", items: ["Low", "Medium", "High"] }],
      table: {
        title: "Registration requests", path: "/rows", nav: "detail", searchKeys: ["id", "name", "cat"],
        columns: [{ label: "Supplier", key: "name", type: "id", sub: "id" }, { label: "Category", key: "cat", minWidth: "900px" }, { label: "Country", key: "country" }, { label: "Progress", key: "progress", type: "progress" }, { label: "Documents", key: "docs", minWidth: "1000px" }, { label: "Risk", key: "risk", type: "status" }, { label: "Stage", key: "stage", type: "status" }],
        actions: [{ text: "Approve", emph: true, setStatus: { key: "stage", text: "Approved", state: "Success" }, done: "{n} approved — supplier records created" }, { text: "Send reminder", toast: "Reminder sent to suppliers with missing documents" }],
      },
    },
    detail: {
      type: "object", icon: "supplier", title: "Evergreen Logistics Inc.", subtitle: "Registration SR-2291 · Freight & transport · Vancouver, CA", status: ["Finance review", "info"],
      bind: function (r) { return { title: r.name, subtitle: "Registration " + r.id + " · " + r.cat + " · " + r.country, status: [r.stage, r.stageState], attrs: [r.progress + " %"] }; },
      attrs: [["Progress", "80 %"], ["Requested by", "Daniel Moreau"], ["Expected annual spend", "1.2 M CAD"], ["Risk score", "Low · 18 / 100"]],
      actions: [{ text: "Approve", emph: true, setStatus: { text: "Approved", state: "Success" }, object: "this supplier", done: "Supplier approved — business partner 300124 created" }, { text: "Request changes", setStatus: { text: "Changes requested", state: "Warning" }, object: "this supplier", note: true, done: "Change request sent to the supplier" }],
      sections: [
        { title: "Company data", form: [["Legal name", "Evergreen Logistics Inc."], ["Tax number", "BN 81234 5678 RT0001"], ["Address", "1200 Harbour Rd, Vancouver BC"], ["Contact", "Aya Matsumoto · CFO"], ["Payment terms", "Net 45"], ["Incoterms", "FCA Vancouver"]] },
        { title: "Documents", table: { title: "Documents", path: "/docs", columns: [{ label: "Document", key: "doc" }, { label: "Uploaded", key: "up" }, { label: "Valid until", key: "valid" }, { label: "Status", key: "s", type: "status" }] } },
        { title: "Checks", timeline: [["Sanctions screening — no matches", "Nov 03", "ok"], ["Duplicate supplier check — none found", "Nov 03", "ok"], ["Bank account validation — owner matches", "Nov 04", "ok"], ["Credit rating A– · stable", "Nov 04", "ok"], ["Code of conduct — waiting for signature", "Reminder sent Nov 10", "warn"]] },
      ],
    },
  },
});
