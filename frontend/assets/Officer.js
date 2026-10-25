import {
 u as useApp,
 e as R,
 P as PageHead,
 K as Kpi,
 C as Card,
 a as Pill,
 b as inr,
 M as Meter
} from "./index-DAvlYmAS.js";
/* Live cyber-cell officer screens, backed by the FastAPI /api (see assets/api.js).
   index renders these instead of the demo pages when the backend is reachable (status "live"). */
const h = R.createElement;
const API = window.PeechaAPI;

const when = ts => {
 if (!ts) return "—";
 const d = new Date(/Z|[+-]\d\d:?\d\d$/.test(ts) ? ts : ts + "Z");
 return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
};
const money = v => v == null ? "—" : inr(Number(v));
const STATUS_TONE = { open: "accent", tracing: "info", actioned: "rec-solid", closed: "neutral", requested: "accent", active: "med", confirmed: "rec-solid", expired: "neutral", rejected: "neutral", released: "neutral", draft: "accent", approved: "info", sent: "rec", executed: "rec-solid" };
/* one-click freeze: draft a freeze request to the bank and approve it (the officer's click is the decision); Send is in Action pack */
const freezeRequest = a => API.call("POST", "/actions", {
 complaint_id: a.complaint_id, kind: "freeze", target: `${a.bank_id} nodal officer`, targets: [{ account_id: a.account_id, amount: a.amount }],
 draft_text: `To the Nodal Officer, ${a.bank_id}.\n\nComplaint ${a.complaint_id}: please freeze account ${a.account_id}.\n${a.amount ? `Traced fraud money in the account: ${money(a.amount)}.\n` : ""}Reason: ${a.reason}.\n\nPlease confirm once the account is frozen.`
}).then(x => API.call("POST", `/actions/${x.id}/approve`, {}));
const COMPUTED = ["fifo"]; // trail methods the tracer writes
const scoreTone = s => s >= 70 ? "high" : s >= 40 ? "med" : "neutral";
const pill = s => h(Pill, { tone: STATUS_TONE[s] || "neutral" }, s);

/* GET a path, re-run when `deps` change or reload() is called */
function useGet(path, deps = []) {
 const [st, setSt] = R.useState({ data: null, err: null, loading: true });
 const [n, setN] = R.useState(0);
 R.useEffect(() => {
  let on = true;
  if (!path) { setSt({ data: null, err: null, loading: false }); return }
  setSt(s => ({ ...s, loading: true }));
  API.call("GET", path).then(d => on && setSt({ data: d, err: null, loading: false }), e => on && setSt({ data: null, err: e.message, loading: false }));
  return () => { on = false }
 }, [path, n, ...deps]);
 return { ...st, reload: () => setN(x => x + 1) }
}

/* run a write, toast the result, then reload */
function useDo(e, reload) {
 return (label, fn) => fn().then(r => {
  e.toast(label);
  reload && reload();
  API.refresh();
  return r || true
 }, err => e.toast(`${label.split(" ")[0]} failed: ${err.message}`))
}

const Table = (cols, rows, onRow) => h("div", { className: "tbl-wrap" }, h("table", { className: "tbl" },
 h("thead", null, h("tr", null, cols.map((c, i) => h("th", { key: i, className: c[1] || "" }, c[0])))),
 h("tbody", null, rows.map((r, i) => h("tr", { key: i, className: onRow ? "click" : "", onClick: onRow ? () => onRow(r.src) : undefined },
  r.cells.map((c, j) => h("td", { key: j, className: (cols[j][1] || "") + (cols[j][2] ? " " + cols[j][2] : "") }, c)))))));
const Empty = (title, sub) => h("div", { className: "empty" }, h("b", null, title), h("span", null, sub));
const Status = ({ st }) => st.loading ? h("div", { className: "note info" }, "Loading…") : st.err ? h("div", { className: "note change" }, st.err) : null;
const Field = (label, node) => h("label", null, label, node);

/* Where a complaint's trace stands, with a Re-run button when it did not work (or any time, so a case can be shown again) */
const TRACE_LABEL = { running: "Tracing…", done: "Traced", no_data: "No data found", failed: "Trace failed", waiting: "Starting…", not_started: "Not started", not_configured: "Tracing off" };
const TRACE_TONE = { running: "info", done: "rec-solid", no_data: "med", failed: "high", waiting: "accent", not_started: "med", not_configured: "neutral" };
const BAD_TRACE = ["no_data", "failed", "not_started"];

function useRetrace(e, id) {
 const [busy, setBusy] = R.useState(false);
 return [busy, () => { setBusy(true); API.retrace(id).then(() => e.toast("Trace started"), err => e.toast(err.message)).then(() => setBusy(false)) }]
}

export function TraceNote({ it, done }) {
 const e = useApp(), t = it.trace, [busy, again] = useRetrace(e, it.c.id);
 if (!t) return null;
 const text = { running: "Tracing the money… this usually takes about a minute.", waiting: "Received. The trace is about to start.",
  done: done || `${t.rows} transfers traced.`, no_data: `No data found. ${t.message || ""}`, failed: t.message, not_started: t.message, not_configured: t.message }[t.state];
 const bad = BAD_TRACE.includes(t.state);
 return h("div", { className: "note " + (bad ? "change" : t.state === "done" ? "ok" : "info"), style: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 12 } },
  h("span", { style: { flex: 1, minWidth: 200 } }, text),
  t.can_rerun && h("button", { className: "btn sm " + (bad ? "" : "ghost"), disabled: busy, onClick: again }, busy ? "Starting…" : bad ? "Re-run trace" : "Run again"))
}

function TraceCell({ it }) {
 const e = useApp(), t = it.trace, [busy, again] = useRetrace(e, it.c.id);
 if (!t) return "—";
 return h("div", { style: { display: "flex", gap: 6, alignItems: "center" } }, h(Pill, { tone: TRACE_TONE[t.state] || "neutral" }, TRACE_LABEL[t.state] || t.state),
  t.can_rerun && BAD_TRACE.includes(t.state) && h("button", { className: "btn sm", disabled: busy, onClick: ev => { ev.stopPropagation(); again() } }, "Re-run"))
}

/* ------------------------------------------------------------------ Inbox */
function Inbox() {
 const e = useApp(),
  live = API.get(),
  items = live.items;
 const count = s => items.filter(i => i.c.status === s).length;
 return h(R.Fragment, null,
  h(PageHead, {
   title: "Cases",
   desc: "Ongoing complaints. Open one to follow where its money went.",
   actions: h("button", { className: "btn", onClick: () => e.open("file") }, "＋ File a complaint")
  }),
  h("div", { className: "kpis" },
   h(Kpi, { label: "Total lost", value: money(items.reduce((s, i) => s + Number(i.c.total_lost), 0)), sub: `${items.length} complaints` }),
   h(Kpi, { label: "Open", value: String(count("open")), sub: "waiting for a trace" }),
   h(Kpi, { label: "Tracing / actioned", value: String(count("tracing") + count("actioned")) })),
  h("div", { style: { marginTop: 18 } }, h(Card, { title: "Complaints", sub: "Newest first. Click a case to open its money trail." },
   items.length === 0 ? Empty("No complaints to show yet.", "Complaints filed or received will appear here.") :
   Table([["Case"], ["Scam"], ["Amount lost", "right", "nowrap"], ["Channel"], ["Filed via"], ["Status"], ["Trace"], ["Reported"]],
    items.map(i => ({
     src: i.c.id,
     cells: [h("div", null, h("div", { className: "cell-main mono" }, i.c.id), h("div", { className: "cell-sub" }, i.c.name, " · ", i.c.city || "—")),
      i.c.scam_type, money(i.c.total_lost), i.c.channel, i.c.filed_via, pill(i.c.status), h(TraceCell, { it: i }), when(i.c.reported_at)]
    })), id => { API.pick.case = id; e.go("trail") }))))
}

/* Live money trail: same look as the original trail view (columns per hop, account cards, amount pills, replay),
   built from the backend's victim_mapping rows, account details and holds. */
const GK = 184, GW = 138, GD = 72, GG = 96, GP = 14, GH = 40;
const short = v => v >= 1e5 ? `₹${(v / 1e5).toFixed(v >= 1e6 ? 1 : 2)}L` : v >= 1e3 ? `₹${(v / 1e3).toFixed(v >= 1e4 ? 0 : 1)}k` : `₹${Math.round(v)}`;
const clip = (t, n) => t.length > n ? t.slice(0, n - 1) + "…" : t;
const tms = ts => Date.parse(/Z|[+-]\d\d:?\d\d$/.test(ts) ? ts : ts + "Z");
const stamp = m => new Date(m).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
const detailCache = new Map();

function useNodeInfo(ids) {
 const key = ids.join("|");
 const [, bump] = R.useState(0);
 R.useEffect(() => {
  let on = true;
  const todo = ids.filter(id => !detailCache.has(id));
  if (!todo.length) return;
  Promise.all(todo.map(id => API.call("GET", `/accounts/${encodeURIComponent(id)}`).then(d => detailCache.set(id, d), () => detailCache.set(id, null)))).then(() => on && bump(x => x + 1));
  return () => { on = false }
 }, [key]);
 return id => detailCache.get(id);
}

function flowModel(rows, c, info, held) {
 const hop0 = Math.min(...rows.map(r => r.hop));
 const sorted = rows.slice().sort((a, b) => a.hop - b.hop || tms(a.ts) - tms(b.ts));
 const victim = sorted[0].from_ref;
 const nodeOf = (ref, from) => ref === "CASH" ? `CASH:${from}` : ref;
 const depth = { [victim]: 0 }, edges = {}, inflow = {}, firstSeen = { [victim]: 0 };
 const kindOf = id => {
  if (id === victim) return "victim";
  if (id.startsWith("CASH:")) return "cash";
  const d = info(id);
  if (id.startsWith("TRON:")) {
   const wk = d && d.wallet_kind;
   return wk && wk.startsWith("exchange") ? "exchange" : wk === "bridge" || wk === "mixer" ? "bridge" : "wallet"
  }
  if (d === null || (d === undefined && !/^[A-Z0-9]+:/.test(id))) return "ext";
  if (d && d.p2p_wallet) return "p2p";
  return "bank"
 };
 for (const r of sorted) {
  const to = nodeOf(r.to_ref || "CASH", r.from_ref);
  if (depth[to] === undefined) depth[to] = r.hop - hop0 + 1;
  if (depth[r.from_ref] === undefined) depth[r.from_ref] = r.hop - hop0;
  const k = r.from_ref + ">" + to;
  const e = edges[k] = edges[k] || { from: r.from_ref, to, taint: 0, t0: Infinity, t1: 0, n: 0, blocked: false, crypto: false, rail: r.rail, rows: [] };
  const m = tms(r.ts);
  e.taint += Number(r.traced_amount); e.n++; e.t0 = Math.min(e.t0, m); e.t1 = Math.max(e.t1, m);
  e.blocked = e.blocked || r.status === "blocked"; e.crypto = e.crypto || r.leg === "crypto"; e.rows.push(r);
  inflow[to] = (inflow[to] || 0) + Number(r.traced_amount);
  firstSeen[to] = Math.min(firstSeen[to] ?? Infinity, m);
 }
 const nodes = Object.keys(depth).map(id => ({ id, kind: kindOf(id), depth: depth[id], first: firstSeen[id] ?? 0, inflow: inflow[id] || 0 }));
 const cols = [...new Set(nodes.map(n => n.depth))].sort((a, b) => a - b);
 const colIdx = Object.fromEntries(cols.map((d, i) => [d, i]));
 const by = {};
 nodes.forEach(n => (by[n.depth] = by[n.depth] || []).push(n));
 const laid = [];
 for (const list of Object.values(by)) {
  list.sort((a, b) => b.inflow - a.inflow || a.id.localeCompare(b.id));
  list.forEach((n, i) => laid.push({ ...n, col: colIdx[n.depth], row: i - (list.length - 1) / 2 }))
 }
 return { victim, nodes: laid, edges: Object.values(edges), ncol: cols.length, maxRows: Math.max(1, ...Object.values(by).map(l => l.length)), held, c }
}

/* node state at time t: how much of the victim's money is sitting there */
function flowState(model, t) {
 const inn = {}, out = {}, usdt = {};
 for (const e of model.edges) for (const r of e.rows) {
  if (tms(r.ts) > t) continue;
  const a = Number(r.traced_amount), to = r.to_ref === "CASH" ? `CASH:${r.from_ref}` : r.to_ref;
  inn[to] = (inn[to] || 0) + a; out[r.from_ref] = (out[r.from_ref] || 0) + a;
  if (r.asset_amount != null) { usdt[to] = (usdt[to] || 0) + Number(r.asset_amount); usdt[r.from_ref] = (usdt[r.from_ref] || 0) - Number(r.asset_amount) }
 }
 const st = {};
 for (const n of model.nodes) {
  const v = n.kind === "victim" ? 0 : n.kind === "cash" || n.kind === "ext" || n.kind === "bridge" ? inn[n.id] || 0 : Math.max(0, (inn[n.id] || 0) - (out[n.id] || 0));
  const isHeld = model.held.has(n.id);
  const status = n.kind === "victim" ? "victim" : n.kind === "cash" || n.kind === "bridge" ? "exited" : n.kind === "ext" ? "outside"
   : n.kind === "p2p" ? "converted"
   : n.kind === "bank" ? (isHeld ? (v >= 1 ? "held" : "held-empty") : v >= 1 ? "recoverable" : "moved")
   : n.kind === "exchange" ? (v >= 1 ? "exchange" : "moved") : v >= 1 ? "crypto" : "moved";
  st[n.id] = { v, status, usdt: Math.max(0, usdt[n.id] || 0) }
 }
 return st
}

function nodeText(n, s) {
 const t = Math.round;
 switch (n.kind) {
  case "victim": return "Paid the scammer";
  case "bank": return s.status === "held" ? `${money(s.v)} held` : s.v >= 1 ? `${money(s.v)} still here` : s.status === "held-empty" ? "Held · nothing left" : "Passed on";
  case "p2p": return "Rupee → USDT here";
  case "cash": return `${money(s.v)} cash out`;
  case "ext": return `${money(s.v)} left our data`;
  case "bridge": return `≈ ${money(s.v)} gone`;
  case "exchange": return s.v >= 1 ? `${t(s.usdt).toLocaleString("en-IN")} USDT freezable` : "Moved on";
  default: return s.v >= 1 ? `≈ ${t(s.usdt).toLocaleString("en-IN")} USDT here` : "Moved on"
 }
}

function colLabel(kinds, i, firstBank) {
 return kinds.has("victim") ? "Victim" : kinds.has("bank") ? `Mule layer ${i - firstBank + 1}` : kinds.has("p2p") || kinds.has("cash") || kinds.has("ext") ? "Cash-out · P2P" : kinds.has("exchange") ? "Exchange" : kinds.has("wallet") || kinds.has("bridge") ? "On-chain (TRON)" : ""
}

function TrailGraph({ rows, c }) {
 const e = useApp();
 const ids = [...new Set(rows.flatMap(r => [r.from_ref, r.to_ref]).filter(x => x && x !== "CASH"))].sort();
 const info = useNodeInfo(ids);
 const holds = useGet("/holds?limit=500");
 const held = new Set((holds.data || []).filter(x => x.status === "active" || x.status === "confirmed").map(x => x.account_id));
 const model = flowModel(rows, c, info, held);
 const times = rows.map(r => tms(r.ts));
 const tMin = Math.floor(Math.min(...times) / 60000) - 3, tLive = Math.ceil(Math.max(...times) / 60000);
 const [view, setView] = R.useState(null), [play, setPlay] = R.useState(false), [focus, setFocus] = R.useState(false), [zoom, setZoom] = R.useState("auto"), [hov, setHov] = R.useState(null);
 const cur = view ?? tLive, nowMs = cur * 60000, live = view == null;
 R.useEffect(() => {
  if (!play) return;
  const step = Math.max(1, (tLive - tMin) / 140);
  const id = setInterval(() => setView(v => { const n = (v ?? tMin) + step; if (n >= tLive) { setPlay(false); return null } return n }), 60);
  return () => clearInterval(id)
 }, [play, tMin, tLive]);
 const st = flowState(model, nowMs);
 const total = Math.max(1, Number(c.total_lost));
 const tot = { stolen: total, secured: 0, recoverable: 0, wallet: 0, outside: 0, gone: 0 };
 for (const n of model.nodes) {
  const s = st[n.id];
  if (n.kind === "bank" || n.kind === "p2p" || n.kind === "exchange") tot.recoverable += s.v;
  if (s.status === "held" || s.status === "frozen") tot.secured += s.v;
  if (n.kind === "wallet") tot.wallet += s.v;
  if (n.kind === "ext") tot.outside += s.v;
  if (n.kind === "cash" || n.kind === "bridge") tot.gone += s.v
 }
 let shown = model.nodes, links = model.edges, ncol = model.ncol, maxRows = model.maxRows, pos = null;
 if (focus) {
  const keep = new Set(model.nodes.filter(n => st[n.id].v >= 1 && ["recoverable", "held", "crypto", "exchange", "frozen"].includes(st[n.id].status)).map(n => n.id));
  keep.add(model.victim);
  let grew = true;
  while (grew) { grew = false; for (const l of model.edges) if (l.t0 <= nowMs && keep.has(l.to) && !keep.has(l.from)) { keep.add(l.from); grew = true } }
  const ns = model.nodes.filter(n => keep.has(n.id)), cs = [...new Set(ns.map(n => n.col))].sort((a, b) => a - b), ci = Object.fromEntries(cs.map((d, i) => [d, i])), g = {};
  ns.forEach(n => (g[n.col] = g[n.col] || []).push(n));
  shown = [];
  Object.values(g).forEach(l => l.forEach((n, i) => shown.push({ ...n, col: ci[n.col], row: i - (l.length - 1) / 2 })));
  links = model.edges.filter(l => keep.has(l.from) && keep.has(l.to)); ncol = cs.length; maxRows = Math.max(1, ...Object.values(g).map(l => l.length))
 }
 const rowsN = Math.max(1, maxRows), W = GP * 2 + (ncol - 1) * GK + GW, H = GH + rowsN * GG + 6;
 pos = {};
 for (const n of shown) pos[n.id] = { x: GP + n.col * GK, y: GH + (n.row + (rowsN - 1) / 2) * GG };
 const kindsAt = {};
 shown.forEach(n => (kindsAt[n.col] = kindsAt[n.col] || new Set()).add(n.kind));
 const firstBank = Math.min(...shown.filter(n => n.kind === "bank").map(n => n.col), 99);
 const kindOfNode = Object.fromEntries(model.nodes.map(n => [n.id, n.kind]));
 const edgeKind = l => { const to = kindOfNode[l.to]; return l.blocked ? "blocked" : to === "cash" || to === "bridge" ? "exit" : to === "ext" ? "outside" : l.crypto ? "crypto" : "bank" };
 const style = zoom === "fit" ? { width: "100%" } : zoom === "auto" ? { minWidth: Math.round(W * .92), maxWidth: Math.round(W * 1.12) } : { width: Math.round(W * zoom), maxWidth: "none" };
 const bump = d => setZoom(z => Math.max(.5, Math.min(1.6, (typeof z === "number" ? z : 1) + d)));
 const open = id => { API.pick.account = id; e.go("accounts") };
 const title = n => n.kind === "victim" ? c.name : n.kind === "cash" ? "ATM cash withdrawal" : n.kind === "ext" ? "Outside our data" : n.id.startsWith("TRON:") ? (n.kind === "exchange" ? "Exchange" : "Unlabelled wallet") : `${n.id.split(":")[0]} ••${n.id.slice(-4)}`;
 const sub = n => { const d = info(n.id); return n.kind === "cash" ? `from ${n.id.slice(5).split(":")[0]}` : n.id.startsWith("TRON:") ? clip(n.id.slice(5, 10) + "…" + n.id.slice(-4), 20) : n.kind === "victim" ? `${n.id.split(":")[0]} ••${n.id.slice(-4)}` : d && d.holder_name ? d.holder_name : n.id.split(":")[0] };
 const marker = k => h("marker", { key: k, id: "arr-" + k, viewBox: "0 0 10 10", refX: "9", refY: "5", markerUnits: "userSpaceOnUse", markerWidth: "11", markerHeight: "11", orient: "auto-start-reverse" }, h("path", { d: "M0 0 L10 5 L0 10z", fill: `var(--${k === "bank" ? "edge" : k})` }));
 return h(Card, { title: "Live money trail", sub: "Each box is an account or wallet; line thickness = how much of the victim's money moved. Click any account for its mule score and reasons.", style: { marginTop: 18 }, bodyClass: "card-body", id: "trail-card" },
  h("div", { className: "scrubber" },
   h("button", { className: "btn sm", onClick: () => { if (!play && (live || cur >= tLive - 1)) setView(tMin); setPlay(!play) }, "aria-label": play ? "Pause replay" : "Replay the money trail" }, play ? "❚❚ Pause" : "▶ Replay trail"),
   h("input", { type: "range", min: tMin, max: tLive, step: 1, value: cur, "aria-label": "Replay time", onChange: ev => { setPlay(false); const v = Number(ev.target.value); setView(v >= tLive ? null : v) } }),
   h("span", { className: "scrub-time mono" }, stamp(nowMs)),
   live ? h("span", { className: "pill rec" }, h("span", { className: "d" }), "Live ", stamp(tLive * 60000)) : h("button", { className: "btn ghost sm", onClick: () => { setPlay(false); setView(null) } }, "Back to live")),
  h("div", { style: { marginTop: 12 } }, h(Meter, { tot, height: 12 })),
  h("div", { className: "graph-tools", role: "toolbar", "aria-label": "Graph view" },
   h("button", { className: "gt " + (focus ? "on" : ""), onClick: () => setFocus(!focus), "aria-pressed": focus, title: "Show only where the victim's money is now, and the path to it" }, "◎ Focus: where the money is now"),
   h("span", { className: "gt-sep" }),
   h("button", { className: "gt " + (zoom === "fit" ? "on" : ""), onClick: () => setZoom("fit") }, "Fit"),
   h("button", { className: "gt", onClick: () => bump(-.15), "aria-label": "Zoom out" }, "−"),
   h("button", { className: "gt " + (zoom === "auto" || zoom === 1 ? "on" : ""), onClick: () => setZoom("auto") }, "100%"),
   h("button", { className: "gt", onClick: () => bump(.15), "aria-label": "Zoom in" }, "+")),
  h("div", { className: "trail-wrap" },
   h("svg", { className: "trail", viewBox: `0 0 ${W} ${H}`, style, role: "img", "aria-label": `Money trail for ${c.id}` },
    h("defs", null, ["bank", "crypto", "exit", "outside"].map(marker),
     h("marker", { id: "arr-blocked", viewBox: "0 0 10 10", refX: "5", refY: "5", markerUnits: "userSpaceOnUse", markerWidth: "16", markerHeight: "16" },
      h("circle", { cx: 5, cy: 5, r: 4, fill: "var(--card-bg)", stroke: "var(--rec)", strokeWidth: 1.6 }), h("path", { d: "M2.6 5h4.8", stroke: "var(--rec)", strokeWidth: 1.6 }))),
    Object.entries(kindsAt).map(([i, ks]) => h("text", { key: "c" + i, x: GP + Number(i) * GK + GW / 2, y: 16, textAnchor: "middle", className: "col-lbl" }, colLabel(ks, Number(i), firstBank))),
    links.map(l => {
     const a = pos[l.from], b = pos[l.to];
     if (!a || !b) return null;
     const k = edgeKind(l), vis = l.t0 <= nowMs, x1 = a.x + GW, y1 = a.y + GD / 2, x2 = b.x - 2, y2 = b.y + GD / 2, dx = Math.max(30, (x2 - x1) / 2);
     const d = x2 > x1 ? `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}` : `M${x1},${y1} C${x1 + 60},${y1 + 70} ${x2 - 60},${y2 + 70} ${x2},${y2}`;
     const key = `${l.from}>${l.to}`, flowing = vis && !live && nowMs - l.t1 <= 12 * 60000 && !l.blocked;
     return h("g", { key, className: `edge ${k} ${vis ? "" : "hide"} ${flowing ? "flowing" : ""} ${hov === key ? "hov" : ""}`, onMouseEnter: () => setHov(key), onMouseLeave: () => setHov(null) },
      h("path", { d, strokeWidth: 1.4 + 6 * Math.sqrt(Math.min(1, l.taint / total)), markerEnd: k === "blocked" ? "url(#arr-blocked)" : `url(#arr-${k})` }),
      h("path", { d, className: "hit" }),
      h("g", { transform: `translate(${(x1 + x2) / 2},${(y1 + y2) / 2})`, className: "elabel" }, h("rect", { x: -34, y: -10, width: 68, height: 20, rx: 10 }), h("text", { y: 4, textAnchor: "middle" }, k === "blocked" ? `⛔ ${short(l.taint)}` : short(l.taint))),
      h("title", null, `${l.blocked ? "BLOCKED attempt" : "Transfer"} ${stamp(l.t0)}${l.n > 1 ? `–${stamp(l.t1)} (${l.n} transfers)` : ""} · ${l.rail} · ${money(l.taint)} of the victim's money`))
    }),
    shown.map(n => {
     const p = pos[n.id], s = st[n.id], vis = n.first <= nowMs, clickable = n.kind !== "victim" && n.kind !== "cash" && n.kind !== "ext", d = info(n.id);
     const isHeld = s.status === "held" || s.status === "frozen" || s.status === "held-empty" || s.status === "frozen-empty";
     return h("g", { key: n.id, transform: `translate(${p.x},${p.y})`, className: `node k-${n.kind === "p2p" ? "p2p" : n.kind} s-${s.status} ${vis ? "" : "hide"} ${clickable ? "click" : ""}`,
      onClick: clickable ? () => open(n.id) : undefined,
      ...(clickable ? { tabIndex: 0, role: "button", "aria-label": `${title(n)}: ${nodeText(n, s)}`, onKeyDown: ev => { ev.key === "Enter" && open(n.id) } } : {}) },
      h("rect", { className: "nbox", width: GW, height: GD, rx: 9 }), h("rect", { className: "nbar", width: 5, height: GD, rx: 2 }),
      h("text", { x: 13, y: 20, className: "n1" }, clip(title(n), n.kind === "bank" && d && d.score != null ? 14 : 19)),
      h("text", { x: 13, y: 37, className: "n2" }, clip(sub(n), 22)),
      h("text", { x: 13, y: 58, className: "n3" }, nodeText(n, s)),
      n.kind === "bank" && d && d.score != null && h("g", { transform: `translate(${GW - 20},17)`, className: "nscore" }, h("circle", { r: 13 }), h("text", { y: 4.5, textAnchor: "middle" }, Math.round(Number(d.score)))),
      isHeld && h("g", { transform: `translate(${GW - 22},${GD - 22})`, className: "nlock" }, h("rect", { width: 16, height: 16, rx: 4 }), h("path", { d: "M4.5 8h7v5h-7z M6 8V6.2a2 2 0 0 1 4 0V8", fill: "none", strokeWidth: 1.4 })))
    })),
   ncol > 6 && zoom !== "fit" && h("div", { className: "trail-hint" }, "Scroll sideways to follow the money → or press Fit"),
   focus && shown.length <= 1 && h("div", { className: "trail-hint" }, "Nothing of the victim's money is left anywhere we can reach.")),
  h("div", { className: "glegend" },
   h("span", null, h("i", { className: "lg rec" }), "Money still here (recoverable)"), h("span", null, h("i", { className: "lg held" }), "Held / frozen"),
   h("span", null, h("i", { className: "lg crypto" }), "Crypto (USDT on TRON)"), h("span", null, h("i", { className: "lg exit" }), "Gone (cash / bridge)"),
   h("span", null, h("i", { className: "lg outside" }), "Outside our data"), h("span", null, h("i", { className: "lg blocked" }), "Transfer blocked by a hold"),
   h("span", null, h("i", { className: "lg score" }, "87"), "Mule-risk score")))
}

/* ------------------------------------------------------------------ Trail */
function Trail() {
 const e = useApp(),
  items = API.get().items;
 const [id, setId] = R.useState(API.pick.case && items.some(i => i.c.id === API.pick.case) ? API.pick.case : items.length ? items[0].c.id : "");
 const [method, setMethod] = R.useState("fifo");
 const it = items.find(i => i.c.id === id);
 const st = useGet(id ? `/complaints/${id}/trail?method=${method}` : null, [id, method]);
 const rows = id && st.data ? st.data : [];
 const first = rows.length ? Math.min(...rows.map(r => r.hop)) : 0,
  traced = rows.filter(r => r.hop === first).reduce((s, r) => s + Number(r.traced_amount), 0);
 return h(R.Fragment, null,
  h(PageHead, { title: "Money trail", desc: "Where the victim's money went, hop by hop. FIFO, LIFO and pro-rata are three ways of attributing it." }),
  items.length === 0 ? h(Card, {}, Empty("No complaints yet.", "File or receive a complaint to see its trail.")) : h(R.Fragment, null,
   h("div", { className: "btn-row" },
    h("select", { className: "input", value: id, onChange: ev => { API.pick.case = ev.target.value; setId(ev.target.value) } },
     items.map(i => h("option", { key: i.c.id, value: i.c.id }, `${i.c.id} · ${i.c.scam_type} · ${money(i.c.total_lost)}`))),
    ["fifo", "lifo", "prorata"].map(m => h("button", {
     key: m, className: "btn sm " + (m === method ? "" : "ghost"), disabled: !COMPUTED.includes(m),
     title: COMPUTED.includes(m) ? "" : "Not computed yet: the tracer only follows FIFO", onClick: () => setMethod(m)
    }, m.toUpperCase()))),
   it && h(TraceNote, { it }),
   it && h("div", { className: "kpis", style: { marginTop: 14 } },
    h(Kpi, { label: "Amount lost", value: money(it.c.total_lost) }),
    h(Kpi, { label: "Traced (first hop)", value: money(traced), tone: "rec" }),
    h(Kpi, { label: "Hops", value: String(rows.length ? Math.max(...rows.map(r => r.hop)) : 0), sub: `${rows.length} transfers` })),
   rows.length > 0 && it && h(TrailGraph, { rows, c: it.c }),
   h("div", { style: { marginTop: 18 } }, h(Card, { title: `Trail · ${method.toUpperCase()}`, sub: id },
    h(Status, { st }),
    !st.loading && !st.err && rows.length === 0 ? Empty("No trail yet.", "See the trace status above; re-run it if it did not work.") :
    rows.length ? Table([["Hop", "right"], ["Time", "", "nowrap"], ["From → To"], ["Banks"], ["Traced", "right", "nowrap"], ["Rail"], ["Status"]],
     rows.map(r => ({ cells: [r.hop, when(r.ts), `${r.from_ref} → ${r.to_ref || "CASH"}`, `${r.from_bank || "—"} → ${r.to_bank || "—"}`,
      r.asset && r.asset !== "INR" ? `${Number(r.asset_amount)} ${r.asset}` : money(r.traced_amount), r.rail, pill(r.status || "traced")] }))) : null)),
   it && h("div", { style: { marginTop: 18 } }, h(Card, { title: "Reported payments", sub: "As filed by the victim" },
    it.payments.length === 0 ? Empty("No payments recorded.", "") :
    Table([["Time", "", "nowrap"], ["Amount", "right"], ["To"], ["Matched"]], it.payments.map(p => ({
     cells: [when(p.paid_at), money(p.amount), p.destination_type === "crypto" ? `wallet ${p.wallet_address}` : (p.utr || p.paid_to_upi_id || p.paid_to_account_no || "—"), p.matched ? "yes" : "no"]
    })))))))
}

/* ------------------------------------------------------------ Mule radar */
function Radar() {
 const e = useApp(),
  officer = e.user.key === "officer",
  accts = useGet("/accounts?limit=200"),
  mules = useGet("/mules?limit=200");
 const [sel, setSel] = R.useState(API.pick.account);
 const detail = useGet(sel ? `/accounts/${encodeURIComponent(sel)}` : null, [sel]);
 const run = useDo(e, null);
 const a = detail.data;
 const rerunAccount = id => API.call("POST", `/accounts/${encodeURIComponent(id)}/rerun`).then(r => {
  e.toast(`Read ${r.transfers_read} transfers · ${r.score == null ? "not enough data to score yet" : "score " + Math.round(r.score)}`);
  accts.reload(); detail.reload()
 }, err => e.toast(err.message));
 return h(R.Fragment, null,
  h(PageHead, { title: "Mule radar", desc: "Accounts ranked by mule score, and accounts the detector has flagged." }),
  h(Status, { st: accts }),
  h(Card, { title: "Accounts", sub: "Highest score first. Click one for its reasons." },
   !accts.data || accts.data.length === 0 ? Empty("No accounts yet.", "Accounts appear after the first pull.") :
   Table([["Account"], ["Holder"], ["Bank"], ["Kind"], ["Score", "right"], [""]], accts.data.map(x => ({
    src: x.account_id,
    cells: [h("span", { className: "mono" }, x.account_id), x.holder_name || "—", x.bank_id || "—", x.kind, x.score == null ? "—" : h(Pill, { tone: scoreTone(Number(x.score)) }, Number(x.score).toFixed(0)),
     x.score == null && x.kind === "bank" ? h("button", { className: "btn sm", title: "Read this account from the bank and score it", onClick: ev => { ev.stopPropagation(); rerunAccount(x.account_id) } }, "Run") : null]
   })), setSel)),
  sel && h("div", { style: { marginTop: 18 } }, h(Card, { title: sel, sub: a ? `${a.holder_name || "—"} · ${a.bank_id || a.kind}` : "" },
   h(Status, { st: detail }),
   a && h(R.Fragment, null,
    h("div", { className: "kpis three" }, h(Kpi, { label: "Score", value: a.score == null ? "—" : Number(a.score).toFixed(0) }),
     h(Kpi, { label: "Complaints naming it", value: String(a.repeat_offender_count) }), h(Kpi, { label: "Model", value: a.model_version || "—" })),
    h("pre", { className: "mono", style: { whiteSpace: "pre-wrap", fontSize: 12, marginTop: 12 } }, a.reasons ? JSON.stringify(a.reasons, null, 2) : "No score reasons yet."),
    h("div", { className: "btn-row" }, h("button", { className: "btn ghost sm", title: "Read this account from the bank again and score it again", onClick: () => rerunAccount(sel) }, "Re-run (read + score)"),
    a.kind === "bank" && h("button", {
     className: "btn hold sm", onClick: () => run("Hold requested", () => API.call("POST", "/holds", { account_id: sel, reason: `Mule score ${a.score == null ? "n/a" : Number(a.score).toFixed(0)}`, score_at_time: a.score }))
    }, officer ? "Request hold" : "Place 24h hold"),
    officer && a.kind === "bank" && (API.pick.case || (API.get().items[0] || { c: {} }).c.id) && h("button", {
     className: "btn danger sm", title: "Draft and approve a freeze request to the bank",
     onClick: () => run("Freeze request approved. Press Send in Action pack", () => freezeRequest({
      complaint_id: API.pick.case || API.get().items[0].c.id, account_id: sel, bank_id: a.bank_id, amount: null,
      reason: `Mule score ${a.score == null ? "n/a" : Number(a.score).toFixed(0)}`
     }).then(r => { e.go("action"); return r }))
    }, "Freeze"))))),
  h("div", { style: { marginTop: 18 } }, h(Card, { title: "Flagged mules", sub: "mule_accounts" },
   !mules.data || mules.data.length === 0 ? Empty("Nothing flagged yet.", "") :
   Table([["Account"], ["Bank"], ["Status"], ["Source"], ["First flagged", "", "nowrap"]], mules.data.map(m => ({
    src: m.account_id, cells: [h("span", { className: "mono" }, m.account_id), m.bank_id || "—", pill(m.status), m.source, when(m.first_flagged_at)]
   })), setSel))))
}

/* --------------------------------------------------------- Prevention calls */
function Calls() {
 const e = useApp(),
  calls = useGet("/calls?limit=100"),
  cand = useGet("/accounts?min_score=40&limit=50");
 const run = useDo(e, () => { calls.reload() });
 const [f, setF] = R.useState({ account_id: "", outcome: "admitted", reply_label: "" });
 const log = body => run("Call logged", () => API.call("POST", "/calls", body));
 return h(R.Fragment, null,
  h(PageHead, { title: "Prevention calls", desc: "Warning calls to accounts scored 40 or more, and what they said." }),
  h(Card, { title: "Candidates", sub: "Score 40 or above" },
   !cand.data || cand.data.length === 0 ? Empty("No candidates.", "No account scores 40 or more yet.") :
   Table([["Account"], ["Holder"], ["Score", "right"], [""]], cand.data.map(x => ({
    cells: [h("span", { className: "mono" }, x.account_id), x.holder_name || "—", h(Pill, { tone: scoreTone(Number(x.score)) }, Number(x.score).toFixed(0)),
     h("button", { className: "btn sm", onClick: () => setF({ ...f, account_id: x.account_id }) }, "Log call")]
   })))),
  h("div", { style: { marginTop: 18 } }, h(Card, { title: "Log a call" },
   h("div", { className: "rl-form two" },
    Field("Account", h("input", { className: "input mono", value: f.account_id, onChange: ev => setF({ ...f, account_id: ev.target.value }), placeholder: "SBI:1234567890" })),
    Field("Outcome", h("select", { className: "input", value: f.outcome, onChange: ev => setF({ ...f, outcome: ev.target.value }) },
     ["admitted", "denied", "unsure", "noanswer"].map(o => h("option", { key: o, value: o }, o)))),
    Field("Reply (optional)", h("input", { className: "input", value: f.reply_label, onChange: ev => setF({ ...f, reply_label: ev.target.value }) }))),
   h("div", { className: "btn-row", style: { marginTop: 12 } }, h("button", {
    className: "btn", disabled: !f.account_id.trim(),
    onClick: () => log({ account_id: f.account_id.trim(), outcome: f.outcome, reply_label: f.reply_label || null })
   }, "Log call")))),
  h("div", { style: { marginTop: 18 } }, h(Card, { title: "Call history" },
   h(Status, { st: calls }),
   calls.data && calls.data.length === 0 ? Empty("No calls yet.", "") : calls.data ? Table([["When", "", "nowrap"], ["Account"], ["Outcome"], ["Reply"], ["By"]],
    calls.data.map(c => ({ cells: [when(c.called_at), h("span", { className: "mono" }, c.account_id), c.outcome, c.reply_label || "—", c.called_by || "—"] }))) : null)))
}

/* AI hold suggestions, computed by the backend per complaint (GET /complaints/{id}/hold-proposals) */
function useProposals(items, tick) {
 const [st, setSt] = R.useState({ rows: [], loading: true });
 const key = items.filter(i => i.c.status !== "closed").map(i => i.c.id).join(",");
 R.useEffect(() => {
  let on = true;
  const ids = key ? key.split(",").slice(0, 30) : [];
  Promise.all(ids.map(id => API.call("GET", `/complaints/${id}/hold-proposals`).catch(() => []))).then(r => on && setSt({ rows: r.flat(), loading: false }));
  return () => { on = false }
 }, [key, tick]);
 return st
}

/* ------------------------------------------------------------------ Holds */
function Holds() {
 const e = useApp(),
  officer = e.user.key === "officer",
  holds = useGet("/holds?limit=200"),
  [tick, setTick] = R.useState(0),
  sug = useProposals(API.get().items, tick);
 const run = useDo(e, () => { holds.reload(); setTick(x => x + 1) });
 const [f, setF] = R.useState({ account_id: "", reason: "", amount: "", complaint_id: "" });
 const decide = (id, verb) => run(`Hold ${verb === "execute" ? "placed" : verb + "ed"}`, () => API.call("POST", `/holds/${id}/${verb}`, {}));
 return h(R.Fragment, null,
  h(PageHead, { title: "Holds", desc: officer ? "24-hour temporary holds. The bank places them; you confirm or reject, or they expire." : "24-hour temporary holds on your bank's accounts. The cyber cell confirms or rejects them, or they expire." }),
  h(Card, { title: officer ? "Request a hold" : "Place a hold", sub: officer ? "Sent to the bank to execute" : "Active immediately for 24 hours" },
   h("div", { className: "rl-form two" },
    Field("Account", h("input", { className: "input mono", value: f.account_id, onChange: ev => setF({ ...f, account_id: ev.target.value }), placeholder: "SBI:1234567890" })),
    Field("Complaint (optional)", h("input", { className: "input mono", value: f.complaint_id, onChange: ev => setF({ ...f, complaint_id: ev.target.value }), placeholder: "C-3021" })),
    Field("Amount (optional)", h("input", { className: "input", type: "number", min: "0", value: f.amount, onChange: ev => setF({ ...f, amount: ev.target.value }) })),
    Field("Reason", h("input", { className: "input", value: f.reason, onChange: ev => setF({ ...f, reason: ev.target.value }) }))),
   h("div", { className: "btn-row", style: { marginTop: 12 } }, h("button", {
    className: "btn", disabled: !f.account_id.trim() || f.reason.trim().length < 3,
    onClick: () => run(officer ? "Hold requested" : "Hold placed", () => API.call("POST", "/holds", {
     account_id: f.account_id.trim(), reason: f.reason.trim(), complaint_id: f.complaint_id.trim() || null, amount: f.amount ? Number(f.amount) : null
    })).then(r => r && setF({ account_id: "", reason: "", amount: "", complaint_id: "" }))
   }, officer ? "Request hold" : "Place hold"))),
  h("div", { style: { marginTop: 18 } }, h(Card, { title: "Suggested holds", sub: "Trail accounts that still hold traced money and score at or above the hold threshold. Computed, not stored." },
   sug.loading ? h("div", { className: "note info" }, "Loading…") : sug.rows.length === 0 ? Empty("No suggestions.", "Nothing on a trail is above the threshold right now.") :
   Table([["Complaint"], ["Account"], ["Bank"], ["Score", "right"], ["Traced", "right", "nowrap"], ["Why"], [""]], sug.rows.map(x => ({
    cells: [x.complaint_id, h("span", { className: "mono" }, x.account_id), x.bank_id, h(Pill, { tone: scoreTone(x.score) }, x.score.toFixed(0)), money(x.amount), x.reason,
     h("div", { className: "btn-row" }, h("button", {
      className: "btn hold sm",
      onClick: () => run(officer ? "Hold requested" : "Hold placed", () => API.call("POST", "/holds", {
       account_id: x.account_id, reason: x.reason, complaint_id: x.complaint_id, amount: x.amount, score_at_time: x.score, basis: "ai_draft"
      }))
     }, officer ? "Request hold" : "Place hold"),
     officer && h("button", {
      className: "btn danger sm", title: "Draft and approve a freeze request to the bank",
      onClick: () => run("Freeze request approved. Press Send in Action pack", () => freezeRequest(x).then(r => { e.go("action"); return r }))
     }, "Freeze"))]
   }))))),
  h("div", { style: { marginTop: 18 } }, h(Card, { title: "All holds" },
   h(Status, { st: holds }),
   holds.data && holds.data.length === 0 ? Empty("No holds yet.", "") : holds.data ? Table([["#", "right"], ["Account"], ["Complaint"], ["Status"], ["Amount", "right", "nowrap"], ["Expires", "", "nowrap"], ["Reason"], [""]],
    holds.data.map(x => ({ cells: [x.id, h("span", { className: "mono" }, x.account_id), x.complaint_id || "—", pill(x.status), money(x.amount), when(x.expires_at), x.reason,
     h("div", { className: "btn-row" },
      officer && x.status === "active" && h("button", { className: "btn approve sm", onClick: () => decide(x.id, "confirm") }, "Confirm"),
      officer && (x.status === "requested" || x.status === "active") && h("button", { className: "btn danger sm", onClick: () => decide(x.id, "reject") }, "Reject"),
      x.status === "requested" && h("button", { className: "btn hold sm", onClick: () => decide(x.id, "execute") }, "Place hold"),
      ["requested", "active", "confirmed"].includes(x.status) && h("button", { className: "btn ghost sm", onClick: () => decide(x.id, "release") }, "Release"))] }))) : null)))
}

/* ---------------------------------------------------------------- Actions */
function Actions() {
 const e = useApp(),
  officer = e.user.key === "officer",
  acts = useGet("/actions?limit=200"),
  items = API.get().items;
 const run = useDo(e, () => acts.reload());
 const [f, setF] = R.useState({ complaint_id: "", kind: "freeze", target: "", draft_text: "" });
 const cid = f.complaint_id || (items[0] ? items[0].c.id : "");
 return h(R.Fragment, null,
  h(PageHead, { title: "Action pack", desc: "Freeze, P2P, issuer and STR requests. Draft, approve, then send." }),
  h(Card, { title: "Draft a request" },
   h("div", { className: "rl-form two" },
    Field("Complaint", h("select", { className: "input", value: cid, onChange: ev => setF({ ...f, complaint_id: ev.target.value }) }, items.map(i => h("option", { key: i.c.id, value: i.c.id }, `${i.c.id} · ${i.c.scam_type}`)))),
    Field("Kind", h("select", { className: "input", value: f.kind, onChange: ev => setF({ ...f, kind: ev.target.value }) }, ["freeze", "p2p", "issuer", "str"].map(k => h("option", { key: k, value: k }, k)))),
    Field("Target (bank / exchange)", h("input", { className: "input", value: f.target, onChange: ev => setF({ ...f, target: ev.target.value }) }))),
   h("div", { style: { marginTop: 12 } }, Field("Draft", h("textarea", { className: "input", rows: 4, value: f.draft_text, onChange: ev => setF({ ...f, draft_text: ev.target.value }) }))),
   h("div", { className: "btn-row", style: { marginTop: 12 } }, h("button", {
    className: "btn ghost", disabled: !f.draft_text.trim(),
    onClick: () => API.call("POST", "/ask", { task: "draft", question: f.draft_text }).then(r => { setF({ ...f, draft_text: r.answer }); e.toast("Draft polished") }, err => e.toast(`Polish failed: ${err.message}`))
   }, "Polish with AI"), h("button", {
    className: "btn", disabled: !cid || !f.target.trim(),
    onClick: () => run("Action drafted", () => API.call("POST", "/actions", { complaint_id: cid, kind: f.kind, target: f.target.trim(), draft_text: f.draft_text || null })).then(r => r && setF({ ...f, target: "", draft_text: "" }))
   }, "Save draft"))),
  h("div", { style: { marginTop: 18 } }, h(Card, { title: "Requests" },
   h(Status, { st: acts }),
   acts.data && acts.data.length === 0 ? Empty("No requests yet.", "") : acts.data ? Table([["#", "right"], ["Complaint"], ["Kind"], ["Target"], ["Status"], ["Created", "", "nowrap"], [""]],
    acts.data.map(x => ({ cells: [x.id, x.complaint_id, x.kind, x.target, pill(x.status), when(x.created_at),
     h("div", { className: "btn-row" },
      officer && x.status === "draft" && h("button", { className: "btn approve sm", onClick: () => run("Action approved", () => API.call("POST", `/actions/${x.id}/approve`, {})) }, "Approve"),
      officer && x.status === "approved" && h("button", { className: "btn sm", onClick: () => run("Action sent", () => API.call("POST", `/actions/${x.id}/send`)) }, "Send"))] }))) : null)))
}

/* ------------------------------------------------------------------ Audit */
function Audit() {
 const log = useGet("/audit?limit=200"),
  chain = useGet("/audit/verify");
 const c = chain.data;
 return h(R.Fragment, null,
  h(PageHead, { title: "Audit trail", desc: "Every state change, hash-chained so edits are detectable." }),
  h("div", { className: "kpis three" },
   h(Kpi, { label: "Entries", value: c ? String(c.entries) : "—" }),
   h(Kpi, { label: "Chain", value: c ? (c.ok ? "Intact" : "Broken") : "—", tone: c && c.ok ? "rec" : undefined, sub: c && !c.ok ? `${c.reason} at #${c.broken_at}` : "sha256 of prev|seq|ts|kind|actor|text" })),
  h("div", { style: { marginTop: 18 } }, h(Card, { title: "Log", sub: "Newest first" },
   h(Status, { st: log }),
   log.data && log.data.length === 0 ? Empty("No entries yet.", "") : log.data ? Table([["#", "right"], ["Time", "", "nowrap"], ["Kind"], ["Actor"], ["Complaint"], ["What happened"], ["Hash"]],
    log.data.map(x => ({ cells: [x.seq, when(x.ts), x.kind, x.actor, x.complaint_id || "—", x.text, h("span", { className: "mono", title: x.hash }, x.hash.slice(0, 10) + "…")] }))) : null)))
}

/* --------------------------------------------------------------- Settings */
function SettingsCard() {
 const e = useApp(),
  officer = e.user.key === "officer",
  st = useGet("/settings");
 const [draft, setDraft] = R.useState({});
 const run = useDo(e, () => { st.reload(); setDraft({}) });
 const show = v => v === null || v === undefined ? "" : typeof v === "string" ? v : JSON.stringify(v);
 const parse = (key, s) => key === "demo_clock" ? (s.trim() === "" ? null : s.trim()) : Number(s);
 return h("div", { style: { marginTop: 18 } }, h(Card, { title: "Server settings", sub: officer ? "Stored in the backend. Changes are audited." : "Stored in the backend. Only an officer can change them." },
  h(Status, { st }),
  st.data && Table([["Setting"], ["Value"], ["Updated by"], [""]], st.data.map(s => ({
   cells: [h("span", { className: "mono" }, s.key),
    h("input", { className: "input mono", disabled: !officer, value: draft[s.key] !== undefined ? draft[s.key] : show(s.value), onChange: ev => setDraft({ ...draft, [s.key]: ev.target.value }) }),
    s.updated_by || "—",
    draft[s.key] !== undefined ? h("button", { className: "btn sm", onClick: () => run(`${s.key} saved`, () => API.call("PATCH", `/settings/${s.key}`, { value: parse(s.key, draft[s.key]) })) }, "Save") : null]
  })))))
}

/* ---------------------------------------------------------- Offline panel */
function Offline({ state }) {
 const e = useApp();
 const base = API.baseUrl ? API.baseUrl() : "";
 if (!state || state.status === "idle" || state.status === "loading") return h("div", { className: "empty", style: { padding: 40 } }, h("b", null, "Connecting to the backend…"));
 return h(R.Fragment, null,
  h(PageHead, { title: "Backend not reachable", desc: "Peecha shows live data only. Start the backend, or point Peecha at it in Settings." }),
  h(Card, {},
   h("div", { className: "note change" }, state.error || "No response"),
   h("p", { className: "sec", style: { fontSize: 13, marginTop: 12 } }, `Trying ${base || "this site"}/api. Sign-in uses the seeded users (see backend/app_users_seed.sql).`),
   h("div", { className: "btn-row", style: { marginTop: 12 } },
    h("button", { className: "btn", onClick: () => API.reset() }, "Retry"),
    h("button", { className: "btn ghost", onClick: () => e.go("settings") }, "Open Settings"))))
}

/* ------------------------------------------------------------------ Model */
function Model() {
 const accts = useGet("/accounts?limit=500"),
  mules = useGet("/mules?limit=500");
 const sc = (accts.data || []).filter(a => a.score != null).map(a => Number(a.score));
 const band = (lo, hi) => sc.filter(x => x >= lo && x < hi).length;
 const m = mules.data || [];
 const byStatus = k => m.filter(x => x.status === k).length;
 return h(R.Fragment, null,
  h(PageHead, { title: "Model & metrics", desc: "What the mule detector has scored so far. Precision and recall against the ground-truth file are computed outside the app." }),
  h(Status, { st: accts }),
  h("div", { className: "kpis" },
   h(Kpi, { label: "Accounts scored", value: String(sc.length), sub: `of ${(accts.data || []).length} loaded` }),
   h(Kpi, { label: "Hold candidates (70+)", value: String(band(70, 101)), tone: "exit" }),
   h(Kpi, { label: "Warning-call band (40–69)", value: String(band(40, 70)) })),
  h("div", { className: "kpis", style: { marginTop: 14 } },
   h(Kpi, { label: "Suspected", value: String(byStatus("suspected")) }),
   h(Kpi, { label: "Confirmed", value: String(byStatus("confirmed")), tone: "exit" }),
   h(Kpi, { label: "Cleared", value: String(byStatus("cleared")), tone: "rec" })),
  sc.length === 0 && h("div", { style: { marginTop: 18 } }, h(Card, {}, Empty("No scores yet.", "The detector writes account_scores when it runs."))),
  h("div", { style: { marginTop: 18 } }, h(Card, { title: "Rules", sub: "Act by band" },
   h("p", { className: "sec", style: { fontSize: 13 } }, "70 or more: the bank can place a 24-hour hold and the officer confirms or rejects it. 40 to 69: a warning call. Below 40: leave alone. Freezing is officer-only."))))
}

const PAGES = { inbox: Inbox, trail: Trail, accounts: Radar, prevent: Calls, holds: Holds, action: Actions, audit: Audit, model: Model };
export { SettingsCard, Offline };
export default function OfficerPage({ page }) {
 const C = PAGES[page];
 return C ? h(C, null) : null
}
