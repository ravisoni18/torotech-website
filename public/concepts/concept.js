/*! © 2026 Torotech Inc. All rights reserved. https://torotech.ca — may not be copied, reused or redistributed without written permission. See https://torotech.ca/legal */
/* Interaction layer for Torotech concept sites. Each page sets window.CONCEPT (see the inline config) and this
   script wires its nav, buttons, forms and widgets. Forms are demos: nothing is sent anywhere. */
(function () {
  var C = window.CONCEPT || {};
  var state = { slot: null, item: null, bill: null };
  var accentBtn = document.querySelector(".btn:not(.ghost)");
  var accent = accentBtn ? getComputedStyle(accentBtn).backgroundColor : "#111";
  var accentInk = accentBtn ? getComputedStyle(accentBtn).color : "#fff";
  var font = getComputedStyle(document.body).fontFamily;

  var css = document.createElement("style");
  css.textContent =
    "[data-nav],[data-action],.btn{cursor:pointer;user-select:none}" +
    ".btn{transition:transform .15s ease,filter .15s ease}.btn:hover{transform:translateY(-1px);filter:brightness(1.06)}.btn:active{transform:translateY(0)}" +
    "[data-nav]:hover{opacity:.7}" +
    "[data-item]{transition:transform .2s ease,box-shadow .2s ease}[data-item]:hover{transform:translateY(-4px);box-shadow:0 24px 40px -24px rgba(0,0,0,.35)}" +
    ".cx-back{position:fixed;inset:0;z-index:10000;background:rgba(10,14,20,.55);backdrop-filter:blur(4px);display:flex;align-items:flex-start;justify-content:center;padding:72px 16px;overflow:auto;opacity:0;transition:opacity .2s}" +
    ".cx-back.on{opacity:1}" +
    ".cx-modal{width:520px;max-width:100%;background:#fff;color:#151515;border-radius:20px;box-shadow:0 40px 80px -20px rgba(0,0,0,.45);font-family:" + font + ";transform:translateY(12px);transition:transform .2s}" +
    ".cx-back.on .cx-modal{transform:none}" +
    ".cx-head{display:flex;justify-content:space-between;align-items:start;gap:16px;padding:26px 28px 6px}.cx-head h3{font-size:24px;line-height:1.2;margin:0}" +
    ".cx-x{border:0;background:#f1f1f1;width:36px;height:36px;border-radius:99px;font-size:18px;cursor:pointer;flex-shrink:0}" +
    ".cx-sub{padding:0 28px;color:#666;font-size:15px}" +
    ".cx-body{padding:18px 28px 26px;display:grid;gap:14px}" +
    ".cx-body label{display:grid;gap:6px;font-size:13px;font-weight:600;color:#444}" +
    ".cx-body input,.cx-body select,.cx-body textarea{font:inherit;font-size:15px;font-weight:400;padding:12px 14px;border:1.5px solid #ddd;border-radius:12px;background:#fff;color:#151515;width:100%;box-sizing:border-box}" +
    ".cx-body input:focus,.cx-body select:focus,.cx-body textarea:focus{outline:none;border-color:" + accent + "}" +
    ".cx-body .bad{border-color:#d33}" +
    ".cx-go{border:0;cursor:pointer;font:inherit;font-weight:700;font-size:16px;padding:15px;border-radius:14px;background:" + accent + ";color:" + accentInk + "}" +
    ".cx-note{font-size:12px;color:#888;text-align:center}" +
    ".cx-ok{padding:36px 28px 30px;text-align:center}.cx-ok .tick{width:64px;height:64px;border-radius:99px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;background:" + accent + ";color:" + accentInk + ";font-size:30px}" +
    ".cx-ok p{color:#555;margin:10px 0 22px;line-height:1.5}" +
    ".cx-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 0;border-top:1px solid #eee}.cx-row:first-child{border-top:0}" +
    ".cx-tag{font-size:12px;font-weight:700;padding:4px 10px;border-radius:99px;background:#eef6ee;color:#2a7a2a}.cx-tag.out{background:#f6eeee;color:#a33}" +
    ".cx-sm{border:0;cursor:pointer;font:inherit;font-weight:700;font-size:14px;padding:10px 16px;border-radius:10px;background:" + accent + ";color:" + accentInk + "}" +
    ".cx-sm[disabled]{opacity:.35;cursor:not-allowed}" +
    ".cx-toast{position:fixed;left:50%;bottom:90px;z-index:10001;transform:translate(-50%,20px);opacity:0;background:#151515;color:#fff;padding:13px 20px;border-radius:14px;font:600 14px/1.4 " + font + ";max-width:520px;text-align:center;box-shadow:0 20px 40px -12px rgba(0,0,0,.4);transition:all .25s}" +
    ".cx-toast.on{opacity:1;transform:translate(-50%,0)}";
  document.head.appendChild(css);

  function scrollTo(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  var toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "cx-toast"; document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    requestAnimationFrame(function () { toastEl.classList.add("on"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("on"); }, 2800);
  }

  function modal(title, sub, body) {
    var back = document.createElement("div");
    back.className = "cx-back";
    back.innerHTML = '<div class="cx-modal" role="dialog" aria-modal="true" aria-label="' + title + '"><div class="cx-head"><h3>' + title + '</h3><button class="cx-x" aria-label="Close">✕</button></div>' + (sub ? '<div class="cx-sub">' + sub + "</div>" : "") + '<div class="cx-slot"></div></div>';
    back.querySelector(".cx-slot").appendChild(body);
    function close() { back.classList.remove("on"); setTimeout(function () { back.remove(); }, 200); document.removeEventListener("keydown", onKey); }
    function onKey(e) { if (e.key === "Escape") close(); }
    back.addEventListener("click", function (e) { if (e.target === back) close(); });
    back.querySelector(".cx-x").addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    document.body.appendChild(back);
    requestAnimationFrame(function () { back.classList.add("on"); });
    var first = body.querySelector("input,select,textarea,button");
    if (first) setTimeout(function () { first.focus(); }, 60);
    return close;
  }

  function success(close, message) {
    var ok = document.createElement("div");
    ok.className = "cx-ok";
    ok.innerHTML = '<div class="tick">✓</div><h3 style="margin:0;font-size:22px">All set</h3><p>' + message + '</p><button class="cx-go" style="width:100%">Done</button><div class="cx-note" style="margin-top:12px">Demo only — nothing was sent.</div>';
    ok.querySelector("button").addEventListener("click", close);
    return ok;
  }

  function openForm(prefill) {
    var f = C.form;
    if (!f) return;
    var form = document.createElement("form");
    form.className = "cx-body";
    form.noValidate = true;
    f.fields.forEach(function (fd) {
      var label = document.createElement("label");
      label.textContent = fd.label + (fd.required ? " *" : "");
      var input;
      if (fd.type === "select") {
        input = document.createElement("select");
        fd.options.forEach(function (o) { var op = document.createElement("option"); op.textContent = o; input.appendChild(op); });
        var want = fd.from && (prefill && prefill[fd.from] || state[fd.from]);
        if (want) for (var i = 0; i < input.options.length; i++) if (input.options[i].text.indexOf(want) === 0) input.selectedIndex = i;
      } else if (fd.type === "textarea") {
        input = document.createElement("textarea"); input.rows = 3;
      } else {
        input = document.createElement("input"); input.type = fd.type;
        if (fd.type === "date") { var d = new Date(Date.now() + 3 * 864e5); input.value = d.toISOString().slice(0, 10); }
      }
      if (fd.placeholder) input.placeholder = fd.placeholder;
      if (fd.required) input.required = true;
      label.appendChild(input);
      form.appendChild(label);
    });
    var go = document.createElement("button");
    go.className = "cx-go"; go.type = "submit"; go.textContent = f.submit;
    form.appendChild(go);
    var note = document.createElement("div");
    note.className = "cx-note"; note.textContent = "Demo form on a concept site — nothing is sent.";
    form.appendChild(note);
    var close = modal(f.title, f.sub, form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = false;
      form.querySelectorAll("[required]").forEach(function (el) {
        var empty = !el.value.trim() || (el.type === "email" && !/^\S+@\S+\.\S+$/.test(el.value));
        el.classList.toggle("bad", empty);
        if (empty) bad = true;
      });
      if (bad) { toast("Please fill in the highlighted fields."); return; }
      go.textContent = "Sending…"; go.disabled = true;
      setTimeout(function () { form.replaceWith(success(close, f.success)); var s = document.querySelector(".cx-sub"); if (s) s.remove(); }, 650);
    });
  }

  function openAvailability() {
    var list = document.createElement("div");
    list.className = "cx-body";
    (C.rooms || []).forEach(function (r) {
      var row = document.createElement("div");
      row.className = "cx-row";
      row.innerHTML = "<div><b>" + r[0] + "</b><div style='font-size:13px;color:#777'>" + r[1] + " · " + r[2] + " / night</div></div><div style='display:flex;gap:10px;align-items:center'><span class='cx-tag" + (r[3] ? "" : " out") + "'>" + (r[3] ? r[3] + " left" : "Sold out") + "</span><button class='cx-sm'" + (r[3] ? "" : " disabled") + ">Reserve</button></div>";
      row.querySelector("button").addEventListener("click", function () { close(); openForm({ item: r[0] }); setTimeout(function () { var s = document.querySelector(".cx-modal select"); if (s) for (var i = 0; i < s.options.length; i++) if (s.options[i].text.indexOf(r[0]) === 0) s.selectedIndex = i; }, 30); });
      list.appendChild(row);
    });
    var close = modal("Available rooms", "Fri 14 Nov → Sun 16 Nov · 2 adults", list);
  }

  function openTracking() {
    var form = document.createElement("form");
    form.className = "cx-body";
    form.innerHTML = "<label>Tracking number<input value='CV-48213' placeholder='CV-00000'></label><button class='cx-go' type='submit'>Track</button><div class='cx-out'></div>";
    var close = modal("Track a shipment", "Enter a Corvane tracking number.", form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var id = form.querySelector("input").value.trim().toUpperCase() || "CV-48213";
      var steps = [["Picked up", "Toronto, ON · Mon 06:10", 1], ["In transit", "Near Buffalo, NY · 5 min ago", 1], ["Out for delivery", "Columbus, OH · Tue", 0], ["Delivered", "ETA Tue by 14:00", 0]];
      form.querySelector(".cx-out").innerHTML = "<div style='display:flex;justify-content:space-between;align-items:center;margin-top:6px'><b>" + id + "</b><span class='cx-tag'>On time</span></div>" + steps.map(function (s) { return "<div class='cx-row' style='justify-content:flex-start'><span style='width:12px;height:12px;border-radius:99px;" + (s[2] ? "background:" + accent : "border:2px solid #ccc") + "'></span><div><b>" + s[0] + "</b><div style='font-size:13px;color:#777'>" + s[1] + "</div></div></div>"; }).join("");
    });
  }

  function run(action, el) {
    if (!action) return;
    if (action === "primary") return openForm();
    if (action === "availability") return openAvailability();
    if (action === "track") return openTracking();
    if (action === "video") return toast("▶ The 2-minute product demo video would play here.");
    if (action.indexOf("scroll:") === 0) return scrollTo(action.slice(7));
    if (action.indexOf("toast:") === 0) return toast(action.slice(6));
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    var nav = t.closest("[data-nav]");
    if (nav) { var id = (C.navTo || [])[+nav.getAttribute("data-nav")]; if (id) scrollTo(id); return; }
    var slot = t.closest("[data-slot]");
    if (slot) {
      state.slot = slot.getAttribute("data-slot");
      // Idle colours come from a slot that isn't highlighted, so every unpicked slot looks the same.
      var slots = Array.prototype.slice.call(document.querySelectorAll("[data-slot]"));
      var rest = slots.filter(function (s) { return s.style.backgroundColor !== accent; })[0] || slot;
      if (!C.slotIdle) C.slotIdle = [rest.style.backgroundColor, rest.style.color];
      slots.forEach(function (s) {
        var on = s === slot;
        s.style.backgroundColor = on ? accent : C.slotIdle[0];
        s.style.color = on ? accentInk : C.slotIdle[1];
      });
      toast(state.slot + " selected — tap Book to confirm.");
      return;
    }
    var side = t.closest("[data-side]");
    if (side) {
      document.querySelectorAll("[data-side]").forEach(function (s) { s.style.background = ""; s.style.color = "#5b6478"; s.style.fontWeight = ""; s.style.boxShadow = ""; });
      side.style.background = "#fff"; side.style.color = "#6d5dfc"; side.style.fontWeight = "600"; side.style.boxShadow = "0 1px 2px rgba(0,0,0,.06)";
      return;
    }
    var fix = t.closest("[data-fix]");
    if (fix) { var tag = fix.lastElementChild; tag.textContent = "Resolved ✓"; tag.style.color = "#12a150"; return; }
    var item = t.closest("[data-item]");
    if (item && !t.closest("[data-action]")) {
      var title = item.getAttribute("data-item"), price = item.getAttribute("data-price");
      if (C.items === "cart") {
        var cart = document.querySelector("[data-cart]");
        if (cart) cart.textContent = String(+cart.textContent + 1);
        toast("Added " + title + (price ? " · " + price : "") + " to your order");
      } else if (C.items === "enroll") { state.item = title; openForm({ item: title }); }
      else if (C.items === "availability") openAvailability();
      else toast(title + " — the full details page would open here.");
      return;
    }
    var act = t.closest("[data-action]");
    if (act) {
      var a = act.getAttribute("data-action");
      if (a === "secondary") a = C.secondary;
      if (a === "more") a = C.more || "toast:The full list would open here.";
      run(a, act);
      return;
    }
    var btn = t.closest(".btn");
    if (btn) toast("This is a design concept — in the real build this button would take you onward.");
  });

  // Solar savings slider: drag the knob, the estimate updates.
  var track = document.querySelector("[data-track]");
  if (track) {
    var fill = track.querySelector("[data-fill]"), knob = track.querySelector("[data-knob]");
    var out = function (k) { return document.querySelector('[data-out="' + k + '"]'); };
    var set = function (clientX) {
      var r = track.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      var bill = Math.round(60 + p * 300);
      fill.style.width = knob.style.left = p * 100 + "%";
      out("bill").textContent = "$" + bill;
      out("save").textContent = "$" + String(Math.round((bill * 12 * 25 * 0.66) / 100) * 100).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      out("be").textContent = Math.max(4.2, 11.5 - bill / 40).toFixed(1) + " yrs";
      state.bill = "$" + [100, 150, 210, 300, 400].reduce(function (a, b) { return Math.abs(b - bill) < Math.abs(a - bill) ? b : a; });
    };
    var dragging = false;
    track.addEventListener("pointerdown", function (e) { dragging = true; track.setPointerCapture(e.pointerId); set(e.clientX); });
    track.addEventListener("pointermove", function (e) { if (dragging) set(e.clientX); });
    track.addEventListener("pointerup", function () { dragging = false; });
  }
})();
