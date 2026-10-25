import { u as useApp, e as R, b as inr } from "./index-DAvlYmAS.js";
/* The slow rotating facts bar at the top of every page. The numbers come from one GET /api/stats per page load
   (whole-platform totals, staff only); the bar then just turns through them. */
const h = R.createElement;
const API = window.PeechaAPI;
const EVERY = 6000;

let cached = null; // kept once it has loaded; a failure (for example a victim signed in) is retried at the next sign-in
const load = () => cached ? Promise.resolve(cached) : API.call("GET", "/stats").then(s => (cached = s));

const plural = (n, one, many) => `${n.toLocaleString("en-IN")} ${n === 1 ? one : many}`;
function facts(s) {
 const out = [];
 if (s.mules_detected) out.push({ k: "mules", big: String(s.mules_detected), text: `${plural(s.mules_detected, "mule account", "mule accounts")} detected${s.mules_confirmed ? `, ${s.mules_confirmed} confirmed` : ""}` });
 if (s.total_lost > 0) out.push({ k: "secured", big: `${s.secured_pct}%`, text: `of the money reported lost is held or frozen (${inr(s.secured)} of ${inr(s.total_lost)})` });
 if (s.complaints) out.push({ k: "complaints", big: String(s.complaints), text: `${s.complaints === 1 ? "complaint" : "complaints"} on file, ${inr(s.total_lost)} reported lost` });
 if (s.holds_open) out.push({ k: "holds", big: String(s.holds_open), text: `${s.holds_open === 1 ? "account is" : "accounts are"} on hold right now` });
 if (s.calls_made) out.push({ k: "calls", big: String(s.calls_made), text: `warning ${s.calls_made === 1 ? "call" : "calls"} made, ${s.calls_answered} answered` });
 if (s.repeat_accounts) out.push({ k: "repeat", big: String(s.repeat_accounts), text: `${s.repeat_accounts === 1 ? "account is" : "accounts are"} named in more than one complaint` });
 return out
}

export default function Facts() {
 const e = useApp();
 const [list, setList] = R.useState(cached ? facts(cached) : []);
 const [i, setI] = R.useState(0);
 const [still, setStill] = R.useState(false);
 R.useEffect(() => {
  if (!e.session || !API) return;
  let on = true;
  load().then(s => on && setList(facts(s)), () => on && setList([]));
  return () => { on = false }
 }, [e.session]);
 R.useEffect(() => {
  if (list.length < 2 || still) return;
  const t = setInterval(() => setI(k => k + 1), EVERY);
  return () => clearInterval(t)
 }, [list.length, still]);
 if (!e.session || list.length === 0) return null;
 const f = list[i % list.length];
 return h("div", { className: "facts", role: "status", "aria-label": "Platform facts", onMouseEnter: () => setStill(true), onMouseLeave: () => setStill(false) },
  h("span", { className: "facts-tag" }, "Live facts"),
  h("span", { className: "facts-item", key: f.k + i },
   h("b", { className: "facts-big mono" }, f.big), h("span", null, f.text)),
  h("span", { className: "facts-n mono" }, `${(i % list.length) + 1}/${list.length}`))
}
