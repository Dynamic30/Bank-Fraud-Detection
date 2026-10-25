import { u as useApp, e as R, b as inr } from "./index-DAvlYmAS.js";
/* The facts marquee at the top of every page. The numbers come from one GET /api/stats per page load
   (whole-platform totals, staff only); the bar then just scrolls through them, slowly, and stops while the pointer is on it. */
const h = R.createElement;
const API = window.PeechaAPI;
const SECONDS_PER_FACT = 6; // about 60px a second

let cached = null, pending = null; // kept once it has loaded; a failure is forgotten so the next sign-in tries again
const load = () => cached ? Promise.resolve(cached) : (pending = pending || API.call("GET", "/stats").then(s => (cached = s), err => { pending = null; throw err }));

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
 const api = R.useSyncExternalStore(API.subscribe, API.get);
 const [list, setList] = R.useState(cached ? facts(cached) : []);
 const staff = api.status === "live" && api.role !== "consumer";
 // ask only once the sign-in has finished (a slow server answers /login after the page has drawn), and again if the role changes
 R.useEffect(() => {
  if (!e.session || !staff) return;
  let on = true;
  load().then(s => on && setList(facts(s)), () => on && setList([]));
  return () => { on = false }
 }, [e.session, staff, api.role]);
 if (!e.session || !staff || list.length === 0) return null;
 // the list twice, so the loop has no gap
 return h("div", { className: "facts", role: "status", "aria-label": "Platform facts" },
  h("span", { className: "facts-tag" }, h("i", { className: "facts-dot", "aria-hidden": "true" }), "Live facts"),
  h("div", { className: "facts-view" },
   h("div", { className: "facts-track", style: { animationDuration: `${Math.max(24, list.length * SECONDS_PER_FACT)}s` } },
    [0, 1].map(k => list.map(f => h("span", { className: "facts-item", key: k + f.k, "aria-hidden": k ? "true" : undefined },
     h("b", { className: "facts-big mono" }, f.big), h("span", null, f.text)))))))
}
