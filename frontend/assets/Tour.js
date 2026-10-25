import { u as useApp, e as R } from "./index-DAvlYmAS.js";
/* The guided demo card. Cards, words and navigation come from tour.json; the voice, the language choice and the pop-up
   are in tour.js. Each card opens its screen, plays its narration, waits a moment and moves on, so nobody has to read. */
const h = R.createElement;
const T = window.PeechaTour;
const API = window.PeechaAPI;
const GAP = 1200;

const LABEL = {
 en: { pause: "Pause", resume: "Resume", back: "Back", next: "Next", sound: "Sound on", muted: "Muted", exit: "Exit tour", finish: "Finish", other: "हिन्दी", otherTip: "Show the words in Hindi", speed: "Voice speed" },
 hi: { pause: "रोकें", resume: "चलाएँ", back: "पीछे", next: "आगे", sound: "आवाज़ चालू", muted: "म्यूट", exit: "दौरा बंद करें", finish: "समाप्त", other: "English", otherTip: "शब्द अंग्रेज़ी में दिखाएँ", speed: "आवाज़ की गति" }
};

// wait (at most a few seconds) until the app is signed in and has loaded its data
const whenLive = () => new Promise(done => {
 const ready = () => { const s = API.get(); return s.status === "live" && s.role === "officer" };
 if (!API || ready()) return done();
 const stop = API.subscribe(() => { if (ready()) { stop(); done() } });
 setTimeout(() => { stop(); done() }, 5000)
});

// show a card's screen: sign in as the officer, point the page at something worth showing, then open it
function open(e, card) {
 if (!e.session) e.login("officer");
 else if (e.session !== "officer") e.switchRole("officer");
 const show = () => e.go(card.page);
 if (!API || (!card.case && !card.account)) return show();
 whenLive().then(() => {
  if (card.case) {
   const best = API.get().items.slice().sort((a, b) => b.trail.length - a.trail.length)[0];
   if (best) API.pick.case = best.c.id;
   return show()
  }
  return API.call("GET", "/accounts?limit=1").then(r => { if (r[0]) API.pick.account = r[0].account_id }, () => {}).then(show)
 })
}

export default function Tour() {
 const e = useApp(), ref = R.useRef(e);
 ref.current = e;
 const cfg = R.useSyncExternalStore(T.subscribe, T.get);
 const [cards, setCards] = R.useState(T.cards());
 const [n, setN] = R.useState(0);
 const [paused, setPaused] = R.useState(false);
 const timer = R.useRef(null), waiting = R.useRef(false), pending = R.useRef(false), isPaused = R.useRef(false);
 isPaused.current = paused;
 const last = cards ? cards.length - 1 : 0;

 R.useEffect(() => { T.load().then(d => setCards(d.cards), () => {}) }, []);

 R.useEffect(() => {
  if (e.tourOn) return;
  clearTimeout(timer.current);
  T.stop();
  setN(0);
  setPaused(false)
 }, [e.tourOn]);

 // arriving on a card: open its screen, narrate it, then move to the next card
 R.useEffect(() => {
  if (!e.tourOn || !cards) return;
  open(ref.current, cards[n]);
  waiting.current = false;
  pending.current = false;
  const move = () => setN(k => Math.min(last, k + 1));
  const next = () => {
   if (n === last) return;
   waiting.current = true;
   timer.current = setTimeout(() => { waiting.current = false; isPaused.current ? (pending.current = true) : move() }, GAP)
  };
  T.play(n, next);
  if (isPaused.current) T.pause();
  return () => clearTimeout(timer.current)
 }, [n, e.tourOn, !!cards]);

 R.useEffect(() => { const a = T.audio(); if (a) a.muted = cfg.muted }, [cfg.muted]);

 if (!e.tourOn || !e.session || !cards) return null;
 const card = cards[n], lang = cfg.text, L = LABEL[lang], isLast = n === last;
 const togglePause = () => {
  if (!paused) {
   setPaused(true);
   if (waiting.current) { clearTimeout(timer.current); waiting.current = false; pending.current = true }
   T.pause()
  } else {
   setPaused(false);
   if (pending.current) { pending.current = false; setN(Math.min(last, n + 1)) } else T.resume()
  }
 };
 const go = k => { setPaused(false); setN(Math.max(0, Math.min(last, k))) };
 const exit = () => { clearTimeout(timer.current); T.stop(); e.endTour() };
 return h("div", { className: "tour", role: "dialog", "aria-live": "polite", "aria-label": "Guided demo" },
  h("div", { className: "tour-top" }, h("span", { className: "tour-step mono" }, `${n + 1} / ${cards.length}`), h("b", { lang }, card.title[lang])),
  h("p", { lang }, card.text[lang]),
  h("div", { className: "tour-progress" }, h("i", { style: { width: `${(n + 1) / cards.length * 100}%` } })),
  h("div", { className: "btn-row", style: { gap: 8, flexWrap: "wrap" } },
   !isLast && h("button", { className: "btn sm", onClick: togglePause }, (paused ? "▶ " : "❚❚ ") + (paused ? L.resume : L.pause)),
   n > 0 && h("button", { className: "btn ghost sm", onClick: () => go(n - 1) }, "← " + L.back),
   !isLast && h("button", { className: "btn ghost sm", onClick: () => go(n + 1) }, L.next + " →"),
   h("button", { className: "btn ghost sm", onClick: () => T.set({ muted: !cfg.muted }), "aria-pressed": cfg.muted, title: cfg.muted ? L.muted : L.sound }, cfg.muted ? "🔇 " + L.muted : "🔊 " + L.sound),
   h("button", { className: "btn ghost sm", onClick: () => T.set({ rate: T.rates[(T.rates.indexOf(cfg.rate) + 1) % T.rates.length] }), title: L.speed, "aria-label": `${L.speed}: ${cfg.rate}x` }, `⏩ ${cfg.rate}×`),
   h("button", { className: "btn ghost sm", onClick: () => T.set({ text: lang === "en" ? "hi" : "en" }), title: L.otherTip, "aria-label": L.otherTip }, "A/अ " + L.other),
   h("button", { className: "btn sm " + (isLast ? "" : "ghost"), onClick: exit }, isLast ? L.finish : L.exit)))
}
