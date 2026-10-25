import {
 u as useApp,
 e as R,
 P as PageHead,
 K as Kpi,
 C as Card,
 a as Pill,
 b as inr
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
   Table([["Case"], ["Scam"], ["Amount lost", "right", "nowrap"], ["Channel"], ["Filed via"], ["Status"], ["Reported"]],
    items.map(i => ({
     src: i.c.id,
     cells: [h("div", null, h("div", { className: "cell-main mono" }, i.c.id), h("div", { className: "cell-sub" }, i.c.name, " · ", i.c.city || "—")),
      i.c.scam_type, money(i.c.total_lost), i.c.channel, i.c.filed_via, pill(i.c.status), when(i.c.reported_at)]
    })), id => { API.pick.case = id; e.go("trail") }))))
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
   it && h("div", { className: "kpis", style: { marginTop: 14 } },
    h(Kpi, { label: "Amount lost", value: money(it.c.total_lost) }),
    h(Kpi, { label: "Traced (first hop)", value: money(traced), tone: "rec" }),
    h(Kpi, { label: "Hops", value: String(rows.length ? Math.max(...rows.map(r => r.hop)) : 0), sub: `${rows.length} transfers` })),
   h("div", { style: { marginTop: 18 } }, h(Card, { title: `Trail · ${method.toUpperCase()}`, sub: id },
    h(Status, { st }),
    !st.loading && !st.err && rows.length === 0 ? Empty("Not traced yet.", "The orchestrator has not written a trail for this complaint.") :
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
 return h(R.Fragment, null,
  h(PageHead, { title: "Mule radar", desc: "Accounts ranked by mule score, and accounts the detector has flagged." }),
  h(Status, { st: accts }),
  h(Card, { title: "Accounts", sub: "Highest score first. Click one for its reasons." },
   !accts.data || accts.data.length === 0 ? Empty("No accounts yet.", "Accounts appear after the first pull.") :
   Table([["Account"], ["Holder"], ["Bank"], ["Kind"], ["Score", "right"]], accts.data.map(x => ({
    src: x.account_id,
    cells: [h("span", { className: "mono" }, x.account_id), x.holder_name || "—", x.bank_id || "—", x.kind, x.score == null ? "—" : h(Pill, { tone: scoreTone(Number(x.score)) }, Number(x.score).toFixed(0))]
   })), setSel)),
  sel && h("div", { style: { marginTop: 18 } }, h(Card, { title: sel, sub: a ? `${a.holder_name || "—"} · ${a.bank_id || a.kind}` : "" },
   h(Status, { st: detail }),
   a && h(R.Fragment, null,
    h("div", { className: "kpis three" }, h(Kpi, { label: "Score", value: a.score == null ? "—" : Number(a.score).toFixed(0) }),
     h(Kpi, { label: "Complaints naming it", value: String(a.repeat_offender_count) }), h(Kpi, { label: "Model", value: a.model_version || "—" })),
    h("pre", { className: "mono", style: { whiteSpace: "pre-wrap", fontSize: 12, marginTop: 12 } }, a.reasons ? JSON.stringify(a.reasons, null, 2) : "No score reasons yet."),
    a.kind === "bank" && h("div", { className: "btn-row" }, h("button", {
     className: "btn hold sm", onClick: () => run("Hold requested", () => API.call("POST", "/holds", { account_id: sel, reason: `Mule score ${a.score == null ? "n/a" : Number(a.score).toFixed(0)}`, score_at_time: a.score }))
    }, officer ? "Request hold" : "Place 24h hold"))))),
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
     h("button", {
      className: "btn hold sm",
      onClick: () => run(officer ? "Hold requested" : "Hold placed", () => API.call("POST", "/holds", {
       account_id: x.account_id, reason: x.reason, complaint_id: x.complaint_id, amount: x.amount, score_at_time: x.score, basis: "ai_draft"
      }))
     }, officer ? "Request hold" : "Place hold")]
   }))))),
  h("div", { style: { marginTop: 18 } }, h(Card, { title: "All holds" },
   h(Status, { st: holds }),
   holds.data && holds.data.length === 0 ? Empty("No holds yet.", "") : holds.data ? Table([["#", "right"], ["Account"], ["Complaint"], ["Status"], ["Amount", "right", "nowrap"], ["Expires", "", "nowrap"], ["Reason"], [""]],
    holds.data.map(x => ({ cells: [x.id, h("span", { className: "mono" }, x.account_id), x.complaint_id || "—", pill(x.status), money(x.amount), when(x.expires_at), x.reason,
     h("div", { className: "btn-row" },
      officer && x.status === "active" && h("button", { className: "btn approve sm", onClick: () => decide(x.id, "confirm") }, "Confirm"),
      officer && (x.status === "requested" || x.status === "active") && h("button", { className: "btn danger sm", onClick: () => decide(x.id, "reject") }, "Reject"),
      !officer && x.status === "requested" && h("button", { className: "btn hold sm", onClick: () => decide(x.id, "execute") }, "Place hold"),
      !officer && ["requested", "active", "confirmed"].includes(x.status) && h("button", { className: "btn ghost sm", onClick: () => decide(x.id, "release") }, "Release"))] }))) : null)))
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
 const base = (() => { try { return localStorage.getItem("pc-backend-url") || "" } catch { return "" } })();
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

/* ----------------------------------------------------------------- Crypto */
function Crypto() {
 const e = useApp(),
  wallets = useGet("/accounts?kind=wallet&limit=200");
 const [addr, setAddr] = R.useState("");
 const [q, setQ] = R.useState("");
 const rows = useGet(q ? `/tron?address=${encodeURIComponent(q)}` : null, [q]);
 const bad = addr.trim() && !/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(addr.trim());
 return h(R.Fragment, null,
  h(PageHead, { title: "Crypto wallets", desc: "USDT on TRON. Transfers come from the traced money, not from an outside lookup." }),
  h(Card, { title: "Look up a wallet" },
   h("div", { className: "btn-row" },
    h("input", { className: "input mono", style: { flex: 1 }, value: addr, onChange: ev => setAddr(ev.target.value), placeholder: "T… TRON address" }),
    h("button", { className: "btn", disabled: !addr.trim() || bad, onClick: () => setQ(addr.trim()) }, "Look up")),
   bad && h("div", { className: "note change", style: { marginTop: 10 } }, "That is not a valid TRON address."),
   q && h("div", { style: { marginTop: 14 } }, h(Status, { st: rows }),
    rows.data && (rows.data.rows.length === 0 ? Empty("No transfers for this wallet.", "") : Table([["Time", "", "nowrap"], ["From"], ["To"], ["USDT", "right"], ["Hash"]],
     rows.data.rows.map(r => ({ cells: [when(new Date(r.time).toISOString()), h("span", { className: "mono" }, r.from), h("span", { className: "mono" }, r.to), r.amount, h("span", { className: "mono" }, r.hash)] })))))),
  h("div", { style: { marginTop: 18 } }, h(Card, { title: "Wallets Peecha has seen", sub: "Click one to look it up" },
   h(Status, { st: wallets }),
   wallets.data && wallets.data.length === 0 ? Empty("No wallets yet.", "Wallets appear when a trail reaches the chain.") : wallets.data ? Table([["Wallet"], ["Kind"], ["Score", "right"]],
    wallets.data.map(w => ({ src: w.account_id, cells: [h("span", { className: "mono" }, w.account_id), w.wallet_kind || "—", w.score == null ? "—" : h(Pill, { tone: scoreTone(Number(w.score)) }, Number(w.score).toFixed(0))] })),
    id => { const a = id.replace(/^TRON:/, ""); setAddr(a); setQ(a) }) : null)))
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

const PAGES = { inbox: Inbox, trail: Trail, accounts: Radar, prevent: Calls, holds: Holds, action: Actions, audit: Audit, crypto: Crypto, model: Model };
export { SettingsCard, Offline };
export default function OfficerPage({ page }) {
 const C = PAGES[page];
 return C ? h(C, null) : null
}
