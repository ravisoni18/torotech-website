/*! © 2026 Torotech Inc. All rights reserved. https://torotech.ca — may not be copied, reused or redistributed without written permission. See https://torotech.ca/legal */
/* Torotech Fiori concept kit — builds real OpenUI5 (sap_horizon) floorplans from a small spec.
   Each app page loads OpenUI5 from the CDN, then this file, then specs/<app>.js which calls FioriKit.run(spec).
   Everything is local demo data in a JSONModel; nothing is sent anywhere. */
window.FioriKit = {
  run: function (spec) {
    sap.ui.require(["sap/ui/core/Core"], function (Core) {
      Core.ready(function () {
        sap.ui.require([
          "sap/m/App", "sap/m/Page", "sap/m/Title", "sap/m/Text", "sap/m/Label", "sap/m/Button", "sap/m/Table", "sap/m/Column",
          "sap/m/ColumnListItem", "sap/m/ObjectIdentifier", "sap/m/ObjectStatus", "sap/m/ObjectNumber", "sap/m/OverflowToolbar",
          "sap/m/ToolbarSpacer", "sap/m/SearchField", "sap/m/ComboBox", "sap/m/MultiComboBox", "sap/m/Input", "sap/m/DatePicker",
          "sap/m/TextArea", "sap/m/Select", "sap/m/VBox", "sap/m/HBox", "sap/m/FlexBox", "sap/m/Avatar", "sap/m/ProgressIndicator",
          "sap/m/MessageToast", "sap/m/MessageBox", "sap/m/Dialog", "sap/m/Breadcrumbs", "sap/m/Link", "sap/m/Wizard", "sap/m/WizardStep",
          "sap/m/SegmentedButton", "sap/m/SegmentedButtonItem", "sap/m/RadioButtonGroup", "sap/m/RadioButton", "sap/m/List",
          "sap/m/StandardListItem", "sap/m/CustomListItem", "sap/m/CheckBox", "sap/m/GenericTile", "sap/m/TileContent",
          "sap/m/NumericContent", "sap/m/IconTabBar", "sap/m/IconTabFilter", "sap/m/MessageStrip", "sap/m/Bar",
          "sap/f/ShellBar", "sap/f/DynamicPage", "sap/f/DynamicPageTitle", "sap/f/DynamicPageHeader", "sap/f/Card",
          "sap/f/cards/Header", "sap/f/cards/NumericHeader", "sap/f/GridContainer", "sap/f/GridContainerSettings",
          "sap/f/FlexibleColumnLayout", "sap/uxap/ObjectPageLayout", "sap/uxap/ObjectPageDynamicHeaderTitle",
          "sap/uxap/ObjectPageSection", "sap/uxap/ObjectPageSubSection", "sap/ui/layout/form/SimpleForm",
          "sap/ui/layout/Grid", "sap/ui/core/HTML", "sap/ui/core/Item", "sap/ui/core/Icon", "sap/ui/model/json/JSONModel",
          "sap/ui/model/Filter", "sap/ui/model/FilterOperator",
          "sap/f/GridContainerItemLayoutData",
        ], function () {
          var names = ["App", "Page", "Title", "Text", "Label", "Button", "Table", "Column", "ColumnListItem", "ObjectIdentifier", "ObjectStatus",
            "ObjectNumber", "OverflowToolbar", "ToolbarSpacer", "SearchField", "ComboBox", "MultiComboBox", "Input", "DatePicker",
            "TextArea", "Select", "VBox", "HBox", "FlexBox", "Avatar", "ProgressIndicator", "MessageToast", "MessageBox", "Dialog",
            "Breadcrumbs", "Link", "Wizard", "WizardStep", "SegmentedButton", "SegmentedButtonItem", "RadioButtonGroup",
            "RadioButton", "List", "StandardListItem", "CustomListItem", "CheckBox", "GenericTile", "TileContent", "NumericContent",
            "IconTabBar", "IconTabFilter", "MessageStrip", "Bar", "ShellBar", "DynamicPage", "DynamicPageTitle", "DynamicPageHeader",
            "Card", "CardHeader", "NumericHeader", "GridContainer", "GridContainerSettings", "FlexibleColumnLayout",
            "ObjectPageLayout", "ObjectPageDynamicHeaderTitle", "ObjectPageSection", "ObjectPageSubSection", "SimpleForm", "Grid",
            "HTML", "Item", "Icon", "JSONModel", "Filter", "FilterOperator", "GridContainerItemLayoutData"];
          // Module order above matches this list one-to-one.
          var m = {}, args = arguments;
          names.forEach(function (n, i) { m[n] = args[i]; });
          window.FioriKit._build(spec, m);
        });
      });
    });
  },

  _build: function (spec, m) {
    var K = this;
    var model = new m.JSONModel(spec.data || {});
    model.setSizeLimit(1000);
    // Id must differ from the #app container; autoFocus off so titles aren't outlined on every navigation.
    var app = new m.App({ id: "fioriApp", autoFocus: false });
    app.setModel(model);
    var pages = {};
    var ctx = { m: m, model: model, app: app, spec: spec, pages: pages, current: null,
      nav: function (id, row) { ctx.current = row || ctx.current; if (pages[id].onShow) pages[id].onShow(ctx.current); app.to(pages[id].control, "slide"); },
      back: function () { app.back(); },
      toast: function (t) { m.MessageToast.show(t, { width: "24em" }); },
      doc: function (p) { return (p || "") + String(Math.floor(1e6 + Math.random() * 9e6)); } };
    K.ctx = ctx;

    new m.ShellBar({
      title: spec.title, secondTitle: spec.subtitle || "", homeIcon: "logo.svg", homeIconTooltip: "Northbridge home",
      showNotifications: true, notificationsNumber: "3", showProductSwitcher: true, showSearch: true,
      profile: new m.Avatar({ initials: "JM" }),
      homeIconPressed: function () { ctx.nav(spec.start); },
      notificationsPressed: function () { ctx.toast("3 notifications · this is a concept app"); },
      productSwitcherPressed: function () { ctx.toast("Apps would open here"); },
      avatarPressed: function () { ctx.toast("Signed in as J. Morgan (demo user)"); },
    }).placeAt("shell");

    Object.keys(spec.pages).forEach(function (id) {
      var p = spec.pages[id];
      var built = K[p.type](p, ctx, id);
      pages[id] = built;
      app.addPage(built.control);
    });
    app.setInitialPage(pages[spec.start].control);
    app.placeAt("app");
    if (spec.onReady) spec.onReady(ctx);
  },

  // ---------- small helpers ----------
  state: function (k) { return { ok: "Success", warn: "Warning", err: "Error", info: "Information", none: "None" }[k] || k || "None"; },
  svgBars: function (values, labels, opts) {
    opts = opts || {}; var w = opts.width || 560, h = opts.height || 150, max = Math.max.apply(null, values), bw = w / values.length, s = "";
    values.forEach(function (v, i) {
      var bh = ((h - 20) * v) / max, x = i * bw + bw * 0.18;
      s += '<rect x="' + x + '" y="' + (h - 20 - bh) + '" width="' + bw * 0.64 + '" height="' + bh + '" rx="3" fill="' + (opts.highlight === i ? "#0070f2" : opts.color || "#9ccbff") + '"><title>' + (labels ? labels[i] + ": " : "") + v + "</title></rect>";
      if (labels) s += '<text x="' + (x + bw * 0.32) + '" y="' + (h - 4) + '" font-size="11" text-anchor="middle" fill="#556b82">' + labels[i] + "</text>";
    });
    return '<svg width="100%" viewBox="0 0 ' + w + " " + h + '" style="display:block;font-family:inherit">' + s + "</svg>";
  },
  svgLine: function (values, color) {
    var w = 560, h = 140, max = Math.max.apply(null, values), min = Math.min.apply(null, values), st = w / (values.length - 1);
    var pts = values.map(function (v, i) { return [i * st, h - 8 - ((v - min) / (max - min || 1)) * (h - 16)]; });
    var d = pts.map(function (p, i) { return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); }).join(" ");
    return '<svg width="100%" viewBox="0 0 ' + w + " " + h + '" style="display:block"><path d="' + d + " L" + w + " " + h + " L0 " + h + ' Z" fill="' + color + '" opacity=".12"/><path d="' + d + '" stroke="' + color + '" stroke-width="3" fill="none"/></svg>';
  },
  svgDonut: function (parts, center) {
    var r = 52, C = 2 * Math.PI * r, off = 0, s = '<circle cx="70" cy="70" r="' + r + '" stroke="#eaecee" stroke-width="18" fill="none"/>';
    parts.forEach(function (p) { s += '<circle cx="70" cy="70" r="' + r + '" stroke="' + p[1] + '" stroke-width="18" fill="none" stroke-dasharray="' + (p[0] / 100) * C + " " + C + '" stroke-dashoffset="' + -off + '" transform="rotate(-90 70 70)"><title>' + (p[2] || "") + " " + p[0] + '%</title></circle>'; off += (p[0] / 100) * C; });
    if (center) s += '<text x="70" y="76" text-anchor="middle" font-size="20" font-weight="700" fill="#1d2d3e">' + center + "</text>";
    return '<svg width="140" height="140" viewBox="0 0 140 140">' + s + "</svg>";
  },

  cell: function (col, m) {
    var K = this, key = col.key;
    switch (col.type) {
      case "id": return new m.ObjectIdentifier({ title: "{" + key + "}", text: col.sub ? "{" + col.sub + "}" : "" });
      case "status": return new m.ObjectStatus({ text: "{" + key + "}", state: { path: key + "State", formatter: K.state }, inverted: !!col.inverted });
      case "number": return new m.ObjectNumber({ number: "{" + key + "}", unit: col.unit || (col.unitKey ? "{" + col.unitKey + "}" : ""), emphasized: !!col.strong, state: col.stateKey ? { path: col.stateKey, formatter: K.state } : "None" });
      case "progress": return new m.ProgressIndicator({ percentValue: { path: key, formatter: function (v) { return Math.min(100, +v || 0); } }, displayValue: "{" + key + "}%", state: { path: key + "State", formatter: K.state }, width: "8rem", displayOnly: true });
      case "person": return new m.HBox({ alignItems: "Center", items: [new m.Avatar({ initials: { path: key, formatter: function (n) { return (n || "").split(" ").map(function (x) { return x[0]; }).join(""); } }, displaySize: "XS", backgroundColor: "Random" }).addStyleClass("sapUiTinyMarginEnd"), new m.Text({ text: "{" + key + "}" })] });
      case "input": return new m.Input({ value: "{" + key + "}", width: col.width || "6rem", textAlign: "End", type: "Number", liveChange: col.onChange, valueState: { path: key + "VS", formatter: function (v) { return v || "None"; } } });
      default: return new m.Text({ text: "{" + key + "}", wrapping: false });
    }
  },

  // A sap.m.Table bound to a model path, with search, selection and toolbar actions.
  table: function (t, ctx, owner) {
    var K = this, m = ctx.m;
    var search = new m.SearchField({ width: "14rem", placeholder: "Search", liveChange: function (e) { owner.applyFilters(e.getParameter("newValue")); } });
    var title = new m.Title({ text: t.title + " ({= ${" + t.path + "}.length })", level: "H2" });
    var buttons = (t.actions || []).map(function (a) { return K.button(a, ctx, owner); });
    var table = new m.Table({
      mode: t.select === false ? "None" : "MultiSelect", growing: true, sticky: ["ColumnHeaders", "HeaderToolbar"],
      headerToolbar: new m.OverflowToolbar({ content: [title, new m.ToolbarSpacer(), search].concat(buttons).concat([
        new m.Button({ icon: "sap-icon://excel-attachment", tooltip: "Export to spreadsheet", type: "Transparent", press: function () { ctx.toast("Exported " + table.getItems().length + " rows to spreadsheet"); } }),
        new m.Button({ icon: "sap-icon://action-settings", tooltip: "Table settings", type: "Transparent", press: function () { ctx.toast("Column and sort settings would open here"); } }),
      ]) }),
      columns: t.columns.map(function (c) { return new m.Column({ header: new m.Text({ text: c.label }), hAlign: c.align || (c.type === "number" ? "End" : "Begin"), width: c.width, minScreenWidth: c.minWidth, demandPopin: !!c.minWidth }); }),
      selectionChange: function () { owner.onSelect && owner.onSelect(table.getSelectedItems().length); },
    });
    var itemSettings = { type: t.nav ? "Navigation" : "Inactive", cells: t.columns.map(function (c) { return K.cell(c, m); }) };
    if (t.nav) itemSettings.press = function (e) { ctx.nav(t.nav, e.getSource().getBindingContext().getObject()); };
    var tmpl = new m.ColumnListItem(itemSettings);
    table.bindItems({ path: t.path, template: tmpl, templateShareable: false });
    table._search = search;
    owner.table = table;
    owner.selected = function () { return table.getSelectedItems().map(function (i) { return i.getBindingContext(); }); };
    owner.applyFilters = function (q) {
      var f = [];
      q = q === undefined ? search.getValue() : q;
      if (q) f.push(new m.Filter({ filters: t.searchKeys.map(function (k) { return new m.Filter(k, m.FilterOperator.Contains, q); }), and: false }));
      (owner.filterControls || []).forEach(function (fc) {
        var keys = fc.control.getSelectedKeys ? fc.control.getSelectedKeys() : [fc.control.getSelectedKey()].filter(Boolean);
        if (keys.length && keys[0] !== "__all") f.push(new m.Filter({ filters: keys.map(function (k) { return new m.Filter(fc.key, m.FilterOperator.EQ, k); }), and: false }));
      });
      table.getBinding("items").filter(f.length ? new m.Filter({ filters: f, and: true }) : []);
      title.setText(t.title + " (" + table.getBinding("items").getLength() + ")");
    };
    return table;
  },

  // Buttons: status changes on selected rows, navigation, dialogs, toasts.
  button: function (a, ctx, owner) {
    var m = ctx.m;
    return new m.Button({ text: a.text, icon: a.icon, type: a.emph ? "Emphasized" : a.type || "Default", press: function () { window.FioriKit.act(a, ctx, owner); } });
  },
  act: function (a, ctx, owner) {
    var m = ctx.m, K = this;
    if (a.run) return a.run(ctx, owner);
    if (a.nav) return ctx.nav(a.nav);
    if (a.toast) return ctx.toast(a.toast);
    if (a.setStatus) {
      var sel = owner && owner.selected ? owner.selected() : [];
      if (owner && owner.selected && !sel.length) return ctx.toast("Select at least one item first");
      var n = sel.length || 1, what = owner && owner.selected ? n + " selected item" + (n > 1 ? "s" : "") : (a.object || "this item");
      var doIt = function (note) {
        if (owner && owner.selected) {
          sel.forEach(function (c) { ctx.model.setProperty(c.getPath() + "/" + a.setStatus.key, a.setStatus.text); ctx.model.setProperty(c.getPath() + "/" + a.setStatus.key + "State", a.setStatus.state); });
          owner.table.removeSelections(true);
        } else if (owner && owner.setHeaderStatus) owner.setHeaderStatus(a.setStatus.text, a.setStatus.state);
        ctx.toast((a.done || "{n} updated").replace("{n}", owner && owner.selected ? n + " item" + (n > 1 ? "s" : "") : (a.object || "Item")) + (note ? " · note added" : ""));
      };
      if (a.note) {
        var ta = new m.TextArea({ width: "100%", rows: 3, placeholder: "Reason (shown to the requester)" });
        var d = new m.Dialog({ title: a.text + " " + what + "?", type: "Message", state: "Warning", content: [ta],
          beginButton: new m.Button({ text: a.text, type: "Emphasized", press: function () { d.close(); doIt(ta.getValue()); } }),
          endButton: new m.Button({ text: "Cancel", press: function () { d.close(); } }), afterClose: function () { d.destroy(); } });
        return d.open();
      }
      return m.MessageBox.confirm(a.text + " " + what + "?", { title: a.text, actions: [a.text, m.MessageBox.Action.CANCEL], emphasizedAction: a.text, onClose: function (r) { if (r === a.text) doIt(); } });
    }
    if (a.success) {
      return m.MessageBox.success(a.success.replace("{doc}", ctx.doc(a.docPrefix || "500")), { title: a.title || "Success", actions: a.then ? [a.then.text, m.MessageBox.Action.CLOSE] : [m.MessageBox.Action.OK], emphasizedAction: a.then ? a.then.text : m.MessageBox.Action.OK,
        onClose: function (r) { if (a.then && r === a.then.text) ctx.nav(a.then.nav); else if (a.afterNav) ctx.nav(a.afterNav); if (owner && owner.setHeaderStatus && a.headerStatus) owner.setHeaderStatus(a.headerStatus[0], a.headerStatus[1]); } });
    }
    if (a.form) {
      var ctrls = a.form.map(function (f) {
        var c = f.type === "select" ? new m.Select({ width: "100%", items: f.options.map(function (o) { return new m.Item({ key: o, text: o }); }) })
          : f.type === "date" ? new m.DatePicker({ value: f.value || "", valueFormat: "yyyy-MM-dd", displayFormat: "medium", width: "100%" })
          : f.type === "textarea" ? new m.TextArea({ width: "100%", rows: 3, value: f.value || "" })
          : new m.Input({ value: f.value || "", placeholder: f.placeholder || "", width: "100%", required: !!f.required });
        return { f: f, c: c };
      });
      var form = new m.SimpleForm({ editable: true, layout: "ResponsiveGridLayout", labelSpanL: 4, labelSpanM: 4, content: ctrls.reduce(function (acc, x) { return acc.concat([new m.Label({ text: x.f.label, required: !!x.f.required }), x.c]); }, []) });
      var dlg = new m.Dialog({ title: a.title || a.text, contentWidth: "32rem", content: [form],
        beginButton: new m.Button({ text: a.submit || "Save", type: "Emphasized", press: function () {
          var bad = ctrls.filter(function (x) { return x.f.required && !x.c.getValue(); });
          ctrls.forEach(function (x) { if (x.c.setValueState) x.c.setValueState(x.f.required && !x.c.getValue() ? "Error" : "None"); });
          if (bad.length) return;
          dlg.close();
          var vals = {}; ctrls.forEach(function (x) { vals[x.f.label] = x.c.getValue ? x.c.getValue() : x.c.getSelectedKey(); });
          if (a.onSubmit) a.onSubmit(vals, ctx, owner);
          ctx.toast((a.done || "Saved").replace(/\{(.+?)\}/g, function (_, k) { return vals[k] || ""; }));
        } }),
        endButton: new m.Button({ text: "Cancel", press: function () { dlg.close(); } }), afterClose: function () { dlg.destroy(); } });
      return dlg.open();
    }
  },

  // ---------- floorplans ----------
  list: function (p, ctx, id) {
    var K = this, m = ctx.m, owner = { filterControls: [] };
    var filterItems = (p.filters || []).map(function (f) {
      var c = f.multi ? new m.MultiComboBox({ width: "14rem", selectedKeys: f.selected || [], items: f.items.map(function (i) { return new m.Item({ key: i, text: i }); }), selectionChange: function () { owner.applyFilters(); } })
        : new m.ComboBox({ width: "14rem", selectedKey: f.selected || "__all", items: [new m.Item({ key: "__all", text: "All" })].concat(f.items.map(function (i) { return new m.Item({ key: i, text: i }); })), selectionChange: function () { owner.applyFilters(); } });
      owner.filterControls.push({ key: f.key, control: c });
      return new m.VBox({ items: [new m.Label({ text: f.label + ":", labelFor: c }), c] }).addStyleClass("sapUiSmallMarginEnd sapUiTinyMarginBottom");
    });
    var go = new m.Button({ text: "Go", type: "Emphasized", press: function () {
      owner.applyFilters();
      owner.table.setBusy(true);
      setTimeout(function () { owner.table.setBusy(false); ctx.toast(owner.table.getBinding("items").getLength() + " results"); }, 600);
    } });
    var header = new m.DynamicPageHeader({ pinnable: true, content: [new m.FlexBox({ wrap: "Wrap", alignItems: "End", items: filterItems.concat([new m.VBox({ items: [go] }).addStyleClass("sapUiTinyMarginBottom")]) })] });
    var top = p.kpis ? new m.FlexBox({ wrap: "Wrap", items: p.kpis.map(function (k) {
      return new m.GenericTile({ header: k[0], subheader: k[3] || "", frameType: "OneByOne", press: function () { ctx.toast(k[0] + ": " + k[1]); },
        tileContent: [new m.TileContent({ content: new m.NumericContent({ value: k[1], valueColor: { ok: "Good", warn: "Critical", err: "Error", info: "Neutral" }[k[2]] || "Neutral", withMargin: false, scale: k[4] || "" }) })] }).addStyleClass("sapUiTinyMarginEnd sapUiTinyMarginBottom");
    }) }).addStyleClass("sapUiSmallMarginBottom") : null;
    var charts = (p.charts || []).map(function (c) { return new m.Card({ width: "100%", header: new m.CardHeader({ title: c.title, subtitle: c.subtitle || "" }), content: new m.HTML({ content: '<div style="padding:0 1rem 1rem">' + c.html + "</div>" }) }).addStyleClass("sapUiSmallMarginBottom"); });
    var table = K.table(p.table, ctx, owner);
    var page = new m.DynamicPage({
      headerExpanded: true, toggleHeaderOnTitleClick: true, fitContent: false,
      title: new m.DynamicPageTitle({ heading: new m.Title({ text: p.title, wrapping: true }), snappedContent: [new m.Text({ text: (p.filters || []).length + " filters" })],
        navigationActions: id === ctx.spec.start ? [] : [new m.Button({ icon: "sap-icon://nav-back", type: "Transparent", tooltip: "Back", press: function () { ctx.back(); } })],
        actions: (p.titleActions || []).map(function (a) { return K.button(a, ctx, owner); }) }),
      header: header,
      content: new m.VBox({ items: [top].concat(charts.length ? [new m.Grid({ defaultSpan: charts.length > 1 ? "XL6 L6 M12 S12" : "XL12 L12 M12 S12", content: charts })] : []).concat([table]).filter(Boolean) }),
    });
    // Apply the default filters once, after the first render — re-filtering on every render would loop.
    var initial = { onAfterRendering: function () { page.removeEventDelegate(initial); owner.applyFilters(); } };
    page.addEventDelegate(initial);
    return { control: page, owner: owner };
  },

  object: function (p, ctx, id) {
    var K = this, m = ctx.m, owner = {};
    var status = new m.ObjectStatus({ text: p.status[0], state: K.state(p.status[1]), inverted: true });
    var heading = new m.Title({ text: p.title, wrapping: true });
    var sub = new m.Text({ text: p.subtitle });
    owner.setHeaderStatus = function (t, s) { status.setText(t); status.setState(K.state(s)); };
    var attrTexts = [];
    var attrs = new m.FlexBox({ wrap: "Wrap", items: [new m.VBox({ items: [new m.Label({ text: "Status" }), status] }).addStyleClass("sapUiLargeMarginEnd sapUiSmallMarginBottom")].concat(
      (p.attrs || []).map(function (a) { var v = new m.Text({ text: a[1] }); attrTexts.push(v); return new m.VBox({ items: [new m.Label({ text: a[0] }), v] }).addStyleClass("sapUiLargeMarginEnd sapUiSmallMarginBottom"); })) });
    var sections = p.sections.map(function (s) {
      var block;
      if (s.form) block = new m.SimpleForm({ editable: false, layout: "ColumnLayout", columnsM: 2, columnsL: 3, columnsXL: 3, content: s.form.reduce(function (acc, f) { return acc.concat([new m.Label({ text: f[0] }), new m.Text({ text: f[1] })]); }, []) });
      else if (s.table) { var tOwner = { filterControls: [] }; block = K.table(Object.assign({ select: s.table.select === true ? undefined : false, searchKeys: [s.table.columns[0].key] }, s.table), ctx, tOwner); owner.inner = tOwner; }
      else if (s.timeline) block = new m.List({ showSeparators: "None", items: s.timeline.map(function (e) { return new m.CustomListItem({ content: new m.HBox({ alignItems: "Start", items: [new m.Icon({ src: "sap-icon://" + ({ ok: "sys-enter-2", warn: "pending", err: "error", info: "process", none: "circle-task" }[e[2]] || "circle-task"), color: { ok: "#256f3a", warn: "#e76500", err: "#aa0808", info: "#0064d9" }[e[2]] || "#8396a8", size: "1.25rem" }).addStyleClass("sapUiSmallMarginEnd sapUiTinyMarginTop"), new m.VBox({ items: [new m.Text({ text: e[0] }).addStyleClass("sapUiTinyMarginTop"), new m.Label({ text: e[1] })] })] }).addStyleClass("sapUiTinyMarginBottom") }); }) });
      else if (s.html) block = new m.HTML({ content: "<div>" + s.html + "</div>" });
      else if (s.control) block = s.control(ctx, owner);
      return new m.ObjectPageSection({ title: s.title, titleUppercase: false, subSections: [new m.ObjectPageSubSection({ title: s.title, blocks: [block] })] });
    });
    var layout = new m.ObjectPageLayout({
      useIconTabBar: !!p.tabs, showFooter: !!p.footer, upperCaseAnchorBar: false,
      headerTitle: new m.ObjectPageDynamicHeaderTitle({
        breadcrumbs: new m.Breadcrumbs({ links: [new m.Link({ text: ctx.spec.title, press: function () { ctx.back(); } })] }),
        heading: new m.HBox({ alignItems: "Center", items: [p.icon ? new m.Avatar({ src: "sap-icon://" + p.icon, displayShape: "Square", displaySize: "S", backgroundColor: "Accent6" }).addStyleClass("sapUiSmallMarginEnd") : null, new m.VBox({ items: [heading, sub] })].filter(Boolean) }),
        snappedHeading: new m.Title({ text: p.title }),
        navigationActions: [new m.Button({ icon: "sap-icon://nav-back", type: "Transparent", tooltip: "Back", press: function () { ctx.back(); } })],
        actions: (p.actions || []).map(function (a) { return K.button(a, ctx, owner); }),
      }),
      headerContent: [attrs],
      sections: sections,
    });
    if (p.footer) layout.setFooter(new m.OverflowToolbar({ content: [new m.ToolbarSpacer()].concat(p.footer.map(function (a) { return K.button(a, ctx, owner); })) }));
    var built = { control: layout, owner: owner };
    if (p.bind) built.onShow = function (row) { if (!row) return; var b = p.bind(row); if (b.title) heading.setText(b.title); if (b.subtitle) sub.setText(b.subtitle); if (b.status) owner.setHeaderStatus(b.status[0], b.status[1]); (b.attrs || []).forEach(function (v, i) { if (attrTexts[i] && v != null) attrTexts[i].setText(v); }); };
    return built;
  },

  wizard: function (p, ctx) {
    var m = ctx.m, K = this;
    var wizard = new m.Wizard({ finishButtonText: p.finish || "Submit", complete: function () { K.act(p.onComplete, ctx); },
      steps: p.steps.map(function (s) { return new m.WizardStep({ title: s.title, validated: true, content: s.content(ctx) }); }) });
    var page = new m.Page({ title: p.title, showNavButton: true, navButtonPress: function () { ctx.back(); }, content: [wizard],
      footer: new m.OverflowToolbar({ content: [new m.ToolbarSpacer(), new m.Button({ text: "Cancel", press: function () { ctx.back(); } })] }) });
    return { control: page, onShow: function () { wizard.discardProgress(wizard.getSteps()[0]); } };
  },

  overview: function (p, ctx) {
    var m = ctx.m;
    var grid = new m.GridContainer({ snapToRow: true, layout: new m.GridContainerSettings({ rowSize: "5rem", columnSize: "5rem", gap: "1rem" }),
      items: p.cards.map(function (c) {
        var header = c.number ? new m.NumericHeader({ title: c.title, subtitle: c.subtitle, number: c.number, scale: c.scale || "", state: { ok: "Good", warn: "Critical", err: "Error" }[c.state] || "Neutral", trend: c.trend || "None", details: c.details || "", press: function () { c.nav ? ctx.nav(c.nav) : ctx.toast(c.title); } })
          : new m.CardHeader({ title: c.title, subtitle: c.subtitle, press: function () { c.nav ? ctx.nav(c.nav) : ctx.toast(c.title); } });
        var card = new m.Card({ header: header, content: new m.HTML({ content: '<div style="padding:0 1rem 1rem">' + (c.html || "") + "</div>" }) });
        card.setLayoutData(new m.GridContainerItemLayoutData({ columns: c.cols || 4, minRows: c.rows || 4 }));
        // The whole card drills down, not just its header.
        if (c.nav) { card.addStyleClass("fk-nav"); card.attachBrowserEvent("click", function () { ctx.nav(c.nav); }); }
        return card;
      }) }).addStyleClass("sapUiSmallMargin");
    var page = new m.DynamicPage({ title: new m.DynamicPageTitle({ heading: new m.Title({ text: p.title }), actions: (p.titleActions || []).map(function (a) { return window.FioriKit.button(a, ctx); }) }), content: grid });
    return { control: page };
  },

  custom: function (p, ctx, id) { return p.build(ctx, id); },
};
