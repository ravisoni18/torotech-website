/*! © 2026 Torotech Inc. All rights reserved. https://torotech.ca — may not be copied, reused or redistributed without written permission. See https://torotech.ca/legal */
/* The prototype page around a phone: swaps screens in the iframe, keeps a back stack, and shows the
   end-of-flow confirmation. Config: window.PROTO = { slug, screens: [names], done, accent, onAccent }. */
(function () {
  var P = window.PROTO;
  var frame = document.getElementById("screen");
  var overlay = document.getElementById("overlay");
  var toastEl = document.getElementById("toast");
  var steps = document.querySelectorAll("[data-step]");
  var stack = [1];
  var toastTimer;

  function show(n, push) {
    n = Math.max(1, Math.min(P.screens.length, n));
    if (push !== false && stack[stack.length - 1] !== n) stack.push(n);
    overlay.classList.remove("on");
    frame.classList.add("swap");
    setTimeout(function () {
      frame.src = P.slug + "-" + n + ".html";
    }, 120);
    steps.forEach(function (s) { s.classList.toggle("on", +s.dataset.step === n); });
  }
  frame.addEventListener("load", function () { frame.classList.remove("swap"); });

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("on"); }, 2200);
  }

  window.addEventListener("message", function (e) {
    if (!e.data || !e.data.concept) return;
    var go = String(e.data.go);
    if (go === "back") { if (stack.length > 1) { stack.pop(); show(stack[stack.length - 1], false); } return; }
    if (go === "done") { overlay.querySelector("p").textContent = P.done; overlay.classList.add("on"); return; }
    if (go.indexOf("done:") === 0) { overlay.querySelector("p").textContent = go.slice(5); overlay.classList.add("on"); return; }
    if (go.indexOf("toast:") === 0) { toast(go.slice(6)); return; }
    show(+go);
  });

  steps.forEach(function (s) { s.addEventListener("click", function () { show(+s.dataset.step); }); });
  document.getElementById("restart").addEventListener("click", function () { stack = [1]; show(1, false); });

  // Fit the phone to short screens.
  function fit() {
    var ph = document.getElementById("phone");
    var stage = ph.parentElement;
    stage.style.width = "";
    // The stage's CSS width already respects the screen; scale the phone to it (and to short viewports).
    var s = Math.min(1, stage.clientWidth / 420, (window.innerHeight - 48) / 880);
    ph.style.transform = "scale(" + s + ")";
    stage.style.height = 880 * s + "px";
    stage.style.width = 420 * s + "px";
  }
  window.addEventListener("resize", fit);
  fit();
})();
