/* Runs inside each phone screen of a Torotech app concept. Turns taps into navigation by posting to the
   prototype page around it (see prototype.js). Config comes from window.SCREEN = { n, total, rules }. */
(function () {
  var S = window.SCREEN || { n: 1, total: 3, rules: [] };
  function send(go) {
    if (window.parent !== window) window.parent.postMessage({ concept: true, go: go }, "*");
  }

  var css = document.createElement("style");
  css.textContent = "[data-go]{cursor:pointer;transition:transform .12s ease,opacity .12s}[data-go]:active{transform:scale(.97);opacity:.85}";
  document.head.appendChild(css);

  // Built-in wiring that every screen shares.
  var bar = document.querySelector('.px.between[style*="height:52px"]');
  if (bar) {
    var icos = bar.querySelectorAll(":scope > .ico");
    if (icos[0]) icos[0].dataset.go = "back";
  }
  document.querySelectorAll(".tab > div").forEach(function (t, i) {
    t.dataset.go = i === 0 ? "1" : "toast:" + t.textContent.trim() + " isn't part of this demo";
  });
  document.querySelectorAll(".btn").forEach(function (b) {
    if (!b.dataset.go) b.dataset.go = S.n < S.total ? String(S.n + 1) : "done";
  });
  if (S.n === 1) {
    // On the first screen, anything with a photo or a card opens the detail screen.
    document.querySelectorAll(".card, [style*='border-radius:22px'], [style*='border-radius:24px']").forEach(function (el) {
      if (!el.closest("[data-go]") && !el.querySelector("[data-go]")) el.dataset.go = "2";
    });
  }
  // Labelled quick-action tiles (icon + caption) announce what they'd open.
  document.querySelectorAll(".ico").forEach(function (ico) {
    var tile = ico.parentElement, label = tile && tile.textContent.trim();
    if (!label || tile.style.textAlign !== "center" || tile.closest("[data-go]") || tile.closest(".tab") || tile.children.length !== 2) return;
    tile.dataset.go = "toast:" + label + " would open here";
  });
  // Every icon does something sensible, based on which icon it is.
  var ICON = { bell: "toast:No new notifications", search: "toast:Search would open here", share: "toast:Share sheet opened",
    more: "toast:More options", settings: "toast:Settings would open here", phone: "toast:Calling…", message: "toast:Chat opened",
    filter: "toast:Filters would open here", calendar: "toast:Date picker would open here",
    mic: "toast:Microphone muted", zap: "toast:Flash on", x: "back", back: "back",
    heart: "fav", plus: "inc", minus: "dec", user: "toast:Profile would open here", cart: "toast:Your cart" };
  document.querySelectorAll("svg[data-i]").forEach(function (svg) {
    var name = svg.getAttribute("data-i"), host = svg.closest(".ico") || svg.parentElement;
    if (!ICON[name] || host.closest("[data-go]") || host.closest(".tab") || host.closest(".btn")) return;
    if (host === document.body || host.children.length > 2) return;
    host.dataset.go = ICON[name];
  });
  // List rows with a bold title open a short detail.
  document.querySelectorAll(".row, .between").forEach(function (r) {
    var title = r.querySelector("b");
    if (!title || title.matches(".h1,.h2") || r.closest("[data-go]") || r.querySelector("[data-go]") || r.closest(".tab") || r.closest("[data-amount]")) return;
    if (r.matches(".px") || r.offsetHeight > 120) return;
    r.dataset.go = "toast:" + title.textContent.trim() + " — details would open here";
  });
  document.querySelectorAll("[data-key]").forEach(function (k) { k.dataset.go = "key:" + k.getAttribute("data-key"); });

  // App-specific overrides: { sel, nth, go } — applied last so they win.
  (S.rules || []).forEach(function (r) {
    var list = document.querySelectorAll(r.sel);
    var targets = r.nth === undefined ? Array.prototype.slice.call(list) : [list[r.nth]];
    targets.forEach(function (el) {
      if (!el) return;
      el.dataset.go = r.go;
      // The rule owns the whole element — drop any guesses made for things inside it.
      el.querySelectorAll("[data-go]").forEach(function (x) { delete x.dataset.go; });
    });
  });

  // Amount keypad (send-money screens).
  var amount = "120";
  function typeKey(k) {
    if (k === "⌫") amount = amount.slice(0, -1);
    else if (k === "." && amount.indexOf(".") >= 0) return;
    else if (amount.replace(".", "").length < 6) amount = amount === "0" ? k : amount + k;
    var shown = amount || "0", parts = shown.split(".");
    var el = document.querySelector("[data-amount]");
    if (el) el.innerHTML = "$" + Number(parts[0] || 0).toLocaleString("en-US") + '<span style="opacity:.35">.' + ((parts[1] || "") + "00").slice(0, 2) + "</span>";
    var btn = document.querySelector("[data-send]");
    var value = Number(shown) || 0;
    if (btn) btn.textContent = "Send $" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    window.SCREEN.amount = value;
  }
  document.querySelectorAll("[data-key]").forEach(function (k) { k.addEventListener("pointerdown", function () { k.style.background = "rgba(127,127,127,.18)"; }); k.addEventListener("pointerup", function () { k.style.background = ""; }); k.addEventListener("pointerleave", function () { k.style.background = ""; }); });

  document.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    var go = e.target.closest("[data-go]");
    if (chip && !go) {
      var row = chip.parentElement;
      row.querySelectorAll(".chip.on").forEach(function (c) { c.classList.remove("on"); });
      chip.classList.add("on");
      return;
    }
    if (!go) return;
    e.preventDefault();
    var g = go.dataset.go;
    // A few interactions are handled right here in the screen.
    if (g === "fav") {
      var svg = go.querySelector("svg[data-i='heart']"), on = svg.getAttribute("fill") !== "currentColor";
      svg.setAttribute("fill", on ? "currentColor" : "none"); svg.style.color = on ? "#e5484d" : "";
      return send("toast:" + (on ? "Saved to your favourites" : "Removed from favourites"));
    }
    if (g === "inc" || g === "dec") {
      var box = go.parentElement, num = box.querySelector("b");
      if (num && /^\d+$/.test(num.textContent.trim())) { num.textContent = Math.max(1, +num.textContent + (g === "inc" ? 1 : -1)); return; }
      return send("toast:" + (g === "inc" ? "Added" : "Removed"));
    }
    if (g.indexOf("key:") === 0) { typeKey(g.slice(4)); return; }
    if (go.hasAttribute("data-send")) {
      var v = window.SCREEN.amount === undefined ? 120 : window.SCREEN.amount;
      if (!v) return send("toast:Enter an amount first");
      g = "done:$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " sent to Jordan Lee — it arrived instantly.";
    }
    send(g);
  });
})();
