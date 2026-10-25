/* Peecha API layer: login, X-User-Id on /api calls, live complaints for the consumer screens.
   Classic script, loaded before the app module. If the backend is unreachable the status is "offline"
   and every screen keeps using the in-browser demo engine. */
(function () {
  var URL_KEY = "pc-backend-url", USER_KEY = "pc-user-id", EMAIL_KEY = "pc-consumer-email";
  var DEFAULT_EMAIL = "anil.verma@mail.example";
  var nativeFetch = window.fetch.bind(window);

  function get(k) { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } }
  function put(k, v) { try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch (e) {} }
  // only a plain http(s) address without credentials is a usable backend URL (a database connection string is not)
  function cleanUrl(v) {
    try {
      var u = new URL(String(v || "").trim());
      if ((u.protocol !== "http:" && u.protocol !== "https:") || u.username || u.password) return "";
      return (u.origin + u.pathname).replace(/\/+$/, "");
    } catch (e) { return ""; }
  }
  // drop a bad value saved earlier (for example a pasted connection string) instead of using or showing it
  if (get(URL_KEY) && !cleanUrl(get(URL_KEY))) put(URL_KEY, "");
  function base() { return cleanUrl(get(URL_KEY)); }

  function withUser(init) {
    var uid = get(USER_KEY);
    if (!uid) return init;
    var out = Object.assign({}, init), h = new Headers(out.headers || {});
    if (!h.has("X-User-Id")) h.set("X-User-Id", uid);
    out.headers = h;
    return out;
  }

  // existing screens call "./api/..."; send them to the configured backend with the logged-in user
  window.fetch = function (input, init) {
    if (typeof input === "string" && input.indexOf("./api/") === 0) {
      return nativeFetch(base() + "/api/" + input.slice(6), withUser(init));
    }
    return nativeFetch(input, init);
  };

  function call(method, path, body) {
    var init = { method: method, headers: {} };
    if (body !== undefined) { init.headers["content-type"] = "application/json"; init.body = JSON.stringify(body); }
    return nativeFetch(base() + "/api" + path, withUser(init)).then(function (r) {
      return r.json().catch(function () { return null; }).then(function (data) {
        if (!r.ok) throw new Error((data && data.detail && (data.detail.map ? data.detail.map(function (d) { return d.msg; }).join("; ") : data.detail)) || ("HTTP " + r.status));
        return data;
      });
    });
  }

  function login(email) {
    return call("POST", "/login", { email: email }).then(function (u) {
      put(USER_KEY, u.user_id);
      put("pc-user-name", u.name || "");
      return u;
    });
  }

  function loadAll() {
    return call("GET", "/complaints?limit=100").then(function (list) {
      return Promise.all(list.map(function (c) {
        return Promise.all([
          call("GET", "/complaints/" + c.id + "/payments").catch(function () { return []; }),
          call("GET", "/complaints/" + c.id + "/trail?method=fifo").catch(function () { return []; })
        ]).then(function (r) { return { c: c, payments: r[0], trail: r[1] }; });
      }));
    });
  }

  var BANKS = {
    SBIN: "SBI", PUNB: "PNB", BARB: "BOB", CNRB: "CANARA", UBIN: "UBI", IDIB: "INDIAN", ICIC: "ICICI", UTIB: "AXIS",
    INDB: "INDUSIND", YESB: "YES", RATN: "RBL", KKBK: "KOTAK", IDFB: "IDFC", FDRL: "FEDERAL", BDBL: "BANDHAN", HDFC: "HDFC",
    AUBL: "AU", ESFB: "EQUITAS", SIBL: "SIB", PYTM: "PAYTM", IPOS: "IPPB", AIRP: "AIRTEL"
  };
  var EMAILS = {
    officer: "meera.baruah@cybercell.example", analyst: "rahul.nair@sbi.example",
    "analyst:SBIN": "rahul.nair@sbi.example", "analyst:HDFC": "sanjay.kulkarni@hdfc.example",
    "analyst:ICIC": "amit.deshpande@icici.example", "analyst:UTIB": "vikas.rao@axis.example",
    "analyst:KKBK": "rohit.malhotra@kotak.example"
  };
  function emailFor(role) {
    if (role.indexOf("analyst:") !== 0) return EMAILS[role] || get(EMAIL_KEY) || DEFAULT_EMAIL;
    var code = BANKS[role.slice(8)];
    return EMAILS[role] || (code ? "analyst@" + code.toLowerCase() + ".example" : "");
  }

  // counts for the sidebar and the clock; staff only, failures just leave them empty
  function loadMeta(role) {
    if (role === "consumer") return Promise.resolve(null);
    var pendingStatus = role === "officer" ? "active" : "requested";
    return Promise.all([
      call("GET", "/holds?limit=500"),
      call("GET", "/accounts?min_score=40&limit=500"),
      call("GET", "/settings").catch(function () { return []; })
    ]).then(function (r) {
      var clock = (r[2].filter(function (x) { return x.key === "demo_clock"; })[0] || {}).value;
      return { pendingHolds: r[0].filter(function (h) { return h.status === pendingStatus; }).length, flagged: r[1].length, clock: clock || null };
    }).catch(function () { return null; });
  }

  var state = { role: "consumer", status: "idle", items: [], meta: null, error: null };
  var listeners = [], inflight = null, gen = 0;
  function set(next) { state = Object.assign({}, state, next); listeners.forEach(function (fn) { fn(); }); }

  function refresh() {
    if (inflight) return inflight;
    var mine = ++gen, email = emailFor(state.role);
    set({ status: state.status === "live" ? "live" : "loading", error: null });
    inflight = (get(USER_KEY) ? Promise.resolve(null) : email ? login(email) : Promise.reject(new Error("no backend user for this bank")))
      .then(function () { return loadAll(); })
      .catch(function (err) {
        if (get(USER_KEY) && /unknown user|401/.test(String(err.message))) { put(USER_KEY, ""); return login(email).then(loadAll); }
        throw err;
      })
      .then(function (items) { return loadMeta(state.role).then(function (meta) { return { items: items, meta: meta }; }); })
      .then(function (r) { if (mine === gen) set({ status: "live", items: r.items, meta: r.meta, userName: get("pc-user-name") }); },
            function (err) { if (mine === gen) set({ status: "offline", items: [], meta: null, error: String(err.message || err) }); })
      .then(function () { if (mine === gen) inflight = null; });
    return inflight;
  }

  // pick the identity for the current screen's role; switching role logs in again as that user
  function use(role) {
    if (role && role !== state.role) { put(USER_KEY, ""); inflight = null; gen++; set({ role: role, status: "idle", items: [], meta: null, error: null }); }
    if (state.status === "idle") refresh();
  }

  function file(f) {
    var ref = (f.ref || "").trim(), pay = { amount: Number(f.amount) };
    if (f.destination === "crypto") { pay.destination_type = "crypto"; pay.wallet_address = ref; pay.crypto_chain = "TRON"; pay.crypto_asset = "USDT"; }
    else if (ref.indexOf("@") > 0) pay.paid_to_upi_id = ref;
    else pay.utr = ref;
    var body = {
      name: f.name.trim(), phone_1: f.phone || null, city: f.city || null,
      scam_type: f.scamType, incident_description: f.description || null,
      total_lost: Number(f.amount),
      fraud_time: f.fraudTime ? f.fraudTime.slice(0, 10) + "T" + (f.fraudClock || "12:00") + ":00" : new Date().toISOString().slice(0, 19),
      payments: [pay]
    };
    if (/^[A-Z0-9]+:[A-Za-z0-9]+$/.test((f.victimAccount || "").trim())) body.victim_account_id = f.victimAccount.trim();
    return call("POST", "/complaints", body).then(function (r) { return refresh().then(function () { return r; }); });
  }

  // a new complaint is traced in the background: keep refreshing until its first trace has finished (10 min cap)
  function awaitingTrace() {
    var cutoff = Date.now() - 10 * 60 * 1000;
    return state.items.some(function (i) {
      var c = i.c, at = Date.parse(/Z|[+-]\d\d:?\d\d$/.test(c.reported_at) ? c.reported_at : c.reported_at + "Z");
      return (c.status === "open" || c.status === "tracing") && !c.last_traced_at && at > cutoff;
    });
  }
  setInterval(function () {
    if (state.status === "live" && !document.hidden && awaitingTrace()) refresh();
  }, 15000);

  window.PeechaAPI = {
    get: function () { return state; },
    subscribe: function (fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (x) { return x !== fn; }); }; },
    banks: BANKS,
    cleanUrl: cleanUrl,
    baseUrl: base,
    pick: { case: null, account: null },
    refresh: refresh,
    use: use,
    call: call,
    file: file,
    login: login,
    reset: function () { put(USER_KEY, ""); inflight = null; gen++; set({ status: "idle", items: [], meta: null, error: null }); }
  };
})();
