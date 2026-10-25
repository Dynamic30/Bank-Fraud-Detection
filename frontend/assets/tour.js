/* Guided demo support: the language choice, the shared audio player and the "Hindi or English?" pop-up.
   The cards themselves are in tour.json; the card UI is in Tour.js. Classic script, loaded before the app module. */
(function () {
  var KEY = "pc-tour";
  var clean = function (v, ok, fallback) { return ok.indexOf(v) >= 0 ? v : fallback; };

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; }
  }
  var saved = read();
  // voice = the language of the narration, text = the language of the words on the card, muted = narration silent
  var state = { voice: clean(saved.voice, ["en", "hi"], "en"), text: clean(saved.text, ["en", "hi"], "en"), muted: !!saved.muted };
  var listeners = [];

  function set(patch) {
    state = Object.assign({}, state, patch);
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    listeners.forEach(function (fn) { fn(); });
  }

  var data = null, loading = null;
  function load() {
    if (data) return Promise.resolve(data);
    if (!loading) {
      loading = fetch("./assets/tour.json").then(function (r) {
        if (!r.ok) throw new Error("tour.json " + r.status);
        return r.json();
      }).then(function (d) { data = d; return d; }, function (e) { loading = null; throw e; });
    }
    return loading;
  }

  // one audio element for the whole tour: browsers let it keep playing once it was started by a click
  var audio = null, token = 0, started = false; // started: card 1 was already started by the click in the pop-up
  function el() {
    if (!audio) audio = new Audio();
    return audio;
  }
  function src(lang, n) { return "./assets/tour/" + lang + "-" + (n < 9 ? "0" : "") + (n + 1) + ".mp3"; }

  // play card n (0-based) in the chosen voice; onEnd runs when the clip ends, or at once if it cannot play
  function play(n, onEnd) {
    var a = el(), mine = ++token, done = false;
    var finish = function () { if (!done && mine === token) { done = true; onEnd && onEnd(); } };
    // a clip that cannot load or play (missing file, sound blocked) should not freeze the tour: give people time to read instead
    var later = function () { setTimeout(finish, 6000); };
    a.onended = finish;
    a.onerror = later;
    a.muted = state.muted;
    if (started && n === 0) {  // already playing from the click: just attach to it
      started = false;
      if (a.ended) setTimeout(finish, 0);
      return;
    }
    var want = new URL(src(state.voice, n), location.href).href;
    if (a.src !== want) a.src = want;
    else if (a.ended) a.currentTime = 0;
    var p = a.play();
    if (p && p.catch) p.catch(later);
  }

  function stop() { token++; if (audio) { audio.onended = audio.onerror = null; audio.pause(); } }

  // the pop-up. Resolves "en", "hi", or null if closed. The click on a language button is what lets the audio start.
  function choose() {
    return new Promise(function (resolve) {
      var css = document.createElement("style");
      css.textContent =
        ".pt-back{position:fixed;inset:0;background:rgba(10,20,35,.55);display:flex;align-items:center;justify-content:center;z-index:2000;padding:16px}" +
        ".pt-box{background:var(--card-bg,#fff);color:var(--text,#14202e);border:1px solid var(--border-color,#d8dee6);border-radius:14px;max-width:420px;width:100%;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,.35);text-align:center}" +
        ".pt-box h2{margin:0 0 4px;font-size:20px}.pt-box p{margin:0 0 18px;font-size:14px;opacity:.75}" +
        ".pt-row{display:flex;gap:12px}.pt-row button{flex:1;padding:16px 10px;font-size:18px;font-weight:700;border-radius:10px;cursor:pointer;border:1px solid var(--primary,#14325e);background:var(--primary,#14325e);color:var(--primary-fg,#fff)}" +
        ".pt-row button:hover{filter:brightness(1.12)}.pt-row small{display:block;font-size:11px;font-weight:400;opacity:.8;margin-top:2px}" +
        ".pt-x{margin-top:14px;background:none;border:0;color:inherit;opacity:.6;cursor:pointer;font-size:13px;text-decoration:underline}";
      var back = document.createElement("div");
      back.className = "pt-back";
      back.innerHTML =
        '<div class="pt-box" role="dialog" aria-modal="true" aria-label="Choose the language">' +
        "<h2>Guided demo · गाइडेड डेमो</h2><p>Choose the language · भाषा चुनें</p>" +
        '<div class="pt-row"><button data-l="hi">हिन्दी<small>Hindi voice and text</small></button>' +
        '<button data-l="en">English<small>English voice and text</small></button></div>' +
        '<button class="pt-x" data-l="">Cancel</button></div>';
      var close = function (lang) {
        document.removeEventListener("keydown", onKey);
        back.remove(); css.remove();
        resolve(lang || null);
      };
      var onKey = function (ev) { if (ev.key === "Escape") close(null); };
      back.addEventListener("click", function (ev) {
        if (ev.target === back) return close(null);
        var l = ev.target.closest && ev.target.closest("button");
        if (!l) return;
        var lang = l.getAttribute("data-l");
        if (!lang) return close(null);
        // inside the click: remember the choice and start the first clip so the browser allows the sound
        set({ voice: lang, text: lang });
        play(0, null);
        started = true;
        close(lang);
      });
      document.addEventListener("keydown", onKey);
      document.head.appendChild(css);
      document.body.appendChild(back);
      var first = back.querySelector("button");
      if (first) first.focus();
    });
  }

  window.PeechaTour = {
    get: function () { return state; },
    set: set,
    subscribe: function (fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (x) { return x !== fn; }); }; },
    load: load,
    cards: function () { return data && data.cards; },
    play: play,
    stop: stop,
    pause: function () { if (audio) audio.pause(); },
    resume: function () { if (audio && audio.src && !audio.ended) { var p = audio.play(); if (p && p.catch) p.catch(function () {}); } },
    audio: function () { return audio; },
    choose: choose
  };
})();
