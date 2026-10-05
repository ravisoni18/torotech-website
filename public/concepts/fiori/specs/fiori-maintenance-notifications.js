/*! © 2026 Torotech Inc. All rights reserved. https://torotech.ca — may not be copied, reused or redistributed without written permission. See https://torotech.ca/legal */
FioriKit.run({
  title: "Maintenance Notifications",
  start: "list",
  data: {
    rows: [
      { id: "10007712", desc: "Conveyor belt slipping at transfer", eq: "CNV-2201", floc: "1100-PRD-L2", prio: "1 · Very high", prioState: "Error", by: "A. Novak", start: "Nov 13, 06:40", status: "Outstanding", statusState: "Warning" },
      { id: "10007709", desc: "Hydraulic leak — press 4", eq: "PRS-0404", floc: "1100-PRD-L1", prio: "1 · Very high", prioState: "Error", by: "J. Kim", start: "Nov 13, 05:15", status: "In process", statusState: "Information" },
      { id: "10007698", desc: "Unusual vibration, motor M3", eq: "MTR-0303", floc: "1100-UTL-02", prio: "2 · High", prioState: "Warning", by: "R. Costa", start: "Nov 12, 22:10", status: "Outstanding", statusState: "Warning" },
      { id: "10007690", desc: "Chiller outlet temp high", eq: "CHL-0001", floc: "1100-UTL-01", prio: "2 · High", prioState: "Warning", by: "M. Duarte", start: "Nov 12, 14:02", status: "Order created", statusState: "Information" },
      { id: "10007684", desc: "Safety guard cracked", eq: "PKG-0110", floc: "1100-PKG-L3", prio: "2 · High", prioState: "Warning", by: "S. Ibrahim", start: "Nov 12, 09:31", status: "In process", statusState: "Information" },
      { id: "10007671", desc: "Label printer misfeeds", eq: "LBL-0032", floc: "1100-PKG-L3", prio: "3 · Medium", prioState: "None", by: "L. Fischer", start: "Nov 11, 16:45", status: "Outstanding", statusState: "Warning" },
      { id: "10007662", desc: "Compressed air pressure drop", eq: "CMP-0002", floc: "1100-UTL-02", prio: "3 · Medium", prioState: "None", by: "A. Novak", start: "Nov 11, 07:20", status: "Completed", statusState: "Success" },
      { id: "10007655", desc: "Forklift battery not charging", eq: "FLT-0017", floc: "1100-WHS-01", prio: "4 · Low", prioState: "None", by: "P. Grant", start: "Nov 10, 13:00", status: "Completed", statusState: "Success" },
    ],
  },
  pages: {
    list: {
      type: "list", title: "Open notifications · Plant 1100",
      titleActions: [{ text: "Report a malfunction", emph: true, nav: "wizard", icon: "sap-icon://add" }],
      filters: [{ label: "Priority", key: "prio", multi: true, items: ["1 · Very high", "2 · High", "3 · Medium", "4 · Low"] }, { label: "Status", key: "status", items: ["Outstanding", "In process", "Order created", "Completed"] }],
      table: {
        title: "Notifications", path: "/rows", searchKeys: ["id", "desc", "eq", "by"],
        columns: [{ label: "Notification", key: "id", type: "id", sub: "desc" }, { label: "Equipment", key: "eq" }, { label: "Functional location", key: "floc", minWidth: "1000px" }, { label: "Priority", key: "prio", type: "status" }, { label: "Reported by", key: "by", minWidth: "900px" }, { label: "Malfunction start", key: "start", minWidth: "1100px" }, { label: "Status", key: "status", type: "status" }],
        actions: [{ text: "Convert to order", emph: true, setStatus: { key: "status", text: "Order created", state: "Information" }, done: "Maintenance orders created for {n}" }, { text: "Complete", setStatus: { key: "status", text: "Completed", state: "Success" }, done: "{n} completed" }],
      },
    },
    wizard: {
      type: "wizard", title: "Report a malfunction", finish: "Create notification",
      onComplete: { success: "Notification 10007713 was created and sent to the maintenance planner for Line 2.", title: "Notification created", afterNav: "list" },
      steps: [
        { title: "Equipment", content: function (ctx) { var m = ctx.m; return [new m.SimpleForm({ editable: true, layout: "ResponsiveGridLayout", content: [new m.Label({ text: "Equipment", required: true }), new m.ComboBox({ selectedKey: "CNV-2201", items: [["CNV-2201", "CNV-2201 · Transfer conveyor"], ["PRS-0404", "PRS-0404 · Hydraulic press 4"], ["MTR-0303", "MTR-0303 · Motor M3"]].map(function (i) { return new m.Item({ key: i[0], text: i[1] }); }) }), new m.Label({ text: "Functional location" }), new m.Text({ text: "1100-PRD-L2 · Line 2 packaging" })] }), new m.MessageStrip({ text: "Same damage code reported twice on CNV-2201 in the last 60 days.", type: "Warning", showIcon: true }).addStyleClass("sapUiSmallMarginTop")]; } },
        { title: "Problem", content: function (ctx) { var m = ctx.m; return [new m.SimpleForm({ editable: true, layout: "ResponsiveGridLayout", content: [new m.Label({ text: "Short description", required: true }), new m.Input({ value: "Conveyor belt slipping at transfer point" }), new m.Label({ text: "Damage code" }), new m.Select({ items: ["BLT-02 · Belt slip / misalignment", "BLT-05 · Belt torn", "MTR-01 · Motor overheating"].map(function (t) { return new m.Item({ key: t, text: t }); }) }), new m.Label({ text: "Priority" }), new m.SegmentedButton({ selectedKey: "1", items: [["1", "Very high"], ["2", "High"], ["3", "Medium"], ["4", "Low"]].map(function (i) { return new m.SegmentedButtonItem({ key: i[0], text: i[1] }); }) }), new m.Label({ text: "Production stopped?" }), new m.RadioButtonGroup({ selectedIndex: 1, columns: 2, buttons: [new m.RadioButton({ text: "Yes — line is down" }), new m.RadioButton({ text: "No — running degraded" })] }), new m.Label({ text: "Malfunction start" }), new m.DatePicker({ value: "2026-11-13", valueFormat: "yyyy-MM-dd", displayFormat: "medium" })] })]; } },
        { title: "Notes", content: function (ctx) { var m = ctx.m; return [new m.SimpleForm({ editable: true, layout: "ResponsiveGridLayout", content: [new m.Label({ text: "Description" }), new m.TextArea({ rows: 5, width: "100%", value: "Belt slips under full load at the transfer point; tensioner appears worn. Running at 70% speed as a workaround." }), new m.Label({ text: "Notify" }), new m.MultiComboBox({ selectedKeys: ["planner"], items: [["planner", "Maintenance planner"], ["shift", "Shift supervisor"], ["ehs", "EHS officer"]].map(function (i) { return new m.Item({ key: i[0], text: i[1] }); }) })] })]; } },
      ],
    },
  },
});
