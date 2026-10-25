/* Peecha API layer: login, X-User-Id on /api calls, live complaints for the consumer screens.
   Classic script, loaded before the app module. If the backend is unreachable the status is "offline"
   and every screen keeps using the in-browser demo engine. */
(function () {
  var URL_KEY = "pc-backend-url", USER_KEY = "pc-user-id", EMAIL_KEY = "pc-consumer-email";
  var DEFAULT_EMAIL = "anil.verma@mail.example";
  var nativeFetch = window.fetch.bind(window);

  function get(k) { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } }
  function put(k, v) { try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch (e) {} }
  function base() { return get(URL_KEY).replace(/\/+$/, ""); }

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

  var EMAILS = {
    officer: "meera.baruah@cybercell.example", analyst: "rahul.nair@sbi.example",
    "analyst:SBIN": "rahul.nair@sbi.example", "analyst:HDFC": "sanjay.kulkarni@hdfc.example",
    "analyst:ICIC": "amit.deshpande@icici.example", "analyst:UTIB": "vikas.rao@axis.example",
    "analyst:KKBK": "rohit.malhotra@kotak.example"
  };
  function emailFor(role) { return role.indexOf("analyst:") === 0 ? EMAILS[role] || "" : EMAILS[role] || get(EMAIL_KEY) || DEFAULT_EMAIL; }

  var state = { role: "consumer", status: "idle", items: [], error: null };
  var listeners = [], inflight = null, gen = 0;
  function set(next) { state = Object.assign({}, state, next); listeners.forEach(function (fn) { fn(); }); }

  function refresh() {
    if (inflight) return inflight;
    var mine = ++gen, email = emailFor(state.role);
    set({ status: "loading", error: null });
    inflight = (get(USER_KEY) ? Promise.resolve(null) : email ? login(email) : Promise.reject(new Error("no backend user for this bank")))
      .then(function () { return loadAll(); })
      .catch(function (err) {
        if (get(USER_KEY) && /unknown user|401/.test(String(err.message))) { put(USER_KEY, ""); return login(email).then(loadAll); }
        throw err;
      })
      .then(function (items) { if (mine === gen) set({ status: "live", items: items }); },
            function (err) { if (mine === gen) set({ status: "offline", items: [], error: String(err.message || err) }); })
      .then(function () { if (mine === gen) inflight = null; });
    return inflight;
  }

  // pick the identity for the current screen's role; switching role logs in again as that user
  function use(role) {
    if (role && role !== state.role) { put(USER_KEY, ""); inflight = null; gen++; set({ role: role, status: "idle", items: [], error: null }); }
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
      fraud_time: f.fraudTime || new Date().toISOString().slice(0, 19),
      payments: [pay]
    };
    return call("POST", "/complaints", body).then(function (r) { return refresh().then(function () { return r; }); });
  }

  window.PeechaAPI = {
    get: function () { return state; },
    subscribe: function (fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (x) { return x !== fn; }); }; },
    pick: { case: null, account: null },
    refresh: refresh,
    use: use,
    call: call,
    file: file,
    login: login,
    reset: function () { put(USER_KEY, ""); inflight = null; set({ status: "idle", items: [], error: null }); }
  };
})();
