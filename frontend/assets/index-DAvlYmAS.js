const __vite__mapDeps = (i, m = __vite__mapDeps, d = (m.f || (m.f = ["./Crypto-BqUjZHoZ.js", "./Trail--XxNU5VG.js", "./Action-DTQ8EHbi.js", "./Prevent-Y66rWjSt.js", "./PhoneCall-CY1IJGsx.js",
 "./WalletModal-BsbTC53B.js", "./AccountModal-BJD0wbb7.js", "./Copilot-BeGpfLz7.js"
]))) => i.map(i => d[i]);
(function() {
 const t = document.createElement("link").relList;
 if (t && t.supports && t.supports("modulepreload")) return;
 for (const l of document.querySelectorAll('link[rel="modulepreload"]')) r(l);
 new MutationObserver(l => {
  for (const o of l)
   if (o.type === "childList")
    for (const i of o.addedNodes) i.tagName === "LINK" && i.rel === "modulepreload" && r(i)
 }).observe(document, {
  childList: !0,
  subtree: !0
 });

 function n(l) {
  const o = {};
  return l.integrity && (o.integrity = l.integrity), l.referrerPolicy && (o.referrerPolicy = l.referrerPolicy), l.crossOrigin === "use-credentials" ? o.credentials = "include" : l.crossOrigin ===
   "anonymous" ? o.credentials = "omit" : o.credentials = "same-origin", o
 }

 function r(l) {
  if (l.ep) return;
  l.ep = !0;
  const o = n(l);
  fetch(l.href, o)
 }
})();

function Kd(e) {
 return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e
}
var lu = {
  exports: {}
 },
 Wl = {},
 ou = {
  exports: {}
 },
 Y = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Dr = Symbol.for("react.element"),
 Wd = Symbol.for("react.portal"),
 Yd = Symbol.for("react.fragment"),
 Qd = Symbol.for("react.strict_mode"),
 Gd = Symbol.for("react.profiler"),
 Xd = Symbol.for("react.provider"),
 bd = Symbol.for("react.context"),
 qd = Symbol.for("react.forward_ref"),
 Zd = Symbol.for("react.suspense"),
 Jd = Symbol.for("react.memo"),
 ef = Symbol.for("react.lazy"),
 Ls = Symbol.iterator;

function tf(e) {
 return e === null || typeof e != "object" ? null : (e = Ls && e[Ls] || e["@@iterator"], typeof e == "function" ? e : null)
}
var iu = {
  isMounted: function() {
   return !1
  },
  enqueueForceUpdate: function() {},
  enqueueReplaceState: function() {},
  enqueueSetState: function() {}
 },
 su = Object.assign,
 au = {};

function Fn(e, t, n) {
 this.props = e, this.context = t, this.refs = au, this.updater = n || iu
}
Fn.prototype.isReactComponent = {};
Fn.prototype.setState = function(e, t) {
 if (typeof e != "object" && typeof e != "function" && e != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
 this.updater.enqueueSetState(this, e, t, "setState")
};
Fn.prototype.forceUpdate = function(e) {
 this.updater.enqueueForceUpdate(this, e, "forceUpdate")
};

function uu() {}
uu.prototype = Fn.prototype;

function Di(e, t, n) {
 this.props = e, this.context = t, this.refs = au, this.updater = n || iu
}
var zi = Di.prototype = new uu;
zi.constructor = Di;
su(zi, Fn.prototype);
zi.isPureReactComponent = !0;
var Os = Array.isArray,
 cu = Object.prototype.hasOwnProperty,
 Li = {
  current: null
 },
 du = {
  key: !0,
  ref: !0,
  __self: !0,
  __source: !0
 };

function fu(e, t, n) {
 var r, l = {},
  o = null,
  i = null;
 if (t != null)
  for (r in t.ref !== void 0 && (i = t.ref), t.key !== void 0 && (o = "" + t.key), t) cu.call(t, r) && !du.hasOwnProperty(r) && (l[r] = t[r]);
 var s = arguments.length - 2;
 if (s === 1) l.children = n;
 else if (1 < s) {
  for (var a = Array(s), h = 0; h < s; h++) a[h] = arguments[h + 2];
  l.children = a
 }
 if (e && e.defaultProps)
  for (r in s = e.defaultProps, s) l[r] === void 0 && (l[r] = s[r]);
 return {
  $$typeof: Dr,
  type: e,
  key: o,
  ref: i,
  props: l,
  _owner: Li.current
 }
}

function nf(e, t) {
 return {
  $$typeof: Dr,
  type: e.type,
  key: t,
  ref: e.ref,
  props: e.props,
  _owner: e._owner
 }
}

function Oi(e) {
 return typeof e == "object" && e !== null && e.$$typeof === Dr
}

function rf(e) {
 var t = {
  "=": "=0",
  ":": "=2"
 };
 return "$" + e.replace(/[=:]/g, function(n) {
  return t[n]
 })
}
var Us = /\/+/g;

function uo(e, t) {
 return typeof e == "object" && e !== null && e.key != null ? rf("" + e.key) : t.toString(36)
}

function ll(e, t, n, r, l) {
 var o = typeof e;
 (o === "undefined" || o === "boolean") && (e = null);
 var i = !1;
 if (e === null) i = !0;
 else switch (o) {
  case "string":
  case "number":
   i = !0;
   break;
  case "object":
   switch (e.$$typeof) {
    case Dr:
    case Wd:
     i = !0
   }
 }
 if (i) return i = e, l = l(i), e = r === "" ? "." + uo(i, 0) : r, Os(l) ? (n = "", e != null && (n = e.replace(Us, "$&/") + "/"), ll(l, t, n, "", function(h) {
  return h
 })) : l != null && (Oi(l) && (l = nf(l, n + (!l.key || i && i.key === l.key ? "" : ("" + l.key).replace(Us, "$&/") + "/") + e)), t.push(l)), 1;
 if (i = 0, r = r === "" ? "." : r + ":", Os(e))
  for (var s = 0; s < e.length; s++) {
   o = e[s];
   var a = r + uo(o, s);
   i += ll(o, t, n, a, l)
  } else if (a = tf(e), typeof a == "function")
   for (e = a.call(e), s = 0; !(o = e.next()).done;) o = o.value, a = r + uo(o, s++), i += ll(o, t, n, a, l);
  else if (o === "object") throw t = String(e), Error("Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) +
  "). If you meant to render a collection of children, use an array instead.");
 return i
}

function Fr(e, t, n) {
 if (e == null) return e;
 var r = [],
  l = 0;
 return ll(e, r, "", "", function(o) {
  return t.call(n, o, l++)
 }), r
}

function lf(e) {
 if (e._status === -1) {
  var t = e._result;
  t = t(), t.then(function(n) {
   (e._status === 0 || e._status === -1) && (e._status = 1, e._result = n)
  }, function(n) {
   (e._status === 0 || e._status === -1) && (e._status = 2, e._result = n)
  }), e._status === -1 && (e._status = 0, e._result = t)
 }
 if (e._status === 1) return e._result.default;
 throw e._result
}
var Me = {
  current: null
 },
 ol = {
  transition: null
 },
 of = {
  ReactCurrentDispatcher: Me,
  ReactCurrentBatchConfig: ol,
  ReactCurrentOwner: Li
 };

function pu() {
 throw Error("act(...) is not supported in production builds of React.")
}
Y.Children = {
 map: Fr,
 forEach: function(e, t, n) {
  Fr(e, function() {
   t.apply(this, arguments)
  }, n)
 },
 count: function(e) {
  var t = 0;
  return Fr(e, function() {
   t++
  }), t
 },
 toArray: function(e) {
  return Fr(e, function(t) {
   return t
  }) || []
 },
 only: function(e) {
  if (!Oi(e)) throw Error("React.Children.only expected to receive a single React element child.");
  return e
 }
};
Y.Component = Fn;
Y.Fragment = Yd;
Y.Profiler = Gd;
Y.PureComponent = Di;
Y.StrictMode = Qd;
Y.Suspense = Zd;
Y.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = of;
Y.act = pu;
Y.cloneElement = function(e, t, n) {
 if (e == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
 var r = su({}, e.props),
  l = e.key,
  o = e.ref,
  i = e._owner;
 if (t != null) {
  if (t.ref !== void 0 && (o = t.ref, i = Li.current), t.key !== void 0 && (l = "" + t.key), e.type && e.type.defaultProps) var s = e.type.defaultProps;
  for (a in t) cu.call(t, a) && !du.hasOwnProperty(a) && (r[a] = t[a] === void 0 && s !== void 0 ? s[a] : t[a])
 }
 var a = arguments.length - 2;
 if (a === 1) r.children = n;
 else if (1 < a) {
  s = Array(a);
  for (var h = 0; h < a; h++) s[h] = arguments[h + 2];
  r.children = s
 }
 return {
  $$typeof: Dr,
  type: e.type,
  key: l,
  ref: o,
  props: r,
  _owner: i
 }
};
Y.createContext = function(e) {
 return e = {
  $$typeof: bd,
  _currentValue: e,
  _currentValue2: e,
  _threadCount: 0,
  Provider: null,
  Consumer: null,
  _defaultValue: null,
  _globalName: null
 }, e.Provider = {
  $$typeof: Xd,
  _context: e
 }, e.Consumer = e
};
Y.createElement = fu;
Y.createFactory = function(e) {
 var t = fu.bind(null, e);
 return t.type = e, t
};
Y.createRef = function() {
 return {
  current: null
 }
};
Y.forwardRef = function(e) {
 return {
  $$typeof: qd,
  render: e
 }
};
Y.isValidElement = Oi;
Y.lazy = function(e) {
 return {
  $$typeof: ef,
  _payload: {
   _status: -1,
   _result: e
  },
  _init: lf
 }
};
Y.memo = function(e, t) {
 return {
  $$typeof: Jd,
  type: e,
  compare: t === void 0 ? null : t
 }
};
Y.startTransition = function(e) {
 var t = ol.transition;
 ol.transition = {};
 try {
  e()
 } finally {
  ol.transition = t
 }
};
Y.unstable_act = pu;
Y.useCallback = function(e, t) {
 return Me.current.useCallback(e, t)
};
Y.useContext = function(e) {
 return Me.current.useContext(e)
};
Y.useDebugValue = function() {};
Y.useDeferredValue = function(e) {
 return Me.current.useDeferredValue(e)
};
Y.useEffect = function(e, t) {
 return Me.current.useEffect(e, t)
};
Y.useId = function() {
 return Me.current.useId()
};
Y.useImperativeHandle = function(e, t, n) {
 return Me.current.useImperativeHandle(e, t, n)
};
Y.useInsertionEffect = function(e, t) {
 return Me.current.useInsertionEffect(e, t)
};
Y.useLayoutEffect = function(e, t) {
 return Me.current.useLayoutEffect(e, t)
};
Y.useMemo = function(e, t) {
 return Me.current.useMemo(e, t)
};
Y.useReducer = function(e, t, n) {
 return Me.current.useReducer(e, t, n)
};
Y.useRef = function(e) {
 return Me.current.useRef(e)
};
Y.useState = function(e) {
 return Me.current.useState(e)
};
Y.useSyncExternalStore = function(e, t, n) {
 return Me.current.useSyncExternalStore(e, t, n)
};
Y.useTransition = function() {
 return Me.current.useTransition()
};
Y.version = "18.3.1";
ou.exports = Y;
var H = ou.exports;
const sf = Kd(H);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var af = H,
 uf = Symbol.for("react.element"),
 cf = Symbol.for("react.fragment"),
 df = Object.prototype.hasOwnProperty,
 ff = af.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
 pf = {
  key: !0,
  ref: !0,
  __self: !0,
  __source: !0
 };

function hu(e, t, n) {
 var r, l = {},
  o = null,
  i = null;
 n !== void 0 && (o = "" + n), t.key !== void 0 && (o = "" + t.key), t.ref !== void 0 && (i = t.ref);
 for (r in t) df.call(t, r) && !pf.hasOwnProperty(r) && (l[r] = t[r]);
 if (e && e.defaultProps)
  for (r in t = e.defaultProps, t) l[r] === void 0 && (l[r] = t[r]);
 return {
  $$typeof: uf,
  type: e,
  key: o,
  ref: i,
  props: l,
  _owner: ff.current
 }
}
Wl.Fragment = cf;
Wl.jsx = hu;
Wl.jsxs = hu;
lu.exports = Wl;
var S = lu.exports,
 mu = {
  exports: {}
 },
 Be = {},
 gu = {
  exports: {}
 },
 vu = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(e) {
 function t(C, $) {
  var _ = C.length;
  C.push($);
  e: for (; 0 < _;) {
   var I = _ - 1 >>> 1,
    D = C[I];
   if (0 < l(D, $)) C[I] = $, C[_] = D, _ = I;
   else break e
  }
 }

 function n(C) {
  return C.length === 0 ? null : C[0]
 }

 function r(C) {
  if (C.length === 0) return null;
  var $ = C[0],
   _ = C.pop();
  if (_ !== $) {
   C[0] = _;
   e: for (var I = 0, D = C.length, B = D >>> 1; I < B;) {
    var Q = 2 * (I + 1) - 1,
     V = C[Q],
     W = Q + 1,
     K = C[W];
    if (0 > l(V, _)) W < D && 0 > l(K, V) ? (C[I] = K, C[W] = _, I = W) : (C[I] = V, C[Q] = _, I = Q);
    else if (W < D && 0 > l(K, _)) C[I] = K, C[W] = _, I = W;
    else break e
   }
  }
  return $
 }

 function l(C, $) {
  var _ = C.sortIndex - $.sortIndex;
  return _ !== 0 ? _ : C.id - $.id
 }
 if (typeof performance == "object" && typeof performance.now == "function") {
  var o = performance;
  e.unstable_now = function() {
   return o.now()
  }
 } else {
  var i = Date,
   s = i.now();
  e.unstable_now = function() {
   return i.now() - s
  }
 }
 var a = [],
  h = [],
  d = 1,
  k = null,
  x = 3,
  v = !1,
  N = !1,
  p = !1,
  P = typeof setTimeout == "function" ? setTimeout : null,
  u = typeof clearTimeout == "function" ? clearTimeout : null,
  f = typeof setImmediate < "u" ? setImmediate : null;
 typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);

 function c(C) {
  for (var $ = n(h); $ !== null;) {
   if ($.callback === null) r(h);
   else if ($.startTime <= C) r(h), $.sortIndex = $.expirationTime, t(a, $);
   else break;
   $ = n(h)
  }
 }

 function y(C) {
  if (p = !1, c(C), !N)
   if (n(a) !== null) N = !0, U(M);
   else {
    var $ = n(h);
    $ !== null && E(y, $.startTime - C)
   }
 }

 function M(C, $) {
  N = !1, p && (p = !1, u(g), g = -1), v = !0;
  var _ = x;
  try {
   for (c($), k = n(a); k !== null && (!(k.expirationTime > $) || C && !O());) {
    var I = k.callback;
    if (typeof I == "function") {
     k.callback = null, x = k.priorityLevel;
     var D = I(k.expirationTime <= $);
     $ = e.unstable_now(), typeof D == "function" ? k.callback = D : k === n(a) && r(a), c($)
    } else r(a);
    k = n(a)
   }
   if (k !== null) var B = !0;
   else {
    var Q = n(h);
    Q !== null && E(y, Q.startTime - $), B = !1
   }
   return B
  } finally {
   k = null, x = _, v = !1
  }
 }
 var w = !1,
  m = null,
  g = -1,
  T = 5,
  j = -1;

 function O() {
  return !(e.unstable_now() - j < T)
 }

 function F() {
  if (m !== null) {
   var C = e.unstable_now();
   j = C;
   var $ = !0;
   try {
    $ = m(!0, C)
   } finally {
    $ ? L() : (w = !1, m = null)
   }
  } else w = !1
 }
 var L;
 if (typeof f == "function") L = function() {
  f(F)
 };
 else if (typeof MessageChannel < "u") {
  var X = new MessageChannel,
   ce = X.port2;
  X.port1.onmessage = F, L = function() {
   ce.postMessage(null)
  }
 } else L = function() {
  P(F, 0)
 };

 function U(C) {
  m = C, w || (w = !0, L())
 }

 function E(C, $) {
  g = P(function() {
   C(e.unstable_now())
  }, $)
 }
 e.unstable_IdlePriority = 5, e.unstable_ImmediatePriority = 1, e.unstable_LowPriority = 4, e.unstable_NormalPriority = 3, e.unstable_Profiling = null, e.unstable_UserBlockingPriority = 2, e
  .unstable_cancelCallback = function(C) {
   C.callback = null
  }, e.unstable_continueExecution = function() {
   N || v || (N = !0, U(M))
  }, e.unstable_forceFrameRate = function(C) {
   0 > C || 125 < C ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : T = 0 < C ? Math.floor(1e3 / C) : 5
  }, e.unstable_getCurrentPriorityLevel = function() {
   return x
  }, e.unstable_getFirstCallbackNode = function() {
   return n(a)
  }, e.unstable_next = function(C) {
   switch (x) {
    case 1:
    case 2:
    case 3:
     var $ = 3;
     break;
    default:
     $ = x
   }
   var _ = x;
   x = $;
   try {
    return C()
   } finally {
    x = _
   }
  }, e.unstable_pauseExecution = function() {}, e.unstable_requestPaint = function() {}, e.unstable_runWithPriority = function(C, $) {
   switch (C) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
     break;
    default:
     C = 3
   }
   var _ = x;
   x = C;
   try {
    return $()
   } finally {
    x = _
   }
  }, e.unstable_scheduleCallback = function(C, $, _) {
   var I = e.unstable_now();
   switch (typeof _ == "object" && _ !== null ? (_ = _.delay, _ = typeof _ == "number" && 0 < _ ? I + _ : I) : _ = I, C) {
    case 1:
     var D = -1;
     break;
    case 2:
     D = 250;
     break;
    case 5:
     D = 1073741823;
     break;
    case 4:
     D = 1e4;
     break;
    default:
     D = 5e3
   }
   return D = _ + D, C = {
    id: d++,
    callback: $,
    priorityLevel: C,
    startTime: _,
    expirationTime: D,
    sortIndex: -1
   }, _ > I ? (C.sortIndex = _, t(h, C), n(a) === null && C === n(h) && (p ? (u(g), g = -1) : p = !0, E(y, _ - I))) : (C.sortIndex = D, t(a, C), N || v || (N = !0, U(M))), C
  }, e.unstable_shouldYield = O, e.unstable_wrapCallback = function(C) {
   var $ = x;
   return function() {
    var _ = x;
    x = $;
    try {
     return C.apply(this, arguments)
    } finally {
     x = _
    }
   }
  }
})(vu);
gu.exports = vu;
var hf = gu.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var mf = H,
 Fe = hf;

function R(e) {
 for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
 return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
}
var yu = new Set,
 vr = {};

function an(e, t) {
 Rn(e, t), Rn(e + "Capture", t)
}

function Rn(e, t) {
 for (vr[e] = t, e = 0; e < t.length; e++) yu.add(t[e])
}
var vt = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"),
 Uo = Object.prototype.hasOwnProperty,
 gf =
 /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
 Fs = {},
 Bs = {};

function vf(e) {
 return Uo.call(Bs, e) ? !0 : Uo.call(Fs, e) ? !1 : gf.test(e) ? Bs[e] = !0 : (Fs[e] = !0, !1)
}

function yf(e, t, n, r) {
 if (n !== null && n.type === 0) return !1;
 switch (typeof t) {
  case "function":
  case "symbol":
   return !0;
  case "boolean":
   return r ? !1 : n !== null ? !n.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
  default:
   return !1
 }
}

function kf(e, t, n, r) {
 if (t === null || typeof t > "u" || yf(e, t, n, r)) return !0;
 if (r) return !1;
 if (n !== null) switch (n.type) {
  case 3:
   return !t;
  case 4:
   return t === !1;
  case 5:
   return isNaN(t);
  case 6:
   return isNaN(t) || 1 > t
 }
 return !1
}

function Ne(e, t, n, r, l, o, i) {
 this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = o, this
  .removeEmptyString = i
}
var ke = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
 ke[e] = new Ne(e, 0, !1, e, null, !1, !1)
});
[
 ["acceptCharset", "accept-charset"],
 ["className", "class"],
 ["htmlFor", "for"],
 ["httpEquiv", "http-equiv"]
].forEach(function(e) {
 var t = e[0];
 ke[t] = new Ne(t, 1, !1, e[1], null, !1, !1)
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
 ke[e] = new Ne(e, 2, !1, e.toLowerCase(), null, !1, !1)
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
 ke[e] = new Ne(e, 2, !1, e, null, !1, !1)
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
.split(" ").forEach(function(e) {
 ke[e] = new Ne(e, 3, !1, e.toLowerCase(), null, !1, !1)
});
["checked", "multiple", "muted", "selected"].forEach(function(e) {
 ke[e] = new Ne(e, 3, !0, e, null, !1, !1)
});
["capture", "download"].forEach(function(e) {
 ke[e] = new Ne(e, 4, !1, e, null, !1, !1)
});
["cols", "rows", "size", "span"].forEach(function(e) {
 ke[e] = new Ne(e, 6, !1, e, null, !1, !1)
});
["rowSpan", "start"].forEach(function(e) {
 ke[e] = new Ne(e, 5, !1, e.toLowerCase(), null, !1, !1)
});
var Ui = /[\-:]([a-z])/g;

function Fi(e) {
 return e[1].toUpperCase()
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
.split(" ").forEach(function(e) {
 var t = e.replace(Ui, Fi);
 ke[t] = new Ne(t, 1, !1, e, null, !1, !1)
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
 var t = e.replace(Ui, Fi);
 ke[t] = new Ne(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1)
});
["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
 var t = e.replace(Ui, Fi);
 ke[t] = new Ne(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1)
});
["tabIndex", "crossOrigin"].forEach(function(e) {
 ke[e] = new Ne(e, 1, !1, e.toLowerCase(), null, !1, !1)
});
ke.xlinkHref = new Ne("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
["src", "href", "action", "formAction"].forEach(function(e) {
 ke[e] = new Ne(e, 1, !1, e.toLowerCase(), null, !0, !0)
});

function Bi(e, t, n, r) {
 var l = ke.hasOwnProperty(t) ? ke[t] : null;
 (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (kf(t, n, l, r) && (n = null), r || l === null ? vf(t) && (n === null ? e
  .removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e
  .removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))))
}
var St = mf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
 Br = Symbol.for("react.element"),
 hn = Symbol.for("react.portal"),
 mn = Symbol.for("react.fragment"),
 Hi = Symbol.for("react.strict_mode"),
 Fo = Symbol.for("react.profiler"),
 ku = Symbol.for("react.provider"),
 wu = Symbol.for("react.context"),
 Vi = Symbol.for("react.forward_ref"),
 Bo = Symbol.for("react.suspense"),
 Ho = Symbol.for("react.suspense_list"),
 Ki = Symbol.for("react.memo"),
 Pt = Symbol.for("react.lazy"),
 Su = Symbol.for("react.offscreen"),
 Hs = Symbol.iterator;

function Yn(e) {
 return e === null || typeof e != "object" ? null : (e = Hs && e[Hs] || e["@@iterator"], typeof e == "function" ? e : null)
}
var oe = Object.assign,
 co;

function nr(e) {
 if (co === void 0) try {
  throw Error()
 } catch (n) {
  var t = n.stack.trim().match(/\n( *(at )?)/);
  co = t && t[1] || ""
 }
 return `
` + co + e
}
var fo = !1;

function po(e, t) {
 if (!e || fo) return "";
 fo = !0;
 var n = Error.prepareStackTrace;
 Error.prepareStackTrace = void 0;
 try {
  if (t)
   if (t = function() {
     throw Error()
    }, Object.defineProperty(t.prototype, "props", {
     set: function() {
      throw Error()
     }
    }), typeof Reflect == "object" && Reflect.construct) {
    try {
     Reflect.construct(t, [])
    } catch (h) {
     var r = h
    }
    Reflect.construct(e, [], t)
   } else {
    try {
     t.call()
    } catch (h) {
     r = h
    }
    e.call(t.prototype)
   }
  else {
   try {
    throw Error()
   } catch (h) {
    r = h
   }
   e()
  }
 } catch (h) {
  if (h && r && typeof h.stack == "string") {
   for (var l = h.stack.split(`
`), o = r.stack.split(`
`), i = l.length - 1, s = o.length - 1; 1 <= i && 0 <= s && l[i] !== o[s];) s--;
   for (; 1 <= i && 0 <= s; i--, s--)
    if (l[i] !== o[s]) {
     if (i !== 1 || s !== 1)
      do
       if (i--, s--, 0 > s || l[i] !== o[s]) {
        var a = `
` + l[i].replace(" at new ", " at ");
        return e.displayName && a.includes("<anonymous>") && (a = a.replace("<anonymous>", e.displayName)), a
       } while (1 <= i && 0 <= s);
     break
    }
  }
 } finally {
  fo = !1, Error.prepareStackTrace = n
 }
 return (e = e ? e.displayName || e.name : "") ? nr(e) : ""
}

function wf(e) {
 switch (e.tag) {
  case 5:
   return nr(e.type);
  case 16:
   return nr("Lazy");
  case 13:
   return nr("Suspense");
  case 19:
   return nr("SuspenseList");
  case 0:
  case 2:
  case 15:
   return e = po(e.type, !1), e;
  case 11:
   return e = po(e.type.render, !1), e;
  case 1:
   return e = po(e.type, !0), e;
  default:
   return ""
 }
}

function Vo(e) {
 if (e == null) return null;
 if (typeof e == "function") return e.displayName || e.name || null;
 if (typeof e == "string") return e;
 switch (e) {
  case mn:
   return "Fragment";
  case hn:
   return "Portal";
  case Fo:
   return "Profiler";
  case Hi:
   return "StrictMode";
  case Bo:
   return "Suspense";
  case Ho:
   return "SuspenseList"
 }
 if (typeof e == "object") switch (e.$$typeof) {
  case wu:
   return (e.displayName || "Context") + ".Consumer";
  case ku:
   return (e._context.displayName || "Context") + ".Provider";
  case Vi:
   var t = e.render;
   return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
  case Ki:
   return t = e.displayName || null, t !== null ? t : Vo(e.type) || "Memo";
  case Pt:
   t = e._payload, e = e._init;
   try {
    return Vo(e(t))
   } catch {}
 }
 return null
}

function Sf(e) {
 var t = e.type;
 switch (e.tag) {
  case 24:
   return "Cache";
  case 9:
   return (t.displayName || "Context") + ".Consumer";
  case 10:
   return (t._context.displayName || "Context") + ".Provider";
  case 18:
   return "DehydratedFragment";
  case 11:
   return e = t.render, e = e.displayName || e.name || "", t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
  case 7:
   return "Fragment";
  case 5:
   return t;
  case 4:
   return "Portal";
  case 3:
   return "Root";
  case 6:
   return "Text";
  case 16:
   return Vo(t);
  case 8:
   return t === Hi ? "StrictMode" : "Mode";
  case 22:
   return "Offscreen";
  case 12:
   return "Profiler";
  case 21:
   return "Scope";
  case 13:
   return "Suspense";
  case 19:
   return "SuspenseList";
  case 25:
   return "TracingMarker";
  case 1:
  case 0:
  case 17:
  case 2:
  case 14:
  case 15:
   if (typeof t == "function") return t.displayName || t.name || null;
   if (typeof t == "string") return t
 }
 return null
}

function Bt(e) {
 switch (typeof e) {
  case "boolean":
  case "number":
  case "string":
  case "undefined":
   return e;
  case "object":
   return e;
  default:
   return ""
 }
}

function xu(e) {
 var t = e.type;
 return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio")
}

function xf(e) {
 var t = xu(e) ? "checked" : "value",
  n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
  r = "" + e[t];
 if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
  var l = n.get,
   o = n.set;
  return Object.defineProperty(e, t, {
   configurable: !0,
   get: function() {
    return l.call(this)
   },
   set: function(i) {
    r = "" + i, o.call(this, i)
   }
  }), Object.defineProperty(e, t, {
   enumerable: n.enumerable
  }), {
   getValue: function() {
    return r
   },
   setValue: function(i) {
    r = "" + i
   },
   stopTracking: function() {
    e._valueTracker = null, delete e[t]
   }
  }
 }
}

function Hr(e) {
 e._valueTracker || (e._valueTracker = xf(e))
}

function Cu(e) {
 if (!e) return !1;
 var t = e._valueTracker;
 if (!t) return !0;
 var n = t.getValue(),
  r = "";
 return e && (r = xu(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1
}

function yl(e) {
 if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
 try {
  return e.activeElement || e.body
 } catch {
  return e.body
 }
}

function Ko(e, t) {
 var n = t.checked;
 return oe({}, t, {
  defaultChecked: void 0,
  defaultValue: void 0,
  value: void 0,
  checked: n ?? e._wrapperState.initialChecked
 })
}

function Vs(e, t) {
 var n = t.defaultValue == null ? "" : t.defaultValue,
  r = t.checked != null ? t.checked : t.defaultChecked;
 n = Bt(t.value != null ? t.value : n), e._wrapperState = {
  initialChecked: r,
  initialValue: n,
  controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null
 }
}

function Eu(e, t) {
 t = t.checked, t != null && Bi(e, "checked", t, !1)
}

function Wo(e, t) {
 Eu(e, t);
 var n = Bt(t.value),
  r = t.type;
 if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
 else if (r === "submit" || r === "reset") {
  e.removeAttribute("value");
  return
 }
 t.hasOwnProperty("value") ? Yo(e, t.type, n) : t.hasOwnProperty("defaultValue") && Yo(e, t.type, Bt(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t
  .defaultChecked)
}

function Ks(e, t, n) {
 if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
  var r = t.type;
  if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
  t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t
 }
 n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n)
}

function Yo(e, t, n) {
 (t !== "number" || yl(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n))
}
var rr = Array.isArray;

function Mn(e, t, n, r) {
 if (e = e.options, t) {
  t = {};
  for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
  for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0)
 } else {
  for (n = "" + Bt(n), t = null, l = 0; l < e.length; l++) {
   if (e[l].value === n) {
    e[l].selected = !0, r && (e[l].defaultSelected = !0);
    return
   }
   t !== null || e[l].disabled || (t = e[l])
  }
  t !== null && (t.selected = !0)
 }
}

function Qo(e, t) {
 if (t.dangerouslySetInnerHTML != null) throw Error(R(91));
 return oe({}, t, {
  value: void 0,
  defaultValue: void 0,
  children: "" + e._wrapperState.initialValue
 })
}

function Ws(e, t) {
 var n = t.value;
 if (n == null) {
  if (n = t.children, t = t.defaultValue, n != null) {
   if (t != null) throw Error(R(92));
   if (rr(n)) {
    if (1 < n.length) throw Error(R(93));
    n = n[0]
   }
   t = n
  }
  t == null && (t = ""), n = t
 }
 e._wrapperState = {
  initialValue: Bt(n)
 }
}

function Pu(e, t) {
 var n = Bt(t.value),
  r = Bt(t.defaultValue);
 n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r)
}

function Ys(e) {
 var t = e.textContent;
 t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t)
}

function Tu(e) {
 switch (e) {
  case "svg":
   return "http://www.w3.org/2000/svg";
  case "math":
   return "http://www.w3.org/1998/Math/MathML";
  default:
   return "http://www.w3.org/1999/xhtml"
 }
}

function Go(e, t) {
 return e == null || e === "http://www.w3.org/1999/xhtml" ? Tu(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e
}
var Vr, Mu = function(e) {
 return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
  MSApp.execUnsafeLocalFunction(function() {
   return e(t, n, r, l)
  })
 } : e
}(function(e, t) {
 if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
 else {
  for (Vr = Vr || document.createElement("div"), Vr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Vr.firstChild; e.firstChild;) e.removeChild(e.firstChild);
  for (; t.firstChild;) e.appendChild(t.firstChild)
 }
});

function yr(e, t) {
 if (t) {
  var n = e.firstChild;
  if (n && n === e.lastChild && n.nodeType === 3) {
   n.nodeValue = t;
   return
  }
 }
 e.textContent = t
}
var ar = {
  animationIterationCount: !0,
  aspectRatio: !0,
  borderImageOutset: !0,
  borderImageSlice: !0,
  borderImageWidth: !0,
  boxFlex: !0,
  boxFlexGroup: !0,
  boxOrdinalGroup: !0,
  columnCount: !0,
  columns: !0,
  flex: !0,
  flexGrow: !0,
  flexPositive: !0,
  flexShrink: !0,
  flexNegative: !0,
  flexOrder: !0,
  gridArea: !0,
  gridRow: !0,
  gridRowEnd: !0,
  gridRowSpan: !0,
  gridRowStart: !0,
  gridColumn: !0,
  gridColumnEnd: !0,
  gridColumnSpan: !0,
  gridColumnStart: !0,
  fontWeight: !0,
  lineClamp: !0,
  lineHeight: !0,
  opacity: !0,
  order: !0,
  orphans: !0,
  tabSize: !0,
  widows: !0,
  zIndex: !0,
  zoom: !0,
  fillOpacity: !0,
  floodOpacity: !0,
  stopOpacity: !0,
  strokeDasharray: !0,
  strokeDashoffset: !0,
  strokeMiterlimit: !0,
  strokeOpacity: !0,
  strokeWidth: !0
 },
 Cf = ["Webkit", "ms", "Moz", "O"];
Object.keys(ar).forEach(function(e) {
 Cf.forEach(function(t) {
  t = t + e.charAt(0).toUpperCase() + e.substring(1), ar[t] = ar[e]
 })
});

function Nu(e, t, n) {
 return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || ar.hasOwnProperty(e) && ar[e] ? ("" + t).trim() : t + "px"
}

function $u(e, t) {
 e = e.style;
 for (var n in t)
  if (t.hasOwnProperty(n)) {
   var r = n.indexOf("--") === 0,
    l = Nu(n, t[n], r);
   n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l
  }
}
var Ef = oe({
 menuitem: !0
}, {
 area: !0,
 base: !0,
 br: !0,
 col: !0,
 embed: !0,
 hr: !0,
 img: !0,
 input: !0,
 keygen: !0,
 link: !0,
 meta: !0,
 param: !0,
 source: !0,
 track: !0,
 wbr: !0
});

function Xo(e, t) {
 if (t) {
  if (Ef[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(R(137, e));
  if (t.dangerouslySetInnerHTML != null) {
   if (t.children != null) throw Error(R(60));
   if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(R(61))
  }
  if (t.style != null && typeof t.style != "object") throw Error(R(62))
 }
}

function bo(e, t) {
 if (e.indexOf("-") === -1) return typeof t.is == "string";
 switch (e) {
  case "annotation-xml":
  case "color-profile":
  case "font-face":
  case "font-face-src":
  case "font-face-uri":
  case "font-face-format":
  case "font-face-name":
  case "missing-glyph":
   return !1;
  default:
   return !0
 }
}
var qo = null;

function Wi(e) {
 return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e
}
var Zo = null,
 Nn = null,
 $n = null;

function Qs(e) {
 if (e = Or(e)) {
  if (typeof Zo != "function") throw Error(R(280));
  var t = e.stateNode;
  t && (t = bl(t), Zo(e.stateNode, e.type, t))
 }
}

function Iu(e) {
 Nn ? $n ? $n.push(e) : $n = [e] : Nn = e
}

function ju() {
 if (Nn) {
  var e = Nn,
   t = $n;
  if ($n = Nn = null, Qs(e), t)
   for (e = 0; e < t.length; e++) Qs(t[e])
 }
}

function _u(e, t) {
 return e(t)
}

function Ru() {}
var ho = !1;

function Au(e, t, n) {
 if (ho) return e(t, n);
 ho = !0;
 try {
  return _u(e, t, n)
 } finally {
  ho = !1, (Nn !== null || $n !== null) && (Ru(), ju())
 }
}

function kr(e, t) {
 var n = e.stateNode;
 if (n === null) return null;
 var r = bl(n);
 if (r === null) return null;
 n = r[t];
 e: switch (t) {
  case "onClick":
  case "onClickCapture":
  case "onDoubleClick":
  case "onDoubleClickCapture":
  case "onMouseDown":
  case "onMouseDownCapture":
  case "onMouseMove":
  case "onMouseMoveCapture":
  case "onMouseUp":
  case "onMouseUpCapture":
  case "onMouseEnter":
   (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
   break e;
  default:
   e = !1
 }
 if (e) return null;
 if (n && typeof n != "function") throw Error(R(231, t, typeof n));
 return n
}
var Jo = !1;
if (vt) try {
 var Qn = {};
 Object.defineProperty(Qn, "passive", {
  get: function() {
   Jo = !0
  }
 }), window.addEventListener("test", Qn, Qn), window.removeEventListener("test", Qn, Qn)
} catch {
 Jo = !1
}

function Pf(e, t, n, r, l, o, i, s, a) {
 var h = Array.prototype.slice.call(arguments, 3);
 try {
  t.apply(n, h)
 } catch (d) {
  this.onError(d)
 }
}
var ur = !1,
 kl = null,
 wl = !1,
 ei = null,
 Tf = {
  onError: function(e) {
   ur = !0, kl = e
  }
 };

function Mf(e, t, n, r, l, o, i, s, a) {
 ur = !1, kl = null, Pf.apply(Tf, arguments)
}

function Nf(e, t, n, r, l, o, i, s, a) {
 if (Mf.apply(this, arguments), ur) {
  if (ur) {
   var h = kl;
   ur = !1, kl = null
  } else throw Error(R(198));
  wl || (wl = !0, ei = h)
 }
}

function un(e) {
 var t = e,
  n = e;
 if (e.alternate)
  for (; t.return;) t = t.return;
 else {
  e = t;
  do t = e, t.flags & 4098 && (n = t.return), e = t.return; while (e)
 }
 return t.tag === 3 ? n : null
}

function Du(e) {
 if (e.tag === 13) {
  var t = e.memoizedState;
  if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated
 }
 return null
}

function Gs(e) {
 if (un(e) !== e) throw Error(R(188))
}

function $f(e) {
 var t = e.alternate;
 if (!t) {
  if (t = un(e), t === null) throw Error(R(188));
  return t !== e ? null : e
 }
 for (var n = e, r = t;;) {
  var l = n.return;
  if (l === null) break;
  var o = l.alternate;
  if (o === null) {
   if (r = l.return, r !== null) {
    n = r;
    continue
   }
   break
  }
  if (l.child === o.child) {
   for (o = l.child; o;) {
    if (o === n) return Gs(l), e;
    if (o === r) return Gs(l), t;
    o = o.sibling
   }
   throw Error(R(188))
  }
  if (n.return !== r.return) n = l, r = o;
  else {
   for (var i = !1, s = l.child; s;) {
    if (s === n) {
     i = !0, n = l, r = o;
     break
    }
    if (s === r) {
     i = !0, r = l, n = o;
     break
    }
    s = s.sibling
   }
   if (!i) {
    for (s = o.child; s;) {
     if (s === n) {
      i = !0, n = o, r = l;
      break
     }
     if (s === r) {
      i = !0, r = o, n = l;
      break
     }
     s = s.sibling
    }
    if (!i) throw Error(R(189))
   }
  }
  if (n.alternate !== r) throw Error(R(190))
 }
 if (n.tag !== 3) throw Error(R(188));
 return n.stateNode.current === n ? e : t
}

function zu(e) {
 return e = $f(e), e !== null ? Lu(e) : null
}

function Lu(e) {
 if (e.tag === 5 || e.tag === 6) return e;
 for (e = e.child; e !== null;) {
  var t = Lu(e);
  if (t !== null) return t;
  e = e.sibling
 }
 return null
}
var Ou = Fe.unstable_scheduleCallback,
 Xs = Fe.unstable_cancelCallback,
 If = Fe.unstable_shouldYield,
 jf = Fe.unstable_requestPaint,
 ae = Fe.unstable_now,
 _f = Fe.unstable_getCurrentPriorityLevel,
 Yi = Fe.unstable_ImmediatePriority,
 Uu = Fe.unstable_UserBlockingPriority,
 Sl = Fe.unstable_NormalPriority,
 Rf = Fe.unstable_LowPriority,
 Fu = Fe.unstable_IdlePriority,
 Yl = null,
 at = null;

function Af(e) {
 if (at && typeof at.onCommitFiberRoot == "function") try {
  at.onCommitFiberRoot(Yl, e, void 0, (e.current.flags & 128) === 128)
 } catch {}
}
var tt = Math.clz32 ? Math.clz32 : Lf,
 Df = Math.log,
 zf = Math.LN2;

function Lf(e) {
 return e >>>= 0, e === 0 ? 32 : 31 - (Df(e) / zf | 0) | 0
}
var Kr = 64,
 Wr = 4194304;

function lr(e) {
 switch (e & -e) {
  case 1:
   return 1;
  case 2:
   return 2;
  case 4:
   return 4;
  case 8:
   return 8;
  case 16:
   return 16;
  case 32:
   return 32;
  case 64:
  case 128:
  case 256:
  case 512:
  case 1024:
  case 2048:
  case 4096:
  case 8192:
  case 16384:
  case 32768:
  case 65536:
  case 131072:
  case 262144:
  case 524288:
  case 1048576:
  case 2097152:
   return e & 4194240;
  case 4194304:
  case 8388608:
  case 16777216:
  case 33554432:
  case 67108864:
   return e & 130023424;
  case 134217728:
   return 134217728;
  case 268435456:
   return 268435456;
  case 536870912:
   return 536870912;
  case 1073741824:
   return 1073741824;
  default:
   return e
 }
}

function xl(e, t) {
 var n = e.pendingLanes;
 if (n === 0) return 0;
 var r = 0,
  l = e.suspendedLanes,
  o = e.pingedLanes,
  i = n & 268435455;
 if (i !== 0) {
  var s = i & ~l;
  s !== 0 ? r = lr(s) : (o &= i, o !== 0 && (r = lr(o)))
 } else i = n & ~l, i !== 0 ? r = lr(i) : o !== 0 && (r = lr(o));
 if (r === 0) return 0;
 if (t !== 0 && t !== r && !(t & l) && (l = r & -r, o = t & -t, l >= o || l === 16 && (o & 4194240) !== 0)) return t;
 if (r & 4 && (r |= n & 16), t = e.entangledLanes, t !== 0)
  for (e = e.entanglements, t &= r; 0 < t;) n = 31 - tt(t), l = 1 << n, r |= e[n], t &= ~l;
 return r
}

function Of(e, t) {
 switch (e) {
  case 1:
  case 2:
  case 4:
   return t + 250;
  case 8:
  case 16:
  case 32:
  case 64:
  case 128:
  case 256:
  case 512:
  case 1024:
  case 2048:
  case 4096:
  case 8192:
  case 16384:
  case 32768:
  case 65536:
  case 131072:
  case 262144:
  case 524288:
  case 1048576:
  case 2097152:
   return t + 5e3;
  case 4194304:
  case 8388608:
  case 16777216:
  case 33554432:
  case 67108864:
   return -1;
  case 134217728:
  case 268435456:
  case 536870912:
  case 1073741824:
   return -1;
  default:
   return -1
 }
}

function Uf(e, t) {
 for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o;) {
  var i = 31 - tt(o),
   s = 1 << i,
   a = l[i];
  a === -1 ? (!(s & n) || s & r) && (l[i] = Of(s, t)) : a <= t && (e.expiredLanes |= s), o &= ~s
 }
}

function ti(e) {
 return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
}

function Bu() {
 var e = Kr;
 return Kr <<= 1, !(Kr & 4194240) && (Kr = 64), e
}

function mo(e) {
 for (var t = [], n = 0; 31 > n; n++) t.push(e);
 return t
}

function zr(e, t, n) {
 e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - tt(t), e[t] = n
}

function Ff(e, t) {
 var n = e.pendingLanes & ~t;
 e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
 var r = e.eventTimes;
 for (e = e.expirationTimes; 0 < n;) {
  var l = 31 - tt(n),
   o = 1 << l;
  t[l] = 0, r[l] = -1, e[l] = -1, n &= ~o
 }
}

function Qi(e, t) {
 var n = e.entangledLanes |= t;
 for (e = e.entanglements; n;) {
  var r = 31 - tt(n),
   l = 1 << r;
  l & t | e[r] & t && (e[r] |= t), n &= ~l
 }
}
var q = 0;

function Hu(e) {
 return e &= -e, 1 < e ? 4 < e ? e & 268435455 ? 16 : 536870912 : 4 : 1
}
var Vu, Gi, Ku, Wu, Yu, ni = !1,
 Yr = [],
 _t = null,
 Rt = null,
 At = null,
 wr = new Map,
 Sr = new Map,
 Mt = [],
 Bf =
 "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit"
 .split(" ");

function bs(e, t) {
 switch (e) {
  case "focusin":
  case "focusout":
   _t = null;
   break;
  case "dragenter":
  case "dragleave":
   Rt = null;
   break;
  case "mouseover":
  case "mouseout":
   At = null;
   break;
  case "pointerover":
  case "pointerout":
   wr.delete(t.pointerId);
   break;
  case "gotpointercapture":
  case "lostpointercapture":
   Sr.delete(t.pointerId)
 }
}

function Gn(e, t, n, r, l, o) {
 return e === null || e.nativeEvent !== o ? (e = {
  blockedOn: t,
  domEventName: n,
  eventSystemFlags: r,
  nativeEvent: o,
  targetContainers: [l]
 }, t !== null && (t = Or(t), t !== null && Gi(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e)
}

function Hf(e, t, n, r, l) {
 switch (t) {
  case "focusin":
   return _t = Gn(_t, e, t, n, r, l), !0;
  case "dragenter":
   return Rt = Gn(Rt, e, t, n, r, l), !0;
  case "mouseover":
   return At = Gn(At, e, t, n, r, l), !0;
  case "pointerover":
   var o = l.pointerId;
   return wr.set(o, Gn(wr.get(o) || null, e, t, n, r, l)), !0;
  case "gotpointercapture":
   return o = l.pointerId, Sr.set(o, Gn(Sr.get(o) || null, e, t, n, r, l)), !0
 }
 return !1
}

function Qu(e) {
 var t = bt(e.target);
 if (t !== null) {
  var n = un(t);
  if (n !== null) {
   if (t = n.tag, t === 13) {
    if (t = Du(n), t !== null) {
     e.blockedOn = t, Yu(e.priority, function() {
      Ku(n)
     });
     return
    }
   } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
    e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
    return
   }
  }
 }
 e.blockedOn = null
}

function il(e) {
 if (e.blockedOn !== null) return !1;
 for (var t = e.targetContainers; 0 < t.length;) {
  var n = ri(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
  if (n === null) {
   n = e.nativeEvent;
   var r = new n.constructor(n.type, n);
   qo = r, n.target.dispatchEvent(r), qo = null
  } else return t = Or(n), t !== null && Gi(t), e.blockedOn = n, !1;
  t.shift()
 }
 return !0
}

function qs(e, t, n) {
 il(e) && n.delete(t)
}

function Vf() {
 ni = !1, _t !== null && il(_t) && (_t = null), Rt !== null && il(Rt) && (Rt = null), At !== null && il(At) && (At = null), wr.forEach(qs), Sr.forEach(qs)
}

function Xn(e, t) {
 e.blockedOn === t && (e.blockedOn = null, ni || (ni = !0, Fe.unstable_scheduleCallback(Fe.unstable_NormalPriority, Vf)))
}

function xr(e) {
 function t(l) {
  return Xn(l, e)
 }
 if (0 < Yr.length) {
  Xn(Yr[0], e);
  for (var n = 1; n < Yr.length; n++) {
   var r = Yr[n];
   r.blockedOn === e && (r.blockedOn = null)
  }
 }
 for (_t !== null && Xn(_t, e), Rt !== null && Xn(Rt, e), At !== null && Xn(At, e), wr.forEach(t), Sr.forEach(t), n = 0; n < Mt.length; n++) r = Mt[n], r.blockedOn === e && (r.blockedOn = null);
 for (; 0 < Mt.length && (n = Mt[0], n.blockedOn === null);) Qu(n), n.blockedOn === null && Mt.shift()
}
var In = St.ReactCurrentBatchConfig,
 Cl = !0;

function Kf(e, t, n, r) {
 var l = q,
  o = In.transition;
 In.transition = null;
 try {
  q = 1, Xi(e, t, n, r)
 } finally {
  q = l, In.transition = o
 }
}

function Wf(e, t, n, r) {
 var l = q,
  o = In.transition;
 In.transition = null;
 try {
  q = 4, Xi(e, t, n, r)
 } finally {
  q = l, In.transition = o
 }
}

function Xi(e, t, n, r) {
 if (Cl) {
  var l = ri(e, t, n, r);
  if (l === null) Po(e, t, r, El, n), bs(e, r);
  else if (Hf(l, e, t, n, r)) r.stopPropagation();
  else if (bs(e, r), t & 4 && -1 < Bf.indexOf(e)) {
   for (; l !== null;) {
    var o = Or(l);
    if (o !== null && Vu(o), o = ri(e, t, n, r), o === null && Po(e, t, r, El, n), o === l) break;
    l = o
   }
   l !== null && r.stopPropagation()
  } else Po(e, t, r, null, n)
 }
}
var El = null;

function ri(e, t, n, r) {
 if (El = null, e = Wi(r), e = bt(e), e !== null)
  if (t = un(e), t === null) e = null;
  else if (n = t.tag, n === 13) {
  if (e = Du(t), e !== null) return e;
  e = null
 } else if (n === 3) {
  if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
  e = null
 } else t !== e && (e = null);
 return El = e, null
}

function Gu(e) {
 switch (e) {
  case "cancel":
  case "click":
  case "close":
  case "contextmenu":
  case "copy":
  case "cut":
  case "auxclick":
  case "dblclick":
  case "dragend":
  case "dragstart":
  case "drop":
  case "focusin":
  case "focusout":
  case "input":
  case "invalid":
  case "keydown":
  case "keypress":
  case "keyup":
  case "mousedown":
  case "mouseup":
  case "paste":
  case "pause":
  case "play":
  case "pointercancel":
  case "pointerdown":
  case "pointerup":
  case "ratechange":
  case "reset":
  case "resize":
  case "seeked":
  case "submit":
  case "touchcancel":
  case "touchend":
  case "touchstart":
  case "volumechange":
  case "change":
  case "selectionchange":
  case "textInput":
  case "compositionstart":
  case "compositionend":
  case "compositionupdate":
  case "beforeblur":
  case "afterblur":
  case "beforeinput":
  case "blur":
  case "fullscreenchange":
  case "focus":
  case "hashchange":
  case "popstate":
  case "select":
  case "selectstart":
   return 1;
  case "drag":
  case "dragenter":
  case "dragexit":
  case "dragleave":
  case "dragover":
  case "mousemove":
  case "mouseout":
  case "mouseover":
  case "pointermove":
  case "pointerout":
  case "pointerover":
  case "scroll":
  case "toggle":
  case "touchmove":
  case "wheel":
  case "mouseenter":
  case "mouseleave":
  case "pointerenter":
  case "pointerleave":
   return 4;
  case "message":
   switch (_f()) {
    case Yi:
     return 1;
    case Uu:
     return 4;
    case Sl:
    case Rf:
     return 16;
    case Fu:
     return 536870912;
    default:
     return 16
   }
  default:
   return 16
 }
}
var $t = null,
 bi = null,
 sl = null;

function Xu() {
 if (sl) return sl;
 var e, t = bi,
  n = t.length,
  r, l = "value" in $t ? $t.value : $t.textContent,
  o = l.length;
 for (e = 0; e < n && t[e] === l[e]; e++);
 var i = n - e;
 for (r = 1; r <= i && t[n - r] === l[o - r]; r++);
 return sl = l.slice(e, 1 < r ? 1 - r : void 0)
}

function al(e) {
 var t = e.keyCode;
 return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0
}

function Qr() {
 return !0
}

function Zs() {
 return !1
}

function He(e) {
 function t(n, r, l, o, i) {
  this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = o, this.target = i, this.currentTarget = null;
  for (var s in e) e.hasOwnProperty(s) && (n = e[s], this[s] = n ? n(o) : o[s]);
  return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? Qr : Zs, this.isPropagationStopped = Zs, this
 }
 return oe(t.prototype, {
  preventDefault: function() {
   this.defaultPrevented = !0;
   var n = this.nativeEvent;
   n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Qr)
  },
  stopPropagation: function() {
   var n = this.nativeEvent;
   n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Qr)
  },
  persist: function() {},
  isPersistent: Qr
 }), t
}
var Bn = {
  eventPhase: 0,
  bubbles: 0,
  cancelable: 0,
  timeStamp: function(e) {
   return e.timeStamp || Date.now()
  },
  defaultPrevented: 0,
  isTrusted: 0
 },
 qi = He(Bn),
 Lr = oe({}, Bn, {
  view: 0,
  detail: 0
 }),
 Yf = He(Lr),
 go, vo, bn, Ql = oe({}, Lr, {
  screenX: 0,
  screenY: 0,
  clientX: 0,
  clientY: 0,
  pageX: 0,
  pageY: 0,
  ctrlKey: 0,
  shiftKey: 0,
  altKey: 0,
  metaKey: 0,
  getModifierState: Zi,
  button: 0,
  buttons: 0,
  relatedTarget: function(e) {
   return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget
  },
  movementX: function(e) {
   return "movementX" in e ? e.movementX : (e !== bn && (bn && e.type === "mousemove" ? (go = e.screenX - bn.screenX, vo = e.screenY - bn.screenY) : vo = go = 0, bn = e), go)
  },
  movementY: function(e) {
   return "movementY" in e ? e.movementY : vo
  }
 }),
 Js = He(Ql),
 Qf = oe({}, Ql, {
  dataTransfer: 0
 }),
 Gf = He(Qf),
 Xf = oe({}, Lr, {
  relatedTarget: 0
 }),
 yo = He(Xf),
 bf = oe({}, Bn, {
  animationName: 0,
  elapsedTime: 0,
  pseudoElement: 0
 }),
 qf = He(bf),
 Zf = oe({}, Bn, {
  clipboardData: function(e) {
   return "clipboardData" in e ? e.clipboardData : window.clipboardData
  }
 }),
 Jf = He(Zf),
 e0 = oe({}, Bn, {
  data: 0
 }),
 ea = He(e0),
 t0 = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
 },
 n0 = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
 },
 r0 = {
  Alt: "altKey",
  Control: "ctrlKey",
  Meta: "metaKey",
  Shift: "shiftKey"
 };

function l0(e) {
 var t = this.nativeEvent;
 return t.getModifierState ? t.getModifierState(e) : (e = r0[e]) ? !!t[e] : !1
}

function Zi() {
 return l0
}
var o0 = oe({}, Lr, {
  key: function(e) {
   if (e.key) {
    var t = t0[e.key] || e.key;
    if (t !== "Unidentified") return t
   }
   return e.type === "keypress" ? (e = al(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? n0[e.keyCode] || "Unidentified" : ""
  },
  code: 0,
  location: 0,
  ctrlKey: 0,
  shiftKey: 0,
  altKey: 0,
  metaKey: 0,
  repeat: 0,
  locale: 0,
  getModifierState: Zi,
  charCode: function(e) {
   return e.type === "keypress" ? al(e) : 0
  },
  keyCode: function(e) {
   return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0
  },
  which: function(e) {
   return e.type === "keypress" ? al(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0
  }
 }),
 i0 = He(o0),
 s0 = oe({}, Ql, {
  pointerId: 0,
  width: 0,
  height: 0,
  pressure: 0,
  tangentialPressure: 0,
  tiltX: 0,
  tiltY: 0,
  twist: 0,
  pointerType: 0,
  isPrimary: 0
 }),
 ta = He(s0),
 a0 = oe({}, Lr, {
  touches: 0,
  targetTouches: 0,
  changedTouches: 0,
  altKey: 0,
  metaKey: 0,
  ctrlKey: 0,
  shiftKey: 0,
  getModifierState: Zi
 }),
 u0 = He(a0),
 c0 = oe({}, Bn, {
  propertyName: 0,
  elapsedTime: 0,
  pseudoElement: 0
 }),
 d0 = He(c0),
 f0 = oe({}, Ql, {
  deltaX: function(e) {
   return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0
  },
  deltaY: function(e) {
   return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0
  },
  deltaZ: 0,
  deltaMode: 0
 }),
 p0 = He(f0),
 h0 = [9, 13, 27, 32],
 Ji = vt && "CompositionEvent" in window,
 cr = null;
vt && "documentMode" in document && (cr = document.documentMode);
var m0 = vt && "TextEvent" in window && !cr,
 bu = vt && (!Ji || cr && 8 < cr && 11 >= cr),
 na = " ",
 ra = !1;

function qu(e, t) {
 switch (e) {
  case "keyup":
   return h0.indexOf(t.keyCode) !== -1;
  case "keydown":
   return t.keyCode !== 229;
  case "keypress":
  case "mousedown":
  case "focusout":
   return !0;
  default:
   return !1
 }
}

function Zu(e) {
 return e = e.detail, typeof e == "object" && "data" in e ? e.data : null
}
var gn = !1;

function g0(e, t) {
 switch (e) {
  case "compositionend":
   return Zu(t);
  case "keypress":
   return t.which !== 32 ? null : (ra = !0, na);
  case "textInput":
   return e = t.data, e === na && ra ? null : e;
  default:
   return null
 }
}

function v0(e, t) {
 if (gn) return e === "compositionend" || !Ji && qu(e, t) ? (e = Xu(), sl = bi = $t = null, gn = !1, e) : null;
 switch (e) {
  case "paste":
   return null;
  case "keypress":
   if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
    if (t.char && 1 < t.char.length) return t.char;
    if (t.which) return String.fromCharCode(t.which)
   }
   return null;
  case "compositionend":
   return bu && t.locale !== "ko" ? null : t.data;
  default:
   return null
 }
}
var y0 = {
 color: !0,
 date: !0,
 datetime: !0,
 "datetime-local": !0,
 email: !0,
 month: !0,
 number: !0,
 password: !0,
 range: !0,
 search: !0,
 tel: !0,
 text: !0,
 time: !0,
 url: !0,
 week: !0
};

function la(e) {
 var t = e && e.nodeName && e.nodeName.toLowerCase();
 return t === "input" ? !!y0[e.type] : t === "textarea"
}

function Ju(e, t, n, r) {
 Iu(r), t = Pl(t, "onChange"), 0 < t.length && (n = new qi("onChange", "change", null, n, r), e.push({
  event: n,
  listeners: t
 }))
}
var dr = null,
 Cr = null;

function k0(e) {
 cc(e, 0)
}

function Gl(e) {
 var t = kn(e);
 if (Cu(t)) return e
}

function w0(e, t) {
 if (e === "change") return t
}
var ec = !1;
if (vt) {
 var ko;
 if (vt) {
  var wo = "oninput" in document;
  if (!wo) {
   var oa = document.createElement("div");
   oa.setAttribute("oninput", "return;"), wo = typeof oa.oninput == "function"
  }
  ko = wo
 } else ko = !1;
 ec = ko && (!document.documentMode || 9 < document.documentMode)
}

function ia() {
 dr && (dr.detachEvent("onpropertychange", tc), Cr = dr = null)
}

function tc(e) {
 if (e.propertyName === "value" && Gl(Cr)) {
  var t = [];
  Ju(t, Cr, e, Wi(e)), Au(k0, t)
 }
}

function S0(e, t, n) {
 e === "focusin" ? (ia(), dr = t, Cr = n, dr.attachEvent("onpropertychange", tc)) : e === "focusout" && ia()
}

function x0(e) {
 if (e === "selectionchange" || e === "keyup" || e === "keydown") return Gl(Cr)
}

function C0(e, t) {
 if (e === "click") return Gl(t)
}

function E0(e, t) {
 if (e === "input" || e === "change") return Gl(t)
}

function P0(e, t) {
 return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t
}
var rt = typeof Object.is == "function" ? Object.is : P0;

function Er(e, t) {
 if (rt(e, t)) return !0;
 if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
 var n = Object.keys(e),
  r = Object.keys(t);
 if (n.length !== r.length) return !1;
 for (r = 0; r < n.length; r++) {
  var l = n[r];
  if (!Uo.call(t, l) || !rt(e[l], t[l])) return !1
 }
 return !0
}

function sa(e) {
 for (; e && e.firstChild;) e = e.firstChild;
 return e
}

function aa(e, t) {
 var n = sa(e);
 e = 0;
 for (var r; n;) {
  if (n.nodeType === 3) {
   if (r = e + n.textContent.length, e <= t && r >= t) return {
    node: n,
    offset: t - e
   };
   e = r
  }
  e: {
   for (; n;) {
    if (n.nextSibling) {
     n = n.nextSibling;
     break e
    }
    n = n.parentNode
   }
   n = void 0
  }
  n = sa(n)
 }
}

function nc(e, t) {
 return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? nc(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(
  t) & 16) : !1 : !1
}

function rc() {
 for (var e = window, t = yl(); t instanceof e.HTMLIFrameElement;) {
  try {
   var n = typeof t.contentWindow.location.href == "string"
  } catch {
   n = !1
  }
  if (n) e = t.contentWindow;
  else break;
  t = yl(e.document)
 }
 return t
}

function es(e) {
 var t = e && e.nodeName && e.nodeName.toLowerCase();
 return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true")
}

function T0(e) {
 var t = rc(),
  n = e.focusedElem,
  r = e.selectionRange;
 if (t !== n && n && n.ownerDocument && nc(n.ownerDocument.documentElement, n)) {
  if (r !== null && es(n)) {
   if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
   else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
    e = e.getSelection();
    var l = n.textContent.length,
     o = Math.min(r.start, l);
    r = r.end === void 0 ? o : Math.min(r.end, l), !e.extend && o > r && (l = r, r = o, o = l), l = aa(n, o);
    var i = aa(n, r);
    l && i && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== i.node || e.focusOffset !== i.offset) && (t = t.createRange(), t.setStart(l.node, l
     .offset), e.removeAllRanges(), o > r ? (e.addRange(t), e.extend(i.node, i.offset)) : (t.setEnd(i.node, i.offset), e.addRange(t)))
   }
  }
  for (t = [], e = n; e = e.parentNode;) e.nodeType === 1 && t.push({
   element: e,
   left: e.scrollLeft,
   top: e.scrollTop
  });
  for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++) e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top
 }
}
var M0 = vt && "documentMode" in document && 11 >= document.documentMode,
 vn = null,
 li = null,
 fr = null,
 oi = !1;

function ua(e, t, n) {
 var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
 oi || vn == null || vn !== yl(r) || (r = vn, "selectionStart" in r && es(r) ? r = {
  start: r.selectionStart,
  end: r.selectionEnd
 } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
  anchorNode: r.anchorNode,
  anchorOffset: r.anchorOffset,
  focusNode: r.focusNode,
  focusOffset: r.focusOffset
 }), fr && Er(fr, r) || (fr = r, r = Pl(li, "onSelect"), 0 < r.length && (t = new qi("onSelect", "select", null, t, n), e.push({
  event: t,
  listeners: r
 }), t.target = vn)))
}

function Gr(e, t) {
 var n = {};
 return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n
}
var yn = {
  animationend: Gr("Animation", "AnimationEnd"),
  animationiteration: Gr("Animation", "AnimationIteration"),
  animationstart: Gr("Animation", "AnimationStart"),
  transitionend: Gr("Transition", "TransitionEnd")
 },
 So = {},
 lc = {};
vt && (lc = document.createElement("div").style, "AnimationEvent" in window || (delete yn.animationend.animation, delete yn.animationiteration.animation, delete yn.animationstart.animation),
 "TransitionEvent" in window || delete yn.transitionend.transition);

function Xl(e) {
 if (So[e]) return So[e];
 if (!yn[e]) return e;
 var t = yn[e],
  n;
 for (n in t)
  if (t.hasOwnProperty(n) && n in lc) return So[e] = t[n];
 return e
}
var oc = Xl("animationend"),
 ic = Xl("animationiteration"),
 sc = Xl("animationstart"),
 ac = Xl("transitionend"),
 uc = new Map,
 ca =
 "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel"
 .split(" ");

function Vt(e, t) {
 uc.set(e, t), an(t, [e])
}
for (var xo = 0; xo < ca.length; xo++) {
 var Co = ca[xo],
  N0 = Co.toLowerCase(),
  $0 = Co[0].toUpperCase() + Co.slice(1);
 Vt(N0, "on" + $0)
}
Vt(oc, "onAnimationEnd");
Vt(ic, "onAnimationIteration");
Vt(sc, "onAnimationStart");
Vt("dblclick", "onDoubleClick");
Vt("focusin", "onFocus");
Vt("focusout", "onBlur");
Vt(ac, "onTransitionEnd");
Rn("onMouseEnter", ["mouseout", "mouseover"]);
Rn("onMouseLeave", ["mouseout", "mouseover"]);
Rn("onPointerEnter", ["pointerout", "pointerover"]);
Rn("onPointerLeave", ["pointerout", "pointerover"]);
an("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
an("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
an("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
an("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
an("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
an("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var or =
 "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting"
 .split(" "),
 I0 = new Set("cancel close invalid load scroll toggle".split(" ").concat(or));

function da(e, t, n) {
 var r = e.type || "unknown-event";
 e.currentTarget = n, Nf(r, t, void 0, e), e.currentTarget = null
}

function cc(e, t) {
 t = (t & 4) !== 0;
 for (var n = 0; n < e.length; n++) {
  var r = e[n],
   l = r.event;
  r = r.listeners;
  e: {
   var o = void 0;
   if (t)
    for (var i = r.length - 1; 0 <= i; i--) {
     var s = r[i],
      a = s.instance,
      h = s.currentTarget;
     if (s = s.listener, a !== o && l.isPropagationStopped()) break e;
     da(l, s, h), o = a
    } else
     for (i = 0; i < r.length; i++) {
      if (s = r[i], a = s.instance, h = s.currentTarget, s = s.listener, a !== o && l.isPropagationStopped()) break e;
      da(l, s, h), o = a
     }
  }
 }
 if (wl) throw e = ei, wl = !1, ei = null, e
}

function ee(e, t) {
 var n = t[ci];
 n === void 0 && (n = t[ci] = new Set);
 var r = e + "__bubble";
 n.has(r) || (dc(t, e, 2, !1), n.add(r))
}

function Eo(e, t, n) {
 var r = 0;
 t && (r |= 4), dc(n, e, r, t)
}
var Xr = "_reactListening" + Math.random().toString(36).slice(2);

function Pr(e) {
 if (!e[Xr]) {
  e[Xr] = !0, yu.forEach(function(n) {
   n !== "selectionchange" && (I0.has(n) || Eo(n, !1, e), Eo(n, !0, e))
  });
  var t = e.nodeType === 9 ? e : e.ownerDocument;
  t === null || t[Xr] || (t[Xr] = !0, Eo("selectionchange", !1, t))
 }
}

function dc(e, t, n, r) {
 switch (Gu(t)) {
  case 1:
   var l = Kf;
   break;
  case 4:
   l = Wf;
   break;
  default:
   l = Xi
 }
 n = l.bind(null, t, n, e), l = void 0, !Jo || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, {
  capture: !0,
  passive: l
 }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, {
  passive: l
 }) : e.addEventListener(t, n, !1)
}

function Po(e, t, n, r, l) {
 var o = r;
 if (!(t & 1) && !(t & 2) && r !== null) e: for (;;) {
  if (r === null) return;
  var i = r.tag;
  if (i === 3 || i === 4) {
   var s = r.stateNode.containerInfo;
   if (s === l || s.nodeType === 8 && s.parentNode === l) break;
   if (i === 4)
    for (i = r.return; i !== null;) {
     var a = i.tag;
     if ((a === 3 || a === 4) && (a = i.stateNode.containerInfo, a === l || a.nodeType === 8 && a.parentNode === l)) return;
     i = i.return
    }
   for (; s !== null;) {
    if (i = bt(s), i === null) return;
    if (a = i.tag, a === 5 || a === 6) {
     r = o = i;
     continue e
    }
    s = s.parentNode
   }
  }
  r = r.return
 }
 Au(function() {
  var h = o,
   d = Wi(n),
   k = [];
  e: {
   var x = uc.get(e);
   if (x !== void 0) {
    var v = qi,
     N = e;
    switch (e) {
     case "keypress":
      if (al(n) === 0) break e;
     case "keydown":
     case "keyup":
      v = i0;
      break;
     case "focusin":
      N = "focus", v = yo;
      break;
     case "focusout":
      N = "blur", v = yo;
      break;
     case "beforeblur":
     case "afterblur":
      v = yo;
      break;
     case "click":
      if (n.button === 2) break e;
     case "auxclick":
     case "dblclick":
     case "mousedown":
     case "mousemove":
     case "mouseup":
     case "mouseout":
     case "mouseover":
     case "contextmenu":
      v = Js;
      break;
     case "drag":
     case "dragend":
     case "dragenter":
     case "dragexit":
     case "dragleave":
     case "dragover":
     case "dragstart":
     case "drop":
      v = Gf;
      break;
     case "touchcancel":
     case "touchend":
     case "touchmove":
     case "touchstart":
      v = u0;
      break;
     case oc:
     case ic:
     case sc:
      v = qf;
      break;
     case ac:
      v = d0;
      break;
     case "scroll":
      v = Yf;
      break;
     case "wheel":
      v = p0;
      break;
     case "copy":
     case "cut":
     case "paste":
      v = Jf;
      break;
     case "gotpointercapture":
     case "lostpointercapture":
     case "pointercancel":
     case "pointerdown":
     case "pointermove":
     case "pointerout":
     case "pointerover":
     case "pointerup":
      v = ta
    }
    var p = (t & 4) !== 0,
     P = !p && e === "scroll",
     u = p ? x !== null ? x + "Capture" : null : x;
    p = [];
    for (var f = h, c; f !== null;) {
     c = f;
     var y = c.stateNode;
     if (c.tag === 5 && y !== null && (c = y, u !== null && (y = kr(f, u), y != null && p.push(Tr(f, y, c)))), P) break;
     f = f.return
    }
    0 < p.length && (x = new v(x, N, null, n, d), k.push({
     event: x,
     listeners: p
    }))
   }
  }
  if (!(t & 7)) {
   e: {
    if (x = e === "mouseover" || e === "pointerover", v = e === "mouseout" || e === "pointerout", x && n !== qo && (N = n.relatedTarget || n.fromElement) && (bt(N) || N[yt])) break e;
    if ((v || x) && (x = d.window === d ? d : (x = d.ownerDocument) ? x.defaultView || x.parentWindow : window, v ? (N = n.relatedTarget || n.toElement, v = h, N = N ? bt(N) : null, N !== null && (
      P = un(N), N !== P || N.tag !== 5 && N.tag !== 6) && (N = null)) : (v = null, N = h), v !== N)) {
     if (p = Js, y = "onMouseLeave", u = "onMouseEnter", f = "mouse", (e === "pointerout" || e === "pointerover") && (p = ta, y = "onPointerLeave", u = "onPointerEnter", f = "pointer"), P = v ==
      null ? x : kn(v), c = N == null ? x : kn(N), x = new p(y, f + "leave", v, n, d), x.target = P, x.relatedTarget = c, y = null, bt(d) === h && (p = new p(u, f + "enter", N, n, d), p.target = c,
       p.relatedTarget = P, y = p), P = y, v && N) t: {
      for (p = v, u = N, f = 0, c = p; c; c = cn(c)) f++;
      for (c = 0, y = u; y; y = cn(y)) c++;
      for (; 0 < f - c;) p = cn(p),
      f--;
      for (; 0 < c - f;) u = cn(u),
      c--;
      for (; f--;) {
       if (p === u || u !== null && p === u.alternate) break t;
       p = cn(p), u = cn(u)
      }
      p = null
     }
     else p = null;
     v !== null && fa(k, x, v, p, !1), N !== null && P !== null && fa(k, P, N, p, !0)
    }
   }
   e: {
    if (x = h ? kn(h) : window, v = x.nodeName && x.nodeName.toLowerCase(), v === "select" || v === "input" && x.type === "file") var M = w0;
    else if (la(x))
     if (ec) M = E0;
     else {
      M = x0;
      var w = S0
     }
    else(v = x.nodeName) && v.toLowerCase() === "input" && (x.type === "checkbox" || x.type === "radio") && (M = C0);
    if (M && (M = M(e, h))) {
     Ju(k, M, n, d);
     break e
    }
    w && w(e, x, h),
    e === "focusout" && (w = x._wrapperState) && w.controlled && x.type === "number" && Yo(x, "number", x.value)
   }
   switch (w = h ? kn(h) : window, e) {
    case "focusin":
     (la(w) || w.contentEditable === "true") && (vn = w, li = h, fr = null);
     break;
    case "focusout":
     fr = li = vn = null;
     break;
    case "mousedown":
     oi = !0;
     break;
    case "contextmenu":
    case "mouseup":
    case "dragend":
     oi = !1, ua(k, n, d);
     break;
    case "selectionchange":
     if (M0) break;
    case "keydown":
    case "keyup":
     ua(k, n, d)
   }
   var m;
   if (Ji) e: {
    switch (e) {
     case "compositionstart":
      var g = "onCompositionStart";
      break e;
     case "compositionend":
      g = "onCompositionEnd";
      break e;
     case "compositionupdate":
      g = "onCompositionUpdate";
      break e
    }
    g = void 0
   }
   else gn ? qu(e, n) && (g = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (g = "onCompositionStart");g && (bu && n.locale !== "ko" && (gn || g !== "onCompositionStart" ? g ===
    "onCompositionEnd" && gn && (m = Xu()) : ($t = d, bi = "value" in $t ? $t.value : $t.textContent, gn = !0)), w = Pl(h, g), 0 < w.length && (g = new ea(g, e, null, n, d), k.push({
    event: g,
    listeners: w
   }), m ? g.data = m : (m = Zu(n), m !== null && (g.data = m)))),
   (m = m0 ? g0(e, n) : v0(e, n)) && (h = Pl(h, "onBeforeInput"), 0 < h.length && (d = new ea("onBeforeInput", "beforeinput", null, n, d), k.push({
    event: d,
    listeners: h
   }), d.data = m))
  }
  cc(k, t)
 })
}

function Tr(e, t, n) {
 return {
  instance: e,
  listener: t,
  currentTarget: n
 }
}

function Pl(e, t) {
 for (var n = t + "Capture", r = []; e !== null;) {
  var l = e,
   o = l.stateNode;
  l.tag === 5 && o !== null && (l = o, o = kr(e, n), o != null && r.unshift(Tr(e, o, l)), o = kr(e, t), o != null && r.push(Tr(e, o, l))), e = e.return
 }
 return r
}

function cn(e) {
 if (e === null) return null;
 do e = e.return; while (e && e.tag !== 5);
 return e || null
}

function fa(e, t, n, r, l) {
 for (var o = t._reactName, i = []; n !== null && n !== r;) {
  var s = n,
   a = s.alternate,
   h = s.stateNode;
  if (a !== null && a === r) break;
  s.tag === 5 && h !== null && (s = h, l ? (a = kr(n, o), a != null && i.unshift(Tr(n, a, s))) : l || (a = kr(n, o), a != null && i.push(Tr(n, a, s)))), n = n.return
 }
 i.length !== 0 && e.push({
  event: t,
  listeners: i
 })
}
var j0 = /\r\n?/g,
 _0 = /\u0000|\uFFFD/g;

function pa(e) {
 return (typeof e == "string" ? e : "" + e).replace(j0, `
`).replace(_0, "")
}

function br(e, t, n) {
 if (t = pa(t), pa(e) !== t && n) throw Error(R(425))
}

function Tl() {}
var ii = null,
 si = null;

function ai(e, t) {
 return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null &&
  t.dangerouslySetInnerHTML.__html != null
}
var ui = typeof setTimeout == "function" ? setTimeout : void 0,
 R0 = typeof clearTimeout == "function" ? clearTimeout : void 0,
 ha = typeof Promise == "function" ? Promise : void 0,
 A0 = typeof queueMicrotask == "function" ? queueMicrotask : typeof ha < "u" ? function(e) {
  return ha.resolve(null).then(e).catch(D0)
 } : ui;

function D0(e) {
 setTimeout(function() {
  throw e
 })
}

function To(e, t) {
 var n = t,
  r = 0;
 do {
  var l = n.nextSibling;
  if (e.removeChild(n), l && l.nodeType === 8)
   if (n = l.data, n === "/$") {
    if (r === 0) {
     e.removeChild(l), xr(t);
     return
    }
    r--
   } else n !== "$" && n !== "$?" && n !== "$!" || r++;
  n = l
 } while (n);
 xr(t)
}

function Dt(e) {
 for (; e != null; e = e.nextSibling) {
  var t = e.nodeType;
  if (t === 1 || t === 3) break;
  if (t === 8) {
   if (t = e.data, t === "$" || t === "$!" || t === "$?") break;
   if (t === "/$") return null
  }
 }
 return e
}

function ma(e) {
 e = e.previousSibling;
 for (var t = 0; e;) {
  if (e.nodeType === 8) {
   var n = e.data;
   if (n === "$" || n === "$!" || n === "$?") {
    if (t === 0) return e;
    t--
   } else n === "/$" && t++
  }
  e = e.previousSibling
 }
 return null
}
var Hn = Math.random().toString(36).slice(2),
 it = "__reactFiber$" + Hn,
 Mr = "__reactProps$" + Hn,
 yt = "__reactContainer$" + Hn,
 ci = "__reactEvents$" + Hn,
 z0 = "__reactListeners$" + Hn,
 L0 = "__reactHandles$" + Hn;

function bt(e) {
 var t = e[it];
 if (t) return t;
 for (var n = e.parentNode; n;) {
  if (t = n[yt] || n[it]) {
   if (n = t.alternate, t.child !== null || n !== null && n.child !== null)
    for (e = ma(e); e !== null;) {
     if (n = e[it]) return n;
     e = ma(e)
    }
   return t
  }
  e = n, n = e.parentNode
 }
 return null
}

function Or(e) {
 return e = e[it] || e[yt], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e
}

function kn(e) {
 if (e.tag === 5 || e.tag === 6) return e.stateNode;
 throw Error(R(33))
}

function bl(e) {
 return e[Mr] || null
}
var di = [],
 wn = -1;

function Kt(e) {
 return {
  current: e
 }
}

function te(e) {
 0 > wn || (e.current = di[wn], di[wn] = null, wn--)
}

function J(e, t) {
 wn++, di[wn] = e.current, e.current = t
}
var Ht = {},
 Ee = Kt(Ht),
 Ae = Kt(!1),
 nn = Ht;

function An(e, t) {
 var n = e.type.contextTypes;
 if (!n) return Ht;
 var r = e.stateNode;
 if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
 var l = {},
  o;
 for (o in n) l[o] = t[o];
 return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l
}

function De(e) {
 return e = e.childContextTypes, e != null
}

function Ml() {
 te(Ae), te(Ee)
}

function ga(e, t, n) {
 if (Ee.current !== Ht) throw Error(R(168));
 J(Ee, t), J(Ae, n)
}

function fc(e, t, n) {
 var r = e.stateNode;
 if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
 r = r.getChildContext();
 for (var l in r)
  if (!(l in t)) throw Error(R(108, Sf(e) || "Unknown", l));
 return oe({}, n, r)
}

function Nl(e) {
 return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Ht, nn = Ee.current, J(Ee, e), J(Ae, Ae.current), !0
}

function va(e, t, n) {
 var r = e.stateNode;
 if (!r) throw Error(R(169));
 n ? (e = fc(e, t, nn), r.__reactInternalMemoizedMergedChildContext = e, te(Ae), te(Ee), J(Ee, e)) : te(Ae), J(Ae, n)
}
var pt = null,
 ql = !1,
 Mo = !1;

function pc(e) {
 pt === null ? pt = [e] : pt.push(e)
}

function O0(e) {
 ql = !0, pc(e)
}

function Wt() {
 if (!Mo && pt !== null) {
  Mo = !0;
  var e = 0,
   t = q;
  try {
   var n = pt;
   for (q = 1; e < n.length; e++) {
    var r = n[e];
    do r = r(!0); while (r !== null)
   }
   pt = null, ql = !1
  } catch (l) {
   throw pt !== null && (pt = pt.slice(e + 1)), Ou(Yi, Wt), l
  } finally {
   q = t, Mo = !1
  }
 }
 return null
}
var Sn = [],
 xn = 0,
 $l = null,
 Il = 0,
 Ve = [],
 Ke = 0,
 rn = null,
 ht = 1,
 mt = "";

function Gt(e, t) {
 Sn[xn++] = Il, Sn[xn++] = $l, $l = e, Il = t
}

function hc(e, t, n) {
 Ve[Ke++] = ht, Ve[Ke++] = mt, Ve[Ke++] = rn, rn = e;
 var r = ht;
 e = mt;
 var l = 32 - tt(r) - 1;
 r &= ~(1 << l), n += 1;
 var o = 32 - tt(t) + l;
 if (30 < o) {
  var i = l - l % 5;
  o = (r & (1 << i) - 1).toString(32), r >>= i, l -= i, ht = 1 << 32 - tt(t) + l | n << l | r, mt = o + e
 } else ht = 1 << o | n << l | r, mt = e
}

function ts(e) {
 e.return !== null && (Gt(e, 1), hc(e, 1, 0))
}

function ns(e) {
 for (; e === $l;) $l = Sn[--xn], Sn[xn] = null, Il = Sn[--xn], Sn[xn] = null;
 for (; e === rn;) rn = Ve[--Ke], Ve[Ke] = null, mt = Ve[--Ke], Ve[Ke] = null, ht = Ve[--Ke], Ve[Ke] = null
}
var Ue = null,
 Oe = null,
 ne = !1,
 et = null;

function mc(e, t) {
 var n = We(5, null, null, 0);
 n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n)
}

function ya(e, t) {
 switch (e.tag) {
  case 5:
   var n = e.type;
   return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, Ue = e, Oe = Dt(t.firstChild), !0) : !1;
  case 6:
   return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, Ue = e, Oe = null, !0) : !1;
  case 13:
   return t = t.nodeType !== 8 ? null : t, t !== null ? (n = rn !== null ? {
    id: ht,
    overflow: mt
   } : null, e.memoizedState = {
    dehydrated: t,
    treeContext: n,
    retryLane: 1073741824
   }, n = We(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, Ue = e, Oe = null, !0) : !1;
  default:
   return !1
 }
}

function fi(e) {
 return (e.mode & 1) !== 0 && (e.flags & 128) === 0
}

function pi(e) {
 if (ne) {
  var t = Oe;
  if (t) {
   var n = t;
   if (!ya(e, t)) {
    if (fi(e)) throw Error(R(418));
    t = Dt(n.nextSibling);
    var r = Ue;
    t && ya(e, t) ? mc(r, n) : (e.flags = e.flags & -4097 | 2, ne = !1, Ue = e)
   }
  } else {
   if (fi(e)) throw Error(R(418));
   e.flags = e.flags & -4097 | 2, ne = !1, Ue = e
  }
 }
}

function ka(e) {
 for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13;) e = e.return;
 Ue = e
}

function qr(e) {
 if (e !== Ue) return !1;
 if (!ne) return ka(e), ne = !0, !1;
 var t;
 if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !ai(e.type, e.memoizedProps)), t && (t = Oe)) {
  if (fi(e)) throw gc(), Error(R(418));
  for (; t;) mc(e, t), t = Dt(t.nextSibling)
 }
 if (ka(e), e.tag === 13) {
  if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(R(317));
  e: {
   for (e = e.nextSibling, t = 0; e;) {
    if (e.nodeType === 8) {
     var n = e.data;
     if (n === "/$") {
      if (t === 0) {
       Oe = Dt(e.nextSibling);
       break e
      }
      t--
     } else n !== "$" && n !== "$!" && n !== "$?" || t++
    }
    e = e.nextSibling
   }
   Oe = null
  }
 } else Oe = Ue ? Dt(e.stateNode.nextSibling) : null;
 return !0
}

function gc() {
 for (var e = Oe; e;) e = Dt(e.nextSibling)
}

function Dn() {
 Oe = Ue = null, ne = !1
}

function rs(e) {
 et === null ? et = [e] : et.push(e)
}
var U0 = St.ReactCurrentBatchConfig;

function qn(e, t, n) {
 if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
  if (n._owner) {
   if (n = n._owner, n) {
    if (n.tag !== 1) throw Error(R(309));
    var r = n.stateNode
   }
   if (!r) throw Error(R(147, e));
   var l = r,
    o = "" + e;
   return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === o ? t.ref : (t = function(i) {
    var s = l.refs;
    i === null ? delete s[o] : s[o] = i
   }, t._stringRef = o, t)
  }
  if (typeof e != "string") throw Error(R(284));
  if (!n._owner) throw Error(R(290, e))
 }
 return e
}

function Zr(e, t) {
 throw e = Object.prototype.toString.call(t), Error(R(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e))
}

function wa(e) {
 var t = e._init;
 return t(e._payload)
}

function vc(e) {
 function t(u, f) {
  if (e) {
   var c = u.deletions;
   c === null ? (u.deletions = [f], u.flags |= 16) : c.push(f)
  }
 }

 function n(u, f) {
  if (!e) return null;
  for (; f !== null;) t(u, f), f = f.sibling;
  return null
 }

 function r(u, f) {
  for (u = new Map; f !== null;) f.key !== null ? u.set(f.key, f) : u.set(f.index, f), f = f.sibling;
  return u
 }

 function l(u, f) {
  return u = Ut(u, f), u.index = 0, u.sibling = null, u
 }

 function o(u, f, c) {
  return u.index = c, e ? (c = u.alternate, c !== null ? (c = c.index, c < f ? (u.flags |= 2, f) : c) : (u.flags |= 2, f)) : (u.flags |= 1048576, f)
 }

 function i(u) {
  return e && u.alternate === null && (u.flags |= 2), u
 }

 function s(u, f, c, y) {
  return f === null || f.tag !== 6 ? (f = Ao(c, u.mode, y), f.return = u, f) : (f = l(f, c), f.return = u, f)
 }

 function a(u, f, c, y) {
  var M = c.type;
  return M === mn ? d(u, f, c.props.children, y, c.key) : f !== null && (f.elementType === M || typeof M == "object" && M !== null && M.$$typeof === Pt && wa(M) === f.type) ? (y = l(f, c.props), y
   .ref = qn(u, f, c), y.return = u, y) : (y = ml(c.type, c.key, c.props, null, u.mode, y), y.ref = qn(u, f, c), y.return = u, y)
 }

 function h(u, f, c, y) {
  return f === null || f.tag !== 4 || f.stateNode.containerInfo !== c.containerInfo || f.stateNode.implementation !== c.implementation ? (f = Do(c, u.mode, y), f.return = u, f) : (f = l(f, c
   .children || []), f.return = u, f)
 }

 function d(u, f, c, y, M) {
  return f === null || f.tag !== 7 ? (f = en(c, u.mode, y, M), f.return = u, f) : (f = l(f, c), f.return = u, f)
 }

 function k(u, f, c) {
  if (typeof f == "string" && f !== "" || typeof f == "number") return f = Ao("" + f, u.mode, c), f.return = u, f;
  if (typeof f == "object" && f !== null) {
   switch (f.$$typeof) {
    case Br:
     return c = ml(f.type, f.key, f.props, null, u.mode, c), c.ref = qn(u, null, f), c.return = u, c;
    case hn:
     return f = Do(f, u.mode, c), f.return = u, f;
    case Pt:
     var y = f._init;
     return k(u, y(f._payload), c)
   }
   if (rr(f) || Yn(f)) return f = en(f, u.mode, c, null), f.return = u, f;
   Zr(u, f)
  }
  return null
 }

 function x(u, f, c, y) {
  var M = f !== null ? f.key : null;
  if (typeof c == "string" && c !== "" || typeof c == "number") return M !== null ? null : s(u, f, "" + c, y);
  if (typeof c == "object" && c !== null) {
   switch (c.$$typeof) {
    case Br:
     return c.key === M ? a(u, f, c, y) : null;
    case hn:
     return c.key === M ? h(u, f, c, y) : null;
    case Pt:
     return M = c._init, x(u, f, M(c._payload), y)
   }
   if (rr(c) || Yn(c)) return M !== null ? null : d(u, f, c, y, null);
   Zr(u, c)
  }
  return null
 }

 function v(u, f, c, y, M) {
  if (typeof y == "string" && y !== "" || typeof y == "number") return u = u.get(c) || null, s(f, u, "" + y, M);
  if (typeof y == "object" && y !== null) {
   switch (y.$$typeof) {
    case Br:
     return u = u.get(y.key === null ? c : y.key) || null, a(f, u, y, M);
    case hn:
     return u = u.get(y.key === null ? c : y.key) || null, h(f, u, y, M);
    case Pt:
     var w = y._init;
     return v(u, f, c, w(y._payload), M)
   }
   if (rr(y) || Yn(y)) return u = u.get(c) || null, d(f, u, y, M, null);
   Zr(f, y)
  }
  return null
 }

 function N(u, f, c, y) {
  for (var M = null, w = null, m = f, g = f = 0, T = null; m !== null && g < c.length; g++) {
   m.index > g ? (T = m, m = null) : T = m.sibling;
   var j = x(u, m, c[g], y);
   if (j === null) {
    m === null && (m = T);
    break
   }
   e && m && j.alternate === null && t(u, m), f = o(j, f, g), w === null ? M = j : w.sibling = j, w = j, m = T
  }
  if (g === c.length) return n(u, m), ne && Gt(u, g), M;
  if (m === null) {
   for (; g < c.length; g++) m = k(u, c[g], y), m !== null && (f = o(m, f, g), w === null ? M = m : w.sibling = m, w = m);
   return ne && Gt(u, g), M
  }
  for (m = r(u, m); g < c.length; g++) T = v(m, u, g, c[g], y), T !== null && (e && T.alternate !== null && m.delete(T.key === null ? g : T.key), f = o(T, f, g), w === null ? M = T : w.sibling = T,
   w = T);
  return e && m.forEach(function(O) {
   return t(u, O)
  }), ne && Gt(u, g), M
 }

 function p(u, f, c, y) {
  var M = Yn(c);
  if (typeof M != "function") throw Error(R(150));
  if (c = M.call(c), c == null) throw Error(R(151));
  for (var w = M = null, m = f, g = f = 0, T = null, j = c.next(); m !== null && !j.done; g++, j = c.next()) {
   m.index > g ? (T = m, m = null) : T = m.sibling;
   var O = x(u, m, j.value, y);
   if (O === null) {
    m === null && (m = T);
    break
   }
   e && m && O.alternate === null && t(u, m), f = o(O, f, g), w === null ? M = O : w.sibling = O, w = O, m = T
  }
  if (j.done) return n(u, m), ne && Gt(u, g), M;
  if (m === null) {
   for (; !j.done; g++, j = c.next()) j = k(u, j.value, y), j !== null && (f = o(j, f, g), w === null ? M = j : w.sibling = j, w = j);
   return ne && Gt(u, g), M
  }
  for (m = r(u, m); !j.done; g++, j = c.next()) j = v(m, u, g, j.value, y), j !== null && (e && j.alternate !== null && m.delete(j.key === null ? g : j.key), f = o(j, f, g), w === null ? M = j : w
   .sibling = j, w = j);
  return e && m.forEach(function(F) {
   return t(u, F)
  }), ne && Gt(u, g), M
 }

 function P(u, f, c, y) {
  if (typeof c == "object" && c !== null && c.type === mn && c.key === null && (c = c.props.children), typeof c == "object" && c !== null) {
   switch (c.$$typeof) {
    case Br:
     e: {
      for (var M = c.key, w = f; w !== null;) {
       if (w.key === M) {
        if (M = c.type, M === mn) {
         if (w.tag === 7) {
          n(u, w.sibling), f = l(w, c.props.children), f.return = u, u = f;
          break e
         }
        } else if (w.elementType === M || typeof M == "object" && M !== null && M.$$typeof === Pt && wa(M) === w.type) {
         n(u, w.sibling), f = l(w, c.props), f.ref = qn(u, w, c), f.return = u, u = f;
         break e
        }
        n(u, w);
        break
       } else t(u, w);
       w = w.sibling
      }
      c.type === mn ? (f = en(c.props.children, u.mode, y, c.key), f.return = u, u = f) : (y = ml(c.type, c.key, c.props, null, u.mode, y), y.ref = qn(u, f, c), y.return = u, u = y)
     }
     return i(u);
    case hn:
     e: {
      for (w = c.key; f !== null;) {
       if (f.key === w)
        if (f.tag === 4 && f.stateNode.containerInfo === c.containerInfo && f.stateNode.implementation === c.implementation) {
         n(u, f.sibling), f = l(f, c.children || []), f.return = u, u = f;
         break e
        } else {
         n(u, f);
         break
        }
       else t(u, f);
       f = f.sibling
      }
      f = Do(c, u.mode, y),
      f.return = u,
      u = f
     }
     return i(u);
    case Pt:
     return w = c._init, P(u, f, w(c._payload), y)
   }
   if (rr(c)) return N(u, f, c, y);
   if (Yn(c)) return p(u, f, c, y);
   Zr(u, c)
  }
  return typeof c == "string" && c !== "" || typeof c == "number" ? (c = "" + c, f !== null && f.tag === 6 ? (n(u, f.sibling), f = l(f, c), f.return = u, u = f) : (n(u, f), f = Ao(c, u.mode, y), f
   .return = u, u = f), i(u)) : n(u, f)
 }
 return P
}
var zn = vc(!0),
 yc = vc(!1),
 jl = Kt(null),
 _l = null,
 Cn = null,
 ls = null;

function os() {
 ls = Cn = _l = null
}

function is(e) {
 var t = jl.current;
 te(jl), e._currentValue = t
}

function hi(e, t, n) {
 for (; e !== null;) {
  var r = e.alternate;
  if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
  e = e.return
 }
}

function jn(e, t) {
 _l = e, ls = Cn = null, e = e.dependencies, e !== null && e.firstContext !== null && (e.lanes & t && (Re = !0), e.firstContext = null)
}

function Qe(e) {
 var t = e._currentValue;
 if (ls !== e)
  if (e = {
    context: e,
    memoizedValue: t,
    next: null
   }, Cn === null) {
   if (_l === null) throw Error(R(308));
   Cn = e, _l.dependencies = {
    lanes: 0,
    firstContext: e
   }
  } else Cn = Cn.next = e;
 return t
}
var qt = null;

function ss(e) {
 qt === null ? qt = [e] : qt.push(e)
}

function kc(e, t, n, r) {
 var l = t.interleaved;
 return l === null ? (n.next = n, ss(t)) : (n.next = l.next, l.next = n), t.interleaved = n, kt(e, r)
}

function kt(e, t) {
 e.lanes |= t;
 var n = e.alternate;
 for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null;) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
 return n.tag === 3 ? n.stateNode : null
}
var Tt = !1;

function as(e) {
 e.updateQueue = {
  baseState: e.memoizedState,
  firstBaseUpdate: null,
  lastBaseUpdate: null,
  shared: {
   pending: null,
   interleaved: null,
   lanes: 0
  },
  effects: null
 }
}

function wc(e, t) {
 e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
  baseState: e.baseState,
  firstBaseUpdate: e.firstBaseUpdate,
  lastBaseUpdate: e.lastBaseUpdate,
  shared: e.shared,
  effects: e.effects
 })
}

function gt(e, t) {
 return {
  eventTime: e,
  lane: t,
  tag: 0,
  payload: null,
  callback: null,
  next: null
 }
}

function zt(e, t, n) {
 var r = e.updateQueue;
 if (r === null) return null;
 if (r = r.shared, G & 2) {
  var l = r.pending;
  return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, kt(e, n)
 }
 return l = r.interleaved, l === null ? (t.next = t, ss(r)) : (t.next = l.next, l.next = t), r.interleaved = t, kt(e, n)
}

function ul(e, t, n) {
 if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
  var r = t.lanes;
  r &= e.pendingLanes, n |= r, t.lanes = n, Qi(e, n)
 }
}

function Sa(e, t) {
 var n = e.updateQueue,
  r = e.alternate;
 if (r !== null && (r = r.updateQueue, n === r)) {
  var l = null,
   o = null;
  if (n = n.firstBaseUpdate, n !== null) {
   do {
    var i = {
     eventTime: n.eventTime,
     lane: n.lane,
     tag: n.tag,
     payload: n.payload,
     callback: n.callback,
     next: null
    };
    o === null ? l = o = i : o = o.next = i, n = n.next
   } while (n !== null);
   o === null ? l = o = t : o = o.next = t
  } else l = o = t;
  n = {
   baseState: r.baseState,
   firstBaseUpdate: l,
   lastBaseUpdate: o,
   shared: r.shared,
   effects: r.effects
  }, e.updateQueue = n;
  return
 }
 e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t
}

function Rl(e, t, n, r) {
 var l = e.updateQueue;
 Tt = !1;
 var o = l.firstBaseUpdate,
  i = l.lastBaseUpdate,
  s = l.shared.pending;
 if (s !== null) {
  l.shared.pending = null;
  var a = s,
   h = a.next;
  a.next = null, i === null ? o = h : i.next = h, i = a;
  var d = e.alternate;
  d !== null && (d = d.updateQueue, s = d.lastBaseUpdate, s !== i && (s === null ? d.firstBaseUpdate = h : s.next = h, d.lastBaseUpdate = a))
 }
 if (o !== null) {
  var k = l.baseState;
  i = 0, d = h = a = null, s = o;
  do {
   var x = s.lane,
    v = s.eventTime;
   if ((r & x) === x) {
    d !== null && (d = d.next = {
     eventTime: v,
     lane: 0,
     tag: s.tag,
     payload: s.payload,
     callback: s.callback,
     next: null
    });
    e: {
     var N = e,
      p = s;
     switch (x = t, v = n, p.tag) {
      case 1:
       if (N = p.payload, typeof N == "function") {
        k = N.call(v, k, x);
        break e
       }
       k = N;
       break e;
      case 3:
       N.flags = N.flags & -65537 | 128;
      case 0:
       if (N = p.payload, x = typeof N == "function" ? N.call(v, k, x) : N, x == null) break e;
       k = oe({}, k, x);
       break e;
      case 2:
       Tt = !0
     }
    }
    s.callback !== null && s.lane !== 0 && (e.flags |= 64, x = l.effects, x === null ? l.effects = [s] : x.push(s))
   } else v = {
    eventTime: v,
    lane: x,
    tag: s.tag,
    payload: s.payload,
    callback: s.callback,
    next: null
   }, d === null ? (h = d = v, a = k) : d = d.next = v, i |= x;
   if (s = s.next, s === null) {
    if (s = l.shared.pending, s === null) break;
    x = s, s = x.next, x.next = null, l.lastBaseUpdate = x, l.shared.pending = null
   }
  } while (!0);
  if (d === null && (a = k), l.baseState = a, l.firstBaseUpdate = h, l.lastBaseUpdate = d, t = l.shared.interleaved, t !== null) {
   l = t;
   do i |= l.lane, l = l.next; while (l !== t)
  } else o === null && (l.shared.lanes = 0);
  on |= i, e.lanes = i, e.memoizedState = k
 }
}

function xa(e, t, n) {
 if (e = t.effects, t.effects = null, e !== null)
  for (t = 0; t < e.length; t++) {
   var r = e[t],
    l = r.callback;
   if (l !== null) {
    if (r.callback = null, r = n, typeof l != "function") throw Error(R(191, l));
    l.call(r)
   }
  }
}
var Ur = {},
 ut = Kt(Ur),
 Nr = Kt(Ur),
 $r = Kt(Ur);

function Zt(e) {
 if (e === Ur) throw Error(R(174));
 return e
}

function us(e, t) {
 switch (J($r, t), J(Nr, e), J(ut, Ur), e = t.nodeType, e) {
  case 9:
  case 11:
   t = (t = t.documentElement) ? t.namespaceURI : Go(null, "");
   break;
  default:
   e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Go(t, e)
 }
 te(ut), J(ut, t)
}

function Ln() {
 te(ut), te(Nr), te($r)
}

function Sc(e) {
 Zt($r.current);
 var t = Zt(ut.current),
  n = Go(t, e.type);
 t !== n && (J(Nr, e), J(ut, n))
}

function cs(e) {
 Nr.current === e && (te(ut), te(Nr))
}
var re = Kt(0);

function Al(e) {
 for (var t = e; t !== null;) {
  if (t.tag === 13) {
   var n = t.memoizedState;
   if (n !== null && (n = n.dehydrated, n === null || n.data === "$?" || n.data === "$!")) return t
  } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
   if (t.flags & 128) return t
  } else if (t.child !== null) {
   t.child.return = t, t = t.child;
   continue
  }
  if (t === e) break;
  for (; t.sibling === null;) {
   if (t.return === null || t.return === e) return null;
   t = t.return
  }
  t.sibling.return = t.return, t = t.sibling
 }
 return null
}
var No = [];

function ds() {
 for (var e = 0; e < No.length; e++) No[e]._workInProgressVersionPrimary = null;
 No.length = 0
}
var cl = St.ReactCurrentDispatcher,
 $o = St.ReactCurrentBatchConfig,
 ln = 0,
 le = null,
 de = null,
 he = null,
 Dl = !1,
 pr = !1,
 Ir = 0,
 F0 = 0;

function we() {
 throw Error(R(321))
}

function fs(e, t) {
 if (t === null) return !1;
 for (var n = 0; n < t.length && n < e.length; n++)
  if (!rt(e[n], t[n])) return !1;
 return !0
}

function ps(e, t, n, r, l, o) {
 if (ln = o, le = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, cl.current = e === null || e.memoizedState === null ? K0 : W0, e = n(r, l), pr) {
  o = 0;
  do {
   if (pr = !1, Ir = 0, 25 <= o) throw Error(R(301));
   o += 1, he = de = null, t.updateQueue = null, cl.current = Y0, e = n(r, l)
  } while (pr)
 }
 if (cl.current = zl, t = de !== null && de.next !== null, ln = 0, he = de = le = null, Dl = !1, t) throw Error(R(300));
 return e
}

function hs() {
 var e = Ir !== 0;
 return Ir = 0, e
}

function ot() {
 var e = {
  memoizedState: null,
  baseState: null,
  baseQueue: null,
  queue: null,
  next: null
 };
 return he === null ? le.memoizedState = he = e : he = he.next = e, he
}

function Ge() {
 if (de === null) {
  var e = le.alternate;
  e = e !== null ? e.memoizedState : null
 } else e = de.next;
 var t = he === null ? le.memoizedState : he.next;
 if (t !== null) he = t, de = e;
 else {
  if (e === null) throw Error(R(310));
  de = e, e = {
   memoizedState: de.memoizedState,
   baseState: de.baseState,
   baseQueue: de.baseQueue,
   queue: de.queue,
   next: null
  }, he === null ? le.memoizedState = he = e : he = he.next = e
 }
 return he
}

function jr(e, t) {
 return typeof t == "function" ? t(e) : t
}

function Io(e) {
 var t = Ge(),
  n = t.queue;
 if (n === null) throw Error(R(311));
 n.lastRenderedReducer = e;
 var r = de,
  l = r.baseQueue,
  o = n.pending;
 if (o !== null) {
  if (l !== null) {
   var i = l.next;
   l.next = o.next, o.next = i
  }
  r.baseQueue = l = o, n.pending = null
 }
 if (l !== null) {
  o = l.next, r = r.baseState;
  var s = i = null,
   a = null,
   h = o;
  do {
   var d = h.lane;
   if ((ln & d) === d) a !== null && (a = a.next = {
    lane: 0,
    action: h.action,
    hasEagerState: h.hasEagerState,
    eagerState: h.eagerState,
    next: null
   }), r = h.hasEagerState ? h.eagerState : e(r, h.action);
   else {
    var k = {
     lane: d,
     action: h.action,
     hasEagerState: h.hasEagerState,
     eagerState: h.eagerState,
     next: null
    };
    a === null ? (s = a = k, i = r) : a = a.next = k, le.lanes |= d, on |= d
   }
   h = h.next
  } while (h !== null && h !== o);
  a === null ? i = r : a.next = s, rt(r, t.memoizedState) || (Re = !0), t.memoizedState = r, t.baseState = i, t.baseQueue = a, n.lastRenderedState = r
 }
 if (e = n.interleaved, e !== null) {
  l = e;
  do o = l.lane, le.lanes |= o, on |= o, l = l.next; while (l !== e)
 } else l === null && (n.lanes = 0);
 return [t.memoizedState, n.dispatch]
}

function jo(e) {
 var t = Ge(),
  n = t.queue;
 if (n === null) throw Error(R(311));
 n.lastRenderedReducer = e;
 var r = n.dispatch,
  l = n.pending,
  o = t.memoizedState;
 if (l !== null) {
  n.pending = null;
  var i = l = l.next;
  do o = e(o, i.action), i = i.next; while (i !== l);
  rt(o, t.memoizedState) || (Re = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o
 }
 return [o, r]
}

function xc() {}

function Cc(e, t) {
 var n = le,
  r = Ge(),
  l = t(),
  o = !rt(r.memoizedState, l);
 if (o && (r.memoizedState = l, Re = !0), r = r.queue, ms(Tc.bind(null, n, r, e), [e]), r.getSnapshot !== t || o || he !== null && he.memoizedState.tag & 1) {
  if (n.flags |= 2048, _r(9, Pc.bind(null, n, r, l, t), void 0, null), ge === null) throw Error(R(349));
  ln & 30 || Ec(n, t, l)
 }
 return l
}

function Ec(e, t, n) {
 e.flags |= 16384, e = {
  getSnapshot: t,
  value: n
 }, t = le.updateQueue, t === null ? (t = {
  lastEffect: null,
  stores: null
 }, le.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e))
}

function Pc(e, t, n, r) {
 t.value = n, t.getSnapshot = r, Mc(t) && Nc(e)
}

function Tc(e, t, n) {
 return n(function() {
  Mc(t) && Nc(e)
 })
}

function Mc(e) {
 var t = e.getSnapshot;
 e = e.value;
 try {
  var n = t();
  return !rt(e, n)
 } catch {
  return !0
 }
}

function Nc(e) {
 var t = kt(e, 1);
 t !== null && nt(t, e, 1, -1)
}

function Ca(e) {
 var t = ot();
 return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = {
  pending: null,
  interleaved: null,
  lanes: 0,
  dispatch: null,
  lastRenderedReducer: jr,
  lastRenderedState: e
 }, t.queue = e, e = e.dispatch = V0.bind(null, le, e), [t.memoizedState, e]
}

function _r(e, t, n, r) {
 return e = {
  tag: e,
  create: t,
  destroy: n,
  deps: r,
  next: null
 }, t = le.updateQueue, t === null ? (t = {
  lastEffect: null,
  stores: null
 }, le.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e
}

function $c() {
 return Ge().memoizedState
}

function dl(e, t, n, r) {
 var l = ot();
 le.flags |= e, l.memoizedState = _r(1 | t, n, void 0, r === void 0 ? null : r)
}

function Zl(e, t, n, r) {
 var l = Ge();
 r = r === void 0 ? null : r;
 var o = void 0;
 if (de !== null) {
  var i = de.memoizedState;
  if (o = i.destroy, r !== null && fs(r, i.deps)) {
   l.memoizedState = _r(t, n, o, r);
   return
  }
 }
 le.flags |= e, l.memoizedState = _r(1 | t, n, o, r)
}

function Ea(e, t) {
 return dl(8390656, 8, e, t)
}

function ms(e, t) {
 return Zl(2048, 8, e, t)
}

function Ic(e, t) {
 return Zl(4, 2, e, t)
}

function jc(e, t) {
 return Zl(4, 4, e, t)
}

function _c(e, t) {
 if (typeof t == "function") return e = e(), t(e),
  function() {
   t(null)
  };
 if (t != null) return e = e(), t.current = e,
  function() {
   t.current = null
  }
}

function Rc(e, t, n) {
 return n = n != null ? n.concat([e]) : null, Zl(4, 4, _c.bind(null, t, e), n)
}

function gs() {}

function Ac(e, t) {
 var n = Ge();
 t = t === void 0 ? null : t;
 var r = n.memoizedState;
 return r !== null && t !== null && fs(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e)
}

function Dc(e, t) {
 var n = Ge();
 t = t === void 0 ? null : t;
 var r = n.memoizedState;
 return r !== null && t !== null && fs(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e)
}

function zc(e, t, n) {
 return ln & 21 ? (rt(n, t) || (n = Bu(), le.lanes |= n, on |= n, e.baseState = !0), t) : (e.baseState && (e.baseState = !1, Re = !0), e.memoizedState = n)
}

function B0(e, t) {
 var n = q;
 q = n !== 0 && 4 > n ? n : 4, e(!0);
 var r = $o.transition;
 $o.transition = {};
 try {
  e(!1), t()
 } finally {
  q = n, $o.transition = r
 }
}

function Lc() {
 return Ge().memoizedState
}

function H0(e, t, n) {
 var r = Ot(e);
 if (n = {
   lane: r,
   action: n,
   hasEagerState: !1,
   eagerState: null,
   next: null
  }, Oc(e)) Uc(t, n);
 else if (n = kc(e, t, n, r), n !== null) {
  var l = Te();
  nt(n, e, r, l), Fc(n, t, r)
 }
}

function V0(e, t, n) {
 var r = Ot(e),
  l = {
   lane: r,
   action: n,
   hasEagerState: !1,
   eagerState: null,
   next: null
  };
 if (Oc(e)) Uc(t, l);
 else {
  var o = e.alternate;
  if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
   var i = t.lastRenderedState,
    s = o(i, n);
   if (l.hasEagerState = !0, l.eagerState = s, rt(s, i)) {
    var a = t.interleaved;
    a === null ? (l.next = l, ss(t)) : (l.next = a.next, a.next = l), t.interleaved = l;
    return
   }
  } catch {} finally {}
  n = kc(e, t, l, r), n !== null && (l = Te(), nt(n, e, r, l), Fc(n, t, r))
 }
}

function Oc(e) {
 var t = e.alternate;
 return e === le || t !== null && t === le
}

function Uc(e, t) {
 pr = Dl = !0;
 var n = e.pending;
 n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t
}

function Fc(e, t, n) {
 if (n & 4194240) {
  var r = t.lanes;
  r &= e.pendingLanes, n |= r, t.lanes = n, Qi(e, n)
 }
}
var zl = {
  readContext: Qe,
  useCallback: we,
  useContext: we,
  useEffect: we,
  useImperativeHandle: we,
  useInsertionEffect: we,
  useLayoutEffect: we,
  useMemo: we,
  useReducer: we,
  useRef: we,
  useState: we,
  useDebugValue: we,
  useDeferredValue: we,
  useTransition: we,
  useMutableSource: we,
  useSyncExternalStore: we,
  useId: we,
  unstable_isNewReconciler: !1
 },
 K0 = {
  readContext: Qe,
  useCallback: function(e, t) {
   return ot().memoizedState = [e, t === void 0 ? null : t], e
  },
  useContext: Qe,
  useEffect: Ea,
  useImperativeHandle: function(e, t, n) {
   return n = n != null ? n.concat([e]) : null, dl(4194308, 4, _c.bind(null, t, e), n)
  },
  useLayoutEffect: function(e, t) {
   return dl(4194308, 4, e, t)
  },
  useInsertionEffect: function(e, t) {
   return dl(4, 2, e, t)
  },
  useMemo: function(e, t) {
   var n = ot();
   return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e
  },
  useReducer: function(e, t, n) {
   var r = ot();
   return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = {
    pending: null,
    interleaved: null,
    lanes: 0,
    dispatch: null,
    lastRenderedReducer: e,
    lastRenderedState: t
   }, r.queue = e, e = e.dispatch = H0.bind(null, le, e), [r.memoizedState, e]
  },
  useRef: function(e) {
   var t = ot();
   return e = {
    current: e
   }, t.memoizedState = e
  },
  useState: Ca,
  useDebugValue: gs,
  useDeferredValue: function(e) {
   return ot().memoizedState = e
  },
  useTransition: function() {
   var e = Ca(!1),
    t = e[0];
   return e = B0.bind(null, e[1]), ot().memoizedState = e, [t, e]
  },
  useMutableSource: function() {},
  useSyncExternalStore: function(e, t, n) {
   var r = le,
    l = ot();
   if (ne) {
    if (n === void 0) throw Error(R(407));
    n = n()
   } else {
    if (n = t(), ge === null) throw Error(R(349));
    ln & 30 || Ec(r, t, n)
   }
   l.memoizedState = n;
   var o = {
    value: n,
    getSnapshot: t
   };
   return l.queue = o, Ea(Tc.bind(null, r, o, e), [e]), r.flags |= 2048, _r(9, Pc.bind(null, r, o, n, t), void 0, null), n
  },
  useId: function() {
   var e = ot(),
    t = ge.identifierPrefix;
   if (ne) {
    var n = mt,
     r = ht;
    n = (r & ~(1 << 32 - tt(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = Ir++, 0 < n && (t += "H" + n.toString(32)), t += ":"
   } else n = F0++, t = ":" + t + "r" + n.toString(32) + ":";
   return e.memoizedState = t
  },
  unstable_isNewReconciler: !1
 },
 W0 = {
  readContext: Qe,
  useCallback: Ac,
  useContext: Qe,
  useEffect: ms,
  useImperativeHandle: Rc,
  useInsertionEffect: Ic,
  useLayoutEffect: jc,
  useMemo: Dc,
  useReducer: Io,
  useRef: $c,
  useState: function() {
   return Io(jr)
  },
  useDebugValue: gs,
  useDeferredValue: function(e) {
   var t = Ge();
   return zc(t, de.memoizedState, e)
  },
  useTransition: function() {
   var e = Io(jr)[0],
    t = Ge().memoizedState;
   return [e, t]
  },
  useMutableSource: xc,
  useSyncExternalStore: Cc,
  useId: Lc,
  unstable_isNewReconciler: !1
 },
 Y0 = {
  readContext: Qe,
  useCallback: Ac,
  useContext: Qe,
  useEffect: ms,
  useImperativeHandle: Rc,
  useInsertionEffect: Ic,
  useLayoutEffect: jc,
  useMemo: Dc,
  useReducer: jo,
  useRef: $c,
  useState: function() {
   return jo(jr)
  },
  useDebugValue: gs,
  useDeferredValue: function(e) {
   var t = Ge();
   return de === null ? t.memoizedState = e : zc(t, de.memoizedState, e)
  },
  useTransition: function() {
   var e = jo(jr)[0],
    t = Ge().memoizedState;
   return [e, t]
  },
  useMutableSource: xc,
  useSyncExternalStore: Cc,
  useId: Lc,
  unstable_isNewReconciler: !1
 };

function qe(e, t) {
 if (e && e.defaultProps) {
  t = oe({}, t), e = e.defaultProps;
  for (var n in e) t[n] === void 0 && (t[n] = e[n]);
  return t
 }
 return t
}

function mi(e, t, n, r) {
 t = e.memoizedState, n = n(r, t), n = n == null ? t : oe({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n)
}
var Jl = {
 isMounted: function(e) {
  return (e = e._reactInternals) ? un(e) === e : !1
 },
 enqueueSetState: function(e, t, n) {
  e = e._reactInternals;
  var r = Te(),
   l = Ot(e),
   o = gt(r, l);
  o.payload = t, n != null && (o.callback = n), t = zt(e, o, l), t !== null && (nt(t, e, l, r), ul(t, e, l))
 },
 enqueueReplaceState: function(e, t, n) {
  e = e._reactInternals;
  var r = Te(),
   l = Ot(e),
   o = gt(r, l);
  o.tag = 1, o.payload = t, n != null && (o.callback = n), t = zt(e, o, l), t !== null && (nt(t, e, l, r), ul(t, e, l))
 },
 enqueueForceUpdate: function(e, t) {
  e = e._reactInternals;
  var n = Te(),
   r = Ot(e),
   l = gt(n, r);
  l.tag = 2, t != null && (l.callback = t), t = zt(e, l, r), t !== null && (nt(t, e, r, n), ul(t, e, r))
 }
};

function Pa(e, t, n, r, l, o, i) {
 return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, o, i) : t.prototype && t.prototype.isPureReactComponent ? !Er(n, r) || !Er(l, o) : !0
}

function Bc(e, t, n) {
 var r = !1,
  l = Ht,
  o = t.contextType;
 return typeof o == "object" && o !== null ? o = Qe(o) : (l = De(t) ? nn : Ee.current, r = t.contextTypes, o = (r = r != null) ? An(e, l) : Ht), t = new t(n, o), e.memoizedState = t.state !== null &&
  t.state !== void 0 ? t.state : null, t.updater = Jl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e
   .__reactInternalMemoizedMaskedChildContext = o), t
}

function Ta(e, t, n, r) {
 e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n,
  r), t.state !== e && Jl.enqueueReplaceState(t, t.state, null)
}

function gi(e, t, n, r) {
 var l = e.stateNode;
 l.props = n, l.state = e.memoizedState, l.refs = {}, as(e);
 var o = t.contextType;
 typeof o == "object" && o !== null ? l.context = Qe(o) : (o = De(t) ? nn : Ee.current, l.context = An(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (mi(
   e, t, o, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" &&
  typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l
   .UNSAFE_componentWillMount(), t !== l.state && Jl.enqueueReplaceState(l, l.state, null), Rl(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308)
}

function On(e, t) {
 try {
  var n = "",
   r = t;
  do n += wf(r), r = r.return; while (r);
  var l = n
 } catch (o) {
  l = `
Error generating stack: ` + o.message + `
` + o.stack
 }
 return {
  value: e,
  source: t,
  stack: l,
  digest: null
 }
}

function _o(e, t, n) {
 return {
  value: e,
  source: null,
  stack: n ?? null,
  digest: t ?? null
 }
}

function vi(e, t) {
 try {
  console.error(t.value)
 } catch (n) {
  setTimeout(function() {
   throw n
  })
 }
}
var Q0 = typeof WeakMap == "function" ? WeakMap : Map;

function Hc(e, t, n) {
 n = gt(-1, n), n.tag = 3, n.payload = {
  element: null
 };
 var r = t.value;
 return n.callback = function() {
  Ol || (Ol = !0, Mi = r), vi(e, t)
 }, n
}

function Vc(e, t, n) {
 n = gt(-1, n), n.tag = 3;
 var r = e.type.getDerivedStateFromError;
 if (typeof r == "function") {
  var l = t.value;
  n.payload = function() {
   return r(l)
  }, n.callback = function() {
   vi(e, t)
  }
 }
 var o = e.stateNode;
 return o !== null && typeof o.componentDidCatch == "function" && (n.callback = function() {
  vi(e, t), typeof r != "function" && (Lt === null ? Lt = new Set([this]) : Lt.add(this));
  var i = t.stack;
  this.componentDidCatch(t.value, {
   componentStack: i !== null ? i : ""
  })
 }), n
}

function Ma(e, t, n) {
 var r = e.pingCache;
 if (r === null) {
  r = e.pingCache = new Q0;
  var l = new Set;
  r.set(t, l)
 } else l = r.get(t), l === void 0 && (l = new Set, r.set(t, l));
 l.has(n) || (l.add(n), e = sp.bind(null, e, t, n), t.then(e, e))
}

function Na(e) {
 do {
  var t;
  if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
  e = e.return
 } while (e !== null);
 return null
}

function $a(e, t, n, r, l) {
 return e.mode & 1 ? (e.flags |= 65536, e.lanes = l, e) : (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t =
  gt(-1, 1), t.tag = 2, zt(n, t, 1))), n.lanes |= 1), e)
}
var G0 = St.ReactCurrentOwner,
 Re = !1;

function Pe(e, t, n, r) {
 t.child = e === null ? yc(t, null, n, r) : zn(t, e.child, n, r)
}

function Ia(e, t, n, r, l) {
 n = n.render;
 var o = t.ref;
 return jn(t, l), r = ps(e, t, n, r, o, l), n = hs(), e !== null && !Re ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, wt(e, t, l)) : (ne && n && ts(t), t.flags |= 1, Pe(e, t, r,
  l), t.child)
}

function ja(e, t, n, r, l) {
 if (e === null) {
  var o = n.type;
  return typeof o == "function" && !Es(o) && o.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = o, Kc(e, t, o, r, l)) : (e = ml(n.type, null, r, t, t
   .mode, l), e.ref = t.ref, e.return = t, t.child = e)
 }
 if (o = e.child, !(e.lanes & l)) {
  var i = o.memoizedProps;
  if (n = n.compare, n = n !== null ? n : Er, n(i, r) && e.ref === t.ref) return wt(e, t, l)
 }
 return t.flags |= 1, e = Ut(o, r), e.ref = t.ref, e.return = t, t.child = e
}

function Kc(e, t, n, r, l) {
 if (e !== null) {
  var o = e.memoizedProps;
  if (Er(o, r) && e.ref === t.ref)
   if (Re = !1, t.pendingProps = r = o, (e.lanes & l) !== 0) e.flags & 131072 && (Re = !0);
   else return t.lanes = e.lanes, wt(e, t, l)
 }
 return yi(e, t, n, r, l)
}

function Wc(e, t, n) {
 var r = t.pendingProps,
  l = r.children,
  o = e !== null ? e.memoizedState : null;
 if (r.mode === "hidden")
  if (!(t.mode & 1)) t.memoizedState = {
   baseLanes: 0,
   cachePool: null,
   transitions: null
  }, J(Pn, Le), Le |= n;
  else {
   if (!(n & 1073741824)) return e = o !== null ? o.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = {
    baseLanes: e,
    cachePool: null,
    transitions: null
   }, t.updateQueue = null, J(Pn, Le), Le |= e, null;
   t.memoizedState = {
    baseLanes: 0,
    cachePool: null,
    transitions: null
   }, r = o !== null ? o.baseLanes : n, J(Pn, Le), Le |= r
  }
 else o !== null ? (r = o.baseLanes | n, t.memoizedState = null) : r = n, J(Pn, Le), Le |= r;
 return Pe(e, t, l, n), t.child
}

function Yc(e, t) {
 var n = t.ref;
 (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152)
}

function yi(e, t, n, r, l) {
 var o = De(n) ? nn : Ee.current;
 return o = An(t, o), jn(t, l), n = ps(e, t, n, r, o, l), r = hs(), e !== null && !Re ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, wt(e, t, l)) : (ne && r && ts(t), t.flags |= 1,
  Pe(e, t, n, l), t.child)
}

function _a(e, t, n, r, l) {
 if (De(n)) {
  var o = !0;
  Nl(t)
 } else o = !1;
 if (jn(t, l), t.stateNode === null) fl(e, t), Bc(t, n, r), gi(t, n, r, l), r = !0;
 else if (e === null) {
  var i = t.stateNode,
   s = t.memoizedProps;
  i.props = s;
  var a = i.context,
   h = n.contextType;
  typeof h == "object" && h !== null ? h = Qe(h) : (h = De(n) ? nn : Ee.current, h = An(t, h));
  var d = n.getDerivedStateFromProps,
   k = typeof d == "function" || typeof i.getSnapshotBeforeUpdate == "function";
  k || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (s !== r || a !== h) && Ta(t, i, r, h), Tt = !1;
  var x = t.memoizedState;
  i.state = x, Rl(t, r, i, l), a = t.memoizedState, s !== r || x !== a || Ae.current || Tt ? (typeof d == "function" && (mi(t, n, d, r), a = t.memoizedState), (s = Tt || Pa(t, n, s, r, x, a, h)) ? (
   k || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i
    .UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t
   .flags |= 4194308), t.memoizedProps = r, t.memoizedState = a), i.props = r, i.state = a, i.context = h, r = s) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), r = !1)
 } else {
  i = t.stateNode, wc(e, t), s = t.memoizedProps, h = t.type === t.elementType ? s : qe(t.type, s), i.props = h, k = t.pendingProps, x = i.context, a = n.contextType, typeof a == "object" && a !==
   null ? a = Qe(a) : (a = De(n) ? nn : Ee.current, a = An(t, a));
  var v = n.getDerivedStateFromProps;
  (d = typeof v == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (
   s !== k || x !== a) && Ta(t, i, r, a), Tt = !1, x = t.memoizedState, i.state = x, Rl(t, r, i, l);
  var N = t.memoizedState;
  s !== k || x !== N || Ae.current || Tt ? (typeof v == "function" && (mi(t, n, v, r), N = t.memoizedState), (h = Tt || Pa(t, n, h, r, x, N, a) || !1) ? (d || typeof i.UNSAFE_componentWillUpdate !=
   "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(r, N, a), typeof i.UNSAFE_componentWillUpdate == "function" && i
    .UNSAFE_componentWillUpdate(r, N, a)), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i
   .componentDidUpdate != "function" || s === e.memoizedProps && x === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || s === e.memoizedProps && x === e
   .memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = N), i.props = r, i.state = N, i.context = a, r = h) : (typeof i.componentDidUpdate != "function" || s === e
   .memoizedProps && x === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || s === e.memoizedProps && x === e.memoizedState || (t.flags |= 1024), r = !1)
 }
 return ki(e, t, n, r, o, l)
}

function ki(e, t, n, r, l, o) {
 Yc(e, t);
 var i = (t.flags & 128) !== 0;
 if (!r && !i) return l && va(t, n, !1), wt(e, t, o);
 r = t.stateNode, G0.current = t;
 var s = i && typeof n.getDerivedStateFromError != "function" ? null : r.render();
 return t.flags |= 1, e !== null && i ? (t.child = zn(t, e.child, null, o), t.child = zn(t, null, s, o)) : Pe(e, t, s, o), t.memoizedState = r.state, l && va(t, n, !0), t.child
}

function Qc(e) {
 var t = e.stateNode;
 t.pendingContext ? ga(e, t.pendingContext, t.pendingContext !== t.context) : t.context && ga(e, t.context, !1), us(e, t.containerInfo)
}

function Ra(e, t, n, r, l) {
 return Dn(), rs(l), t.flags |= 256, Pe(e, t, n, r), t.child
}
var wi = {
 dehydrated: null,
 treeContext: null,
 retryLane: 0
};

function Si(e) {
 return {
  baseLanes: e,
  cachePool: null,
  transitions: null
 }
}

function Gc(e, t, n) {
 var r = t.pendingProps,
  l = re.current,
  o = !1,
  i = (t.flags & 128) !== 0,
  s;
 if ((s = i) || (s = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), s ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), J(re, l & 1), e === null)
  return pi(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? (t.mode & 1 ? e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824 : t.lanes = 1, null) : (i = r.children, e = r
   .fallback, o ? (r = t.mode, o = t.child, i = {
     mode: "hidden",
     children: i
    }, !(r & 1) && o !== null ? (o.childLanes = 0, o.pendingProps = i) : o = no(i, r, 0, null), e = en(e, r, n, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState =
    Si(n), t.memoizedState = wi, e) : vs(t, i));
 if (l = e.memoizedState, l !== null && (s = l.dehydrated, s !== null)) return X0(e, t, i, r, s, l, n);
 if (o) {
  o = r.fallback, i = t.mode, l = e.child, s = l.sibling;
  var a = {
   mode: "hidden",
   children: r.children
  };
  return !(i & 1) && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = a, t.deletions = null) : (r = Ut(l, a), r.subtreeFlags = l.subtreeFlags & 14680064), s !== null ? o = Ut(s, o) : (
   o = en(o, i, n, null), o.flags |= 2), o.return = t, r.return = t, r.sibling = o, t.child = r, r = o, o = t.child, i = e.child.memoizedState, i = i === null ? Si(n) : {
   baseLanes: i.baseLanes | n,
   cachePool: null,
   transitions: i.transitions
  }, o.memoizedState = i, o.childLanes = e.childLanes & ~n, t.memoizedState = wi, r
 }
 return o = e.child, e = o.sibling, r = Ut(o, {
   mode: "visible",
   children: r.children
  }), !(t.mode & 1) && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null,
  r
}

function vs(e, t) {
 return t = no({
  mode: "visible",
  children: t
 }, e.mode, 0, null), t.return = e, e.child = t
}

function Jr(e, t, n, r) {
 return r !== null && rs(r), zn(t, e.child, null, n), e = vs(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e
}

function X0(e, t, n, r, l, o, i) {
 if (n) return t.flags & 256 ? (t.flags &= -257, r = _o(Error(R(422))), Jr(e, t, i, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = r.fallback, l = t.mode, r = no({
   mode: "visible",
   children: r.children
  }, l, 0, null), o = en(o, l, i, null), o.flags |= 2, r.return = t, o.return = t, r.sibling = o, t.child = r, t.mode & 1 && zn(t, e.child, null, i), t.child.memoizedState = Si(i), t.memoizedState =
  wi, o);
 if (!(t.mode & 1)) return Jr(e, t, i, null);
 if (l.data === "$!") {
  if (r = l.nextSibling && l.nextSibling.dataset, r) var s = r.dgst;
  return r = s, o = Error(R(419)), r = _o(o, r, void 0), Jr(e, t, i, r)
 }
 if (s = (i & e.childLanes) !== 0, Re || s) {
  if (r = ge, r !== null) {
   switch (i & -i) {
    case 4:
     l = 2;
     break;
    case 16:
     l = 8;
     break;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
     l = 32;
     break;
    case 536870912:
     l = 268435456;
     break;
    default:
     l = 0
   }
   l = l & (r.suspendedLanes | i) ? 0 : l, l !== 0 && l !== o.retryLane && (o.retryLane = l, kt(e, l), nt(r, e, l, -1))
  }
  return Cs(), r = _o(Error(R(421))), Jr(e, t, i, r)
 }
 return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = ap.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, Oe = Dt(l.nextSibling), Ue = t, ne = !0, et = null, e !== null && (
  Ve[Ke++] = ht, Ve[Ke++] = mt, Ve[Ke++] = rn, ht = e.id, mt = e.overflow, rn = t), t = vs(t, r.children), t.flags |= 4096, t)
}

function Aa(e, t, n) {
 e.lanes |= t;
 var r = e.alternate;
 r !== null && (r.lanes |= t), hi(e.return, t, n)
}

function Ro(e, t, n, r, l) {
 var o = e.memoizedState;
 o === null ? e.memoizedState = {
  isBackwards: t,
  rendering: null,
  renderingStartTime: 0,
  last: r,
  tail: n,
  tailMode: l
 } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = l)
}

function Xc(e, t, n) {
 var r = t.pendingProps,
  l = r.revealOrder,
  o = r.tail;
 if (Pe(e, t, r.children, n), r = re.current, r & 2) r = r & 1 | 2, t.flags |= 128;
 else {
  if (e !== null && e.flags & 128) e: for (e = t.child; e !== null;) {
   if (e.tag === 13) e.memoizedState !== null && Aa(e, n, t);
   else if (e.tag === 19) Aa(e, n, t);
   else if (e.child !== null) {
    e.child.return = e, e = e.child;
    continue
   }
   if (e === t) break e;
   for (; e.sibling === null;) {
    if (e.return === null || e.return === t) break e;
    e = e.return
   }
   e.sibling.return = e.return, e = e.sibling
  }
  r &= 1
 }
 if (J(re, r), !(t.mode & 1)) t.memoizedState = null;
 else switch (l) {
  case "forwards":
   for (n = t.child, l = null; n !== null;) e = n.alternate, e !== null && Al(e) === null && (l = n), n = n.sibling;
   n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), Ro(t, !1, l, n, o);
   break;
  case "backwards":
   for (n = null, l = t.child, t.child = null; l !== null;) {
    if (e = l.alternate, e !== null && Al(e) === null) {
     t.child = l;
     break
    }
    e = l.sibling, l.sibling = n, n = l, l = e
   }
   Ro(t, !0, n, null, o);
   break;
  case "together":
   Ro(t, !1, null, null, void 0);
   break;
  default:
   t.memoizedState = null
 }
 return t.child
}

function fl(e, t) {
 !(t.mode & 1) && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2)
}

function wt(e, t, n) {
 if (e !== null && (t.dependencies = e.dependencies), on |= t.lanes, !(n & t.childLanes)) return null;
 if (e !== null && t.child !== e.child) throw Error(R(153));
 if (t.child !== null) {
  for (e = t.child, n = Ut(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;) e = e.sibling, n = n.sibling = Ut(e, e.pendingProps), n.return = t;
  n.sibling = null
 }
 return t.child
}

function b0(e, t, n) {
 switch (t.tag) {
  case 3:
   Qc(t), Dn();
   break;
  case 5:
   Sc(t);
   break;
  case 1:
   De(t.type) && Nl(t);
   break;
  case 4:
   us(t, t.stateNode.containerInfo);
   break;
  case 10:
   var r = t.type._context,
    l = t.memoizedProps.value;
   J(jl, r._currentValue), r._currentValue = l;
   break;
  case 13:
   if (r = t.memoizedState, r !== null) return r.dehydrated !== null ? (J(re, re.current & 1), t.flags |= 128, null) : n & t.child.childLanes ? Gc(e, t, n) : (J(re, re.current & 1), e = wt(e, t, n),
    e !== null ? e.sibling : null);
   J(re, re.current & 1);
   break;
  case 19:
   if (r = (n & t.childLanes) !== 0, e.flags & 128) {
    if (r) return Xc(e, t, n);
    t.flags |= 128
   }
   if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), J(re, re.current), r) break;
   return null;
  case 22:
  case 23:
   return t.lanes = 0, Wc(e, t, n)
 }
 return wt(e, t, n)
}
var bc, xi, qc, Zc;
bc = function(e, t) {
 for (var n = t.child; n !== null;) {
  if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
  else if (n.tag !== 4 && n.child !== null) {
   n.child.return = n, n = n.child;
   continue
  }
  if (n === t) break;
  for (; n.sibling === null;) {
   if (n.return === null || n.return === t) return;
   n = n.return
  }
  n.sibling.return = n.return, n = n.sibling
 }
};
xi = function() {};
qc = function(e, t, n, r) {
 var l = e.memoizedProps;
 if (l !== r) {
  e = t.stateNode, Zt(ut.current);
  var o = null;
  switch (n) {
   case "input":
    l = Ko(e, l), r = Ko(e, r), o = [];
    break;
   case "select":
    l = oe({}, l, {
     value: void 0
    }), r = oe({}, r, {
     value: void 0
    }), o = [];
    break;
   case "textarea":
    l = Qo(e, l), r = Qo(e, r), o = [];
    break;
   default:
    typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Tl)
  }
  Xo(n, r);
  var i;
  n = null;
  for (h in l)
   if (!r.hasOwnProperty(h) && l.hasOwnProperty(h) && l[h] != null)
    if (h === "style") {
     var s = l[h];
     for (i in s) s.hasOwnProperty(i) && (n || (n = {}), n[i] = "")
    } else h !== "dangerouslySetInnerHTML" && h !== "children" && h !== "suppressContentEditableWarning" && h !== "suppressHydrationWarning" && h !== "autoFocus" && (vr.hasOwnProperty(h) ? o || (
     o = []) : (o = o || []).push(h, null));
  for (h in r) {
   var a = r[h];
   if (s = l != null ? l[h] : void 0, r.hasOwnProperty(h) && a !== s && (a != null || s != null))
    if (h === "style")
     if (s) {
      for (i in s) !s.hasOwnProperty(i) || a && a.hasOwnProperty(i) || (n || (n = {}), n[i] = "");
      for (i in a) a.hasOwnProperty(i) && s[i] !== a[i] && (n || (n = {}), n[i] = a[i])
     } else n || (o || (o = []), o.push(h, n)), n = a;
   else h === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, s = s ? s.__html : void 0, a != null && s !== a && (o = o || []).push(h, a)) : h === "children" ? typeof a != "string" &&
    typeof a != "number" || (o = o || []).push(h, "" + a) : h !== "suppressContentEditableWarning" && h !== "suppressHydrationWarning" && (vr.hasOwnProperty(h) ? (a != null && h === "onScroll" && ee(
     "scroll", e), o || s === a || (o = [])) : (o = o || []).push(h, a))
  }
  n && (o = o || []).push("style", n);
  var h = o;
  (t.updateQueue = h) && (t.flags |= 4)
 }
};
Zc = function(e, t, n, r) {
 n !== r && (t.flags |= 4)
};

function Zn(e, t) {
 if (!ne) switch (e.tailMode) {
  case "hidden":
   t = e.tail;
   for (var n = null; t !== null;) t.alternate !== null && (n = t), t = t.sibling;
   n === null ? e.tail = null : n.sibling = null;
   break;
  case "collapsed":
   n = e.tail;
   for (var r = null; n !== null;) n.alternate !== null && (r = n), n = n.sibling;
   r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null
 }
}

function Se(e) {
 var t = e.alternate !== null && e.alternate.child === e.child,
  n = 0,
  r = 0;
 if (t)
  for (var l = e.child; l !== null;) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
 else
  for (l = e.child; l !== null;) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
 return e.subtreeFlags |= r, e.childLanes = n, t
}

function q0(e, t, n) {
 var r = t.pendingProps;
 switch (ns(t), t.tag) {
  case 2:
  case 16:
  case 15:
  case 0:
  case 11:
  case 7:
  case 8:
  case 12:
  case 9:
  case 14:
   return Se(t), null;
  case 1:
   return De(t.type) && Ml(), Se(t), null;
  case 3:
   return r = t.stateNode, Ln(), te(Ae), te(Ee), ds(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (qr(t) ? t.flags |= 4 : e ===
    null || e.memoizedState.isDehydrated && !(t.flags & 256) || (t.flags |= 1024, et !== null && (Ii(et), et = null))), xi(e, t), Se(t), null;
  case 5:
   cs(t);
   var l = Zt($r.current);
   if (n = t.type, e !== null && t.stateNode != null) qc(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
   else {
    if (!r) {
     if (t.stateNode === null) throw Error(R(166));
     return Se(t), null
    }
    if (e = Zt(ut.current), qr(t)) {
     r = t.stateNode, n = t.type;
     var o = t.memoizedProps;
     switch (r[it] = t, r[Mr] = o, e = (t.mode & 1) !== 0, n) {
      case "dialog":
       ee("cancel", r), ee("close", r);
       break;
      case "iframe":
      case "object":
      case "embed":
       ee("load", r);
       break;
      case "video":
      case "audio":
       for (l = 0; l < or.length; l++) ee(or[l], r);
       break;
      case "source":
       ee("error", r);
       break;
      case "img":
      case "image":
      case "link":
       ee("error", r), ee("load", r);
       break;
      case "details":
       ee("toggle", r);
       break;
      case "input":
       Vs(r, o), ee("invalid", r);
       break;
      case "select":
       r._wrapperState = {
        wasMultiple: !!o.multiple
       }, ee("invalid", r);
       break;
      case "textarea":
       Ws(r, o), ee("invalid", r)
     }
     Xo(n, o), l = null;
     for (var i in o)
      if (o.hasOwnProperty(i)) {
       var s = o[i];
       i === "children" ? typeof s == "string" ? r.textContent !== s && (o.suppressHydrationWarning !== !0 && br(r.textContent, s, e), l = ["children", s]) : typeof s == "number" && r.textContent !==
        "" + s && (o.suppressHydrationWarning !== !0 && br(r.textContent, s, e), l = ["children", "" + s]) : vr.hasOwnProperty(i) && s != null && i === "onScroll" && ee("scroll", r)
      } switch (n) {
      case "input":
       Hr(r), Ks(r, o, !0);
       break;
      case "textarea":
       Hr(r), Ys(r);
       break;
      case "select":
      case "option":
       break;
      default:
       typeof o.onClick == "function" && (r.onclick = Tl)
     }
     r = l, t.updateQueue = r, r !== null && (t.flags |= 4)
    } else {
     i = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Tu(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = i.createElement("div"), e.innerHTML =
       "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = i.createElement(n, {
       is: r.is
      }) : (e = i.createElement(n), n === "select" && (i = e, r.multiple ? i.multiple = !0 : r.size && (i.size = r.size))) : e = i.createElementNS(e, n), e[it] = t, e[Mr] = r, bc(e, t, !1, !1), t
      .stateNode = e;
     e: {
      switch (i = bo(n, r), n) {
       case "dialog":
        ee("cancel", e), ee("close", e), l = r;
        break;
       case "iframe":
       case "object":
       case "embed":
        ee("load", e), l = r;
        break;
       case "video":
       case "audio":
        for (l = 0; l < or.length; l++) ee(or[l], e);
        l = r;
        break;
       case "source":
        ee("error", e), l = r;
        break;
       case "img":
       case "image":
       case "link":
        ee("error", e), ee("load", e), l = r;
        break;
       case "details":
        ee("toggle", e), l = r;
        break;
       case "input":
        Vs(e, r), l = Ko(e, r), ee("invalid", e);
        break;
       case "option":
        l = r;
        break;
       case "select":
        e._wrapperState = {
         wasMultiple: !!r.multiple
        }, l = oe({}, r, {
         value: void 0
        }), ee("invalid", e);
        break;
       case "textarea":
        Ws(e, r), l = Qo(e, r), ee("invalid", e);
        break;
       default:
        l = r
      }
      Xo(n, l),
      s = l;
      for (o in s)
       if (s.hasOwnProperty(o)) {
        var a = s[o];
        o === "style" ? $u(e, a) : o === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, a != null && Mu(e, a)) : o === "children" ? typeof a == "string" ? (n !== "textarea" || a !== "") &&
         yr(e, a) : typeof a == "number" && yr(e, "" + a) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (vr.hasOwnProperty(o) ? a != null &&
          o === "onScroll" && ee("scroll", e) : a != null && Bi(e, o, a, i))
       } switch (n) {
       case "input":
        Hr(e), Ks(e, r, !1);
        break;
       case "textarea":
        Hr(e), Ys(e);
        break;
       case "option":
        r.value != null && e.setAttribute("value", "" + Bt(r.value));
        break;
       case "select":
        e.multiple = !!r.multiple, o = r.value, o != null ? Mn(e, !!r.multiple, o, !1) : r.defaultValue != null && Mn(e, !!r.multiple, r.defaultValue, !0);
        break;
       default:
        typeof l.onClick == "function" && (e.onclick = Tl)
      }
      switch (n) {
       case "button":
       case "input":
       case "select":
       case "textarea":
        r = !!r.autoFocus;
        break e;
       case "img":
        r = !0;
        break e;
       default:
        r = !1
      }
     }
     r && (t.flags |= 4)
    }
    t.ref !== null && (t.flags |= 512, t.flags |= 2097152)
   }
   return Se(t), null;
  case 6:
   if (e && t.stateNode != null) Zc(e, t, e.memoizedProps, r);
   else {
    if (typeof r != "string" && t.stateNode === null) throw Error(R(166));
    if (n = Zt($r.current), Zt(ut.current), qr(t)) {
     if (r = t.stateNode, n = t.memoizedProps, r[it] = t, (o = r.nodeValue !== n) && (e = Ue, e !== null)) switch (e.tag) {
      case 3:
       br(r.nodeValue, n, (e.mode & 1) !== 0);
       break;
      case 5:
       e.memoizedProps.suppressHydrationWarning !== !0 && br(r.nodeValue, n, (e.mode & 1) !== 0)
     }
     o && (t.flags |= 4)
    } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[it] = t, t.stateNode = r
   }
   return Se(t), null;
  case 13:
   if (te(re), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
    if (ne && Oe !== null && t.mode & 1 && !(t.flags & 128)) gc(), Dn(), t.flags |= 98560, o = !1;
    else if (o = qr(t), r !== null && r.dehydrated !== null) {
     if (e === null) {
      if (!o) throw Error(R(318));
      if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(R(317));
      o[it] = t
     } else Dn(), !(t.flags & 128) && (t.memoizedState = null), t.flags |= 4;
     Se(t), o = !1
    } else et !== null && (Ii(et), et = null), o = !0;
    if (!o) return t.flags & 65536 ? t : null
   }
   return t.flags & 128 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, t.mode & 1 && (e === null || re.current & 1 ? fe === 0 && (
    fe = 3) : Cs())), t.updateQueue !== null && (t.flags |= 4), Se(t), null);
  case 4:
   return Ln(), xi(e, t), e === null && Pr(t.stateNode.containerInfo), Se(t), null;
  case 10:
   return is(t.type._context), Se(t), null;
  case 17:
   return De(t.type) && Ml(), Se(t), null;
  case 19:
   if (te(re), o = t.memoizedState, o === null) return Se(t), null;
   if (r = (t.flags & 128) !== 0, i = o.rendering, i === null)
    if (r) Zn(o, !1);
    else {
     if (fe !== 0 || e !== null && e.flags & 128)
      for (e = t.child; e !== null;) {
       if (i = Al(e), i !== null) {
        for (t.flags |= 128, Zn(o, !1), r = i.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null;) o = n, e = r, o.flags &= 14680066, i =
         o.alternate, i === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o
          .stateNode = null) : (o.childLanes = i.childLanes, o.lanes = i.lanes, o.child = i.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = i.memoizedProps, o.memoizedState = i
          .memoizedState, o.updateQueue = i.updateQueue, o.type = i.type, e = i.dependencies, o.dependencies = e === null ? null : {
           lanes: e.lanes,
           firstContext: e.firstContext
          }), n = n.sibling;
        return J(re, re.current & 1 | 2), t.child
       }
       e = e.sibling
      }
     o.tail !== null && ae() > Un && (t.flags |= 128, r = !0, Zn(o, !1), t.lanes = 4194304)
    }
   else {
    if (!r)
     if (e = Al(i), e !== null) {
      if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), Zn(o, !0), o.tail === null && o.tailMode === "hidden" && !i.alternate && !ne) return Se(t), null
     } else 2 * ae() - o.renderingStartTime > Un && n !== 1073741824 && (t.flags |= 128, r = !0, Zn(o, !1), t.lanes = 4194304);
    o.isBackwards ? (i.sibling = t.child, t.child = i) : (n = o.last, n !== null ? n.sibling = i : t.child = i, o.last = i)
   }
   return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = ae(), t.sibling = null, n = re.current, J(re, r ? n & 1 | 2 : n & 1), t) : (Se(t), null);
  case 22:
  case 23:
   return xs(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && t.mode & 1 ? Le & 1073741824 && (Se(t), t.subtreeFlags & 6 && (t.flags |= 8192)) :
    Se(t), null;
  case 24:
   return null;
  case 25:
   return null
 }
 throw Error(R(156, t.tag))
}

function Z0(e, t) {
 switch (ns(t), t.tag) {
  case 1:
   return De(t.type) && Ml(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
  case 3:
   return Ln(), te(Ae), te(Ee), ds(), e = t.flags, e & 65536 && !(e & 128) ? (t.flags = e & -65537 | 128, t) : null;
  case 5:
   return cs(t), null;
  case 13:
   if (te(re), e = t.memoizedState, e !== null && e.dehydrated !== null) {
    if (t.alternate === null) throw Error(R(340));
    Dn()
   }
   return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
  case 19:
   return te(re), null;
  case 4:
   return Ln(), null;
  case 10:
   return is(t.type._context), null;
  case 22:
  case 23:
   return xs(), null;
  case 24:
   return null;
  default:
   return null
 }
}
var el = !1,
 Ce = !1,
 J0 = typeof WeakSet == "function" ? WeakSet : Set,
 z = null;

function En(e, t) {
 var n = e.ref;
 if (n !== null)
  if (typeof n == "function") try {
   n(null)
  } catch (r) {
   ie(e, t, r)
  } else n.current = null
}

function Ci(e, t, n) {
 try {
  n()
 } catch (r) {
  ie(e, t, r)
 }
}
var Da = !1;

function ep(e, t) {
 if (ii = Cl, e = rc(), es(e)) {
  if ("selectionStart" in e) var n = {
   start: e.selectionStart,
   end: e.selectionEnd
  };
  else e: {
   n = (n = e.ownerDocument) && n.defaultView || window;
   var r = n.getSelection && n.getSelection();
   if (r && r.rangeCount !== 0) {
    n = r.anchorNode;
    var l = r.anchorOffset,
     o = r.focusNode;
    r = r.focusOffset;
    try {
     n.nodeType, o.nodeType
    } catch {
     n = null;
     break e
    }
    var i = 0,
     s = -1,
     a = -1,
     h = 0,
     d = 0,
     k = e,
     x = null;
    t: for (;;) {
     for (var v; k !== n || l !== 0 && k.nodeType !== 3 || (s = i + l), k !== o || r !== 0 && k.nodeType !== 3 || (a = i + r), k.nodeType === 3 && (i += k.nodeValue.length), (v = k.firstChild) !==
      null;) x = k, k = v;
     for (;;) {
      if (k === e) break t;
      if (x === n && ++h === l && (s = i), x === o && ++d === r && (a = i), (v = k.nextSibling) !== null) break;
      k = x, x = k.parentNode
     }
     k = v
    }
    n = s === -1 || a === -1 ? null : {
     start: s,
     end: a
    }
   } else n = null
  }
  n = n || {
   start: 0,
   end: 0
  }
 } else n = null;
 for (si = {
   focusedElem: e,
   selectionRange: n
  }, Cl = !1, z = t; z !== null;)
  if (t = z, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, z = e;
  else
   for (; z !== null;) {
    t = z;
    try {
     var N = t.alternate;
     if (t.flags & 1024) switch (t.tag) {
      case 0:
      case 11:
      case 15:
       break;
      case 1:
       if (N !== null) {
        var p = N.memoizedProps,
         P = N.memoizedState,
         u = t.stateNode,
         f = u.getSnapshotBeforeUpdate(t.elementType === t.type ? p : qe(t.type, p), P);
        u.__reactInternalSnapshotBeforeUpdate = f
       }
       break;
      case 3:
       var c = t.stateNode.containerInfo;
       c.nodeType === 1 ? c.textContent = "" : c.nodeType === 9 && c.documentElement && c.removeChild(c.documentElement);
       break;
      case 5:
      case 6:
      case 4:
      case 17:
       break;
      default:
       throw Error(R(163))
     }
    } catch (y) {
     ie(t, t.return, y)
    }
    if (e = t.sibling, e !== null) {
     e.return = t.return, z = e;
     break
    }
    z = t.return
   }
 return N = Da, Da = !1, N
}

function hr(e, t, n) {
 var r = t.updateQueue;
 if (r = r !== null ? r.lastEffect : null, r !== null) {
  var l = r = r.next;
  do {
   if ((l.tag & e) === e) {
    var o = l.destroy;
    l.destroy = void 0, o !== void 0 && Ci(t, n, o)
   }
   l = l.next
  } while (l !== r)
 }
}

function eo(e, t) {
 if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
  var n = t = t.next;
  do {
   if ((n.tag & e) === e) {
    var r = n.create;
    n.destroy = r()
   }
   n = n.next
  } while (n !== t)
 }
}

function Ei(e) {
 var t = e.ref;
 if (t !== null) {
  var n = e.stateNode;
  switch (e.tag) {
   case 5:
    e = n;
    break;
   default:
    e = n
  }
  typeof t == "function" ? t(e) : t.current = e
 }
}

function Jc(e) {
 var t = e.alternate;
 t !== null && (e.alternate = null, Jc(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[it], delete t[Mr], delete t[ci], delete t[
  z0], delete t[L0])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null
}

function ed(e) {
 return e.tag === 5 || e.tag === 3 || e.tag === 4
}

function za(e) {
 e: for (;;) {
  for (; e.sibling === null;) {
   if (e.return === null || ed(e.return)) return null;
   e = e.return
  }
  for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
   if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
   e.child.return = e, e = e.child
  }
  if (!(e.flags & 2)) return e.stateNode
 }
}

function Pi(e, t, n) {
 var r = e.tag;
 if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t
  .appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Tl));
 else if (r !== 4 && (e = e.child, e !== null))
  for (Pi(e, t, n), e = e.sibling; e !== null;) Pi(e, t, n), e = e.sibling
}

function Ti(e, t, n) {
 var r = e.tag;
 if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
 else if (r !== 4 && (e = e.child, e !== null))
  for (Ti(e, t, n), e = e.sibling; e !== null;) Ti(e, t, n), e = e.sibling
}
var ve = null,
 Je = !1;

function Ct(e, t, n) {
 for (n = n.child; n !== null;) td(e, t, n), n = n.sibling
}

function td(e, t, n) {
 if (at && typeof at.onCommitFiberUnmount == "function") try {
  at.onCommitFiberUnmount(Yl, n)
 } catch {}
 switch (n.tag) {
  case 5:
   Ce || En(n, t);
  case 6:
   var r = ve,
    l = Je;
   ve = null, Ct(e, t, n), ve = r, Je = l, ve !== null && (Je ? (e = ve, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : ve.removeChild(n.stateNode));
   break;
  case 18:
   ve !== null && (Je ? (e = ve, n = n.stateNode, e.nodeType === 8 ? To(e.parentNode, n) : e.nodeType === 1 && To(e, n), xr(e)) : To(ve, n.stateNode));
   break;
  case 4:
   r = ve, l = Je, ve = n.stateNode.containerInfo, Je = !0, Ct(e, t, n), ve = r, Je = l;
   break;
  case 0:
  case 11:
  case 14:
  case 15:
   if (!Ce && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
    l = r = r.next;
    do {
     var o = l,
      i = o.destroy;
     o = o.tag, i !== void 0 && (o & 2 || o & 4) && Ci(n, t, i), l = l.next
    } while (l !== r)
   }
   Ct(e, t, n);
   break;
  case 1:
   if (!Ce && (En(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
    r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount()
   } catch (s) {
    ie(n, t, s)
   }
   Ct(e, t, n);
   break;
  case 21:
   Ct(e, t, n);
   break;
  case 22:
   n.mode & 1 ? (Ce = (r = Ce) || n.memoizedState !== null, Ct(e, t, n), Ce = r) : Ct(e, t, n);
   break;
  default:
   Ct(e, t, n)
 }
}

function La(e) {
 var t = e.updateQueue;
 if (t !== null) {
  e.updateQueue = null;
  var n = e.stateNode;
  n === null && (n = e.stateNode = new J0), t.forEach(function(r) {
   var l = up.bind(null, e, r);
   n.has(r) || (n.add(r), r.then(l, l))
  })
 }
}

function be(e, t) {
 var n = t.deletions;
 if (n !== null)
  for (var r = 0; r < n.length; r++) {
   var l = n[r];
   try {
    var o = e,
     i = t,
     s = i;
    e: for (; s !== null;) {
     switch (s.tag) {
      case 5:
       ve = s.stateNode, Je = !1;
       break e;
      case 3:
       ve = s.stateNode.containerInfo, Je = !0;
       break e;
      case 4:
       ve = s.stateNode.containerInfo, Je = !0;
       break e
     }
     s = s.return
    }
    if (ve === null) throw Error(R(160));
    td(o, i, l), ve = null, Je = !1;
    var a = l.alternate;
    a !== null && (a.return = null), l.return = null
   } catch (h) {
    ie(l, t, h)
   }
  }
 if (t.subtreeFlags & 12854)
  for (t = t.child; t !== null;) nd(t, e), t = t.sibling
}

function nd(e, t) {
 var n = e.alternate,
  r = e.flags;
 switch (e.tag) {
  case 0:
  case 11:
  case 14:
  case 15:
   if (be(t, e), lt(e), r & 4) {
    try {
     hr(3, e, e.return), eo(3, e)
    } catch (p) {
     ie(e, e.return, p)
    }
    try {
     hr(5, e, e.return)
    } catch (p) {
     ie(e, e.return, p)
    }
   }
   break;
  case 1:
   be(t, e), lt(e), r & 512 && n !== null && En(n, n.return);
   break;
  case 5:
   if (be(t, e), lt(e), r & 512 && n !== null && En(n, n.return), e.flags & 32) {
    var l = e.stateNode;
    try {
     yr(l, "")
    } catch (p) {
     ie(e, e.return, p)
    }
   }
   if (r & 4 && (l = e.stateNode, l != null)) {
    var o = e.memoizedProps,
     i = n !== null ? n.memoizedProps : o,
     s = e.type,
     a = e.updateQueue;
    if (e.updateQueue = null, a !== null) try {
     s === "input" && o.type === "radio" && o.name != null && Eu(l, o), bo(s, i);
     var h = bo(s, o);
     for (i = 0; i < a.length; i += 2) {
      var d = a[i],
       k = a[i + 1];
      d === "style" ? $u(l, k) : d === "dangerouslySetInnerHTML" ? Mu(l, k) : d === "children" ? yr(l, k) : Bi(l, d, k, h)
     }
     switch (s) {
      case "input":
       Wo(l, o);
       break;
      case "textarea":
       Pu(l, o);
       break;
      case "select":
       var x = l._wrapperState.wasMultiple;
       l._wrapperState.wasMultiple = !!o.multiple;
       var v = o.value;
       v != null ? Mn(l, !!o.multiple, v, !1) : x !== !!o.multiple && (o.defaultValue != null ? Mn(l, !!o.multiple, o.defaultValue, !0) : Mn(l, !!o.multiple, o.multiple ? [] : "", !1))
     }
     l[Mr] = o
    } catch (p) {
     ie(e, e.return, p)
    }
   }
   break;
  case 6:
   if (be(t, e), lt(e), r & 4) {
    if (e.stateNode === null) throw Error(R(162));
    l = e.stateNode, o = e.memoizedProps;
    try {
     l.nodeValue = o
    } catch (p) {
     ie(e, e.return, p)
    }
   }
   break;
  case 3:
   if (be(t, e), lt(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
    xr(t.containerInfo)
   } catch (p) {
    ie(e, e.return, p)
   }
   break;
  case 4:
   be(t, e), lt(e);
   break;
  case 13:
   be(t, e), lt(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (ws = ae())), r & 4 &&
    La(e);
   break;
  case 22:
   if (d = n !== null && n.memoizedState !== null, e.mode & 1 ? (Ce = (h = Ce) || d, be(t, e), Ce = h) : be(t, e), lt(e), r & 8192) {
    if (h = e.memoizedState !== null, (e.stateNode.isHidden = h) && !d && e.mode & 1)
     for (z = e, d = e.child; d !== null;) {
      for (k = z = d; z !== null;) {
       switch (x = z, v = x.child, x.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
         hr(4, x, x.return);
         break;
        case 1:
         En(x, x.return);
         var N = x.stateNode;
         if (typeof N.componentWillUnmount == "function") {
          r = x, n = x.return;
          try {
           t = r, N.props = t.memoizedProps, N.state = t.memoizedState, N.componentWillUnmount()
          } catch (p) {
           ie(r, n, p)
          }
         }
         break;
        case 5:
         En(x, x.return);
         break;
        case 22:
         if (x.memoizedState !== null) {
          Ua(k);
          continue
         }
       }
       v !== null ? (v.return = x, z = v) : Ua(k)
      }
      d = d.sibling
     }
    e: for (d = null, k = e;;) {
     if (k.tag === 5) {
      if (d === null) {
       d = k;
       try {
        l = k.stateNode, h ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (s = k.stateNode, a = k.memoizedProps.style, i =
         a != null && a.hasOwnProperty("display") ? a.display : null, s.style.display = Nu("display", i))
       } catch (p) {
        ie(e, e.return, p)
       }
      }
     } else if (k.tag === 6) {
      if (d === null) try {
       k.stateNode.nodeValue = h ? "" : k.memoizedProps
      } catch (p) {
       ie(e, e.return, p)
      }
     } else if ((k.tag !== 22 && k.tag !== 23 || k.memoizedState === null || k === e) && k.child !== null) {
      k.child.return = k, k = k.child;
      continue
     }
     if (k === e) break e;
     for (; k.sibling === null;) {
      if (k.return === null || k.return === e) break e;
      d === k && (d = null), k = k.return
     }
     d === k && (d = null), k.sibling.return = k.return, k = k.sibling
    }
   }
   break;
  case 19:
   be(t, e), lt(e), r & 4 && La(e);
   break;
  case 21:
   break;
  default:
   be(t, e), lt(e)
 }
}

function lt(e) {
 var t = e.flags;
 if (t & 2) {
  try {
   e: {
    for (var n = e.return; n !== null;) {
     if (ed(n)) {
      var r = n;
      break e
     }
     n = n.return
    }
    throw Error(R(160))
   }
   switch (r.tag) {
    case 5:
     var l = r.stateNode;
     r.flags & 32 && (yr(l, ""), r.flags &= -33);
     var o = za(e);
     Ti(e, o, l);
     break;
    case 3:
    case 4:
     var i = r.stateNode.containerInfo,
      s = za(e);
     Pi(e, s, i);
     break;
    default:
     throw Error(R(161))
   }
  }
  catch (a) {
   ie(e, e.return, a)
  }
  e.flags &= -3
 }
 t & 4096 && (e.flags &= -4097)
}

function tp(e, t, n) {
 z = e, rd(e)
}

function rd(e, t, n) {
 for (var r = (e.mode & 1) !== 0; z !== null;) {
  var l = z,
   o = l.child;
  if (l.tag === 22 && r) {
   var i = l.memoizedState !== null || el;
   if (!i) {
    var s = l.alternate,
     a = s !== null && s.memoizedState !== null || Ce;
    s = el;
    var h = Ce;
    if (el = i, (Ce = a) && !h)
     for (z = l; z !== null;) i = z, a = i.child, i.tag === 22 && i.memoizedState !== null ? Fa(l) : a !== null ? (a.return = i, z = a) : Fa(l);
    for (; o !== null;) z = o, rd(o), o = o.sibling;
    z = l, el = s, Ce = h
   }
   Oa(e)
  } else l.subtreeFlags & 8772 && o !== null ? (o.return = l, z = o) : Oa(e)
 }
}

function Oa(e) {
 for (; z !== null;) {
  var t = z;
  if (t.flags & 8772) {
   var n = t.alternate;
   try {
    if (t.flags & 8772) switch (t.tag) {
     case 0:
     case 11:
     case 15:
      Ce || eo(5, t);
      break;
     case 1:
      var r = t.stateNode;
      if (t.flags & 4 && !Ce)
       if (n === null) r.componentDidMount();
       else {
        var l = t.elementType === t.type ? n.memoizedProps : qe(t.type, n.memoizedProps);
        r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate)
       } var o = t.updateQueue;
      o !== null && xa(t, o, r);
      break;
     case 3:
      var i = t.updateQueue;
      if (i !== null) {
       if (n = null, t.child !== null) switch (t.child.tag) {
        case 5:
         n = t.child.stateNode;
         break;
        case 1:
         n = t.child.stateNode
       }
       xa(t, i, n)
      }
      break;
     case 5:
      var s = t.stateNode;
      if (n === null && t.flags & 4) {
       n = s;
       var a = t.memoizedProps;
       switch (t.type) {
        case "button":
        case "input":
        case "select":
        case "textarea":
         a.autoFocus && n.focus();
         break;
        case "img":
         a.src && (n.src = a.src)
       }
      }
      break;
     case 6:
      break;
     case 4:
      break;
     case 12:
      break;
     case 13:
      if (t.memoizedState === null) {
       var h = t.alternate;
       if (h !== null) {
        var d = h.memoizedState;
        if (d !== null) {
         var k = d.dehydrated;
         k !== null && xr(k)
        }
       }
      }
      break;
     case 19:
     case 17:
     case 21:
     case 22:
     case 23:
     case 25:
      break;
     default:
      throw Error(R(163))
    }
    Ce || t.flags & 512 && Ei(t)
   } catch (x) {
    ie(t, t.return, x)
   }
  }
  if (t === e) {
   z = null;
   break
  }
  if (n = t.sibling, n !== null) {
   n.return = t.return, z = n;
   break
  }
  z = t.return
 }
}

function Ua(e) {
 for (; z !== null;) {
  var t = z;
  if (t === e) {
   z = null;
   break
  }
  var n = t.sibling;
  if (n !== null) {
   n.return = t.return, z = n;
   break
  }
  z = t.return
 }
}

function Fa(e) {
 for (; z !== null;) {
  var t = z;
  try {
   switch (t.tag) {
    case 0:
    case 11:
    case 15:
     var n = t.return;
     try {
      eo(4, t)
     } catch (a) {
      ie(t, n, a)
     }
     break;
    case 1:
     var r = t.stateNode;
     if (typeof r.componentDidMount == "function") {
      var l = t.return;
      try {
       r.componentDidMount()
      } catch (a) {
       ie(t, l, a)
      }
     }
     var o = t.return;
     try {
      Ei(t)
     } catch (a) {
      ie(t, o, a)
     }
     break;
    case 5:
     var i = t.return;
     try {
      Ei(t)
     } catch (a) {
      ie(t, i, a)
     }
   }
  } catch (a) {
   ie(t, t.return, a)
  }
  if (t === e) {
   z = null;
   break
  }
  var s = t.sibling;
  if (s !== null) {
   s.return = t.return, z = s;
   break
  }
  z = t.return
 }
}
var np = Math.ceil,
 Ll = St.ReactCurrentDispatcher,
 ys = St.ReactCurrentOwner,
 Ye = St.ReactCurrentBatchConfig,
 G = 0,
 ge = null,
 ue = null,
 ye = 0,
 Le = 0,
 Pn = Kt(0),
 fe = 0,
 Rr = null,
 on = 0,
 to = 0,
 ks = 0,
 mr = null,
 je = null,
 ws = 0,
 Un = 1 / 0,
 ft = null,
 Ol = !1,
 Mi = null,
 Lt = null,
 tl = !1,
 It = null,
 Ul = 0,
 gr = 0,
 Ni = null,
 pl = -1,
 hl = 0;

function Te() {
 return G & 6 ? ae() : pl !== -1 ? pl : pl = ae()
}

function Ot(e) {
 return e.mode & 1 ? G & 2 && ye !== 0 ? ye & -ye : U0.transition !== null ? (hl === 0 && (hl = Bu()), hl) : (e = q, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Gu(e.type)), e) : 1
}

function nt(e, t, n, r) {
 if (50 < gr) throw gr = 0, Ni = null, Error(R(185));
 zr(e, n, r), (!(G & 2) || e !== ge) && (e === ge && (!(G & 2) && (to |= n), fe === 4 && Nt(e, ye)), ze(e, r), n === 1 && G === 0 && !(t.mode & 1) && (Un = ae() + 500, ql && Wt()))
}

function ze(e, t) {
 var n = e.callbackNode;
 Uf(e, t);
 var r = xl(e, e === ge ? ye : 0);
 if (r === 0) n !== null && Xs(n), e.callbackNode = null, e.callbackPriority = 0;
 else if (t = r & -r, e.callbackPriority !== t) {
  if (n != null && Xs(n), t === 1) e.tag === 0 ? O0(Ba.bind(null, e)) : pc(Ba.bind(null, e)), A0(function() {
   !(G & 6) && Wt()
  }), n = null;
  else {
   switch (Hu(r)) {
    case 1:
     n = Yi;
     break;
    case 4:
     n = Uu;
     break;
    case 16:
     n = Sl;
     break;
    case 536870912:
     n = Fu;
     break;
    default:
     n = Sl
   }
   n = dd(n, ld.bind(null, e))
  }
  e.callbackPriority = t, e.callbackNode = n
 }
}

function ld(e, t) {
 if (pl = -1, hl = 0, G & 6) throw Error(R(327));
 var n = e.callbackNode;
 if (_n() && e.callbackNode !== n) return null;
 var r = xl(e, e === ge ? ye : 0);
 if (r === 0) return null;
 if (r & 30 || r & e.expiredLanes || t) t = Fl(e, r);
 else {
  t = r;
  var l = G;
  G |= 2;
  var o = id();
  (ge !== e || ye !== t) && (ft = null, Un = ae() + 500, Jt(e, t));
  do try {
   op();
   break
  } catch (s) {
   od(e, s)
  }
  while (!0);
  os(), Ll.current = o, G = l, ue !== null ? t = 0 : (ge = null, ye = 0, t = fe)
 }
 if (t !== 0) {
  if (t === 2 && (l = ti(e), l !== 0 && (r = l, t = $i(e, l))), t === 1) throw n = Rr, Jt(e, 0), Nt(e, r), ze(e, ae()), n;
  if (t === 6) Nt(e, r);
  else {
   if (l = e.current.alternate, !(r & 30) && !rp(l) && (t = Fl(e, r), t === 2 && (o = ti(e), o !== 0 && (r = o, t = $i(e, o))), t === 1)) throw n = Rr, Jt(e, 0), Nt(e, r), ze(e, ae()), n;
   switch (e.finishedWork = l, e.finishedLanes = r, t) {
    case 0:
    case 1:
     throw Error(R(345));
    case 2:
     Xt(e, je, ft);
     break;
    case 3:
     if (Nt(e, r), (r & 130023424) === r && (t = ws + 500 - ae(), 10 < t)) {
      if (xl(e, 0) !== 0) break;
      if (l = e.suspendedLanes, (l & r) !== r) {
       Te(), e.pingedLanes |= e.suspendedLanes & l;
       break
      }
      e.timeoutHandle = ui(Xt.bind(null, e, je, ft), t);
      break
     }
     Xt(e, je, ft);
     break;
    case 4:
     if (Nt(e, r), (r & 4194240) === r) break;
     for (t = e.eventTimes, l = -1; 0 < r;) {
      var i = 31 - tt(r);
      o = 1 << i, i = t[i], i > l && (l = i), r &= ~o
     }
     if (r = l, r = ae() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * np(r / 1960)) - r, 10 < r) {
      e.timeoutHandle = ui(Xt.bind(null, e, je, ft), r);
      break
     }
     Xt(e, je, ft);
     break;
    case 5:
     Xt(e, je, ft);
     break;
    default:
     throw Error(R(329))
   }
  }
 }
 return ze(e, ae()), e.callbackNode === n ? ld.bind(null, e) : null
}

function $i(e, t) {
 var n = mr;
 return e.current.memoizedState.isDehydrated && (Jt(e, t).flags |= 256), e = Fl(e, t), e !== 2 && (t = je, je = n, t !== null && Ii(t)), e
}

function Ii(e) {
 je === null ? je = e : je.push.apply(je, e)
}

function rp(e) {
 for (var t = e;;) {
  if (t.flags & 16384) {
   var n = t.updateQueue;
   if (n !== null && (n = n.stores, n !== null))
    for (var r = 0; r < n.length; r++) {
     var l = n[r],
      o = l.getSnapshot;
     l = l.value;
     try {
      if (!rt(o(), l)) return !1
     } catch {
      return !1
     }
    }
  }
  if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
  else {
   if (t === e) break;
   for (; t.sibling === null;) {
    if (t.return === null || t.return === e) return !0;
    t = t.return
   }
   t.sibling.return = t.return, t = t.sibling
  }
 }
 return !0
}

function Nt(e, t) {
 for (t &= ~ks, t &= ~to, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t;) {
  var n = 31 - tt(t),
   r = 1 << n;
  e[n] = -1, t &= ~r
 }
}

function Ba(e) {
 if (G & 6) throw Error(R(327));
 _n();
 var t = xl(e, 0);
 if (!(t & 1)) return ze(e, ae()), null;
 var n = Fl(e, t);
 if (e.tag !== 0 && n === 2) {
  var r = ti(e);
  r !== 0 && (t = r, n = $i(e, r))
 }
 if (n === 1) throw n = Rr, Jt(e, 0), Nt(e, t), ze(e, ae()), n;
 if (n === 6) throw Error(R(345));
 return e.finishedWork = e.current.alternate, e.finishedLanes = t, Xt(e, je, ft), ze(e, ae()), null
}

function Ss(e, t) {
 var n = G;
 G |= 1;
 try {
  return e(t)
 } finally {
  G = n, G === 0 && (Un = ae() + 500, ql && Wt())
 }
}

function sn(e) {
 It !== null && It.tag === 0 && !(G & 6) && _n();
 var t = G;
 G |= 1;
 var n = Ye.transition,
  r = q;
 try {
  if (Ye.transition = null, q = 1, e) return e()
 } finally {
  q = r, Ye.transition = n, G = t, !(G & 6) && Wt()
 }
}

function xs() {
 Le = Pn.current, te(Pn)
}

function Jt(e, t) {
 e.finishedWork = null, e.finishedLanes = 0;
 var n = e.timeoutHandle;
 if (n !== -1 && (e.timeoutHandle = -1, R0(n)), ue !== null)
  for (n = ue.return; n !== null;) {
   var r = n;
   switch (ns(r), r.tag) {
    case 1:
     r = r.type.childContextTypes, r != null && Ml();
     break;
    case 3:
     Ln(), te(Ae), te(Ee), ds();
     break;
    case 5:
     cs(r);
     break;
    case 4:
     Ln();
     break;
    case 13:
     te(re);
     break;
    case 19:
     te(re);
     break;
    case 10:
     is(r.type._context);
     break;
    case 22:
    case 23:
     xs()
   }
   n = n.return
  }
 if (ge = e, ue = e = Ut(e.current, null), ye = Le = t, fe = 0, Rr = null, ks = to = on = 0, je = mr = null, qt !== null) {
  for (t = 0; t < qt.length; t++)
   if (n = qt[t], r = n.interleaved, r !== null) {
    n.interleaved = null;
    var l = r.next,
     o = n.pending;
    if (o !== null) {
     var i = o.next;
     o.next = l, r.next = i
    }
    n.pending = r
   } qt = null
 }
 return e
}

function od(e, t) {
 do {
  var n = ue;
  try {
   if (os(), cl.current = zl, Dl) {
    for (var r = le.memoizedState; r !== null;) {
     var l = r.queue;
     l !== null && (l.pending = null), r = r.next
    }
    Dl = !1
   }
   if (ln = 0, he = de = le = null, pr = !1, Ir = 0, ys.current = null, n === null || n.return === null) {
    fe = 1, Rr = t, ue = null;
    break
   }
   e: {
    var o = e,
     i = n.return,
     s = n,
     a = t;
    if (t = ye, s.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
     var h = a,
      d = s,
      k = d.tag;
     if (!(d.mode & 1) && (k === 0 || k === 11 || k === 15)) {
      var x = d.alternate;
      x ? (d.updateQueue = x.updateQueue, d.memoizedState = x.memoizedState, d.lanes = x.lanes) : (d.updateQueue = null, d.memoizedState = null)
     }
     var v = Na(i);
     if (v !== null) {
      v.flags &= -257, $a(v, i, s, o, t), v.mode & 1 && Ma(o, h, t), t = v, a = h;
      var N = t.updateQueue;
      if (N === null) {
       var p = new Set;
       p.add(a), t.updateQueue = p
      } else N.add(a);
      break e
     } else {
      if (!(t & 1)) {
       Ma(o, h, t), Cs();
       break e
      }
      a = Error(R(426))
     }
    } else if (ne && s.mode & 1) {
     var P = Na(i);
     if (P !== null) {
      !(P.flags & 65536) && (P.flags |= 256), $a(P, i, s, o, t), rs(On(a, s));
      break e
     }
    }
    o = a = On(a, s),
    fe !== 4 && (fe = 2),
    mr === null ? mr = [o] : mr.push(o),
    o = i;do {
     switch (o.tag) {
      case 3:
       o.flags |= 65536, t &= -t, o.lanes |= t;
       var u = Hc(o, a, t);
       Sa(o, u);
       break e;
      case 1:
       s = a;
       var f = o.type,
        c = o.stateNode;
       if (!(o.flags & 128) && (typeof f.getDerivedStateFromError == "function" || c !== null && typeof c.componentDidCatch == "function" && (Lt === null || !Lt.has(c)))) {
        o.flags |= 65536, t &= -t, o.lanes |= t;
        var y = Vc(o, s, t);
        Sa(o, y);
        break e
       }
     }
     o = o.return
    } while (o !== null)
   }
   ad(n)
  } catch (M) {
   t = M, ue === n && n !== null && (ue = n = n.return);
   continue
  }
  break
 } while (!0)
}

function id() {
 var e = Ll.current;
 return Ll.current = zl, e === null ? zl : e
}

function Cs() {
 (fe === 0 || fe === 3 || fe === 2) && (fe = 4), ge === null || !(on & 268435455) && !(to & 268435455) || Nt(ge, ye)
}

function Fl(e, t) {
 var n = G;
 G |= 2;
 var r = id();
 (ge !== e || ye !== t) && (ft = null, Jt(e, t));
 do try {
  lp();
  break
 } catch (l) {
  od(e, l)
 }
 while (!0);
 if (os(), G = n, Ll.current = r, ue !== null) throw Error(R(261));
 return ge = null, ye = 0, fe
}

function lp() {
 for (; ue !== null;) sd(ue)
}

function op() {
 for (; ue !== null && !If();) sd(ue)
}

function sd(e) {
 var t = cd(e.alternate, e, Le);
 e.memoizedProps = e.pendingProps, t === null ? ad(e) : ue = t, ys.current = null
}

function ad(e) {
 var t = e;
 do {
  var n = t.alternate;
  if (e = t.return, t.flags & 32768) {
   if (n = Z0(n, t), n !== null) {
    n.flags &= 32767, ue = n;
    return
   }
   if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
   else {
    fe = 6, ue = null;
    return
   }
  } else if (n = q0(n, t, Le), n !== null) {
   ue = n;
   return
  }
  if (t = t.sibling, t !== null) {
   ue = t;
   return
  }
  ue = t = e
 } while (t !== null);
 fe === 0 && (fe = 5)
}

function Xt(e, t, n) {
 var r = q,
  l = Ye.transition;
 try {
  Ye.transition = null, q = 1, ip(e, t, n, r)
 } finally {
  Ye.transition = l, q = r
 }
 return null
}

function ip(e, t, n, r) {
 do _n(); while (It !== null);
 if (G & 6) throw Error(R(327));
 n = e.finishedWork;
 var l = e.finishedLanes;
 if (n === null) return null;
 if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(R(177));
 e.callbackNode = null, e.callbackPriority = 0;
 var o = n.lanes | n.childLanes;
 if (Ff(e, o), e === ge && (ue = ge = null, ye = 0), !(n.subtreeFlags & 2064) && !(n.flags & 2064) || tl || (tl = !0, dd(Sl, function() {
   return _n(), null
  })), o = (n.flags & 15990) !== 0, n.subtreeFlags & 15990 || o) {
  o = Ye.transition, Ye.transition = null;
  var i = q;
  q = 1;
  var s = G;
  G |= 4, ys.current = null, ep(e, n), nd(n, e), T0(si), Cl = !!ii, si = ii = null, e.current = n, tp(n), jf(), G = s, q = i, Ye.transition = o
 } else e.current = n;
 if (tl && (tl = !1, It = e, Ul = l), o = e.pendingLanes, o === 0 && (Lt = null), Af(n.stateNode), ze(e, ae()), t !== null)
  for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, {
   componentStack: l.stack,
   digest: l.digest
  });
 if (Ol) throw Ol = !1, e = Mi, Mi = null, e;
 return Ul & 1 && e.tag !== 0 && _n(), o = e.pendingLanes, o & 1 ? e === Ni ? gr++ : (gr = 0, Ni = e) : gr = 0, Wt(), null
}

function _n() {
 if (It !== null) {
  var e = Hu(Ul),
   t = Ye.transition,
   n = q;
  try {
   if (Ye.transition = null, q = 16 > e ? 16 : e, It === null) var r = !1;
   else {
    if (e = It, It = null, Ul = 0, G & 6) throw Error(R(331));
    var l = G;
    for (G |= 4, z = e.current; z !== null;) {
     var o = z,
      i = o.child;
     if (z.flags & 16) {
      var s = o.deletions;
      if (s !== null) {
       for (var a = 0; a < s.length; a++) {
        var h = s[a];
        for (z = h; z !== null;) {
         var d = z;
         switch (d.tag) {
          case 0:
          case 11:
          case 15:
           hr(8, d, o)
         }
         var k = d.child;
         if (k !== null) k.return = d, z = k;
         else
          for (; z !== null;) {
           d = z;
           var x = d.sibling,
            v = d.return;
           if (Jc(d), d === h) {
            z = null;
            break
           }
           if (x !== null) {
            x.return = v, z = x;
            break
           }
           z = v
          }
        }
       }
       var N = o.alternate;
       if (N !== null) {
        var p = N.child;
        if (p !== null) {
         N.child = null;
         do {
          var P = p.sibling;
          p.sibling = null, p = P
         } while (p !== null)
        }
       }
       z = o
      }
     }
     if (o.subtreeFlags & 2064 && i !== null) i.return = o, z = i;
     else e: for (; z !== null;) {
      if (o = z, o.flags & 2048) switch (o.tag) {
       case 0:
       case 11:
       case 15:
        hr(9, o, o.return)
      }
      var u = o.sibling;
      if (u !== null) {
       u.return = o.return, z = u;
       break e
      }
      z = o.return
     }
    }
    var f = e.current;
    for (z = f; z !== null;) {
     i = z;
     var c = i.child;
     if (i.subtreeFlags & 2064 && c !== null) c.return = i, z = c;
     else e: for (i = f; z !== null;) {
      if (s = z, s.flags & 2048) try {
       switch (s.tag) {
        case 0:
        case 11:
        case 15:
         eo(9, s)
       }
      } catch (M) {
       ie(s, s.return, M)
      }
      if (s === i) {
       z = null;
       break e
      }
      var y = s.sibling;
      if (y !== null) {
       y.return = s.return, z = y;
       break e
      }
      z = s.return
     }
    }
    if (G = l, Wt(), at && typeof at.onPostCommitFiberRoot == "function") try {
     at.onPostCommitFiberRoot(Yl, e)
    } catch {}
    r = !0
   }
   return r
  } finally {
   q = n, Ye.transition = t
  }
 }
 return !1
}

function Ha(e, t, n) {
 t = On(n, t), t = Hc(e, t, 1), e = zt(e, t, 1), t = Te(), e !== null && (zr(e, 1, t), ze(e, t))
}

function ie(e, t, n) {
 if (e.tag === 3) Ha(e, e, n);
 else
  for (; t !== null;) {
   if (t.tag === 3) {
    Ha(t, e, n);
    break
   } else if (t.tag === 1) {
    var r = t.stateNode;
    if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Lt === null || !Lt.has(r))) {
     e = On(n, e), e = Vc(t, e, 1), t = zt(t, e, 1), e = Te(), t !== null && (zr(t, 1, e), ze(t, e));
     break
    }
   }
   t = t.return
  }
}

function sp(e, t, n) {
 var r = e.pingCache;
 r !== null && r.delete(t), t = Te(), e.pingedLanes |= e.suspendedLanes & n, ge === e && (ye & n) === n && (fe === 4 || fe === 3 && (ye & 130023424) === ye && 500 > ae() - ws ? Jt(e, 0) : ks |= n),
  ze(e, t)
}

function ud(e, t) {
 t === 0 && (e.mode & 1 ? (t = Wr, Wr <<= 1, !(Wr & 130023424) && (Wr = 4194304)) : t = 1);
 var n = Te();
 e = kt(e, t), e !== null && (zr(e, t, n), ze(e, n))
}

function ap(e) {
 var t = e.memoizedState,
  n = 0;
 t !== null && (n = t.retryLane), ud(e, n)
}

function up(e, t) {
 var n = 0;
 switch (e.tag) {
  case 13:
   var r = e.stateNode,
    l = e.memoizedState;
   l !== null && (n = l.retryLane);
   break;
  case 19:
   r = e.stateNode;
   break;
  default:
   throw Error(R(314))
 }
 r !== null && r.delete(t), ud(e, n)
}
var cd;
cd = function(e, t, n) {
 if (e !== null)
  if (e.memoizedProps !== t.pendingProps || Ae.current) Re = !0;
  else {
   if (!(e.lanes & n) && !(t.flags & 128)) return Re = !1, b0(e, t, n);
   Re = !!(e.flags & 131072)
  }
 else Re = !1, ne && t.flags & 1048576 && hc(t, Il, t.index);
 switch (t.lanes = 0, t.tag) {
  case 2:
   var r = t.type;
   fl(e, t), e = t.pendingProps;
   var l = An(t, Ee.current);
   jn(t, n), l = ps(null, t, r, e, l, n);
   var o = hs();
   return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, De(r) ? (o = !0, Nl(
    t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, as(t), l.updater = Jl, t.stateNode = l, l._reactInternals = t, gi(t, r, e, n), t = ki(null, t, r, !0, o,
    n)) : (t.tag = 0, ne && o && ts(t), Pe(null, t, l, n), t = t.child), t;
  case 16:
   r = t.elementType;
   e: {
    switch (fl(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = dp(r), e = qe(r, e), l) {
     case 0:
      t = yi(null, t, r, e, n);
      break e;
     case 1:
      t = _a(null, t, r, e, n);
      break e;
     case 11:
      t = Ia(null, t, r, e, n);
      break e;
     case 14:
      t = ja(null, t, r, qe(r.type, e), n);
      break e
    }
    throw Error(R(306, r, ""))
   }
   return t;
  case 0:
   return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : qe(r, l), yi(e, t, r, l, n);
  case 1:
   return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : qe(r, l), _a(e, t, r, l, n);
  case 3:
   e: {
    if (Qc(t), e === null) throw Error(R(387));r = t.pendingProps,
    o = t.memoizedState,
    l = o.element,
    wc(e, t),
    Rl(t, r, null, n);
    var i = t.memoizedState;
    if (r = i.element, o.isDehydrated)
     if (o = {
       element: r,
       isDehydrated: !1,
       cache: i.cache,
       pendingSuspenseBoundaries: i.pendingSuspenseBoundaries,
       transitions: i.transitions
      }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
      l = On(Error(R(423)), t), t = Ra(e, t, r, n, l);
      break e
     } else if (r !== l) {
     l = On(Error(R(424)), t), t = Ra(e, t, r, n, l);
     break e
    } else
     for (Oe = Dt(t.stateNode.containerInfo.firstChild), Ue = t, ne = !0, et = null, n = yc(t, null, r, n), t.child = n; n;) n.flags = n.flags & -3 | 4096, n = n.sibling;
    else {
     if (Dn(), r === l) {
      t = wt(e, t, n);
      break e
     }
     Pe(e, t, r, n)
    }
    t = t.child
   }
   return t;
  case 5:
   return Sc(t), e === null && pi(t), r = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, i = l.children, ai(r, l) ? i = null : o !== null && ai(r, o) && (t.flags |= 32), Yc(e,
    t), Pe(e, t, i, n), t.child;
  case 6:
   return e === null && pi(t), null;
  case 13:
   return Gc(e, t, n);
  case 4:
   return us(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = zn(t, null, r, n) : Pe(e, t, r, n), t.child;
  case 11:
   return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : qe(r, l), Ia(e, t, r, l, n);
  case 7:
   return Pe(e, t, t.pendingProps, n), t.child;
  case 8:
   return Pe(e, t, t.pendingProps.children, n), t.child;
  case 12:
   return Pe(e, t, t.pendingProps.children, n), t.child;
  case 10:
   e: {
    if (r = t.type._context, l = t.pendingProps, o = t.memoizedProps, i = l.value, J(jl, r._currentValue), r._currentValue = i, o !== null)
     if (rt(o.value, i)) {
      if (o.children === l.children && !Ae.current) {
       t = wt(e, t, n);
       break e
      }
     } else
      for (o = t.child, o !== null && (o.return = t); o !== null;) {
       var s = o.dependencies;
       if (s !== null) {
        i = o.child;
        for (var a = s.firstContext; a !== null;) {
         if (a.context === r) {
          if (o.tag === 1) {
           a = gt(-1, n & -n), a.tag = 2;
           var h = o.updateQueue;
           if (h !== null) {
            h = h.shared;
            var d = h.pending;
            d === null ? a.next = a : (a.next = d.next, d.next = a), h.pending = a
           }
          }
          o.lanes |= n, a = o.alternate, a !== null && (a.lanes |= n), hi(o.return, n, t), s.lanes |= n;
          break
         }
         a = a.next
        }
       } else if (o.tag === 10) i = o.type === t.type ? null : o.child;
       else if (o.tag === 18) {
        if (i = o.return, i === null) throw Error(R(341));
        i.lanes |= n, s = i.alternate, s !== null && (s.lanes |= n), hi(i, n, t), i = o.sibling
       } else i = o.child;
       if (i !== null) i.return = o;
       else
        for (i = o; i !== null;) {
         if (i === t) {
          i = null;
          break
         }
         if (o = i.sibling, o !== null) {
          o.return = i.return, i = o;
          break
         }
         i = i.return
        }
       o = i
      }
    Pe(e, t, l.children, n),
    t = t.child
   }
   return t;
  case 9:
   return l = t.type, r = t.pendingProps.children, jn(t, n), l = Qe(l), r = r(l), t.flags |= 1, Pe(e, t, r, n), t.child;
  case 14:
   return r = t.type, l = qe(r, t.pendingProps), l = qe(r.type, l), ja(e, t, r, l, n);
  case 15:
   return Kc(e, t, t.type, t.pendingProps, n);
  case 17:
   return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : qe(r, l), fl(e, t), t.tag = 1, De(r) ? (e = !0, Nl(t)) : e = !1, jn(t, n), Bc(t, r, l), gi(t, r, l, n), ki(null, t, r, !0, e,
    n);
  case 19:
   return Xc(e, t, n);
  case 22:
   return Wc(e, t, n)
 }
 throw Error(R(156, t.tag))
};

function dd(e, t) {
 return Ou(e, t)
}

function cp(e, t, n, r) {
 this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies =
  this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null
}

function We(e, t, n, r) {
 return new cp(e, t, n, r)
}

function Es(e) {
 return e = e.prototype, !(!e || !e.isReactComponent)
}

function dp(e) {
 if (typeof e == "function") return Es(e) ? 1 : 0;
 if (e != null) {
  if (e = e.$$typeof, e === Vi) return 11;
  if (e === Ki) return 14
 }
 return 2
}

function Ut(e, t) {
 var n = e.alternate;
 return n === null ? (n = We(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e
   .type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n
  .memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : {
   lanes: t.lanes,
   firstContext: t.firstContext
  }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n
}

function ml(e, t, n, r, l, o) {
 var i = 2;
 if (r = e, typeof e == "function") Es(e) && (i = 1);
 else if (typeof e == "string") i = 5;
 else e: switch (e) {
  case mn:
   return en(n.children, l, o, t);
  case Hi:
   i = 8, l |= 8;
   break;
  case Fo:
   return e = We(12, n, t, l | 2), e.elementType = Fo, e.lanes = o, e;
  case Bo:
   return e = We(13, n, t, l), e.elementType = Bo, e.lanes = o, e;
  case Ho:
   return e = We(19, n, t, l), e.elementType = Ho, e.lanes = o, e;
  case Su:
   return no(n, l, o, t);
  default:
   if (typeof e == "object" && e !== null) switch (e.$$typeof) {
    case ku:
     i = 10;
     break e;
    case wu:
     i = 9;
     break e;
    case Vi:
     i = 11;
     break e;
    case Ki:
     i = 14;
     break e;
    case Pt:
     i = 16, r = null;
     break e
   }
   throw Error(R(130, e == null ? e : typeof e, ""))
 }
 return t = We(i, n, t, l), t.elementType = e, t.type = r, t.lanes = o, t
}

function en(e, t, n, r) {
 return e = We(7, e, r, t), e.lanes = n, e
}

function no(e, t, n, r) {
 return e = We(22, e, r, t), e.elementType = Su, e.lanes = n, e.stateNode = {
  isHidden: !1
 }, e
}

function Ao(e, t, n) {
 return e = We(6, e, null, t), e.lanes = n, e
}

function Do(e, t, n) {
 return t = We(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = {
  containerInfo: e.containerInfo,
  pendingChildren: null,
  implementation: e.implementation
 }, t
}

function fp(e, t, n, r, l) {
 this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this
  .context = null, this.callbackPriority = 0, this.eventTimes = mo(0), this.expirationTimes = mo(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this
  .pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = mo(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null
}

function Ps(e, t, n, r, l, o, i, s, a) {
 return e = new fp(e, t, n, s, a), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = We(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = {
  element: r,
  isDehydrated: n,
  cache: null,
  transitions: null,
  pendingSuspenseBoundaries: null
 }, as(o), e
}

function pp(e, t, n) {
 var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
 return {
  $$typeof: hn,
  key: r == null ? null : "" + r,
  children: e,
  containerInfo: t,
  implementation: n
 }
}

function fd(e) {
 if (!e) return Ht;
 e = e._reactInternals;
 e: {
  if (un(e) !== e || e.tag !== 1) throw Error(R(170));
  var t = e;do {
   switch (t.tag) {
    case 3:
     t = t.stateNode.context;
     break e;
    case 1:
     if (De(t.type)) {
      t = t.stateNode.__reactInternalMemoizedMergedChildContext;
      break e
     }
   }
   t = t.return
  } while (t !== null);
  throw Error(R(171))
 }
 if (e.tag === 1) {
  var n = e.type;
  if (De(n)) return fc(e, n, t)
 }
 return t
}

function pd(e, t, n, r, l, o, i, s, a) {
 return e = Ps(n, r, !0, e, l, o, i, s, a), e.context = fd(null), n = e.current, r = Te(), l = Ot(n), o = gt(r, l), o.callback = t ?? null, zt(n, o, l), e.current.lanes = l, zr(e, l, r), ze(e, r), e
}

function ro(e, t, n, r) {
 var l = t.current,
  o = Te(),
  i = Ot(l);
 return n = fd(n), t.context === null ? t.context = n : t.pendingContext = n, t = gt(o, i), t.payload = {
  element: e
 }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = zt(l, t, i), e !== null && (nt(e, l, i, o), ul(e, l, i)), i
}

function Bl(e) {
 if (e = e.current, !e.child) return null;
 switch (e.child.tag) {
  case 5:
   return e.child.stateNode;
  default:
   return e.child.stateNode
 }
}

function Va(e, t) {
 if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
  var n = e.retryLane;
  e.retryLane = n !== 0 && n < t ? n : t
 }
}

function Ts(e, t) {
 Va(e, t), (e = e.alternate) && Va(e, t)
}

function hp() {
 return null
}
var hd = typeof reportError == "function" ? reportError : function(e) {
 console.error(e)
};

function Ms(e) {
 this._internalRoot = e
}
lo.prototype.render = Ms.prototype.render = function(e) {
 var t = this._internalRoot;
 if (t === null) throw Error(R(409));
 ro(e, t, null, null)
};
lo.prototype.unmount = Ms.prototype.unmount = function() {
 var e = this._internalRoot;
 if (e !== null) {
  this._internalRoot = null;
  var t = e.containerInfo;
  sn(function() {
   ro(null, e, null, null)
  }), t[yt] = null
 }
};

function lo(e) {
 this._internalRoot = e
}
lo.prototype.unstable_scheduleHydration = function(e) {
 if (e) {
  var t = Wu();
  e = {
   blockedOn: null,
   target: e,
   priority: t
  };
  for (var n = 0; n < Mt.length && t !== 0 && t < Mt[n].priority; n++);
  Mt.splice(n, 0, e), n === 0 && Qu(e)
 }
};

function Ns(e) {
 return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11)
}

function oo(e) {
 return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
}

function Ka() {}

function mp(e, t, n, r, l) {
 if (l) {
  if (typeof r == "function") {
   var o = r;
   r = function() {
    var h = Bl(i);
    o.call(h)
   }
  }
  var i = pd(t, r, e, 0, null, !1, !1, "", Ka);
  return e._reactRootContainer = i, e[yt] = i.current, Pr(e.nodeType === 8 ? e.parentNode : e), sn(), i
 }
 for (; l = e.lastChild;) e.removeChild(l);
 if (typeof r == "function") {
  var s = r;
  r = function() {
   var h = Bl(a);
   s.call(h)
  }
 }
 var a = Ps(e, 0, !1, null, null, !1, !1, "", Ka);
 return e._reactRootContainer = a, e[yt] = a.current, Pr(e.nodeType === 8 ? e.parentNode : e), sn(function() {
  ro(t, a, n, r)
 }), a
}

function io(e, t, n, r, l) {
 var o = n._reactRootContainer;
 if (o) {
  var i = o;
  if (typeof l == "function") {
   var s = l;
   l = function() {
    var a = Bl(i);
    s.call(a)
   }
  }
  ro(t, i, e, l)
 } else i = mp(n, t, e, l, r);
 return Bl(i)
}
Vu = function(e) {
 switch (e.tag) {
  case 3:
   var t = e.stateNode;
   if (t.current.memoizedState.isDehydrated) {
    var n = lr(t.pendingLanes);
    n !== 0 && (Qi(t, n | 1), ze(t, ae()), !(G & 6) && (Un = ae() + 500, Wt()))
   }
   break;
  case 13:
   sn(function() {
    var r = kt(e, 1);
    if (r !== null) {
     var l = Te();
     nt(r, e, 1, l)
    }
   }), Ts(e, 1)
 }
};
Gi = function(e) {
 if (e.tag === 13) {
  var t = kt(e, 134217728);
  if (t !== null) {
   var n = Te();
   nt(t, e, 134217728, n)
  }
  Ts(e, 134217728)
 }
};
Ku = function(e) {
 if (e.tag === 13) {
  var t = Ot(e),
   n = kt(e, t);
  if (n !== null) {
   var r = Te();
   nt(n, e, t, r)
  }
  Ts(e, t)
 }
};
Wu = function() {
 return q
};
Yu = function(e, t) {
 var n = q;
 try {
  return q = e, t()
 } finally {
  q = n
 }
};
Zo = function(e, t, n) {
 switch (t) {
  case "input":
   if (Wo(e, n), t = n.name, n.type === "radio" && t != null) {
    for (n = e; n.parentNode;) n = n.parentNode;
    for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
     var r = n[t];
     if (r !== e && r.form === e.form) {
      var l = bl(r);
      if (!l) throw Error(R(90));
      Cu(r), Wo(r, l)
     }
    }
   }
   break;
  case "textarea":
   Pu(e, n);
   break;
  case "select":
   t = n.value, t != null && Mn(e, !!n.multiple, t, !1)
 }
};
_u = Ss;
Ru = sn;
var gp = {
  usingClientEntryPoint: !1,
  Events: [Or, kn, bl, Iu, ju, Ss]
 },
 Jn = {
  findFiberByHostInstance: bt,
  bundleType: 0,
  version: "18.3.1",
  rendererPackageName: "react-dom"
 },
 vp = {
  bundleType: Jn.bundleType,
  version: Jn.version,
  rendererPackageName: Jn.rendererPackageName,
  rendererConfig: Jn.rendererConfig,
  overrideHookState: null,
  overrideHookStateDeletePath: null,
  overrideHookStateRenamePath: null,
  overrideProps: null,
  overridePropsDeletePath: null,
  overridePropsRenamePath: null,
  setErrorHandler: null,
  setSuspenseHandler: null,
  scheduleUpdate: null,
  currentDispatcherRef: St.ReactCurrentDispatcher,
  findHostInstanceByFiber: function(e) {
   return e = zu(e), e === null ? null : e.stateNode
  },
  findFiberByHostInstance: Jn.findFiberByHostInstance || hp,
  findHostInstancesForRefresh: null,
  scheduleRefresh: null,
  scheduleRoot: null,
  setRefreshHandler: null,
  getCurrentFiber: null,
  reconcilerVersion: "18.3.1-next-f1338f8080-20240426"
 };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
 var nl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
 if (!nl.isDisabled && nl.supportsFiber) try {
  Yl = nl.inject(vp), at = nl
 } catch {}
}
Be.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = gp;
Be.createPortal = function(e, t) {
 var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
 if (!Ns(t)) throw Error(R(200));
 return pp(e, t, null, n)
};
Be.createRoot = function(e, t) {
 if (!Ns(e)) throw Error(R(299));
 var n = !1,
  r = "",
  l = hd;
 return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Ps(e, 1,
  !1, null, null, n, !1, r, l), e[yt] = t.current, Pr(e.nodeType === 8 ? e.parentNode : e), new Ms(t)
};
Be.findDOMNode = function(e) {
 if (e == null) return null;
 if (e.nodeType === 1) return e;
 var t = e._reactInternals;
 if (t === void 0) throw typeof e.render == "function" ? Error(R(188)) : (e = Object.keys(e).join(","), Error(R(268, e)));
 return e = zu(t), e = e === null ? null : e.stateNode, e
};
Be.flushSync = function(e) {
 return sn(e)
};
Be.hydrate = function(e, t, n) {
 if (!oo(t)) throw Error(R(200));
 return io(null, e, t, !0, n)
};
Be.hydrateRoot = function(e, t, n) {
 if (!Ns(e)) throw Error(R(405));
 var r = n != null && n.hydratedSources || null,
  l = !1,
  o = "",
  i = hd;
 if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onRecoverableError !== void 0 && (i = n.onRecoverableError)), t = pd(t, null,
   e, 1, n ?? null, l, !1, o, i), e[yt] = t.current, Pr(e), r)
  for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t
   .mutableSourceEagerHydrationData.push(n, l);
 return new lo(t)
};
Be.render = function(e, t, n) {
 if (!oo(t)) throw Error(R(200));
 return io(null, e, t, !1, n)
};
Be.unmountComponentAtNode = function(e) {
 if (!oo(e)) throw Error(R(40));
 return e._reactRootContainer ? (sn(function() {
  io(null, null, e, !1, function() {
   e._reactRootContainer = null, e[yt] = null
  })
 }), !0) : !1
};
Be.unstable_batchedUpdates = Ss;
Be.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
 if (!oo(n)) throw Error(R(200));
 if (e == null || e._reactInternals === void 0) throw Error(R(38));
 return io(e, t, n, !1, r)
};
Be.version = "18.3.1-next-f1338f8080-20240426";

function md() {
 if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(md)
 } catch (e) {
  console.error(e)
 }
}
md(), mu.exports = Be;
var yp = mu.exports,
 gd, Wa = yp;
gd = Wa.createRoot, Wa.hydrateRoot;

function vd(e = 20261024) {
 let t = e >>> 0;
 const n = () => {
  t = t + 1831565813 >>> 0;
  let l = t;
  return l = Math.imul(l ^ l >>> 15, l | 1), l ^= l + Math.imul(l ^ l >>> 7, l | 61), ((l ^ l >>> 14) >>> 0) / 4294967296
 };
 return {
  next: n,
  range: (l, o) => l + (o - l) * n(),
  int: (l, o) => Math.floor(l + (o - l + 1) * n()),
  chance: l => n() < l,
  pick: l => l[Math.floor(n() * l.length)],
  logu: (l, o) => Math.exp(Math.log(l) + (Math.log(o) - Math.log(l)) * n()),
  shuffle: l => {
   const o = l.slice();
   for (let i = o.length - 1; i > 0; i--) {
    const s = Math.floor(n() * (i + 1));
    [o[i], o[s]] = [o[s], o[i]]
   }
   return o
  },
  hex: l => Array.from({
   length: l
  }, () => "0123456789ABCDEF" [Math.floor(n() * 16)]).join(""),
  b58: l => Array.from({
   length: l
  }, () => "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz" [Math.floor(n() * 58)]).join(""),
  digits: l => Array.from({
   length: l
  }, () => Math.floor(n() * 10)).join("")
 }
}
const ct = 1440,
 yd = Date.UTC(2026, 9, 18),
 A = (e, t, n = 0) => e * ct + t * 60 + n;

function me(e) {
 const t = (Math.round(e) % ct + ct) % ct;
 return `${String(Math.floor(t/60)).padStart(2,"0")}:${String(t%60).padStart(2,"0")}`
}

function $s(e) {
 const t = Math.floor(e / ct);
 return new Date(yd + t * 864e5).toLocaleDateString("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC"
 })
}

function ir(e) {
 const t = Math.floor(e / ct);
 return new Date(yd + t * 864e5).toLocaleDateString("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC"
 })
}

function jt(e, t) {
 return t != null && Math.floor(e / ct) === Math.floor(t / ct) ? me(e) : `${$s(e)} ${me(e)}`
}

function kd(e) {
 const t = Math.max(0, Math.round(e));
 if (t < 60) return `${t} min`;
 if (t < ct) return `${Math.floor(t/60)} h ${t%60?`${t%60} min`:""}`.trim();
 const n = Math.floor(t / ct);
 return `${n} day${n>1?"s":""}`
}

function pe(e) {
 return `₹${Math.round(e||0).toLocaleString("en-IN")}`
}

function _e(e) {
 const t = Math.round(e || 0),
  n = Math.abs(t);
 return n >= 1e7 ? `₹${(t/1e7).toFixed(2)} Cr` : n >= 1e5 ? `₹${(t/1e5).toFixed(2)} L` : pe(t)
}

function er(e) {
 return `${(e||0).toLocaleString("en-IN",{maximumFractionDigits:2,minimumFractionDigits:2})} USDT`
}

function Qt(e, t = 0) {
 return `${(e*100).toFixed(t)}%`
}

function mh(e) {
 return e && e.length > 12 ? `${e.slice(0,6)}…${e.slice(-4)}` : e
}
const st = A(6, 14, 18),
 Ya = A(6, 23, 30),
 ji = 92,
 Ze = {
  BKID: "Bank of India",
  SBIN: "State Bank of India",
  PUNB: "Punjab National Bank",
  CNRB: "Canara Bank",
  UBIN: "Union Bank of India",
  HDFC: "HDFC Bank",
  ICIC: "ICICI Bank",
  UTIB: "Axis Bank",
  KKBK: "Kotak Mahindra Bank",
  IDFB: "IDFC First Bank",
  AUBL: "AU Small Finance Bank",
  FINO: "Fino Payments Bank",
  AIRP: "Airtel Payments Bank",
  IMPT: "Imported data",
  BARB: "Bank of Baroda",
  IDIB: "Indian Bank",
  INDB: "IndusInd Bank",
  YESB: "Yes Bank",
  RATN: "RBL Bank",
  FDRL: "Federal Bank",
  BDBL: "Bandhan Bank",
  ESFB: "Equitas Small Finance Bank",
  SIBL: "South Indian Bank",
  PYTM: "Paytm Payments Bank",
  IPOS: "India Post Payments Bank"
 },
 gh = {
  BKID: "Bank of India",
  SBIN: "SBI",
  PUNB: "PNB",
  CNRB: "Canara",
  UBIN: "Union Bank",
  HDFC: "HDFC",
  ICIC: "ICICI",
  UTIB: "Axis",
  KKBK: "Kotak",
  IDFB: "IDFC First",
  AUBL: "AU SFB",
  FINO: "Fino PB",
  AIRP: "Airtel PB",
  IMPT: "Imported",
  BARB: "Bank of Baroda",
  IDIB: "Indian Bank",
  INDB: "IndusInd",
  YESB: "Yes Bank",
  RATN: "RBL",
  FDRL: "Federal",
  BDBL: "Bandhan",
  ESFB: "Equitas SFB",
  SIBL: "South Indian",
  PYTM: "Paytm PB",
  IPOS: "India Post PB"
 },
 Ft = {
  A: "Exchange A",
  B: "Exchange B"
 },
 wd = ["Rahul", "Amit", "Rohit", "Vikas", "Sanjay", "Arjun", "Imran", "Karan", "Deepak", "Sahil", "Nikhil", "Manoj", "Ravi", "Ankit", "Sourav", "Bikash", "Pranjal", "Abhishek", "Faizan", "Gaurav",
  "Harsh", "Joydeep", "Kunal", "Mrinal", "Nitin", "Pankaj", "Rajib", "Suresh", "Tarun", "Vivek"
 ],
 Sd = ["Pooja", "Meena", "Anjali", "Priya", "Neha", "Sneha", "Ritu", "Kavita", "Sunita", "Rekha", "Bhaswati", "Dipika", "Farah", "Gargi", "Ishita", "Jyoti", "Komal", "Lipika", "Mousumi", "Nandini",
  "Pallavi", "Rashmi", "Shabnam", "Tanvi", "Urmila"
 ],
 xd = ["Sharma", "Verma", "Das", "Saikia", "Bora", "Kalita", "Nath", "Gogoi", "Baruah", "Hussain", "Ali", "Singh", "Kumar", "Yadav", "Gupta", "Mishra", "Patel", "Reddy", "Iyer", "Menon", "Dutta",
  "Sen", "Roy", "Chakraborty", "Hazarika", "Deka", "Khan", "Joshi", "Mehta", "Pandey"
 ],
 _i = ["Guwahati", "Jorhat", "Dibrugarh", "Silchar", "Tezpur", "Shillong", "Kolkata", "Patna", "Ranchi", "Delhi", "Jaipur", "Pune", "Bengaluru", "Hyderabad", "Lucknow", "Bhopal", "Chandigarh",
  "Indore", "Nagpur", "Bhubaneswar"
 ],
 kp = ["Kirana Store", "Medical Hall", "Mobile Point", "Tea Stall", "Sweets", "Hardware", "Garments", "Electronics", "Hostel", "Coaching Centre", "Pharmacy", "Bakery", "Stationers", "Auto Parts",
  "Travels", "Dhaba", "Salon", "Book Depot"
 ],
 Qa = ["Shree", "Maa Kamakhya", "New", "Royal", "Sai", "Brahmaputra", "City", "Lakshmi", "Ganesh", "Star", "Jai Hind", "Northeast", "Durga", "Krishna"];

function wp(e = 20261024) {
 const t = vd(e),
  n = {},
  r = {},
  l = [];
 let o = 0,
  i = 1e3;
 const s = Object.keys(Ze).filter(E => E !== "IMPT"),
  a = () => `D-${t.hex(4)}`,
  h = E => `${t.pick(E==="F"?Sd:wd)} ${t.pick(xd)}`;

 function d(E) {
  const C = E.id || `AC${++i}`,
   $ = E.bank || t.pick(s),
   _ = E.g || (t.chance(.5) ? "M" : "F"),
   I = {
    id: C,
    kind: "bank",
    bank: $,
    g: _,
    mask: `••${t.int(1e3,9999)}`,
    ifsc: `${$}0SYN${t.int(100,999)}`,
    name: E.name || h(_),
    ageY: E.ageY || t.int(19, 60),
    occ: E.occ || "Salaried",
    income: E.income ?? 3e4,
    opened: E.opened ?? t.int(200, 3e3),
    device: E.device || a(),
    city: E.city || t.pick(_i),
    phone: `+91 9${t.int(1e3,9999)}•••${t.int(100,999)}`,
    role: E.role || "normal",
    label: E.label || 0,
    open0: E.open0 ?? 1e4,
    ...E
   };
  return I.id = C, I.bank = $, n[C] = I, I
 }

 function k(E) {
  const C = E.id || `T${t.b58(33)}`,
   $ = {
    id: C,
    kind: "wallet",
    chain: "TRON",
    label: "Unlabelled wallet",
    flags: [],
    open0: 0,
    ...E
   };
  return $.id = C, r[C] = $, $
 }

 function x(E) {
  return E === "TRC20" ? t.hex(64).toLowerCase() : E === "NEFT" || E === "RTGS" ? `${E==="NEFT"?"N":"R"}${t.digits(15)}` : E === "P2P" ? `P2P-${t.digits(9)}` : E === "ATM" ? `ATM-${t.digits(8)}` : t
   .digits(12)
 }

 function v(E, C, $, _, I, D = {}) {
  const B = `TX${String(++o).padStart(6,"0")}`;
  return l.push({
   id: B,
   t: Math.round(E),
   from: C,
   to: $,
   amt: _ == null ? null : Math.round(_ * 100) / 100,
   cur: D.cur || "INR",
   rail: I,
   ref: x(I),
   ...D
  }), B
 }

 function N(E, C = .04) {
  return t.chance(C) ? A(E, t.chance(.5) ? 23 : t.int(0, 4), t.int(0, 59)) : A(E, t.int(8, 21), t.int(0, 59))
 }
 const p = A(6, 18, 0),
  P = E => E <= p,
  u = [
   ["Salaried", .4, 25e3, 15e4],
   ["Student", .18, 3e3, 12e3],
   ["Homemaker", .12, 2e3, 8e3],
   ["Self-employed", .14, 3e4, 2e5],
   ["Retired", .08, 15e3, 6e4],
   ["Gig worker", .08, 12e3, 35e3]
  ],
  f = () => {
   let E = t.next();
   for (const C of u)
    if ((E -= C[1]) <= 0) return C;
   return u[0]
  },
  c = [];
 for (let E = 0; E < 720; E++) {
  const [C, , $, _] = f(), I = Math.round(t.logu($, _) / 100) * 100, D = C === "Student" ? t.int(18, 24) : C === "Retired" ? t.int(60, 78) : t.int(22, 58), B = t.chance(.09) ? t.int(10, 90) : t.int(
   120, 4200);
  c.push(d({
   occ: C,
   income: I,
   ageY: D,
   opened: B,
   open0: Math.max(2500, I * t.range(.4, 2.6)),
   role: "normal"
  }))
 }
 const y = [];
 for (let E = 0; E < 150; E++) y.push(d({
  name: `${t.pick(Qa)} ${t.pick(kp)}`,
  occ: "Business",
  income: Math.round(t.logu(3e5, 25e5)),
  ageY: t.int(28, 60),
  opened: t.int(200, 4500),
  open0: t.logu(4e4, 5e5),
  role: "business"
 }));
 const M = c.filter(E => E.occ === "Salaried");
 for (let E = 0; E < 40; E++) {
  const C = t.pick(c),
   $ = t.pick(c);
  C !== $ && ($.device = C.device)
 }
 for (const E of c) {
  for (let $ = 0; $ <= 6; $++) {
   const _ = E.occ === "Student" ? t.int(0, 2) : t.int(0, 3);
   for (let I = 0; I < _; I++) {
    const D = N($);
    P(D) && v(D, E.id, t.pick(y).id, t.logu(80, Math.min(9e3, E.income * .15 + 500)), "UPI")
   }
  }
  const C = () => t.int(0, 6);
  if (E.occ === "Salaried" || E.occ === "Homemaker")
   for (let $ = 0, _ = t.int(0, 2); $ < _; $++) {
    const I = N(C());
    P(I) && v(I, t.pick(c).id, E.id, t.logu(500, 15e3), "UPI")
   }
  if (E.occ === "Student")
   for (let $ = 0, _ = t.int(1, 2); $ < _; $++) {
    const I = N(C());
    P(I) && v(I, t.pick(M).id, E.id, t.logu(2e3, 12e3), "UPI")
   }
  if (E.occ === "Self-employed")
   for (let $ = 0, _ = t.int(3, 8); $ < _; $++) {
    const I = N(C()),
     D = t.logu(2e3, 6e4);
    if (P(I) && (v(I, t.chance(.5) ? `EXT:${t.pick(s)}` : t.pick(c).id, E.id, D, t.pick(["UPI", "IMPS", "NEFT"])), t.chance(.45))) {
     const B = I + t.int(180, 1800);
     P(B) && v(B, E.id, `EXT:${t.pick(s)}`, D * t.range(.3, .6), "NEFT")
    }
   }
  if (E.occ === "Retired") {
   const $ = A(1, t.int(9, 12), t.int(0, 59));
   v($, `EXT:${t.pick(s)}`, E.id, E.income, "NEFT")
  }
  if (E.occ === "Gig worker") {
   for (let $ = 0; $ <= 6; $++)
    if (t.chance(.7)) {
     const _ = A($, t.int(20, 23), t.int(0, 59));
     P(_) && v(_, "EXT:UTIB", E.id, t.logu(300, 2500), "IMPS")
    }
  }
 }
 for (const E of y)
  for (let C = 0; C <= 5; C++) t.chance(.75) && v(A(C, t.int(21, 23), t.int(0, 59)), E.id, `EXT:${t.pick(s)}`, null, "NEFT", {
   sweepPct: t.range(.6, .9)
  });
 const w = y.slice(0, 12);
 for (let E = 0; E < 25; E++) {
  const C = d({
    name: `${t.pick(Qa)} ${t.pick(["Collections","Agencies","Distributors","Telecom Recharge","Bill Pay Point"])}`,
    occ: "Business",
    income: Math.round(t.logu(2e5, 15e5)),
    ageY: t.int(25, 55),
    opened: t.int(40, 900),
    open0: t.logu(2e3, 2e4),
    role: "business",
    tricky: "sweeper"
   }),
   $ = t.pick(w);
  for (let _ = 0, I = t.int(5, 12); _ < I; _++) {
   const D = N(t.int(0, 6), .02);
   if (!P(D)) continue;
   v(D, t.chance(.6) ? t.pick(c).id : `EXT:${t.pick(s)}`, C.id, t.logu(2e3, 45e3), "UPI");
   const B = D + t.int(8, 45);
   P(B) && v(B, C.id, $.id, null, "IMPS", {
    sweepPct: t.range(.85, .96)
   })
  }
 }
 const m = y.filter(E => /Hostel|Coaching|Book/.test(E.name));
 for (let E = 0; E < 22; E++) {
  const C = d({
   occ: "Student",
   income: t.int(4e3, 12e3),
   ageY: t.int(18, 23),
   opened: t.int(60, 1500),
   open0: t.logu(300, 4e3),
   role: "normal",
   tricky: "fee-payer"
  });
  for (let $ = 0, _ = t.int(1, 2); $ < _; $++) {
   const I = N(t.int(0, 6), .01);
   if (!P(I)) continue;
   v(I, t.pick(M).id, C.id, t.logu(8e3, 3e4), t.pick(["UPI", "IMPS"]));
   const D = I + t.int(12, 50);
   P(D) && v(D, C.id, t.pick(m.length ? m : y).id, null, "UPI", {
    sweepPct: t.range(.82, .95)
   })
  }
 }
 const g = (E, C = {}) => k({
   kind: "exchange",
   exchange: E,
   label: `${Ft[E]} · user deposit address`,
   ...C
  }),
  T = [];
 for (let E = 0; E < 3; E++) T.push(k({
  label: "Scam cluster SC-7 (demo watchlist)",
  flags: ["watchlist"],
  open0: t.logu(2e3, 4e4)
 }));
 const j = [],
  O = ["Zenith OTC Services", "Brahmaputra Digital Traders", "Nova Coin Exchange Desk", "Eastgate VDA Traders"];
 for (let E = 0; E < 4; E++) {
  const C = d({
   name: O[E],
   occ: "P2P crypto seller (VDA)",
   income: 25e5,
   ageY: t.int(26, 40),
   opened: t.int(300, 1100),
   open0: t.logu(2e4, 12e4),
   role: "p2p",
   bank: ["HDFC", "ICIC", "UTIB", "KKBK"][E]
  });
  C.wallet = k({
   label: `${C.name} · P2P seller wallet`,
   owner: C.id,
   open0: 5e4
  }).id, j.push(C)
 }
 for (let E = 0; E < 45; E++) {
  const C = t.pick(c),
   $ = t.pick(j),
   _ = k({
    label: "Retail buyer wallet",
    owner: C.id
   }),
   I = N(t.int(0, 6));
  if (!P(I)) continue;
  const D = v(I, C.id, $.id, t.logu(2e3, 4e4), "UPI"),
   B = I + t.int(2, 9);
  if (v(B, $.id, _.id, null, "P2P", {
    match: D,
    cur: "USDT"
   }), t.chance(.5)) {
   const Q = B + t.int(60, 2e3);
   P(Q) && v(Q, _.id, g(t.pick(["A", "B"])).id, null, "TRC20", {
    cur: "USDT",
    sweepPct: .99
   })
  }
 }
 const F = Array.from({
  length: 36
 }, () => k({
  label: "Unlabelled wallet",
  open0: t.logu(100, 2e4)
 }));
 for (let E = 0; E < 70; E++) {
  const C = t.pick(F),
   $ = t.chance(.2) ? g(t.pick(["A", "B"])) : t.pick(F),
   _ = A(t.int(0, 6), t.int(0, 23), t.int(0, 59));
  P(_) && C !== $ && v(_, C.id, $.id, null, "TRC20", {
   cur: "USDT",
   sweepPct: t.range(.05, .4)
  })
 }
 for (let E = 0; E < 6; E++) {
  const C = A(t.int(0, 6), t.int(0, 23), t.int(0, 59));
  P(C) && v(C, t.pick(T).id, t.pick(F).id, null, "TRC20", {
   cur: "USDT",
   sweepPct: t.range(.05, .2)
  })
 }

 function L(E) {
  for (let C = 0; C <= 6; C++)
   for (let $ = 0, _ = t.int(0, 2); $ < _; $++) {
    const I = N(C);
    P(I) && v(I, E.id, t.pick(y).id, t.logu(60, 1500), "UPI")
   }
  if (t.chance(.5)) {
   const C = N(t.int(0, 5));
   v(C, t.pick(M).id, E.id, t.logu(1e3, 6e3), "UPI")
  }
 }
 for (let E = 0; E < 18; E++) {
  const C = t.pick(c);
  C.tricky = "group-pay";
  const $ = N(t.int(1, 6), .03),
   _ = t.int(3, 7);
  for (let D = 0; D < _; D++) {
   const B = $ + D * t.int(2, 12);
   P(B) && v(B, t.pick(c).id, C.id, t.logu(1500, 6e3), "UPI")
  }
  const I = $ + _ * 12 + t.int(5, 40);
  P(I) && v(I, C.id, t.chance(.5) ? t.pick(c).id : `EXT:${t.pick(s)}`, null, "UPI", {
   sweepPct: t.range(.5, .8)
  })
 }
 const X = [],
  ce = [49999, 49500, 49e3, 45e3, 9999, 24999];
 for (let E = 1; E <= 26; E++) {
  const C = t.chance(.38),
   $ = [a(), a()],
   _ = `R${String(E).padStart(2,"0")}`,
   I = K => {
    const Z = C ? t.pick(["Salaried", "Self-employed", "Student"]) : t.pick(["Student", "Student", "Homemaker", "Self-employed", "Gig worker", "Student"]);
    return d({
     occ: Z,
     income: Z === "Student" ? t.int(3e3, 9e3) : t.int(8e3, C ? 6e4 : 2e4),
     ageY: Z === "Student" ? t.int(18, 23) : t.int(21, 40),
     opened: C ? t.int(90, 700) : t.int(6, 110),
     device: t.chance(C ? .35 : .8) ? t.pick($) : a(),
     open0: t.logu(100, 3e3),
     role: "mule",
     label: 1,
     ring: _,
     layer: K
    })
   },
   D = Array.from({
    length: t.int(1, 2)
   }, () => I(1)),
   B = Array.from({
    length: t.int(2, 4)
   }, () => I(2));
  for (const K of [...D, ...B]) L(K);
  X.push(...B);
  const Q = k({
    label: "Unlabelled wallet"
   }),
   V = g(t.pick(["A", "B"])),
   W = new Set;
  for (let K = 0, Z = Math.max(t.int(2, 5), D.length);
   (K < Z || B.some(b => !W.has(b.id))) && !(K > 12); K++) {
   const b = t.int(1, 6),
    dt = b === 6 ? A(6, t.int(0, 12), t.int(0, 59)) : N(b, C ? .05 : .25),
    Yt = D[K % D.length],
    Vn = t.chance(.4) ? t.pick(ce) : t.logu(15e3, 15e4);
   v(dt, `EXT:${t.pick(s)}`, Yt.id, Vn, t.pick(["IMPS", "UPI", "NEFT"]));
   const ao = C ? t.int(120, 600) : t.int(4, 45),
    Kn = Math.min(B.length, t.int(C ? 1 : 2, C ? 2 : 3)),
    js = [...B.filter(Xe => !W.has(Xe.id)), ...t.shuffle(B.filter(Xe => W.has(Xe.id)))].slice(0, Kn);
   js.forEach(Xe => W.add(Xe.id));
   const _s = t.range(.9, .98);
   js.forEach((Xe, Rs) => {
    const As = dt + ao + Rs * t.int(1, 6);
    v(As, Yt.id, Xe.id, null, "IMPS", {
     sweepPct: _s / Kn / (1 - _s * Rs / Kn)
    });
    const Bd = C ? t.int(180, 720) : t.int(8, 90),
     Wn = As + Bd,
     Ds = t.next();
    if (Ds < .4) v(Wn, Xe.id, "CASH", null, "ATM", {
     sweepPct: .5
    }), v(Wn + t.int(2, 15), Xe.id, "CASH", null, "ATM", {
     sweepPct: .92
    });
    else if (Ds < .7) {
     const zs = t.pick(j),
      Hd = v(Wn, Xe.id, zs.id, null, "UPI", {
       sweepPct: .95
      }),
      Vd = Wn + t.int(2, 9);
     v(Vd, zs.id, Q.id, null, "P2P", {
      match: Hd,
      cur: "USDT"
     })
    } else v(Wn, Xe.id, `EXT:${t.pick(s)}`, null, "IMPS", {
     sweepPct: .95
    })
   })
  }
  for (let K = 1; K <= 6; K++) {
   const Z = A(K, 23, t.int(0, 50));
   P(Z) && v(Z, Q.id, V.id, null, "TRC20", {
    cur: "USDT",
    sweepPct: .98
   });
   const b = A(K, 23, 55);
   P(b) && t.chance(.6) && v(b + t.int(30, 300), V.id, t.chance(.3) ? t.pick(T).id : "BRIDGE", null, "TRC20", {
    cur: "USDT",
    sweepPct: .97
   })
  }
 }
 for (let E = 0; E < 8; E++) {
  const C = d({
   occ: t.pick(["Student", "Student", "Gig worker"]),
   income: t.int(8e3, 16e3),
   ageY: t.int(18, 23),
   opened: t.int(20, 75),
   open0: t.logu(800, 4e3),
   role: "early",
   label: 1
  });
  L(C);
  const $ = E < 5 ? A(6, t.int(9, 13), t.int(0, 59)) : A(5, t.int(10, 20), t.int(0, 59));
  v($, `EXT:${t.pick(s)}`, C.id, t.pick([1e4, 12e3, 15e3, 14500, 18e3]), "UPI");
  const _ = t.int(25, 70);
  v($ + _, C.id, t.chance(.5) ? t.pick(X).id : `EXT:${t.pick(s)}`, null, "IMPS", {
   sweepPct: t.range(.4, .55)
  }), v($ + _ + t.int(30, 90), C.id, `EXT:${t.pick(s)}`, null, "IMPS", {
   sweepPct: t.range(.55, .8)
  })
 }
 const U = [];
 {
  const E = d({
    id: "AC0907",
    name: "Prakash Gogoi",
    g: "M",
    occ: "Retired",
    ageY: 67,
    income: 52e3,
    opened: 6100,
    city: "Dibrugarh",
    bank: "ICIC",
    open0: 124e4,
    role: "victim"
   }),
   C = d({
    id: "AC0911",
    name: "Shakti Enterprises",
    occ: "Business (current a/c)",
    ageY: 29,
    income: 8e4,
    opened: 52,
    city: "Kolkata",
    bank: "IDFB",
    open0: 4200,
    role: "mule",
    label: 1,
    layer: 1,
    device: "D-6611"
   }),
   $ = d({
    id: "AC0912",
    name: "Bikash Roy",
    g: "M",
    occ: "Gig worker",
    ageY: 24,
    income: 14e3,
    opened: 33,
    city: "Kolkata",
    bank: "FINO",
    open0: 600,
    role: "mule",
    label: 1,
    layer: 2,
    device: "D-6611"
   }),
   _ = d({
    id: "AC0913",
    name: "Shabnam Khan",
    g: "F",
    occ: "Homemaker",
    ageY: 27,
    income: 4e3,
    opened: 41,
    city: "Howrah",
    bank: "AIRP",
    open0: 300,
    role: "mule",
    label: 1,
    layer: 2,
    device: "D-6612"
   }),
   I = d({
    id: "AC0914",
    name: "Nitin Yadav",
    g: "M",
    occ: "Student",
    ageY: 21,
    income: 6e3,
    opened: 18,
    city: "Patna",
    bank: "AUBL",
    open0: 250,
    role: "mule",
    label: 1,
    layer: 2,
    device: "D-6612"
   }),
   D = k({
    id: "TQm4cZsyn7RkV2pWdB8xN3hLf6Jy9aEoT1",
    label: "Unlabelled wallet"
   }),
   B = j[2],
   Q = v(A(1, 15, 10), E.id, C.id, 49e4, "RTGS"),
   V = v(A(1, 15, 40), E.id, C.id, 49e4, "RTGS");
  v(A(1, 15, 52), C.id, $.id, 24e4, "IMPS"), v(A(1, 15, 58), C.id, _.id, 245e3, "IMPS"), v(A(1, 16, 20), C.id, I.id, 485e3, "NEFT");
  const W = v(A(1, 16, 35), $.id, B.id, 238e3, "IMPS");
  v(A(1, 16, 41), B.id, D.id, null, "P2P", {
   match: W,
   cur: "USDT"
  }), v(A(1, 17, 5), _.id, "EXT:SBIN", 244e3, "IMPS");
  const K = v(A(1, 18, 10), I.id, B.id, 48e4, "IMPS");
  v(A(1, 18, 17), B.id, D.id, null, "P2P", {
   match: K,
   cur: "USDT"
  }), v(A(1, 19, 2), D.id, T[0].id, null, "TRC20", {
   cur: "USDT",
   sweepPct: .99
  }), U.push({
   id: "C-2954",
   ack: "31412210048217",
   type: "Digital arrest",
   victim: E.id,
   amount: 98e4,
   fraudAt: A(1, 15, 10),
   reportedAt: A(2, 9, 30),
   taintTx: [Q, V],
   channel: "1930 helpline",
   story: 'Caller posing as a CBI officer kept the victim on a video call for 6 hours and made him transfer savings to a "verification account".',
   seedHolds: {
    [C.id]: A(2, 10, 5),
    [$.id]: A(2, 10, 5),
    [_.id]: A(2, 10, 5),
    [I.id]: A(2, 10, 5)
   },
   seedApproved: A(2, 10, 5)
  })
 } {
  const E = d({
    id: "AC0931",
    name: "Rekha Sharma",
    g: "F",
    occ: "Retired",
    ageY: 58,
    income: 41e3,
    opened: 5200,
    city: "Jorhat",
    bank: "HDFC",
    open0: 72e4,
    role: "victim"
   }),
   C = d({
    id: "AC0932",
    name: "Arjun Mehta",
    g: "M",
    occ: "Self-employed",
    ageY: 26,
    income: 22e3,
    opened: 70,
    city: "Jaipur",
    bank: "CNRB",
    open0: 1800,
    role: "mule",
    label: 1,
    layer: 1,
    device: "D-5A20"
   }),
   $ = d({
    id: "AC0933",
    name: "Kavita Joshi",
    g: "F",
    occ: "Homemaker",
    ageY: 29,
    income: 3e3,
    opened: 38,
    city: "Jaipur",
    bank: "PUNB",
    open0: 900,
    role: "mule",
    label: 1,
    layer: 1,
    device: "D-5A20"
   }),
   _ = d({
    id: "AC0934",
    name: "Faizan Ali",
    g: "M",
    occ: "Student",
    ageY: 21,
    income: 5e3,
    opened: 15,
    city: "Lucknow",
    bank: "FINO",
    open0: 400,
    role: "mule",
    label: 1,
    layer: 2,
    device: "D-5A21"
   }),
   I = d({
    id: "AC0935",
    name: "Ritu Pandey",
    g: "F",
    occ: "Student",
    ageY: 20,
    income: 4e3,
    opened: 22,
    city: "Lucknow",
    bank: "AIRP",
    open0: 250,
    role: "mule",
    label: 1,
    layer: 2,
    device: "D-5A21"
   }),
   D = d({
    id: "AC0936",
    name: "Gaurav Mishra",
    g: "M",
    occ: "Salaried",
    ageY: 24,
    income: 18e3,
    opened: 40,
    city: "Kanpur",
    bank: "SBIN",
    open0: 1500,
    role: "mule",
    label: 1,
    layer: 2,
    device: "D-5A22"
   }),
   B = k({
    id: "TJx9pKsyn2WqLmB4vC7dR8nF5hY3aZoE6u",
    label: "Unlabelled wallet"
   }),
   Q = g("B", {
    id: "TXdKe2syn9LpQ4wVb7Nm3cF8jH6rT5aZy1"
   }),
   V = j[1],
   W = v(A(4, 10, 30), E.id, C.id, 2e5, "NEFT"),
   K = v(A(4, 10, 41), E.id, C.id, 16e4, "NEFT"),
   Z = v(A(4, 10, 55), E.id, $.id, 1e5, "IMPS");
  v(A(4, 10, 52), C.id, _.id, 99e3, "IMPS"), v(A(4, 11, 0), C.id, I.id, 99500, "IMPS"), v(A(4, 11, 12), C.id, "EXT:UBIN", 12e4, "IMPS"), v(A(4, 11, 25), C.id, D.id, 38e3, "IMPS"), v(A(4, 11, 6), $.id,
   "CASH", 49e3, "ATM"), v(A(4, 11, 15), $.id, D.id, 49e3, "IMPS");
  const b = v(A(4, 11, 20), _.id, V.id, 98e3, "UPI");
  v(A(4, 11, 27), V.id, B.id, null, "P2P", {
   match: b,
   cur: "USDT"
  }), v(A(4, 12, 5), B.id, Q.id, null, "TRC20", {
   cur: "USDT",
   sweepPct: .99
  }), v(A(4, 13, 0), Q.id, "BRIDGE", null, "TRC20", {
   cur: "USDT",
   sweepPct: .99
  }), v(A(4, 11, 25), I.id, "CASH", 49e3, "ATM"), v(A(4, 11, 32), I.id, "CASH", 49e3, "ATM"), v(A(4, 12, 10), D.id, "EXT:KKBK", 85e3, "IMPS"), U.push({
   id: "C-2987",
   ack: "31412240019935",
   type: "Investment scam",
   victim: E.id,
   amount: 46e4,
   fraudAt: A(4, 10, 30),
   reportedAt: A(4, 11, 5),
   taintTx: [W, K, Z],
   channel: "NCRP portal",
   story: 'Victim was added to a "stock tips" WhatsApp group and paid into a fake trading app that showed fake profits.',
   seedHolds: {
    [D.id]: A(4, 11, 40),
    [C.id]: A(4, 11, 40),
    [$.id]: A(4, 11, 40),
    [_.id]: A(4, 11, 40),
    [I.id]: A(4, 11, 40)
   },
   seedFreezes: {
    [Q.id]: A(4, 12, 20)
   },
   seedApproved: A(4, 11, 40)
  })
 } {
  const E = d({
    id: "AC0951",
    name: "Anil Verma",
    g: "M",
    occ: "Salaried",
    ageY: 52,
    income: 64e3,
    opened: 4300,
    city: "Guwahati",
    bank: "SBIN",
    open0: 34e4,
    role: "victim"
   }),
   C = d({
    id: "AC0952",
    name: "Rohit Saikia",
    g: "M",
    occ: "Student",
    ageY: 20,
    income: 6e3,
    opened: 34,
    city: "Guwahati",
    bank: "BKID",
    open0: 2340,
    role: "mule",
    label: 1,
    layer: 1,
    device: "D-77A1",
    story: 'Rented his account for a ₹5,000 "commission" offered on Telegram.'
   }),
   $ = d({
    id: "AC0953",
    name: "Pooja Das",
    g: "F",
    occ: "Homemaker",
    ageY: 24,
    income: 3e3,
    opened: 61,
    city: "Guwahati",
    bank: "PUNB",
    open0: 1150,
    role: "mule",
    label: 1,
    layer: 2,
    device: "D-77A1"
   }),
   _ = d({
    id: "AC0954",
    name: "Imran Ali",
    g: "M",
    occ: "Student",
    ageY: 22,
    income: 5e3,
    opened: 19,
    city: "Nagaon",
    bank: "FINO",
    open0: 500,
    role: "mule",
    label: 1,
    layer: 2,
    device: "D-3F02"
   }),
   I = d({
    id: "AC0955",
    name: "Karan Bora",
    g: "M",
    occ: "Student",
    ageY: 19,
    income: 4e3,
    opened: 27,
    city: "Tezpur",
    bank: "AIRP",
    open0: 800,
    role: "mule",
    label: 1,
    layer: 2,
    device: "D-3F02"
   }),
   D = d({
    id: "AC0956",
    name: "Meena Kalita",
    g: "F",
    occ: "Homemaker",
    ageY: 31,
    income: 3e3,
    opened: 45,
    city: "Guwahati",
    bank: "UBIN",
    open0: 1700,
    role: "mule",
    label: 1,
    layer: 2,
    device: "D-91C4"
   }),
   B = d({
    id: "AC0957",
    name: "Deepak Nath",
    g: "M",
    occ: "Gig worker",
    ageY: 23,
    income: 9e3,
    opened: 12,
    city: "Shillong",
    bank: "AUBL",
    open0: 300,
    role: "mule",
    label: 1,
    layer: 3,
    device: "D-91C4"
   }),
   Q = d({
    id: "AC0958",
    name: "Sahil Hussain",
    g: "M",
    occ: "Student",
    ageY: 21,
    income: 5e3,
    opened: 9,
    city: "Silchar",
    bank: "KKBK",
    open0: 200,
    role: "mule",
    label: 1,
    layer: 3,
    device: "D-91C4"
   }),
   V = j[0],
   W = j[1],
   K = k({
    id: "TNw8hVsyn4QzK7pLc2mB9xR5dF3jY6aE1t",
    label: "Unlabelled wallet"
   }),
   Z = k({
    id: "TGr5bQsyn8MvN2kX7pW4cJ9hL3fD6eA1yz",
    label: "Unlabelled wallet",
    open0: 320
   }),
   b = g("A", {
    id: "TYc7kPsyn3RmW9vB2nQ5xH8jL4fD6eZa2s"
   });
  v(A(3, 2, 14), Z.id, T[1].id, 300, "TRC20", {
   cur: "USDT"
  });
  const dt = v(A(6, 13, 2), E.id, C.id, 12e4, "IMPS"),
   Yt = v(A(6, 13, 9), E.id, C.id, 8e4, "UPI");
  v(A(6, 13, 21), C.id, $.id, 49e3, "IMPS"), v(A(6, 13, 24), C.id, _.id, 48500, "IMPS"), v(A(6, 13, 28), C.id, I.id, 49500, "IMPS"), v(A(6, 13, 40), C.id, D.id, 45e3, "IMPS"), v(A(6, 13, 47), $.id,
   "CASH", 4e4, "ATM"), v(A(6, 14, 5), $.id, B.id, 9e3, "IMPS"), v(A(6, 13, 52), _.id, B.id, 48e3, "IMPS");
  const Vn = v(A(6, 13, 58), I.id, V.id, 49e3, "UPI");
  v(A(6, 14, 4), V.id, K.id, null, "P2P", {
   match: Vn,
   cur: "USDT"
  });
  const ao = v(A(6, 14, 15), B.id, V.id, 5e4, "UPI");
  v(A(6, 14, 20), V.id, K.id, null, "P2P", {
   match: ao,
   cur: "USDT"
  }), v(A(6, 14, 31), K.id, Z.id, 1070, "TRC20", {
   cur: "USDT"
  }), v(A(6, 14, 38), D.id, Q.id, 44e3, "IMPS"), v(A(6, 14, 44), Z.id, b.id, 1065, "TRC20", {
   cur: "USDT"
  }), v(A(6, 14, 50), B.id, "CASH", 7e3, "ATM");
  const Kn = v(A(6, 14, 55), Q.id, W.id, 43500, "UPI");
  v(A(6, 15, 1), W.id, K.id, null, "P2P", {
   match: Kn,
   cur: "USDT"
  }), v(A(6, 15, 10), b.id, "BRIDGE", null, "TRC20", {
   cur: "USDT",
   sweepPct: .995
  }), v(A(6, 15, 20), K.id, Z.id, 470, "TRC20", {
   cur: "USDT"
  }), v(A(6, 15, 32), Z.id, b.id, 468, "TRC20", {
   cur: "USDT"
  }), v(A(6, 15, 50), b.id, "BRIDGE", null, "TRC20", {
   cur: "USDT",
   sweepPct: .995
  }), v(A(6, 15, 25), C.id, "CASH", 1e4, "ATM"), U.push({
   id: "C-3021",
   ack: "31412260057321",
   type: "Fake job / task scam",
   victim: E.id,
   amount: 2e5,
   fraudAt: A(6, 13, 2),
   reportedAt: A(6, 14, 20),
   taintTx: [dt, Yt],
   channel: "1930 helpline",
   story: 'Victim was offered a part-time "hotel review" job on Telegram, earned small payouts, then paid ₹2 lakh to "unlock" a VIP task.',
   event: "complaint",
   demo: !0
  })
 }
 return l.sort((E, C) => E.t - C.t || (E.id < C.id ? -1 : 1)), {
  accounts: n,
  wallets: r,
  txns: l,
  cases: U,
  sellers: j.map(E => E.id),
  watch: T.map(E => E.id)
 }
}
const xe = .01,
 so = e => e.startsWith("EXT:"),
 Ga = e => e === "CASH" || e === "BRIDGE" || so(e),
 Xa = e => e.to === "CASH" ? `CASH@${e.from}` : e.to,
 ba = e => Math.floor((e % 1440 + 1440) % 1440 / 60);

function Hl(e, {
 clock: t,
 holds: n = {},
 freezes: r = {},
 cases: l = [],
 method: o = "fifo"
}) {
 const {
  accounts: i,
  wallets: s,
  txns: a
 } = e, h = {};
 for (const g of l)
  for (const T of g.taintTx) h[T] = g.id;
 const d = {},
  k = {},
  x = {},
  v = {},
  N = {},
  p = {},
  P = {},
  u = {};
 for (const g of l) N[g.id] = [], x[g.id] = {}, v[g.id] = {};
 const f = g => {
   let T = d[g];
   if (!T) {
    const j = i[g] || s[g];
    T = d[g] = {
     lots: [],
     h: 0,
     bal: 0
    }, j && j.open0 > 0 && (T.lots.push({
     amt: j.open0,
     t: -1e9,
     taint: null,
     src: "open",
     inflow: !1
    }), T.bal = j.open0)
   }
   return T
  },
  c = g => u[g] || (u[g] = {
   inAmt: 0,
   outAmt: 0,
   inN: 0,
   outN: 0,
   senders: new Set,
   receivers: new Set,
   night: 0,
   below: 0,
   pt60: 0,
   dwell: [],
   outYoung: 0,
   outP2P: 0,
   outCash: 0,
   txN: 0,
   firstIn: null,
   lastT: null,
   fastEvents: 0
  }),
  y = (g, T, j, O) => {
   const F = k[g] || (k[g] = {});
   F[T] = Math.max(0, (F[T] || 0) + j), F[T] < .5 && (F[T] = 0);
   const L = x[T][g] || (x[T][g] = []);
   L.length && L[L.length - 1][0] === O ? L[L.length - 1][1] = F[T] : L.push([O, F[T]])
  },
  M = (g, T, j) => {
   const O = {
    taint: {},
    pieces: []
   };
   let F = T;
   const L = o === "prorata";
   let X = null;
   if (L && g.bal > xe) {
    X = {};
    for (let U = g.h; U < g.lots.length; U++) {
     const E = g.lots[U];
     if (E.taint && E.amt > xe)
      for (const C in E.taint) X[C] = (X[C] || 0) + E.taint[C]
    }
   }
   const ce = (U, E) => {
    const C = E / U.amt;
    if (U.taint && !L)
     for (const $ in U.taint) {
      const _ = U.taint[$] * C;
      O.taint[$] = (O.taint[$] || 0) + _, U.taint[$] -= _
     }
    U.amt -= E, O.pieces.push({
     amt: E,
     t: U.t,
     inflow: U.inflow
    })
   };
   if (j) {
    const U = g.lots.find(E => E.src === j && E.amt > xe);
    if (U) {
     const E = Math.min(F, U.amt);
     if (L && U.taint) {
      const C = E / U.amt;
      for (const $ in U.taint) {
       const _ = U.taint[$] * C;
       O.taint[$] = (O.taint[$] || 0) + _, U.taint[$] -= _, X && (X[$] = Math.max(0, (X[$] || 0) - _))
      }
     }
     ce(U, E), F -= E
    }
   }
   if (L && X && F > xe) {
    const U = Math.min(1, F / Math.max(xe, g.bal - (T - F)));
    for (const E in X) O.taint[E] = (O.taint[E] || 0) + X[E] * U;
    for (let E = g.h; E < g.lots.length; E++) {
     const C = g.lots[E];
     if (C.taint)
      for (const $ in C.taint) C.taint[$] *= 1 - U
    }
   }
   if (o === "lifo") {
    for (let U = g.lots.length - 1; U >= g.h && F > xe; U--) {
     const E = g.lots[U];
     if (E.amt <= xe) continue;
     const C = Math.min(F, E.amt);
     ce(E, C), F -= C
    }
    for (; g.h < g.lots.length && g.lots[g.h].amt <= xe;) g.h++
   } else
    for (; F > xe && g.h < g.lots.length;) {
     const U = g.lots[g.h];
     if (U.amt <= xe) {
      g.h++;
      continue
     }
     const E = Math.min(F, U.amt);
     ce(U, E), F -= E, U.amt <= xe && g.h++
    }
   return g.bal -= T - Math.max(0, F), O
  },
  w = (g, T) => {
   const j = {};
   let O = T;
   for (let F = g.h; F < g.lots.length && O > xe; F++) {
    const L = g.lots[F];
    if (L.amt <= xe) continue;
    const X = Math.min(O, L.amt);
    if (L.taint)
     for (const ce in L.taint) j[ce] = (j[ce] || 0) + L.taint[ce] * (X / L.amt);
    O -= X
   }
   return j
  };
 for (const g of a) {
  if (g.t > t) {
   p[g.id] = "future";
   continue
  }
  const {
   from: T,
   to: j
  } = g, O = so(T), F = n[T] != null && g.t >= n[T] ? "hold" : r[T] != null && g.t >= r[T] ? "freeze" : null;
  let L = g.amt;
  const X = O ? null : f(T);
  if (!O)
   if (g.match && L == null) {
    const I = X.lots.find(D => D.src === g.match && D.amt > xe);
    L = I ? I.amt : 0
   } else L == null && (L = X.bal * (g.sweepPct || 1), L = g.cur === "USDT" ? Math.floor(L * 100) / 100 : Math.floor(L));
  if (F) {
   p[g.id] = "blocked";
   const I = X ? w(X, L || 0) : {};
   for (const D in I) I[D] >= 1 && N[D] && N[D].push({
    tx: g.id,
    from: T,
    to: Xa(g),
    t: g.t,
    amt: L,
    cur: g.cur,
    taint: I[D],
    rail: g.rail,
    status: "blocked",
    by: F
   });
   continue
  }
  if (!O && (!(L > xe) || L > X.bal + xe)) {
   p[g.id] = "failed";
   continue
  }
  const ce = O ? {
   taint: {},
   pieces: []
  } : M(X, L, g.match);
  let U = ce.taint;
  h[g.id] && (U = {
   [h[g.id]]: L
  });
  const E = g.rail === "P2P" ? L / ji : L,
   C = Xa(g);
  for (const I in U) x[I] && ((!h[g.id] || h[g.id] !== I) && y(T, I, -U[I], g.t), Ga(g.to) ? (v[I][C] = (v[I][C] || 0) + U[I], (x[I][C] || (x[I][C] = [])).push([g.t, v[I][C]])) : y(j, I, U[I], g.t),
   U[I] >= 1 && N[I].push({
    tx: g.id,
    from: T,
    to: C,
    t: g.t,
    amt: L,
    amtOut: E,
    cur: g.cur,
    outCur: g.rail === "P2P" ? "USDT" : g.cur,
    taint: U[I],
    rail: g.rail,
    status: "done"
   }));
  if (!Ga(j)) {
   const I = f(j),
    D = {};
   let B = !1;
   for (const Q in U) U[Q] > .001 && (D[Q] = U[Q], B = !0);
   I.lots.push({
    amt: E,
    t: g.t,
    taint: B ? D : null,
    src: g.id,
    inflow: !0
   }), I.bal += E
  }
  p[g.id] = "done", P[g.id] = {
   amt: L,
   out: E
  };
  const $ = ba(g.t) >= 23 || ba(g.t) <= 4,
   _ = g.cur === "INR" && (L >= 45e3 && L < 5e4 || L >= 9e3 && L < 1e4 || L >= 24e3 && L < 25e3);
  if (i[T]) {
   const I = c(T);
   I.outAmt += L, I.outN++, I.txN++, I.lastT = g.t, i[j] && i[j].role === "business" || I.receivers.add(g.to === "CASH" ? "CASH" : g.to), $ && I.night++, _ && I.below++;
   const D = i[j];
   D && D.opened < 90 && (I.outYoung += L), D && D.role === "p2p" && (I.outP2P += L), j === "CASH" && (I.outCash += L);
   let B = 0;
   for (const Q of ce.pieces)
    if (Q.inflow) {
     const V = g.t - Q.t;
     I.dwell.push([V, Q.amt]), V <= 60 && (I.pt60 += Q.amt, B += Q.amt)
    } B > 5e3 && I.fastEvents++
  }
  if (i[j]) {
   const I = c(j);
   I.inAmt += E, I.inN++, I.txN++, I.lastT = g.t, i[T] && i[T].role === "business" || I.senders.add(T), I.firstIn == null && (I.firstIn = g.t), $ && I.night++, _ && I.below++
  }
 }
 const m = {};
 for (const g in d) m[g] = d[g].bal;
 return {
  status: p,
  exec: P,
  bal: m,
  tb: k,
  hist: x,
  sinkIn: v,
  edges: N,
  stats: u
 }
}

function Sp(e, t, n, r) {
 const l = e[t] && e[t][n];
 if (!l || !l.length || l[0][0] > r) return 0;
 let o = 0,
  i = l.length - 1;
 for (; o < i;) {
  const s = o + i + 1 >> 1;
  l[s][0] <= r ? o = s : i = s - 1
 }
 return l[o][1]
}
const zo = Math.log10,
 Vl = [{
  k: "pass",
  label: "Pass-through (money in → out)",
  sign: 1
 }, {
  k: "fanOut",
  label: "Fan-out to individuals",
  sign: 1
 }, {
  k: "fanIn",
  label: "Fan-in from individuals",
  sign: 1
 }, {
  k: "age",
  label: "New account",
  sign: -1
 }, {
  k: "volInc",
  label: "Volume vs profile",
  sign: 1
 }, {
  k: "night",
  label: "Night-time activity",
  sign: 1
 }, {
  k: "below",
  label: "Just-below-limit amounts",
  sign: 1
 }, {
  k: "device",
  label: "Shared device",
  sign: 1
 }, {
  k: "young",
  label: "Money to new accounts",
  sign: 1
 }, {
  k: "p2p",
  label: "P2P crypto seller link",
  sign: 1
 }, {
  k: "cash",
  label: "ATM cash-out share",
  sign: 1
 }],
 qa = 7 * 1440;

function Cd(e) {
 if (!e || !e.dwell || !e.dwell.length) return null;
 const t = e.dwell.slice().sort((l, o) => l[0] - o[0]),
  n = t.reduce((l, o) => l + o[1], 0);
 let r = 0;
 for (const [l, o] of t)
  if (r += o, r >= n / 2) return l;
 return t[t.length - 1][0]
}

function Ed(e) {
 const t = {};
 for (const n of Object.values(e.accounts)) t[n.device] = (t[n.device] || 0) + 1;
 return t
}

function Pd(e, t, n) {
 const r = t || {
   inAmt: 0,
   outAmt: 0,
   senders: new Set,
   receivers: new Set,
   night: 0,
   below: 0,
   pt60: 0,
   dwell: [],
   outYoung: 0,
   outP2P: 0,
   outCash: 0,
   txN: 0
  },
  l = Cd(r),
  o = Math.max(e.income, 2e3) * 7 / 30;
 return {
  pass: r.inAmt > 5e3 ? .5 * Math.min(1, r.pt60 / r.inAmt) + .5 * Math.min(1, r.outAmt / r.inAmt) : 0,
  pt60: r.inAmt > 0 ? Math.min(1, r.pt60 / r.inAmt) : 0,
  dwell: zo(1 + Math.min(l ?? qa, qa)),
  flow: r.inAmt > 5e3 ? Math.min(1, r.outAmt / r.inAmt) : 0,
  fanOut: Math.log1p(r.receivers.size),
  fanIn: Math.log1p(r.senders.size),
  age: zo(1 + e.opened),
  volInc: Math.max(-2, Math.min(3, zo((r.inAmt + 1) / o))),
  night: r.txN ? r.night / r.txN : 0,
  below: Math.min(r.below, 5) / 5,
  device: Math.min((n[e.device] || 1) - 1, 4),
  young: r.outAmt ? r.outYoung / r.outAmt : 0,
  p2p: r.outAmt ? r.outP2P / r.outAmt : 0,
  cash: r.outAmt ? r.outCash / r.outAmt : 0
 }
}
const Ri = e => e.kind === "bank" && e.role !== "p2p" && e.role !== "victim",
 xp = e => {
  let t = 0;
  for (let n = 0; n < e.length; n++) t = t * 31 + e.charCodeAt(n) >>> 0;
  return t % 10 >= 7
 },
 fn = e => 1 / (1 + Math.exp(-e));

function Cp(e, t) {
 const n = (typeof performance < "u" ? performance : Date).now(),
  r = Ed(e),
  l = [];
 for (const u of Object.values(e.accounts)) Ri(u) && l.push({
  id: u.id,
  y: u.label,
  test: xp(u.id),
  x: Pd(u, t.stats[u.id], r)
 });
 const o = l.filter(u => !u.test),
  i = Vl.map(u => u.k),
  s = {},
  a = {};
 for (const u of i) {
  const f = o.map(M => M.x[u]),
   c = f.reduce((M, w) => M + w, 0) / f.length,
   y = Math.sqrt(f.reduce((M, w) => M + (w - c) ** 2, 0) / f.length) || 1;
  s[u] = c, a[u] = y
 }
 const h = o.map(u => i.map(f => (u.x[f] - s[f]) / a[f])),
  d = o.map(u => u.y),
  k = new Array(i.length).fill(0);
 let x = 0;
 const v = .4,
  N = .002,
  p = h.length;
 for (let u = 0; u < 700; u++) {
  const f = new Array(i.length).fill(0);
  let c = 0;
  for (let y = 0; y < p; y++) {
   let M = x;
   for (let m = 0; m < i.length; m++) M += k[m] * h[y][m];
   const w = fn(M) - d[y];
   c += w;
   for (let m = 0; m < i.length; m++) f[m] += w * h[y][m]
  }
  x -= v * c / p;
  for (let y = 0; y < i.length; y++) k[y] -= v * (f[y] / p + N * k[y]), k[y] * Vl[y].sign < 0 && (k[y] = 0)
 }
 const P = (typeof performance < "u" ? performance : Date).now() - n;
 return {
  w: Object.fromEntries(i.map((u, f) => [u, k[f]])),
  b: x,
  mean: s,
  std: a,
  ms: P,
  trainN: o.length,
  testN: l.length - o.length,
  trainPos: o.filter(u => u.y).length,
  testPos: l.filter(u => u.test && u.y).length,
  testIds: new Set(l.filter(u => u.test).map(u => u.id))
 }
}

function Ep(e, t, n, r) {
 const l = n || {};
 switch (e) {
  case "pass":
   return r.pt60 >= .2 ? `${_e(l.inAmt)} came in and ${Qt(r.flow)} moved on — ${Qt(r.pt60)} within 60 minutes` :
    `${_e(l.inAmt)} came in and ${Qt(r.flow)} moved on; only ${Qt(Math.max(0,1-r.flow))} stayed`;
  case "dwell": {
   const o = Cd(l);
   return o == null ? "Money never left the account" : `Money stayed a median of only ${kd(o)}`
  }
  case "fanOut":
   return `Sent money on to ${l.receivers?l.receivers.size:0} different individuals or cash points`;
  case "fanIn":
   return `Received money from ${l.senders?l.senders.size:0} different individuals or banks`;
  case "age":
   return t.opened<=90?`Account opened only ${t.opened} days ago`:t.opened<=400?`Relatively new account (${t.opened} days old)`:`Account age ${t.opened} days`;
  case "volInc":
   return `${t.occ} profile, but ${_e(l.inAmt)} flowed in this week (expected ~${_e(Math.max(t.income,2e3)*7/30)})`;
  case "night":
   return `${Qt(r.night)} of transactions between 11 pm and 5 am`;
  case "below":
   return `${l.below} transfers just under common limits (₹49,xxx / ₹9,xxx)`;
  case "device":
   return `Same device as ${r.device} other account${r.device>1?"s":""}`;
  case "young":
   return `${Qt(r.young)} of outgoing money went to accounts opened < 90 days ago`;
  case "p2p":
   return `${_e(l.outP2P)} paid to a P2P crypto seller`;
  case "cash":
   return `${Qt(r.cash)} of outgoing money withdrawn as ATM cash`;
  default:
   return e
 }
}

function Pp(e, t, n, r = {}) {
 const l = Ed(e),
  o = Vl.map(h => h.k),
  i = {},
  s = {};
 for (const h of Object.values(e.accounts)) {
  if (!Ri(h)) continue;
  const d = Pd(h, t.stats[h.id], l);
  s[h.id] = d;
  let k = n.b;
  for (const x of o) k += n.w[x] * ((d[x] - n.mean[x]) / n.std[x]);
  i[h.id] = k
 }
 const a = {};
 for (const h of Object.values(e.accounts)) {
  if (!Ri(h)) continue;
  const d = t.stats[h.id],
   k = s[h.id],
   x = o.map(m => ({
    k: m,
    label: Vl.find(g => g.k === m).label,
    phi: n.w[m] * ((k[m] - n.mean[m]) / n.std[m]),
    value: k[m]
   })),
   v = [],
   N = r.traced && r.traced[h.id];
  if (N && h.role !== "victim") {
   const m = Object.values(N).reduce((g, T) => g + T, 0);
   m >= 1e3 && v.push({
    k: "traced",
    label: "Complaint money traced in",
    phi: 1.6,
    text: `Received ${_e(m)} traced from complaint ${Object.keys(N).join(", ")}`
   })
  }
  if (d) {
   let m = 0;
   for (const g of new Set([...d.senders, ...d.receivers])) i[g] != null && g !== h.id && fn(i[g]) >= .85 && m++;
   m && v.push({
    k: "linked",
    label: "Linked high-risk accounts",
    phi: Math.min(2, m) * .45,
    text: `Transacts directly with ${m} high-risk account${m>1?"s":""}`
   })
  }
  const p = [...x, ...v],
   P = p.reduce((m, g) => m + g.phi, 0),
   u = n.b + P,
   f = 100 * fn(n.b / 2.5),
   c = Math.min(99, 100 * fn(u / 2.5)),
   y = Math.abs(P) > 1e-6 ? (c - f) / P : 100 * fn(n.b / 2.5) * (1 - fn(n.b / 2.5)) / 2.5;
  for (const m of p) m.pts = m.phi * y;
  const M = p.slice().sort((m, g) => g.pts - m.pts);
  for (const m of x) m.text = Ep(m.k, h, d, k);
  const w = M.filter(m => m.pts > 1.5).slice(0, 3).map(m => m.text);
  a[h.id] = {
   score: c,
   base: f,
   contribs: M,
   reasons: w,
   x: k
  }
 }
 return a
}

function Tp(e, t, n, r) {
 let l = 0,
  o = 0,
  i = 0,
  s = 0;
 const a = [],
  h = [...n.testIds];
 for (const x of h) {
  const v = e.accounts[x].label,
   N = t[x].score >= r;
  N && v ? l++ : N && !v ? o++ : !N && v ? i++ : s++
 }
 for (let x = 10; x <= 95; x += 5) {
  let v = 0,
   N = 0,
   p = 0;
  for (const P of h) {
   const u = e.accounts[P].label,
    f = t[P].score >= x;
   f && u ? v++ : f && !u ? N++ : !f && u && p++
  }
  a.push({
   t: x,
   precision: v + N ? v / (v + N) : 1,
   recall: v + p ? v / (v + p) : 0
  })
 }
 const d = l + o ? l / (l + o) : 1,
  k = l + i ? l / (l + i) : 0;
 return {
  tp: l,
  fp: o,
  fn: i,
  tn: s,
  precision: d,
  recall: k,
  f1: d + k ? 2 * d * k / (d + k) : 0,
  falsePer1000: o / Math.max(1, o + s) * 1e3,
  curve: a,
  n: h.length
 }
}

function Mp(e, t, n) {
 if (n && t === n.victim) return "victim";
 if (t.startsWith("CASH@")) return "cash";
 if (t === "BRIDGE") return "bridge";
 if (so(t)) return "ext";
 const r = e.accounts[t];
 if (r) return r.role === "p2p" ? "p2p" : "bank";
 const l = e.wallets[t];
 return l ? l.kind === "exchange" ? "exchange" : "wallet" : "other"
}

function Np(e, t) {
 if (t.startsWith("CASH@")) return "ATM cash withdrawal";
 if (t === "BRIDGE") return "Cross-chain bridge / mixer";
 if (so(t)) return `${Ze[t.slice(4)]||t.slice(4)} (outside data)`;
 const n = e.accounts[t];
 if (n) return n.name;
 const r = e.wallets[t];
 return r ? r.kind === "exchange" ? `${Ft[r.exchange]} deposit` : r.label : t
}

function vh(e, t, n) {
 const r = e.wallets[t];
 if (!r) return [];
 const l = [];
 return r.flags.includes("watchlist") && l.push({
  k: "watchlist",
  text: "On demo watchlist (scam cluster SC-7)",
  tone: "high"
 }), r.kind === "exchange" && l.push({
  k: "exchange",
  text: `${Ft[r.exchange]} deposit address — freeze request works here`,
  tone: "clear"
 }), r.owner && e.accounts[r.owner] && e.accounts[r.owner].role === "p2p" && l.push({
  k: "p2p",
  text: "P2P seller wallet (linked bank a/c)",
  tone: "crypto"
 }), r.flags.includes("watchlist") || e.txns.find(i => i.t <= n && i.cur === "USDT" && (i.from === t && e.wallets[i.to] && e.wallets[i.to].flags.includes("watchlist") || i.to === t && e.wallets[i
  .from] && e.wallets[i.from].flags.includes("watchlist"))) && l.push({
  k: "contact",
  text: "1 hop from scam cluster SC-7 (demo watchlist)",
  tone: "med"
 }), e.txns.some(o => o.from === t && o.to === "BRIDGE" && o.t <= n) && l.push({
  k: "bridge",
  text: "Has sent funds to a bridge / mixer",
  tone: "high"
 }), l
}

function Td(e, t, n, {
 clock: r,
 holds: l = {},
 freezes: o = {}
}) {
 var M;
 const i = (t.edges[n.id] || []).filter(w => w.t <= r).sort((w, m) => w.t - m.t),
  s = w => Mp(e, w, n),
  a = new Set([n.victim]);
 for (const w of i) a.add(w.from), a.add(w.to);
 const h = {};
 for (const w of i) h[w.to] == null && (h[w.to] = w.t), h[w.from] == null && (h[w.from] = w.t);
 h[n.victim] = Math.min(h[n.victim] ?? 1 / 0, n.fraudAt);
 const d = {
   [n.victim]: 0
  },
  k = w => ["victim", "bank"].includes(s(w));
 let x = !0;
 for (let w = 0; w < 12 && x; w++) {
  x = !1;
  for (const m of i) {
   if (!k(m.from) || s(m.to) !== "bank" || d[m.from] == null) continue;
   const g = d[m.from] + 1;
   (d[m.to] == null || g < d[m.to]) && (d[m.to] = g, x = !0)
  }
 }
 let v = 0;
 for (const w of a) s(w) === "bank" && d[w] != null && (v = Math.max(v, d[w]));
 for (const w of a)["cash", "ext", "p2p"].includes(s(w)) && (d[w] = v + 1);
 x = !0;
 for (let w = 0; w < 12 && x; w++) {
  x = !1;
  for (const m of i) {
   const g = s(m.to);
   if (!["wallet", "exchange"].includes(g) || d[m.from] == null) continue;
   const T = d[m.from] + 1;
   (d[m.to] == null || T < d[m.to]) && (d[m.to] = T, x = !0)
  }
 }
 let N = 0;
 for (const w of a) d[w] != null && s(w) !== "bridge" && (N = Math.max(N, d[w]));
 for (const w of a) s(w) === "bridge" && (d[w] = N + 1), d[w] == null && (d[w] = N + 1);
 const p = Math.max(...[...a].map(w => d[w])) + 1,
  P = {};
 for (const w of a)(P[M = d[w]] || (P[M] = [])).push(w);
 const u = {},
  f = Object.keys(P).map(Number).sort((w, m) => w - m);
 for (const w of f) {
  const m = P[w],
   g = T => {
    const j = i.filter(O => O.to === T && u[O.from] != null).map(O => u[O.from]);
    return j.length ? j.reduce((O, F) => O + F, 0) / j.length : 0
   };
  m.sort((T, j) => g(T) - g(j) || (h[T] ?? 0) - (h[j] ?? 0)), m.forEach((T, j) => {
   u[T] = j - (m.length - 1) / 2
  })
 }
 const c = {};
 for (const w of i) {
  const m = `${w.from}>${w.to}>${w.status}`,
   g = c[m] || (c[m] = {
    from: w.from,
    to: w.to,
    status: w.status,
    taint: 0,
    amt: 0,
    out: 0,
    n: 0,
    t0: w.t,
    t1: w.t,
    rail: w.rail,
    cur: w.cur,
    outCur: w.outCur,
    txs: []
   });
  g.taint += w.taint, g.amt += w.amt || 0, g.out += w.amtOut || 0, g.n++, g.t1 = w.t, g.txs.push(w.tx)
 }
 const y = [...a].map(w => ({
  id: w,
  kind: s(w),
  col: d[w],
  row: u[w],
  first: h[w] ?? n.fraudAt,
  title: Np(e, w)
 }));
 return {
  c: n,
  edges: i,
  links: Object.values(c),
  nodes: y,
  ncol: p,
  maxRows: Math.max(...Object.values(P).map(w => w.length))
 }
}

function Md(e, t, n, r, {
 holds: l = {},
 freezes: o = {}
}) {
 const i = n.c.id,
  s = {},
  a = {
   stolen: 0,
   bank: 0,
   held: 0,
   exchange: 0,
   frozen: 0,
   wallet: 0,
   cash: 0,
   bridge: 0,
   outside: 0,
   blocked: 0,
   converted: 0
  };
 for (const d of n.edges) d.t <= r && d.from === n.c.victim && d.status === "done" && (a.stolen += d.taint);
 for (const d of n.edges) d.t <= r && d.status === "blocked" && (a.blocked += d.taint);
 const h = new Set(n.edges.filter(d => d.status === "done" && d.t <= r).map(d => d.to));
 for (const d of n.nodes) {
  const k = Sp(t.hist, i, d.id, r),
   x = d.first <= r;
  let v = "moved";
  if (d.kind === "victim") v = "victim";
  else if (d.kind !== "p2p" && !h.has(d.id) && n.edges.some(N => N.to === d.id && N.status === "blocked" && N.t <= r)) v = "stopped";
  else if (d.kind === "bank") {
   const N = l[d.id] != null && l[d.id] <= r;
   v = k >= 1 ? N ? "held" : "recoverable" : N ? "held-empty" : "moved", k >= 1 && (a.bank += k, N && (a.held += k))
  } else if (v !== "stopped")
   if (d.kind === "p2p") v = "converted";
   else if (d.kind === "cash") v = "exited", a.cash += k;
  else if (d.kind === "bridge") v = "exited", a.bridge += k;
  else if (d.kind === "ext") v = "outside", a.outside += k;
  else if (d.kind === "exchange") {
   const N = o[d.id] != null && o[d.id] <= r;
   v = k >= 1 ? N ? "frozen" : "exchange" : N ? "frozen-empty" : "moved", k >= 1 && (a.exchange += k, N && (a.frozen += k))
  } else d.kind === "wallet" && (v = k >= 1 ? "crypto" : "moved", k >= 1 && (a.wallet += k));
  s[d.id] = {
   v: k,
   status: v,
   visible: x
  }
 }
 return a.secured = a.held + a.frozen, a.atRisk = a.bank - a.held + (a.exchange - a.frozen) + a.wallet, a.recoverable = a.bank + a.exchange, a.gone = a.cash + a.bridge, {
  st: s,
  tot: a
 }
}

function $p(e, t, n) {
 const r = Math.max(0, n - e.reportedAt);
 return (t.bank - t.held + (t.exchange - t.frozen) + .5 * t.wallet) * Math.exp(-r / 360)
}

function yh(e, t) {
 const n = t - e.fraudAt;
 return n <= 120 ? {
  k: "golden",
  text: "Golden hour",
  tone: "accent"
 } : n <= 1440 ? {
  k: "same",
  text: "Same day",
  tone: "med"
 } : {
  k: "late",
  text: `${Math.floor(n/1440)} days old`,
  tone: "neutral"
 }
}
const Ip = [
  ["Fake job / task scam", 'Offered a part-time "rate the hotel" job on Telegram; paid to unlock a premium task.'],
  ["Investment scam", 'Added to a WhatsApp "stock tips" group; invested through a fake trading app.'],
  ["Digital arrest", 'A caller posing as police kept the victim on video call and demanded a "verification deposit".'],
  ["Courier / customs scam", 'Told a parcel in their name held drugs; paid a "clearance fee" to avoid arrest.'],
  ["KYC update scam", "Got an SMS that the bank account would be blocked; shared OTPs on a fake KYC page."],
  ["Electricity bill scam", 'Warned the power would be cut tonight; paid the "pending bill" through a link.'],
  ["Loan app harassment", "A loan app demanded repayment many times the loan, using morphed photos as threats."]
 ],
 jp = ["Student", "Student", "Homemaker", "Gig worker", "Student", "Self-employed"];

function _p(e, t, n, r) {
 const l = vd(t * 7919 + 17),
  o = Object.keys(Ze).filter(V => V !== "IMPT"),
  i = `G${r}`,
  s = [],
  a = [],
  h = [];
 let d = 0,
  k = 0;
 const x = () => {
   const V = l.chance(.5) ? "M" : "F";
   return [`${l.pick(V==="F"?Sd:wd)} ${l.pick(xd)}`, V]
  },
  v = () => `D-${l.hex(4)}`,
  N = V => {
   const [W, K] = x(), Z = l.pick(o), b = {
    id: `${i}A${++d}`,
    kind: "bank",
    bank: Z,
    g: K,
    mask: `••${l.int(1e3,9999)}`,
    ifsc: `${Z}0SYN${l.int(100,999)}`,
    name: W,
    city: l.pick(_i),
    phone: `+91 9${l.int(1e3,9999)}•••${l.int(100,999)}`,
    label: 1,
    role: "mule",
    ...V
   };
   return s.push(b), b
  },
  p = (V, W, K, Z, b, dt = {}) => {
   const Yt = `${i}T${++k}`,
    Vn = b === "TRC20" ? l.hex(64).toLowerCase() : b === "ATM" ? `ATM-${l.digits(8)}` : b === "P2P" ? `P2P-${l.digits(9)}` : l.digits(12);
   return h.push({
    id: Yt,
    t: Math.round(V),
    from: W,
    to: K,
    amt: Z == null ? null : Math.round(Z),
    cur: dt.cur || "INR",
    rail: b,
    ref: Vn,
    ...dt
   }), Yt
  },
  [P, u] = l.pick(Ip),
  f = Math.round(l.logu(6e4, 6e5) / 1e3) * 1e3,
  c = n - l.int(55, 95),
  [y, M] = x(),
  w = {
   id: `${i}V`,
   kind: "bank",
   bank: l.pick(o),
   g: M,
   mask: `••${l.int(1e3,9999)}`,
   ifsc: "SBIN0SYN001",
   name: y,
   city: l.pick(_i),
   phone: "",
   ageY: l.int(35, 72),
   occ: l.pick(["Salaried", "Retired", "Self-employed"]),
   income: l.int(3e4, 12e4),
   opened: l.int(1500, 6e3),
   device: v(),
   open0: f * l.range(1.3, 2.5),
   role: "victim",
   label: 0
  };
 s.push(w);
 const m = v(),
  g = () => l.pick(jp),
  T = () => ({
   ageY: l.int(18, 30),
   occ: g(),
   income: l.int(3e3, 15e3),
   opened: l.int(6, 80),
   device: l.chance(.6) ? m : v(),
   open0: l.int(150, 2500)
  }),
  j = N({
   layer: 1,
   ...T()
  }),
  O = Array.from({
   length: l.int(2, 4)
  }, () => N({
   layer: 2,
   ...T()
  })),
  F = Array.from({
   length: l.int(1, 2)
  }, () => N({
   layer: 3,
   ...T()
  })),
  L = f > 2e5 ? 3 : f > 9e4 ? 2 : 1,
  X = [];
 let ce = c,
  U = f;
 for (let V = 0; V < L; V++) {
  const W = V === L - 1 ? U : Math.round(f / L / 1e3) * 1e3;
  U -= W, X.push(p(ce, w.id, j.id, W, W > 1e5 ? "IMPS" : "UPI")), ce += l.int(3, 9)
 }
 let E = ce + l.int(6, 14);
 const C = l.range(.03, .07);
 O.forEach((V, W) => {
  p(E, j.id, V.id, null, "IMPS", {
   sweepPct: (1 - C) / O.length / (1 - (1 - C) * W / O.length)
  }), E += l.int(2, 6)
 });
 const $ = e.sellers,
  _ = V => {
   const W = {
    id: `T${l.b58(4)}syn${l.b58(26)}`,
    kind: "wallet",
    chain: "TRON",
    label: "Unlabelled wallet",
    flags: [],
    open0: 0,
    ...V
   };
   return a.push(W), W
  },
  I = _({}),
  D = _({
   kind: "exchange",
   exchange: l.pick(Object.keys(Ft)),
   label: "Exchange deposit"
  });
 D.label = `${Ft[D.exchange]} · user deposit address`, O.forEach((V, W) => {
  const K = E + l.int(5, 35) + W * 4,
   Z = W % 3;
  if (Z === 0) {
   const b = F[W % F.length];
   p(K, V.id, b.id, null, "IMPS", {
    sweepPct: .95
   })
  } else if (Z === 1) p(K, V.id, "CASH", null, "ATM", {
   sweepPct: .5
  }), p(K + l.int(3, 12), V.id, "CASH", null, "ATM", {
   sweepPct: .9
  });
  else {
   const b = l.pick($),
    dt = p(K, V.id, b, null, "UPI", {
     sweepPct: .96
    });
   p(K + l.int(3, 8), b, I.id, null, "P2P", {
    match: dt,
    cur: "USDT"
   })
  }
 }), F.forEach((V, W) => {
  const K = E + l.int(45, 95) + W * 7;
  if (W === 0) {
   const Z = l.pick($),
    b = p(K, V.id, Z, null, "UPI", {
     sweepPct: .95
    });
   p(K + l.int(3, 8), Z, I.id, null, "P2P", {
    match: b,
    cur: "USDT"
   })
  } else p(K, V.id, `EXT:${l.pick(o)}`, null, "IMPS", {
   sweepPct: .9
  })
 });
 const B = E + l.int(30, 60);
 p(B, I.id, D.id, null, "TRC20", {
  cur: "USDT",
  sweepPct: .99
 }), p(B + l.int(70, 110), I.id, D.id, null, "TRC20", {
  cur: "USDT",
  sweepPct: .99
 }), p(B + l.int(40, 60), D.id, "BRIDGE", null, "TRC20", {
  cur: "USDT",
  sweepPct: .995
 }), p(B + l.int(130, 170), D.id, "BRIDGE", null, "TRC20", {
  cur: "USDT",
  sweepPct: .995
 });
 const Q = {
  id: `C-${r}`,
  ack: `3141${l.digits(10)}`,
  type: P,
  victim: w.id,
  amount: f,
  fraudAt: c,
  reportedAt: n,
  taintTx: X,
  channel: l.pick(["1930 helpline", "NCRP portal"]),
  story: u,
  generated: !0
 };
 return {
  accounts: s,
  wallets: a,
  txns: h,
  case: Q
 }
}
const kh = `time,from,to,amount,rail,currency,fraud
10:02,Victim Sharma,Mule Ravi,95000,IMPS,INR,1
10:05,Victim Sharma,Mule Ravi,55000,UPI,INR,1
10:19,Mule Ravi,Mule Asha,49500,IMPS,INR,0
10:21,Mule Ravi,Mule Kunal,48000,IMPS,INR,0
10:24,Mule Ravi,Mule Tina,47500,IMPS,INR,0
10:40,Mule Asha,ATM,40000,ATM,INR,0
10:52,Mule Kunal,Mule Joy,45000,IMPS,INR,0
11:15,Mule Joy,Other bank,44000,IMPS,INR,0`;

function Rp(e) {
 const t = [];
 for (const n of e.split(/\r?\n/)) {
  const r = n.trim();
  if (!r) continue;
  const l = [];
  let o = "",
   i = !1;
  for (let s = 0; s < r.length; s++) {
   const a = r[s];
   a === '"' ? i && r[s + 1] === '"' ? (o += '"', s++) : i = !i : a === "," && !i ? (l.push(o.trim()), o = "") : o += a
  }
  l.push(o.trim()), t.push(l)
 }
 return t
}

function Ap(e) {
 const t = /(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{2})/.exec(e);
 if (t) return Date.UTC(+t[1], +t[2] - 1, +t[3], +t[4], +t[5]) / 6e4;
 const n = /^(\d{1,2}):(\d{2})$/.exec(e);
 if (n) return +n[1] * 60 + +n[2];
 const r = Number(e);
 return Number.isFinite(r) ? r : null
}

function Dp(e, t, n) {
 const r = Rp(e);
 if (r.length < 2) throw new Error("Need a header row and at least one transaction.");
 const l = r[0].map(m => m.toLowerCase()),
  o = m => l.indexOf(m);
 for (const m of ["time", "from", "to", "amount"])
  if (o(m) < 0) throw new Error(`Missing column "${m}". Expected: time, from, to, amount, rail, currency, fraud.`);
 const i = `I${n}`,
  s = {},
  a = [],
  h = [],
  d = [],
  k = m => {
   const g = m.trim();
   if (/^(atm|cash)$/i.test(g)) return "CASH";
   if (/^(bridge|mixer)$/i.test(g)) return "BRIDGE";
   if (/^(other bank|ext|external)/i.test(g)) return "EXT:SBIN";
   if (s[g]) return s[g];
   const T = /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(g),
    j = T ? g : `${i}-${Object.keys(s).length+1}`;
   return s[g] = j, T ? h.push({
    id: j,
    kind: "wallet",
    chain: "TRON",
    label: "Imported wallet",
    flags: [],
    open0: 0
   }) : a.push({
    id: j,
    kind: "bank",
    bank: "IMPT",
    g: "M",
    mask: `••${String(1e3+a.length).slice(-4)}`,
    ifsc: "IMPORT",
    name: g,
    city: "—",
    phone: "",
    ageY: 30,
    occ: "Imported account",
    income: 2e4,
    opened: 60,
    device: `D-IMP${a.length}`,
    open0: 0,
    role: "normal",
    label: 0
   }), j
  },
  x = [];
 r.slice(1).forEach((m, g) => {
  const T = Ap(m[o("time")] || ""),
   j = Number(String(m[o("amount")] || "").replace(/[₹,\s]/g, ""));
  if (T == null || !(j > 0)) throw new Error(`Row ${g+2}: could not read the time or amount.`);
  x.push({
   t: T,
   from: k(m[o("from")] || ""),
   to: k(m[o("to")] || ""),
   amt: j,
   rail: o("rail") >= 0 && m[o("rail")] || "IMPS",
   cur: (o("currency") >= 0 && m[o("currency")] || "INR").toUpperCase() === "USDT" ? "USDT" : "INR",
   fraud: o("fraud") >= 0 && /^(1|true|yes|y)$/i.test(m[o("fraud")] || "")
  })
 });
 const v = x.filter(m => m.fraud);
 if (!v.length) throw new Error("Mark the victim's payments with fraud=1 so Peecha knows where to start.");
 const N = Math.max(...x.map(m => m.t)),
  p = t - 2 - N,
  P = {},
  u = {};
 for (const m of x.slice().sort((g, T) => g.t - T.t)) P[m.from] = (P[m.from] || 0) - m.amt, u[m.from] = Math.min(u[m.from] || 0, P[m.from]), P[m.to] = (P[m.to] || 0) + m.amt;
 for (const m of [...a, ...h]) m.open0 = Math.max(0, -(u[m.id] || 0));
 const f = [];
 x.forEach((m, g) => {
  const T = `${i}T${g+1}`;
  d.push({
   id: T,
   t: Math.round(m.t + p),
   from: m.from,
   to: m.to,
   amt: m.amt,
   cur: m.cur,
   rail: m.rail.toUpperCase(),
   ref: `IMP${String(g+1).padStart(5,"0")}`
  }), m.fraud && f.push(T)
 });
 const c = v[0].from,
  y = a.find(m => m.id === c);
 y && (y.role = "victim");
 const M = v.reduce((m, g) => m + g.amt, 0),
  w = {
   id: `C-${n}`,
   ack: "IMPORTED",
   type: "Imported transactions",
   victim: c,
   amount: M,
   fraudAt: Math.round(v[0].t + p),
   reportedAt: t,
   taintTx: f,
   channel: "CSV import",
   story: `Imported from a CSV with ${x.length} transactions and ${a.length+h.length} accounts or wallets.`,
   imported: !0
  };
 return {
  accounts: a,
  wallets: h,
  txns: d,
  case: w
 }
}

function zp(e, t) {
 if (!t || !t.length) return e;
 const n = {
   ...e.accounts
  },
  r = {
   ...e.wallets
  },
  l = [],
  o = [...e.cases];
 for (const s of t) {
  for (const a of s.accounts) n[a.id] = a;
  for (const a of s.wallets) r[a.id] || (r[a.id] = a);
  l.push(...s.txns), o.push(s.case)
 }
 const i = e.txns.concat(l).sort((s, a) => s.t - a.t || (s.id < a.id ? -1 : 1));
 return {
  ...e,
  accounts: n,
  wallets: r,
  txns: i,
  cases: o
 }
}
const tn = () => (typeof performance < "u" ? performance : Date).now();
let rl = null;

function Ar() {
 if (rl) return rl;
 const e = tn(),
  t = wp(),
  n = tn() - e,
  r = Hl(t, {
   clock: st,
   cases: []
  }),
  l = Cp(t, r);
 return rl = {
  W: t,
  M: l,
  genMs: n
 }, rl
}
let Lo = {
 key: null,
 W: null
};

function Nd(e) {
 const {
  W: t
 } = Ar();
 if (!e || !e.length) return t;
 const n = e.map(r => r.case.id).join("|");
 return Lo.key !== n && (Lo = {
  key: n,
  W: zp(t, e)
 }), Lo.W
}

function sr(e, t) {
 var M, w;
 const {
  M: n
 } = Ar(), r = Nd(e.extra), l = tn(), o = r.cases.filter(m => !m.event || e.fired[m.event]), i = t.method || "fifo", s = Hl(r, {
  clock: e.clock,
  holds: e.holds,
  freezes: e.freezes,
  cases: o,
  method: i
 }), a = tn(), h = i === "fifo" ? s : Hl(r, {
  clock: e.clock,
  holds: e.holds,
  freezes: e.freezes,
  cases: [],
  method: "fifo"
 }), d = {};
 for (const m of o)
  for (const g of s.edges[m.id]) g.status === "done" && r.accounts[g.to] && g.to !== m.victim && ((d[M = g.to] || (d[M] = {}))[m.id] = (d[g.to][m.id] || 0) + g.taint);
 const k = Pp(r, h, n, {
   traced: d
  }),
  x = {},
  v = {},
  N = {},
  p = {};
 for (const m of o) {
  const g = Td(r, s, m, {
   clock: e.clock
  });
  x[m.id] = g, v[m.id] = Md(r, s, g, e.clock, {
   holds: e.holds,
   freezes: e.freezes
  }), N[m.id] = $p(m, v[m.id].tot, e.clock);
  for (const T of g.nodes)(p[w = T.id] || (p[w] = [])).push(m.id)
 }
 const P = tn() - l,
  u = Tp(r, k, n, t.holdThr),
  f = Object.keys(k).filter(m => k[m].score >= t.holdThr && !p[m] && h.stats[m] && h.stats[m].lastT != null).sort((m, g) => h.stats[g].lastT - h.stats[m].lastT || k[g].score - k[m].score),
  c = Object.keys(k).filter(m => {
   const g = r.accounts[m],
    T = h.stats[m],
    j = k[m];
   return j.score >= t.callLo && j.score < t.holdThr && g.opened <= 90 && T && T.lastT >= e.clock - 3 * 1440 && j.x.flow >= .75 && T.inAmt >= 8e3 && !p[m]
  }).sort((m, g) => k[g].score - k[m].score),
  y = o.slice().sort((m, g) => N[g.id] - N[m.id] || g.reportedAt - m.reportedAt).map(m => m.id);
 return {
  W: r,
  M: n,
  sim: s,
  behaviour: h,
  method: i,
  scores: k,
  cases: o,
  graphs: x,
  states: v,
  prio: N,
  order: y,
  inTrail: p,
  alerts: f,
  candidates: c,
  evalr: u,
  ms: P,
  simMs: a - l,
  txCount: Object.values(s.status).filter(m => m !== "future").length
 }
}

function wh(e, t, n) {
 const r = Nd(e.extra),
  o = r.cases.filter(s => !s.event || e.fired[s.event]).find(s => s.id === n);
 if (!o) return null;
 const i = {};
 for (const s of ["fifo", "lifo", "prorata"]) {
  const a = tn(),
   h = Hl(r, {
    clock: e.clock,
    holds: e.holds,
    freezes: e.freezes,
    cases: [o],
    method: s
   }),
   d = Td(r, h, o, {
    clock: e.clock
   });
  i[s] = {
   ...Md(r, h, d, e.clock, {
    holds: e.holds,
    freezes: e.freezes
   }).tot,
   ms: tn() - a
  }
 }
 return i
}
const Lp = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206,
 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711,
 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804,
 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479,
 3329325298
]);

function $d(e) {
 const t = new TextEncoder().encode(e),
  n = t.length,
  r = n + 9 + 63 >> 6,
  l = new Uint8Array(r * 64);
 l.set(t), l[n] = 128;
 const o = n * 8,
  i = new DataView(l.buffer);
 i.setUint32(l.length - 4, o >>> 0), i.setUint32(l.length - 8, Math.floor(o / 4294967296));
 const s = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]),
  a = new Uint32Array(64),
  h = (d, k) => d >>> k | d << 32 - k;
 for (let d = 0; d < r; d++) {
  for (let c = 0; c < 16; c++) a[c] = i.getUint32(d * 64 + c * 4);
  for (let c = 16; c < 64; c++) {
   const y = h(a[c - 15], 7) ^ h(a[c - 15], 18) ^ a[c - 15] >>> 3,
    M = h(a[c - 2], 17) ^ h(a[c - 2], 19) ^ a[c - 2] >>> 10;
   a[c] = a[c - 16] + y + a[c - 7] + M >>> 0
  }
  let [k, x, v, N, p, P, u, f] = s;
  for (let c = 0; c < 64; c++) {
   const y = h(p, 6) ^ h(p, 11) ^ h(p, 25),
    M = p & P ^ ~p & u,
    w = f + y + M + Lp[c] + a[c] >>> 0,
    m = h(k, 2) ^ h(k, 13) ^ h(k, 22),
    g = k & x ^ k & v ^ x & v,
    T = m + g >>> 0;
   f = u, u = P, P = p, p = N + w >>> 0, N = v, v = x, x = k, k = w + T >>> 0
  }
  s[0] = s[0] + k >>> 0, s[1] = s[1] + x >>> 0, s[2] = s[2] + v >>> 0, s[3] = s[3] + N >>> 0, s[4] = s[4] + p >>> 0, s[5] = s[5] + P >>> 0, s[6] = s[6] + u >>> 0, s[7] = s[7] + f >>> 0
 }
 return Array.from(s).map(d => d.toString(16).padStart(8, "0")).join("")
}
const gl = (e = 64) => "-".repeat(e);

function Id(e, t, n, r, l, {
 clock: o,
 holds: i,
 freezes: s,
 thr: a,
 officer: h
}) {
 var u, f;
 const d = n.c,
  k = [],
  x = (c, y) => [`To: ${c}`, `From: ${h.name}, ${h.title} (${h.unit})`, `Ref: Complaint ${d.id} · Acknowledgement ${d.ack} · ${ir(o)} ${me(o)} IST`, `Subject: ${y}`, ""],
  v = c => {
   const y = e.txns.find(M => M.id === c.tx);
   return `${jt(c.t,o)} · ${c.rail} ${y?y.ref:c.tx} · ${c.cur==="USDT"?er(c.amt):pe(c.amt)} (${pe(c.taint)} traced)`
  },
  N = {};
 for (const c of n.nodes) {
  if (c.kind !== "bank") continue;
  const y = r.st[c.id],
   M = l[c.id] ? l[c.id].score : 0;
  (y.v >= 500 || M >= a) && (N[u = e.accounts[c.id].bank] || (N[u] = [])).push(c.id)
 }
 for (const [c, y] of Object.entries(N)) {
  const M = y.reduce((m, g) => m + r.st[g].v, 0),
   w = x(`The Nodal Officer (Cyber Fraud), ${Ze[c]}`, "Immediate debit hold on accounts receiving proceeds of cyber fraud");
  w.push(
   `The account${y.length>1?"s":""} below received money traced from complaint ${d.id} (${d.type}; ${pe(d.amount)} lost by the complainant on ${ir(d.fraudAt)}). Please place an immediate debit hold for the traced amount and preserve KYC, device, IP and login records.`,
   ""), y.forEach((m, g) => {
   const T = e.accounts[m],
    j = l[m];
   w.push(`${g+1}. A/c ${T.mask} · ${T.name} · IFSC ${T.ifsc}`), w.push(`   Traced balance now: ${pe(r.st[m].v)} · Mule-risk score: ${j?Math.round(j.score):"—"}/100`), j && j.reasons.forEach(O => w
    .push(`   - ${O}`));
   for (const O of n.edges.filter(F => F.to === m && F.status === "done").slice(0, 4)) w.push(`   In:  ${v(O)}`);
   for (const O of n.edges.filter(F => F.from === m && F.status === "done").slice(0, 4)) w.push(`   Out: ${v(O)}`);
   w.push("")
  }), w.push("The full hop-by-hop trail with timestamps is attached (Peecha evidence timeline).", "Generated by Peecha; reviewed and approved by the undersigned officer."), k.push({
   id: `hold:${c}`,
   kind: "hold",
   title: `Debit hold · ${Ze[c]}`,
   to: Ze[c],
   targets: y,
   amount: M,
   effect: `Debit hold on ${y.length} account${y.length>1?"s":""}`,
   executed: y.every(m => i[m] != null),
   text: w.join(`
`)
  })
 }
 const p = {};
 for (const c of n.nodes) c.kind === "exchange" && (p[f = e.wallets[c.id].exchange] || (p[f] = [])).push(c.id);
 for (const [c, y] of Object.entries(p)) {
  const M = y.reduce((m, g) => m + r.st[g].v, 0),
   w = x(`Compliance / LEA Desk, ${Ft[c]}`, "Freeze of user deposit address receiving USDT traced from cyber fraud");
  w.push(
   `USDT bought with money from complaint ${d.id} reached the deposit address(es) below. Please freeze the associated user account, block withdrawals and share KYC, login IPs and withdrawal history.`,
   ""), y.forEach((m, g) => {
   w.push(`${g+1}. Deposit address (TRON / TRC20): ${m}`), w.push(`   Traced value now: ≈ ${pe(r.st[m].v)} (≈ ${er(r.st[m].v/ji)})`);
   for (const T of n.edges.filter(j => j.to === m && j.status === "done")) w.push(`   In: ${v(T)}`)
  }), w.push("", "Upstream wallets on the same trail are listed in the attached evidence timeline."), k.push({
   id: `exchange:${c}`,
   kind: "exchange",
   title: `Freeze request · ${Ft[c]}`,
   to: Ft[c],
   targets: y,
   amount: M,
   effect: `Freeze ${y.length} deposit address${y.length>1?"es":""}`,
   executed: y.every(m => s[m] != null),
   text: w.join(`
`)
  })
 }
 const P = n.nodes.filter(c => c.kind === "wallet" && r.st[c.id].v >= 50);
 if (P.length) {
  const c = P.reduce((M, w) => M + r.st[w.id].v, 0),
   y = x("Tether (USDT issuer) — via the LEA request channel", "Request to freeze USDT on self-custody addresses linked to cyber fraud");
  y.push("The TRON addresses below hold USDT traced from the complaint. They are self-custody wallets, so an exchange cannot freeze them. Please consider an issuer-level freeze.", ""), P.forEach((M,
   w) => y.push(`${w+1}. ${M.id} · ≈ ${er(r.st[M.id].v/ji)} traced`)), y.push("", "Note: issuer freezes are at the issuer's discretion; Peecha keeps watching these addresses."), k.push({
   id: "issuer:USDT",
   kind: "issuer",
   title: "Issuer freeze request · USDT (self-custody wallets)",
   to: "USDT issuer (via LEA channel)",
   targets: P.map(M => M.id),
   amount: c,
   effect: "Request only — outcome not simulated",
   executed: !1,
   text: y.join(`
`)
  })
 }
 for (const c of n.nodes.filter(y => y.kind === "p2p")) {
  const y = e.accounts[c.id],
   M = n.edges.filter(T => T.to === c.id && T.status === "done"),
   w = n.edges.filter(T => T.from === c.id && T.status === "done"),
   m = M.reduce((T, j) => T + j.taint, 0),
   g = x(`${y.name} (P2P seller) and ${Ze[y.bank]}`, "Information request: P2P orders paid with proceeds of cyber fraud");
  g.push(
   "Your bank account received the payments below and, minutes later, USDT was released to the listed wallet. Please share the P2P order IDs, buyer KYC / platform handle and chat logs for these orders.",
   ""), M.forEach(T => g.push(`Paid in: ${v(T)} from ${e.accounts[T.from]?e.accounts[T.from].name:T.from}`)), w.forEach(T => g.push(`USDT out: ${jt(T.t,o)} · ${er(T.amtOut)} → ${T.to}`)), k.push({
   id: `p2p:${c.id}`,
   kind: "p2p",
   title: `P2P order details · ${y.name}`,
   to: y.name,
   targets: [c.id],
   amount: m,
   effect: "Information request (rupee → USDT seam)",
   executed: !1,
   text: g.join(`
`)
  })
 }
 for (const c of n.nodes.filter(y => y.kind === "ext")) {
  const y = c.id.slice(4),
   M = n.edges.filter(m => m.to === c.id && m.status === "done"),
   w = x(`The Nodal Officer (Cyber Fraud), ${Ze[y]||y}`, "Trace and hold request for onward transfers");
  w.push("Money traced from the complaint left our data towards your bank. Please identify the beneficiary accounts, place a debit hold for the traced amount and share the onward trail.", ""), M
   .forEach(m => w.push(`- ${v(m)} from A/c ${e.accounts[m.from]?e.accounts[m.from].mask:m.from}`)), k.push({
    id: `ext:${y}`,
    kind: "ext",
    title: `Trace request · ${Ze[y]||y}`,
    to: Ze[y] || y,
    targets: [c.id],
    amount: r.st[c.id].v,
    effect: "Extends the trail beyond our data",
    executed: !1,
    text: w.join(`
`)
   })
 } {
  const c = new Set(n.edges.filter(T => T.status === "done").map(T => T.to)),
   y = n.nodes.filter(T => T.kind === "bank" && c.has(T.id)),
   M = n.edges.find(T => T.from === d.victim),
   w = n.edges.filter(T => T.rail === "P2P" && T.status === "done"),
   m = r.tot,
   g = ["SUSPICIOUS TRANSACTION REPORT — DRAFT NARRATIVE (for the reporting entity to file with FIU-IND)", `Case ${d.id} · ${d.type} · prepared ${ir(o)} ${me(o)} IST`, gl(),
    `On ${ir(d.fraudAt)}, the complainant transferred ${pe(d.amount)} in ${n.edges.filter(T=>T.from===d.victim&&T.status==="done").length} payments, the first at ${me(M?M.t:d.fraudAt)}, to A/c ${M?e.accounts[M.to].mask:""} (${M?`${e.accounts[M.to].occ.toLowerCase()}, account opened ${e.accounts[M.to].opened} days earlier`:""}).`,
    `Within minutes the funds were layered through ${y.length} accounts across ${new Set(y.map(T=>e.accounts[T.id].bank)).size} banks, with several transfers just under ₹50,000 and several accounts sharing devices.`,
    w.length ?
    `${_e(w.reduce((T,j)=>T+j.taint,0))} was paid to P2P crypto seller(s) and converted to ${er(w.reduce((T,j)=>T+j.amtOut,0))} on TRON, then moved between self-custody wallets towards an exchange deposit address.` :
    "No crypto leg was observed.",
    `Status at ${me(o)}: ${pe(m.secured)} secured (held/frozen), ${pe(m.atRisk)} still at risk, ${pe(m.gone)} already exited as cash or via bridge, ${pe(m.outside)} outside our data.`, "",
    "Accounts involved:", ...y.map(T => {
     const j = e.accounts[T.id],
      O = l[T.id];
     return `- ${j.mask} ${j.name} (${Ze[j.bank]}) · score ${O?Math.round(O.score):"—"} · ${O&&O.reasons[0]?O.reasons[0]:""}`
    }), "", "Grounds for suspicion: rapid pass-through, fan-out to new accounts, profile mismatch, shared devices and conversion to crypto, all linked to a registered cyber-fraud complaint."
   ];
  k.push({
   id: "str",
   kind: "str",
   title: "STR draft narrative",
   to: "Reporting bank(s) → FIU-IND",
   targets: y.map(T => T.id),
   amount: m.stolen,
   effect: "Draft for the bank's principal officer",
   executed: !1,
   text: g.join(`
`)
  })
 }
 return k
}

function Op(e, t, n) {
 return t.edges.map(r => {
  const l = e.txns.find(o => o.id === r.tx);
  return {
   t: r.t,
   when: jt(r.t, n),
   from: r.from,
   to: r.to,
   rail: r.rail,
   ref: l ? l.ref : r.tx,
   amt: r.amt,
   cur: r.cur,
   out: r.amtOut,
   outCur: r.outCur,
   taint: r.taint,
   status: r.status
  }
 })
}

function Up(e, t, n) {
 const r = Op(e, t, n),
  l = o => `"${String(o).replace(/"/g,'""')}"`;
 return ["time,from,to,rail,reference,amount,currency,traced_inr,status", ...r.map(o => [o.when, o.from, o.to, o.rail, o.ref, o.amt, o.cur, Math.round(o.taint), o.status].map(l).join(","))].join(`
`)
}

function Sh(e, t, n, r, l) {
 const o = [`PEECHA ACTION PACK — ${t.c.id} (${t.c.type})`, `Exported ${ir(l)} ${me(l)} IST · synthetic demo data`, gl(72)];
 for (const s of n) {
  const a = r[s.id];
  o.push("", `[${a?`APPROVED ${me(a.at)} by ${a.by}`:"DRAFT"}] ${s.title}`, gl(72), a && a.text ? a.text : s.text)
 }
 o.push("", gl(72), "EVIDENCE TIMELINE", Up(e, t, l));
 const i = o.join(`
`);
 return {
  text: i,
  hash: $d(i)
 }
}
const se = {
  officer: {
   key: "officer",
   badge: "O",
   title: "Cyber-cell officer",
   name: "Insp. Meera Baruah",
   unit: "Cyber Crime PS, Guwahati",
   blurb: "Sees every case. Confirms holds and approves requests.",
   perms: ["approve", "trace", "call", "events", "edit", "file", "holdDecide"]
  },
  analyst: {
   key: "analyst",
   badge: "B",
   title: "Bank analyst",
   name: "Rahul Nair",
   unit: "Fraud Risk Management Unit",
   blurb: "Sees cases and accounts of your own bank. Places 24-hour holds.",
   perms: ["trace", "call", "edit", "file", "holdPlace"]
  },
  consumer: {
   key: "consumer",
   badge: "C",
   title: "Consumer (victim)",
   name: "Anil Verma",
   unit: "Complainant",
   blurb: "Files a complaint and follows where the money went.",
   perms: ["file"]
  }
 },
 Fp = {
  approve: "Approve holds, freezes and requests",
  trace: "Open cases and trace money",
  call: "Trigger prevention calls",
  events: "Ingest complaints / run re-trace",
  edit: "Edit action-pack drafts",
  audit: "Read-only review and audit",
  file: "File complaints",
  holdDecide: "Confirm or reject holds, request holds",
  holdPlace: "Place 24-hour holds on own accounts"
 },
 Ai = {
  holdThr: 70,
  callLo: 40,
  step: 25,
  method: "fifo"
 },
 jd = "0".repeat(64);

function _d(e, t) {
 return $d(`${e}|${t.seq}|${t.t}|${t.kind}|${t.actor}|${t.text}`)
}

function pn(e, t) {
 const n = e.length ? e[e.length - 1].hash : jd,
  r = {
   seq: e.length + 1,
   ...t,
   prev: n
  };
 return r.hash = _d(n, r), [...e, r]
}

function xh(e) {
 let t = jd;
 for (const n of e) {
  if (n.prev !== t || _d(t, n) !== n.hash) return {
   ok: !1,
   at: n.seq
  };
  t = n.hash
 }
 return {
  ok: !0,
  n: e.length,
  head: t
 }
}
const Za = (e, t) => {
  try {
   return localStorage.getItem(e) || t
  } catch {
   return t
  }
 },
 Ja = (e, t) => {
  try {
   localStorage.setItem(e, t)
  } catch {}
 },
 Rd = "peecha-state-v6",
 Ad = ["S", "settings", "log", "approvals", "edits", "calls", "reviewed", "caseSel", "session", "page", "queued", "bank", "victimId", "holds2", "holdSkew", "holdsSeeded", "filed"];

function Dd() {
 const {
  W: e,
  M: t,
  genMs: n
 } = Ar(), r = {}, l = {}, o = {};
 for (const d of e.cases) d.seedHolds && Object.assign(r, d.seedHolds), d.seedFreezes && Object.assign(l, d.seedFreezes);
 const i = {
  clock: st,
  fired: {},
  holds: r,
  freezes: l,
  retraces: 0,
  extra: []
 };
 let s = [];
 const a = (d, k, x, v = "system") => {
  s = pn(s, {
   t: jt(d, st),
   kind: k,
   actor: v,
   text: x
  })
 };
 a(A(0, 0, 0), "SYSTEM",
  `Synthetic world generated in ${n.toFixed(0)} ms · ${Object.keys(e.accounts).length} accounts, ${Object.keys(e.wallets).length} wallets, ${e.txns.length.toLocaleString("en-IN")} transactions`), a(
  A(0, 0, 1), "MODEL", `Mule model trained in browser in ${t.ms.toFixed(0)} ms on ${t.trainN} accounts (${t.trainPos} mules); ${t.testN} held out for testing`);
 const h = sr(i, Ai);
 for (const d of e.cases.filter(k => !k.event))
  if (a(d.reportedAt, "COMPLAINT", `${d.id} ingested · ${d.type} · ${pe(d.amount)} · via ${d.channel}`, "intake"), a(d.reportedAt + 1, "TRACE", `${d.id} trail built · agent drafted action pack`,
    "agent"), d.seedApproved) {
   const k = Id(e, h.sim, h.graphs[d.id], h.states[d.id], h.scores, {
    clock: st,
    holds: r,
    freezes: l,
    thr: Ai.holdThr,
    officer: se.officer
   });
   for (const x of k) o[`${d.id}|${x.id}`] = {
    at: d.seedApproved,
    by: se.officer.name,
    targets: x.targets.slice()
   };
   a(d.seedApproved, "DECISION", `APPROVED ${d.id} action pack · ${k.length} actions · debit holds on ${Object.keys(d.seedHolds).length} accounts`, `O:${se.officer.name}`)
  } return a(st - 1, "FEED", "Bank alerts, NCRP/1930 intake and TRON listener connected · watching for complaints"), {
  S: i,
  log: s,
  approvals: o,
  edits: {},
  calls: {},
  reviewed: {},
  caseSel: null,
  queued: 0
 }
}

function Bp() {
 let e = null;
 try {
  e = JSON.parse(localStorage.getItem(Rd) || "null")
 } catch {
  e = null
 }
 const t = e && e.S && e.S.clock && Array.isArray(e.log) && e.settings;
 return {
  ...Dd(),
  settings: {
   ...Ai
  },
  session: null,
  page: "inbox",
  bank: null,
  victimId: null,
  holds2: [],
  holdSkew: 0,
  holdsSeeded: !1,
  filed: [],
  holdPrefill: null,
  ...t ? Object.fromEntries(Ad.filter(n => n in e).map(n => [n, e[n]])) : {},
  degraded: !1,
  linkLostAt: null,
  modal: null,
  modalStack: [],
  paletteOpen: !1,
  copilotOpen: !1,
  copilotSeed: null,
  toastMsg: null,
  viewTime: null,
  tourOn: !1,
  call: null,
  lastRetrace: null,
  theme: Za("pc-theme", "light"),
  density: Za("pc-density", "comfortable"),
  lastSync: Date.now()
 }
}
const zd = H.createContext(null),
 xt = () => H.useContext(zd);

function hopen(x) {
 return x.status === "active" || x.status === "confirmed" || x.status === "requested"
}

function hset(S, ac, on) {
 const h = {
  ...S.holds
 };
 if (on) {
  h[ac] == null && (h[ac] = S.clock)
 } else delete h[ac];
 return {
  ...S,
  holds: h
 }
}

function hlb(W, y) {
 const A = W.accounts[y.account];
 return A ? `${gh[A.bank]} ${A.mask}` : y.account
}

function hchg(p, id, patch, on, actor, logf, toast, d) {
 const x = p.holds2.find(q => q.id === id);
 if (!x) return p;
 const y = {
  ...x,
  ...patch
 };
 let c = {
  ...p,
  holds2: p.holds2.map(q => q.id === id ? y : q),
  toastMsg: toast(y)
 };
 if (on === !0) c.S = hset(p.S, y.account, !0);
 else if (on === !1) c.S = hset(p.S, y.account, !1);
 c.log = d(c, "HOLD", logf(y), actor, y.basis2 || (c.session === "officer" ? "Officer decision" : "Bank"));
 return c
}

function visFiled(t) {
 return t.session === "officer" ? t.filed : t.session === "analyst" ? t.filed.filter(f => f.bank === t.bank) : t.session === "consumer" ? t.filed.filter(f => f.victimId === t.victimId) : []
}

function userOf(t, D) {
 const u = userOf0(t, D),
  A = window.PeechaAPI,
  st = A && A.get();
 return u && st && st.status === "live" && st.userName ? {
  ...u,
  name: st.userName
 } : u
}

function userOf0(t, D) {
 if (!t.session) return null;
 const b = se[t.session];
 if (t.session === "analyst") return {
  ...b,
  title: `Bank analyst · ${gh[t.bank]||""}`,
  unit: `${Ze[t.bank]||""} · Fraud Risk Management`
 };
 if (t.session === "consumer") {
  const a = D.W.accounts[t.victimId];
  return {
   ...b,
   name: a ? a.name : b.name,
   unit: a ? `${Ze[a.bank]} customer · ${a.city}` : b.unit
  }
 }
 return b
}

function scopeD(D, role, bank, vid) {
 if (role !== "analyst" && role !== "consumer") return D;
 const W = D.W,
  acc = W.accounts,
  own = role === "analyst" ? (id => !!acc[id] && acc[id].bank === bank) : (id => id === vid);
 const touches = c => {
  const g = D.graphs[c.id];
  return own(c.victim) || (!!g && g.nodes.some(nd => (nd.kind === "bank" || nd.kind === "victim") && own(nd.id)))
 };
 const cases = D.cases.filter(role === "consumer" ? (c => c.victim === vid) : touches);
 const ids = new Set(cases.map(c => c.id));
 const mk = {};
 for (const k in acc) {
  const a = acc[k];
  mk[k] = own(k) ? a : {
   ...a,
   name: `${gh[a.bank]} ${a.mask}`,
   occ: "—",
   ageY: "–",
   city: "—",
   phone: "••••",
   device: "••••",
   income: 0,
   opened: 0,
   masked: !0
  }
 }
 const graphs = {};
 for (const c of cases) {
  const g = D.graphs[c.id];
  graphs[c.id] = {
   ...g,
   nodes: g.nodes.map(nd => mk[nd.id] && !own(nd.id) ? {
    ...nd,
    title: mk[nd.id].name
   } : nd)
  }
 }
 const pick = o => {
  const r = {};
  for (const k in o) own(k) && (r[k] = o[k]);
  return r
 };
 return {
  ...D,
  W: {
   ...W,
   accounts: mk
  },
  cases,
  order: D.order.filter(id => ids.has(id)),
  graphs,
  scores: role === "analyst" ? pick(D.scores) : {},
  alerts: role === "analyst" ? D.alerts.filter(own) : [],
  candidates: role === "analyst" ? D.candidates.filter(own) : [],
  inTrail: role === "analyst" ? pick(D.inTrail) : {}
 }
}

function navOf(r) {
 return r === "consumer" ? [
  ["mine", "▤", "My complaints", ["mine"]],
  ["reports", "▦", "Reports", ["reports"]],
  ["settings", "⚙", "Settings", ["settings"]]
 ] : [
  ["inbox", "▤", "Cases", ["inbox"]],
  ["trail", "⟿", "Money action", ["trail"]],
  ["accounts", "◉", "Mule radar", ["accounts", "prevent"]],
  ["holds", "◈", "Holds", ["holds", "action"]],
  ["reports", "▦", "Reports", ["reports"]], r === "officer" ? ["model", "▧", "System", ["model", "audit", "settings"]] : ["settings", "⚙", "Settings", ["settings"]]
 ]
}

function routeOf(e) {
 const r = e.user ? e.user.key : "officer",
  pg = navOf(r).flatMap(x => x[3]);
 return pg.includes(e.page) ? e.page : pg[0]
}

function homeOf(r) {
 return r === "consumer" ? "mine" : "inbox"
}

function TabsBar() {
 const e = xt(),
  r = e.user.key,
  pg = routeOf(e);
 const G = {
  accounts: [
   ["accounts", "Mule accounts"],
   ["prevent", "Prevention calls"]
  ],
  holds: [
   ["holds", "Holds"],
   ["action", "Action pack"]
  ],
  model: [
   ["model", "Model & metrics"],
   ["audit", "Audit trail"],
   ["settings", "Settings"]
  ]
 };
 let key = null;
 for (const k in G) G[k].some(x => x[0] === pg) && (key = k);
 if (!key || key === "model" && r !== "officer") return null;
 return S.jsx("div", {
  className: "rl-tabs page-tabs",
  role: "tablist",
  children: G[key].map(([p, l]) => S.jsx("button", {
   role: "tab",
   "aria-selected": pg === p,
   className: pg === p ? "on" : "",
   onClick: () => e.go(p),
   children: l
  }, p))
 })
}

function Hp({
 children: e
}) {
 const [t, n] = H.useState(() => {
  const q = Bp();
  return q.session && !se[q.session] ? {
   ...q,
   session: null
  } : q
 }), r = H.useRef(null), l = H.useMemo(() => sr(t.S, t.settings), [t.S, t.settings]), o = H.useRef(l);
 o.current = l;
 const sc = H.useMemo(() => scopeD(l, t.session, t.bank, t.victimId), [l, t.session, t.bank, t.victimId]);
 const i = H.useRef(t);
 i.current = t, H.useEffect(() => {
  document.documentElement.dataset.theme = t.theme, document.documentElement.dataset.density = t.density, Ja("pc-theme", t.theme), Ja("pc-density", t.density)
 }, [t.theme, t.density]), H.useEffect(() => {
  const p = setTimeout(() => {
   try {
    localStorage.setItem(Rd, JSON.stringify(Object.fromEntries(Ad.map(P => [P, t[P]]))))
   } catch {}
  }, 400);
  return () => clearTimeout(p)
 }, [t.S, t.log, t.settings, t.session, t.page, t.approvals, t.edits, t.calls, t.reviewed, t.caseSel, t.queued]), H.useEffect(() => {
  const p = setInterval(() => n(P => P.degraded ? P : {
   ...P,
   lastSync: Date.now()
  }), 6e3);
  return () => clearInterval(p)
 }, []);
 const s = H.useCallback(p => n(P => ({
  ...P,
  toastMsg: p
 })), []);
 H.useEffect(() => {
  if (t.toastMsg) return clearTimeout(r.current), r.current = setTimeout(() => n(p => ({
   ...p,
   toastMsg: null
  })), 3400), () => clearTimeout(r.current)
 }, [t.toastMsg]);
 const a = p => p.session ?
  `${se[p.session].badge}:${p.session==="analyst"?(gh[p.bank]||"Bank")+" analyst":p.session==="consumer"?((o.current.W.accounts[p.victimId]||{}).name||"Consumer"):se[p.session].name}` : "system",
  h = H.useCallback(p => !!t.session && se[t.session].perms.includes(p), [t.session]),
  d = (p, P, u, f, b) => pn(p.log, {
   t: jt(p.S.clock, st),
   kind: P,
   actor: f || a(p),
   text: u,
   ...b ? {
    basis: b
   } : {}
  }),
  k = H.useMemo(() => ({
   login: (p, q = {}) => {
    window.scrollTo(0, 0), n(P => {
     const v0 = q.victimId || P.victimId || ((o.current.cases.find(c=>c.id==="C-3021")||o.current.W.cases.find(c=>c.id==="C-3021")||o.current.cases[0]||o.current.W.cases[0])).victim,
      b0 = q.bank || P.bank || "SBIN",
      Q = {
       ...P,
       session: p,
       bank: p === "analyst" ? b0 : P.bank,
       victimId: p === "consumer" ? v0 : P.victimId,
       page: homeOf(p),
       caseSel: null
      };
     Q.log = pn(P.log, {
      t: jt(P.S.clock, st),
      kind: "ACCESS",
      actor: a(Q),
      text: `Signed in as ${se[p].title}${p==="analyst"?" · "+(Ze[b0]||b0):""}`
     });
     return Q
    })
   },
   logout: () => n(p => ({
    ...p,
    session: null,
    modal: null,
    modalStack: [],
    copilotOpen: !1,
    paletteOpen: !1,
    tourOn: !1,
    call: null
   })),
   switchRole: (p, q = {}) => n(P => {
    const v0 = q.victimId || P.victimId || ((o.current.cases.find(c=>c.id==="C-3021")||o.current.W.cases.find(c=>c.id==="C-3021")||o.current.cases[0]||o.current.W.cases[0])).victim,
     b0 = q.bank || P.bank || "SBIN",
     Q = {
      ...P,
      session: p,
      bank: p === "analyst" ? b0 : P.bank,
      victimId: p === "consumer" ? v0 : P.victimId,
      page: homeOf(p),
      caseSel: null,
      modal: null,
      modalStack: []
     };
    Q.log = pn(P.log, {
     t: jt(P.S.clock, st),
     kind: "ACCESS",
     actor: a(Q),
     text: `Role switched to ${se[p].title}${p==="analyst"?" · "+(Ze[b0]||b0):""}`
    });
    return Q
   }),
   go: p => {
    n(P => ({
     ...P,
     page: p,
     trailOpen: p === "trail" ? (P.page === "crypto" ? P.trailOpen : !1) : P.trailOpen,
     modal: null,
     modalStack: [],
     paletteOpen: !1
    })), window.scrollTo({
     top: 0,
     behavior: "smooth"
    })
   },
   openCase: (p, P = "trail") => {
    const toCrypto = P === "crypto";
    toCrypto && (P = "trail", setTimeout(() => {
     const x = document.getElementById("crypto-leg");
     x && x.scrollIntoView({
      behavior: "smooth",
      block: "start"
     })
    }, 900));
    n(u => ({
     ...u,
     caseSel: p,
     page: P,
     trailOpen: P === "trail",
     modal: null,
     modalStack: [],
     paletteOpen: !1,
     viewTime: null
    })), toCrypto || window.scrollTo({
     top: 0,
     behavior: "smooth"
    })
   },
   pickCase: p => n(u => ({
    ...u,
    caseSel: p
   })),
   open: (p, P) => n(u => ({
    ...u,
    modalStack: u.modal && !(u.modal.type === p && u.modal.id === P) ? [...u.modalStack, u.modal] : u.modalStack,
    modal: {
     type: p,
     id: P
    },
    paletteOpen: !1
   })),
   back: () => n(p => ({
    ...p,
    modal: p.modalStack[p.modalStack.length - 1] || null,
    modalStack: p.modalStack.slice(0, -1)
   })),
   close: () => n(p => ({
    ...p,
    modal: null,
    modalStack: []
   })),
   setViewTime: p => n(P => ({
    ...P,
    viewTime: p
   })),
   startTour: () => n(p => ({
    ...p,
    tourOn: !0,
    copilotOpen: !1
   })),
   endTour: () => n(p => ({
    ...p,
    tourOn: !1
   })),
   togglePalette: p => n(P => ({
    ...P,
    paletteOpen: p ?? !P.paletteOpen
   })),
   toggleCopilot: (p, P) => n(u => ({
    ...u,
    copilotOpen: p ?? !u.copilotOpen,
    copilotSeed: P || null
   })),
   setTheme: p => n(P => ({
    ...P,
    theme: p
   })),
   toggleTheme: () => n(p => ({
    ...p,
    theme: p.theme === "dark" ? "light" : "dark"
   })),
   setDensity: p => n(P => ({
    ...P,
    density: p
   })),
   toast: s,
   ingestComplaint: () => {
    n(p => {
     if (p.S.fired.complaint) return p;
     const {
      W: P
     } = Ar(), u = P.cases.find(m => m.event === "complaint"), f = {
      ...p.S,
      clock: Math.max(p.S.clock, u.reportedAt + 2),
      fired: {
       ...p.S.fired,
       complaint: !0
      }
     }, c = sr(f, p.settings), y = c.graphs[u.id], M = c.states[u.id].tot;
     let w = {
      ...p,
      S: f,
      caseSel: u.id,
      viewTime: null
     };
     return w.log = d(w, "COMPLAINT", `${u.id} ingested · ${u.type} · ${pe(u.amount)} · via ${u.channel} (ack ${u.ack})`, "intake"), w.log = d(w, "TRACE",
      `${u.id} trail built in ${c.ms.toFixed(0)} ms over ${c.txCount.toLocaleString("en-IN")} transactions · ${y.nodes.filter(m=>m.kind==="bank").length} accounts, ${y.nodes.filter(m=>m.kind==="wallet").length} wallet · ${_e(M.recoverable)} recoverable now`,
      "agent"), w.log = d(w, "AGENT", `${u.id} action pack drafted · awaiting officer approval`, "agent"), {
      ...w,
      toastMsg: `New complaint ${u.id} traced in ${c.ms.toFixed(0)} ms — top of the inbox`
     }
    })
   },
   retrace: () => {
    n(p => {
     if (p.S.clock >= Ya) return {
      ...p,
      toastMsg: "End of the demo day (23:30)"
     };
     const P = o.current,
      u = {
       ...p.S,
       clock: Math.min(Ya, p.S.clock + p.settings.step),
       retraces: p.S.retraces + 1
      },
      f = sr(u, p.settings),
      c = [];
     let y = 0,
      M = 0,
      w = 0;
     for (const T of f.cases) {
      const j = new Set((P.graphs[T.id] ? P.graphs[T.id].edges : []).map(E => E.tx)),
       O = f.graphs[T.id].edges.filter(E => !j.has(E.tx)),
       F = O.filter(E => E.status === "done"),
       L = O.filter(E => E.status === "blocked");
      y += F.length, M += L.length, w += L.reduce((E, C) => E + C.taint, 0), (F.length || L.length) && c.push(
       `${T.id}: ${F.length} new hop${F.length===1?"":"s"}${L.length?`, ${L.length} blocked by holds/freezes`:""}`);
      const X = new Set((P.graphs[T.id] ? P.graphs[T.id].nodes : []).map(E => E.id));
      f.graphs[T.id].nodes.filter(E => !X.has(E.id)).filter(E => E.kind === "exchange").length && c.push(`${T.id}: reached an exchange deposit address — freeze request drafted`)
     }
     let m = {
      ...p,
      S: u,
      viewTime: null
     };
     m.log = d(m, "RE-TRACE", `Scheduled re-trace at ${me(u.clock)} · ${c.length?c.join(" · "):"no new movement on open cases"}`, "agent");
     const g = {
      at: u.clock,
      newHops: y,
      blocked: M,
      saved: w,
      parts: c
     };
     return {
      ...m,
      lastRetrace: g,
      toastMsg: M ? `Re-trace ${me(u.clock)}: ${M} transfer${M>1?"s":""} blocked by your holds/freezes` : y ? `Re-trace ${me(u.clock)}: ${y} new hop${y>1?"s":""} found` :
       `Re-trace ${me(u.clock)}: no new movement`
     }
    })
   },
   newComplaint: () => n(p => {
    const P = p.S.extra || [],
     u = 3022 + P.length,
     f = _p(Ar().W, 500 + P.length, p.S.clock, u),
     c = {
      ...p.S,
      extra: [...P, f]
     },
     y = sr(c, p.settings),
     M = f.case,
     w = y.states[M.id].tot;
    let m = {
     ...p,
     S: c,
     caseSel: M.id,
     page: "trail",
     viewTime: null,
     modal: null
    };
    return m.log = d(m, "COMPLAINT", `${M.id} ingested · ${M.type} · ${pe(M.amount)} · via ${M.channel} (ack ${M.ack})`, "intake"), m.log = d(m, "TRACE",
     `${M.id} trail built in ${y.ms.toFixed(0)} ms · ${y.graphs[M.id].nodes.filter(g=>g.kind==="bank").length} accounts · ${_e(w.recoverable)} recoverable now`, "agent"), {
     ...m,
     toastMsg: `New complaint ${M.id} (${M.type}) traced in ${y.ms.toFixed(0)} ms`
    }
   }),
   importCase: p => {
    const P = i.current,
     u = P.S.extra || [];
    let f;
    try {
     f = Dp(p, P.S.clock, 3022 + u.length)
    } catch (c) {
     return c.message
    }
    return n(c => {
     const y = {
      ...c.S,
      extra: [...c.S.extra || [], f]
     };
     let M = {
      ...c,
      S: y,
      caseSel: f.case.id,
      page: "trail",
      viewTime: null,
      modal: null
     };
     return M.log = d(M, "COMPLAINT", `${f.case.id} created from CSV import · ${f.txns.length} transactions · ${pe(f.case.amount)} reported lost`), {
      ...M,
      toastMsg: `${f.case.id} imported — ${f.txns.length} transactions traced`
     }
    }), null
   },
   approveItems: (p, P) => n(u => {
    if (!P.length) return u;
    const f = {
      ...u.S,
      holds: {
       ...u.S.holds
      },
      freezes: {
       ...u.S.freezes
      }
     },
     c = {
      ...u.approvals
     };
    let y = {
     ...u
    };
    const M = se[u.session].name;
    for (const w of P) {
     if (w.kind === "hold")
      for (const m of w.targets) f.holds[m] == null && (f.holds[m] = f.clock);
     if (w.kind === "exchange")
      for (const m of w.targets) f.freezes[m] == null && (f.freezes[m] = f.clock);
     c[`${p}|${w.id}`] = {
      at: f.clock,
      by: M,
      targets: w.targets.slice(),
      text: u.edits[`${p}|${w.id}`] || null
     }, y.log = d(y, "DECISION", `${u.degraded?"[queued offline] ":""}APPROVED ${p} · ${w.title} · ${w.effect}${w.amount?` · ${pe(w.amount)} traced`:""}`)
    }
    return {
     ...y,
     S: f,
     approvals: c,
     queued: u.degraded ? u.queued + P.length : u.queued,
     toastMsg: `${P.length} action${P.length>1?"s":""} approved${u.degraded?" — queued until the link returns":" and sent"}`
    }
   }),
   editItem: (p, P) => n(u => ({
    ...u,
    edits: {
     ...u.edits,
     [p]: P
    }
   })),
   holdAccount: p => n(P => {
    if (P.S.holds[p] != null) return P;
    const u = o.current.W,
     f = {
      ...P.S,
      holds: {
       ...P.S.holds,
       [p]: P.S.clock
      }
     };
    let c = {
     ...P,
     S: f
    };
    return c.log = d(c, "DECISION", `APPROVED debit hold on ${u.accounts[p].name} (${u.accounts[p].mask})`), {
     ...c,
     toastMsg: `Debit hold placed on ${u.accounts[p].name}`
    }
   }),
   markReviewed: (p, P) => n(u => {
    const f = o.current.W;
    let c = {
     ...u,
     reviewed: {
      ...u.reviewed,
      [p]: {
       verdict: P,
       at: u.S.clock
      }
     }
    };
    return c.log = d(c, "REVIEW", `${f.accounts[p].name} marked ${P==="fp"?"NOT a mule (false alarm)":"confirmed mule"} by analyst review`), {
     ...c,
     toastMsg: P === "fp" ? "Marked as false alarm — kept as a training label" : "Marked as confirmed mule"
    }
   }),
   startCall: p => n(P => ({
    ...P,
    call: {
     id: p,
     startedAt: Date.now()
    }
   })),
   endCall: () => n(p => ({
    ...p,
    call: null
   })),
   logCall: (p, P, u) => n(f => {
    const c = o.current.W;
    let y = {
     ...f,
     calls: {
      ...f.calls,
      [p]: {
       at: f.S.clock,
       outcome: P,
       label: u,
       by: se[f.session] ? se[f.session].name : "system"
      }
     }
    };
    return y.log = d(y, "CALL", `Hindi warning call to ${c.accounts[p].name} (${c.accounts[p].phone}) · holder response: ${u}`, "agent"), y
   }),
   setSetting: (p, P) => n(u => ({
    ...u,
    settings: {
     ...u.settings,
     [p]: P
    }
   })),
   logSettings: () => n(p => ({
    ...p,
    log: d(p, "CONFIG",
     `Settings: hold ≥ ${p.settings.holdThr}, warning call ${p.settings.callLo}–${p.settings.holdThr-1}, re-trace every ${p.settings.step} min, tracing ${(p.settings.method||"fifo").toUpperCase()}`
     )
   })),
   toggleLink: () => n(p => {
    if (!p.degraded) return {
     ...p,
     degraded: !0,
     linkLostAt: me(p.S.clock),
     log: d(p, "LINK", "Link to bank / exchange gateways lost — approvals queue locally", "system"),
     toastMsg: "Link lost — approvals will queue and sync later"
    };
    const P = p.queued;
    return {
     ...p,
     degraded: !1,
     queued: 0,
     linkLostAt: null,
     lastSync: Date.now(),
     log: d(p, "LINK", `Link restored · ${P} queued approval${P===1?"":"s"} sent`, "system"),
     toastMsg: `Reconnected — ${P} queued approval${P===1?"":"s"} sent`
    }
   }),
   resetDemo: p => {
    n(P => {
     const u = Dd();
     return {
      ...P,
      ...u,
      holds2: [],
      holdSkew: 0,
      holdsSeeded: !1,
      filed: [],
      holdPrefill: null,
      log: pn(u.log, {
       t: jt(st, st),
       kind: "SYSTEM",
       actor: a(P),
       text: "Demo reset to 14:18 baseline"
      }),
      degraded: !1,
      linkLostAt: null,
      modal: null,
      modalStack: [],
      viewTime: null,
      call: null,
      lastRetrace: null
     }
    }), p || s("Demo reset to 14:18 — no complaint yet")
   },
   tamperDemo: () => n(p => {
    const P = p.log.findIndex(f => f.kind === "DECISION");
    if (P < 0) return {
     ...p,
     toastMsg: "No decision in the log yet"
    };
    const u = p.log.map((f, c) => c === P ? {
     ...f,
     text: f.text.replace(/₹[\d,]+|\d+/, y => y.startsWith("₹") ? "₹1" + y.slice(1) : String(Number(y) + 1)),
     tampered: !0
    } : f);
    return {
     ...p,
     log: u,
     toastMsg: `Entry #${u[P].seq} edited without re-hashing — run Verify chain`
    }
   }),
   undoTamper: () => n(p => {
    const P = p.log.findIndex(y => y.tampered);
    if (P < 0) return p;
    const f = p.log[P].text.replace(/₹1([\d,]+)|\d+/, (y, M) => M != null ? "₹" + M : String(Number(y) - 1));
    let c = [];
    for (const y of p.log) c = pn(c, {
     t: y.t,
     kind: y.kind,
     actor: y.actor,
     text: y.tampered ? f : y.text
    });
    return {
     ...p,
     log: c,
     toastMsg: "Original entry restored"
    }
   }),
   logReport: (p, P) => n(u => ({
    ...u,
    log: d(u, "REPORT", `${p} exported · sha256 ${P.slice(0,16)}…`)
   })),
   backToList: () => n(p => ({
    ...p,
    trailOpen: !1
   })),
   setHoldPrefill: ac => n(p => ({
    ...p,
    holdPrefill: ac
   })),
   advanceHolds: m => n(p => ({
    ...p,
    holdSkew: p.holdSkew + m,
    toastMsg: `Hold clock moved forward ${m/60} h (demo)`
   })),
   placeHold: (ac, rs) => n(p => {
    const D = o.current,
     A = D.W.accounts[ac];
    if (p.session !== "analyst" || !A || A.bank !== p.bank || !rs || !rs.trim()) return p;
    if (p.holds2.some(x => x.account === ac && hopen(x))) return {
     ...p,
     toastMsg: "This account already has an open hold"
    };
    const now = p.S.clock + p.holdSkew,
     sc = D.scores[ac],
     r = {
      id: `H-${101+p.holds2.length}`,
      account: ac,
      bank: A.bank,
      complaint: (D.inTrail[ac] || [])[0] || null,
      origin: "bank",
      basis: "Bank",
      status: "active",
      reason: rs.trim(),
      score: sc ? Math.round(sc.score) : null,
      placedBy: a(p),
      placedAt: now,
      expiresAt: now + 1440,
      decidedBy: null,
      decidedAt: null,
      executedBy: null,
      executedAt: null
     };
    let c = {
     ...p,
     S: hset(p.S, ac, !0),
     holds2: [...p.holds2, r],
     holdPrefill: null,
     toastMsg: `24-hour hold placed on ${A.mask} — waiting for the officer`
    };
    c.log = d(c, "HOLD", `${r.id} · temporary 24h hold placed on ${gh[A.bank]} ${A.mask} · reason: ${r.reason} · awaiting officer confirmation`, void 0, "Bank");
    return c
   }),
   requestHold: (ac, rs) => n(p => {
    const D = o.current,
     A = D.W.accounts[ac];
    if (p.session !== "officer" || !A || !rs || !rs.trim()) return p;
    if (p.holds2.some(x => x.account === ac && hopen(x))) return {
     ...p,
     toastMsg: "This account already has an open hold"
    };
    const now = p.S.clock + p.holdSkew,
     sc = D.scores[ac],
     r = {
      id: `H-${101+p.holds2.length}`,
      account: ac,
      bank: A.bank,
      complaint: (D.inTrail[ac] || [])[0] || null,
      origin: "officer",
      basis: "Officer decision",
      status: "requested",
      reason: rs.trim(),
      score: sc ? Math.round(sc.score) : null,
      placedBy: a(p),
      placedAt: now,
      expiresAt: null,
      decidedBy: a(p),
      decidedAt: now,
      executedBy: null,
      executedAt: null
     };
    let c = {
     ...p,
     holds2: [...p.holds2, r],
     toastMsg: `Hold requested from ${gh[A.bank]}`
    };
    c.log = d(c, "HOLD", `${r.id} · hold requested from ${Ze[A.bank]} on ${A.mask} · reason: ${r.reason}`, void 0, "Officer decision");
    return c
   }),
   executeHold: id => n(p => {
    const x = p.holds2.find(q => q.id === id);
    if (p.session !== "analyst" || !x || x.bank !== p.bank || x.status !== "requested") return p;
    return hchg(p, id, {
     status: "confirmed",
     executedBy: a(p),
     executedAt: p.S.clock + p.holdSkew
    }, !0, void 0, y => `${y.id} · ${hlb(o.current.W,y)} held by the bank as requested by the cyber cell`, y => `Hold on ${hlb(o.current.W,y)} done`, d)
   }),
   confirmHold: id => n(p => {
    const x = p.holds2.find(q => q.id === id);
    if (p.session !== "officer" || !x || x.status !== "active") return p;
    return hchg(p, id, {
     status: "confirmed",
     decidedBy: a(p),
     decidedAt: p.S.clock + p.holdSkew,
     expiresAt: null
    }, null, void 0, y => `${y.id} · temporary hold on ${hlb(o.current.W,y)} CONFIRMED — stays until released`, y => `Hold on ${hlb(o.current.W,y)} confirmed`, d)
   }),
   rejectHold: id => n(p => {
    const x = p.holds2.find(q => q.id === id);
    if (p.session !== "officer" || !x || x.status !== "active") return p;
    return hchg(p, id, {
     status: "rejected",
     decidedBy: a(p),
     decidedAt: p.S.clock + p.holdSkew
    }, !1, void 0, y => `${y.id} · temporary hold on ${hlb(o.current.W,y)} REJECTED — hold lifted`, y => `Hold on ${hlb(o.current.W,y)} rejected and lifted`, d)
   }),
   releaseHold: id => n(p => {
    const x = p.holds2.find(q => q.id === id);
    if (!x || !hopen(x)) return p;
    const ok = p.session === "officer" || p.session === "analyst" && x.bank === p.bank && x.status === "active";
    if (!ok) return p;
    return hchg(p, id, {
      status: "released",
      decidedBy: a(p),
      decidedAt: p.S.clock + p.holdSkew
     }, x.status === "requested" ? null : !1, void 0, y => `${y.id} · hold on ${hlb(o.current.W,y)} ${x.status==="requested"?"request cancelled":"released"}`, y =>
     `Hold on ${hlb(o.current.W,y)} released`, d)
   }),
   expireHolds: () => n(p => {
    const now = p.S.clock + p.holdSkew;
    let c = p,
     ch = !1;
    for (const x of p.holds2) x.status === "active" && now >= x.expiresAt && (c = hchg(c, x.id, {
     status: "expired"
    }, !1, "system", y => `${y.id} · temporary hold on ${hlb(o.current.W,y)} EXPIRED — no officer confirmation within 24h, hold lifted`, y => `Hold ${y.id} expired`, d), ch = !0);
    return ch ? c : p
   }),
   seedHolds: () => n(p => {
    if (p.holdsSeeded) return p;
    const D = o.current,
     now = p.S.clock + p.holdSkew,
     by = {};
    for (const ac of D.alerts) {
     const b = D.W.accounts[ac].bank;
     (by[b] || (by[b] = [])).push(ac)
    }
    let i = 100,
     S2 = p.S;
    const hs2 = [],
     mk = (ac, q) => {
      const A = D.W.accounts[ac],
       sc = D.scores[ac];
      hs2.push({
       id: `H-${++i}`,
       account: ac,
       bank: A.bank,
       complaint: null,
       score: sc ? Math.round(sc.score) : null,
       decidedBy: null,
       decidedAt: null,
       executedBy: null,
       executedAt: null,
       expiresAt: null,
       ...q
      })
     };
    Object.keys(by).slice(0, 6).forEach((b, k) => {
     const L = by[b];
     L[0] && mk(L[0], {
      origin: "officer",
      basis: "Officer decision",
      status: "requested",
      reason: "Cyber cell request: high mule-risk score (pass-through pattern, new account) — hold until reviewed",
      placedBy: "O:" + se.officer.name,
      placedAt: now - 35 - k * 7,
      decidedBy: "O:" + se.officer.name,
      decidedAt: now - 35 - k * 7
     });
     if (k < 2 && L[1]) {
      mk(L[1], {
       origin: "bank",
       basis: "Bank",
       status: "active",
       reason: "Fraud desk: rapid in-and-out pattern on a new account",
       placedBy: `B:${gh[b]} analyst`,
       placedAt: now - 180,
       expiresAt: now + 1260
      });
      S2 = hset(S2, L[1], !0)
     }
     if (k === 0 && L[2]) {
      mk(L[2], {
       origin: "bank",
       basis: "Bank",
       status: "confirmed",
       reason: "Fraud desk: shares a device with two known mule accounts",
       placedBy: `B:${gh[b]} analyst`,
       placedAt: now - 900,
       decidedBy: "O:" + se.officer.name,
       decidedAt: now - 860
      });
      S2 = hset(S2, L[2], !0)
     }
    });
    return {
     ...p,
     S: S2,
     holds2: hs2,
     holdsSeeded: !0
    }
   }),
   fileComplaint: f => n(p => {
    const id = `F-${1001+p.filed.length}`,
     role = p.session,
     via = role === "consumer" ? "self-filed by victim" : role === "analyst" ? "filed by bank for a customer" : "filed by cyber cell",
     by = role === "consumer" ? f.name : role === "analyst" ? `${gh[p.bank]} analyst` : se.officer.name,
     r = {
      id,
      ...f,
      amount: Number(f.amount),
      status: "filed",
      basis: role === "consumer" ? "Consumer complaint" : role === "analyst" ? "Bank" : "Officer decision",
      filedAt: p.S.clock,
      filedBy: by,
      filedVia: via,
      bank: role === "analyst" ? p.bank : null,
      victimId: role === "consumer" ? p.victimId : null
     };
    let c = {
     ...p,
     filed: [...p.filed, r],
     modal: null,
     modalStack: [],
     toastMsg: `Complaint ${id} filed`
    };
    c.log = d(c, "COMPLAINT", `${id} filed · ${f.scamType} · ${pe(r.amount)} · to ${f.destination==="crypto"?"crypto wallet":"bank/UPI"} ${f.ref} · filed_by ${by} · filed_via ${via}`, void 0, r
     .basis);
    return c
   }),
   startTrace: id => n(p => {
    if (p.session !== "officer") return p;
    const f = p.filed.find(q => q.id === id);
    if (!f || f.status !== "filed") return p;
    let c = {
     ...p,
     filed: p.filed.map(q => q.id === id ? {
      ...q,
      status: "tracing"
     } : q),
     toastMsg: `Trace started for ${id}`
    };
    c.log = d(c, "TRACE", `${id} trace started by ${a(p).replace(/^[A-Z]:/,"")}`);
    return c
   })
  }), [s]),
  x = t.caseSel && sc.order.includes(t.caseSel) ? t.caseSel : sc.order[0],
  v = H.useCallback(p => {
   const P = l.graphs[p];
   if (!P) return [];
   const u = t.session ? se[t.session] : se.officer;
   return Id(l.W, l.sim, P, l.states[p], l.scores, {
    clock: t.S.clock,
    holds: t.S.holds,
    freezes: t.S.freezes,
    thr: t.settings.holdThr,
    officer: u
   })
  }, [l, t.session, t.S, t.settings.holdThr]),
  N = H.useMemo(() => ({
   ...t,
   ...k,
   D: sc,
   can: h,
   caseId: x,
   pack: v,
   user: userOf(t, l),
   myFiled: visFiled(t)
  }), [t, k, sc, l, h, x, v]);
 return H.useEffect(() => {
  const p = P => {
   (P.metaKey || P.ctrlKey) && P.key.toLowerCase() === "k" && (P.preventDefault(), t.session === "officer" && k.togglePalette()), P.key === "Escape" && n(u => u.paletteOpen ? {
    ...u,
    paletteOpen: !1
   } : u.call ? u : u.modal ? {
    ...u,
    modal: u.modalStack[u.modalStack.length - 1] || null,
    modalStack: u.modalStack.slice(0, -1)
   } : u)
  };
  return window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p)
 }, [t.session, k]), S.jsx(zd.Provider, {
  value: N,
  children: e
 })
}
const eu = {
 shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
 file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
 check: "M20 6 9 17l-5-5",
 x: "M18 6 6 18 M6 6l12 12",
 alert: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
 link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
 unlink: "M18.84 12.25l1.72-1.71a5 5 0 0 0-7.07-7.07l-1.72 1.71 M5.17 11.75l-1.71 1.71a5 5 0 0 0 7.07 7.07l1.71-1.71 M8 2v3 M2 8h3 M16 22v-3 M22 16h-3",
 lock: "M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4",
 refresh: "M21 2v6h-6 M3 12a9 9 0 0 1 15-6.7L21 8 M3 22v-6h6 M21 12a9 9 0 0 1-15 6.7L3 16",
 chart: "M3 3v18h18 M7 16v-4 M12 16V8 M17 16v-7",
 moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
 sun: "M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0 M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42",
 search: "M11 11m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0 M21 21l-4.35-4.35",
 download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
 hash: "M4 9h16 M4 15h16 M10 3 8 21 M16 3l-2 18",
 clock: "M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0 M12 6v6l4 2",
 user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
 play: "M5 3l14 9-14 9V3z",
 pause: "M6 4h4v16H6z M14 4h4v16h-4z",
 edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
 phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
 bank: "M3 21h18 M3 10h18 M5 6l7-3 7 3 M4 10v11 M20 10v11 M8 14v3 M12 14v3 M16 14v3",
 coin: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M8 8h8 M12 8v9",
 zap: "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
 inbox: "M22 12h-6l-2 3h-4l-2-3H2 M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
 layers: "M12 2 2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
 sliders: "M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M1 14h6 M9 8h6 M17 16h6",
 eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",
 mic: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8",
 ext: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14 21 3"
};

function tr({
 name: e,
 size: t = 16,
 stroke: n = 2,
 style: r,
 className: l
}) {
 const o = eu[e] || eu.file;
 return S.jsx("svg", {
  viewBox: "0 0 24 24",
  width: t,
  height: t,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: n,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  style: {
   display: "block",
   flexShrink: 0,
   ...r
  },
  className: l,
  "aria-hidden": "true",
  children: o.split(" M").map((i, s) => S.jsx("path", {
   d: (s ? "M" : "") + i
  }, s))
 })
}

function Is({
 size: e = 40,
 mono: t = !1,
 className: n,
 style: r
}) {
 const l = t ? "currentColor" : "var(--accent)";
 return S.jsxs("svg", {
  viewBox: "0 0 64 64",
  width: e,
  height: e,
  className: n,
  style: r,
  "aria-hidden": "true",
  children: [S.jsx("text", {
   x: "5",
   y: "52",
   fontFamily: "'Source Serif 4', Georgia, serif",
   fontSize: "27",
   fontWeight: "700",
   fill: l,
   children: "₹"
  }), S.jsx("path", {
   d: "M23 46 C 31 44, 33 32, 38.5 27.5",
   fill: "none",
   stroke: "currentColor",
   strokeWidth: "3",
   strokeDasharray: "0.5 5.5",
   strokeLinecap: "round"
  }), S.jsx("circle", {
   cx: "45",
   cy: "21",
   r: "9",
   fill: "none",
   stroke: "currentColor",
   strokeWidth: "3"
  }), S.jsx("circle", {
   cx: "45",
   cy: "21",
   r: "3.6",
   fill: l
  }), S.jsx("path", {
   d: "M51.5 27.5 L58 34",
   stroke: "currentColor",
   strokeWidth: "4",
   strokeLinecap: "round"
  })]
 })
}

function Ld({
 size: e = 420,
 sweep: t = !1,
 className: n,
 style: r
}) {
 return S.jsxs("svg", {
  viewBox: "0 0 200 200",
  width: e,
  height: e,
  className: n,
  style: r,
  "aria-hidden": "true",
  children: [S.jsx("circle", {
   cx: "100",
   cy: "100",
   r: "94",
   fill: "none",
   stroke: "currentColor",
   strokeWidth: "3"
  }), S.jsx("circle", {
   cx: "100",
   cy: "100",
   r: "66",
   fill: "none",
   stroke: "currentColor",
   strokeWidth: "2",
   strokeDasharray: "2 7",
   opacity: ".8"
  }), S.jsx("circle", {
   cx: "100",
   cy: "100",
   r: "38",
   fill: "none",
   stroke: "currentColor",
   strokeWidth: "2",
   opacity: ".6"
  }), Array.from({
   length: 36
  }).map((l, o) => {
   const i = o * Math.PI / 18;
   return S.jsx("line", {
    x1: 100 + 88 * Math.cos(i),
    y1: 100 + 88 * Math.sin(i),
    x2: 100 + 94 * Math.cos(i),
    y2: 100 + 94 * Math.sin(i),
    stroke: "currentColor",
    strokeWidth: "2"
   }, o)
  }), S.jsxs("g", {
   className: t ? "sweep" : void 0,
   children: [S.jsx("path", {
    d: "M100 100 L100 6 A94 94 0 0 1 166.5 33.5 Z",
    fill: "currentColor",
    opacity: ".2"
   }), S.jsx("line", {
    x1: "100",
    y1: "100",
    x2: "166.5",
    y2: "33.5",
    stroke: "currentColor",
    strokeWidth: "2.5"
   })]
  }), S.jsx("text", {
   x: "100",
   y: "112",
   textAnchor: "middle",
   fontFamily: "'Source Serif 4', Georgia, serif",
   fontSize: "36",
   fontWeight: "700",
   fill: "currentColor",
   children: "₹"
  })]
 })
}

function Vp() {
 const {
  login: e,
  D: t,
  startTour: n
 } = xt(), [r, l] = H.useState("officer"), o = t.W, vs = [...new Map(o.cases.map(c => [c.victim, c])).values()], [bk, setBk] = H.useState("SBIN"), [vid, setVid] = H.useState((() => {
   try {
    return localStorage.getItem("pc-consumer-email") || "anil.verma@mail.example"
   } catch {
    return "anil.verma@mail.example"
   }
  })()),
  go2 = k => (window.PeechaAPI.reset(), e(k, {
   bank: bk,
   victimId: vid
  })), i = t.cases.reduce((s, a) => s + a.amount, 0);
 return S.jsxs("main", {
  className: "login",
  children: [S.jsx("div", {
   className: "tricolour",
   "aria-hidden": "true"
  }), S.jsxs("div", {
   className: "login-top",
   children: [S.jsx(Is, {
    size: 40,
    style: {
     color: "#E8ECF3"
    }
   }), S.jsxs("div", {
    children: [S.jsxs("div", {
     className: "k",
     children: ["Hackyard Build 2026 · IIT Guwahati", ""]
    }), S.jsx("div", {
     className: "n",
     children: "Peecha — follow the fraud rupee from mule accounts to the crypto exit"
    })]
   })]
  }), S.jsx(Ld, {
   className: "login-radar",
   size: 560,
   sweep: !0
  }), S.jsxs("div", {
   className: "login-card",
   children: [S.jsxs("div", {
    className: "login-left",
    children: [S.jsxs("div", {
     children: [S.jsxs("h1", {
      children: ["Peecha ", S.jsx("span", {
       className: "hi",
       children: "पीछा"
      })]
     }), S.jsx("p", {
      style: {
       fontSize: 14,
       color: "#C5D0E0",
       marginTop: 6
      },
      children: "Trace · Score · Act · Prevent — the officer approves every action"
     })]
    }), S.jsxs("div", {
     className: "login-stats",
     hidden: !0,
     children: [S.jsxs("div", {
      className: "login-stat",
      children: [S.jsxs("div", {
       className: "v",
       children: [o.txns.length.toLocaleString("en-IN"), " transactions"]
      }), S.jsxs("div", {
       className: "l",
       children: ["replayed hop by hop across ", Object.keys(o.accounts).length.toLocaleString("en-IN"), " bank accounts and ", Object.keys(o.wallets).length, " TRON wallets"]
      })]
     }), S.jsxs("div", {
      className: "login-stat",
      children: [S.jsxs("div", {
       className: "v",
       style: {
        color: "#9FE3C9"
       },
       children: [_e(i), " under trace"]
      }), S.jsx("div", {
       className: "l",
       children: "across open complaints, ranked by what can still be stopped"
      })]
     })]
    })]
   }), S.jsxs("div", {
    className: "login-right",
    children: [S.jsx("h2", {
     children: "Sign in"
    }), S.jsx("p", {
     style: {
      fontSize: 14,
      color: "#4A555F",
      marginTop: 6
     },
     children: "Choose how you use Peecha. Each role sees only its own part of the data."
    }), S.jsx("div", {
     style: {
      marginTop: 14
     },
     role: "radiogroup",
     "aria-label": "Demo role",
     children: Object.values(se).map(s => S.jsxs("button", {
      role: "radio",
      "aria-checked": r === s.key,
      className: `role-card ${r===s.key?"on":""}`,
      onClick: () => l(s.key),
      onDoubleClick: () => go2(s.key),
      children: [S.jsx("span", {
       className: "role-badge",
       children: s.badge
      }), S.jsxs("span", {
       style: {
        minWidth: 0
       },
       children: [S.jsxs("span", {
        style: {
         display: "block",
         fontWeight: 600,
         fontSize: 14
        },
        children: [s.title, " ", S.jsxs("span", {
         style: {
          fontWeight: 400,
          color: "#6C7780"
         },
         children: ["· ", s.name]
        })]
       }), S.jsx("span", {
        style: {
         display: "block",
         fontSize: 12,
         color: "#6C7780",
         marginTop: 2
        },
        children: s.blurb
       })]
      })]
     }, s.key))
    }), S.jsxs(S.Fragment, {
     children: [r === "analyst" && S.jsxs("div", {
      style: {
       marginTop: 14
      },
      children: [S.jsx("label", {
       style: {
        fontSize: 12,
        fontWeight: 600,
        color: "#4A555F"
       },
       htmlFor: "lg-bank",
       children: "Your bank"
      }), S.jsx("select", {
       id: "lg-bank",
       className: "select",
       style: {
        width: "100%",
        marginTop: 4
       },
       value: bk,
       onChange: q => setBk(q.target.value),
       children: Object.keys(Ze).filter(k => window.PeechaAPI.banks[k]).map(k => S.jsx("option", {
        value: k,
        children: Ze[k]
       }, k))
      })]
     }), r === "consumer" && S.jsxs("div", {
      style: {
       marginTop: 14
      },
      children: [S.jsx("label", {
       style: {
        fontSize: 12,
        fontWeight: 600,
        color: "#4A555F"
       },
       htmlFor: "lg-vic",
       children: "Sign in as"
      }), S.jsx("select", {
       id: "lg-vic",
       className: "select",
       style: {
        width: "100%",
        marginTop: 4
       },
       value: vid,
       onChange: q => {
        setVid(q.target.value);
        try {
         localStorage.setItem("pc-consumer-email", q.target.value)
        } catch {}
       },
       children: [
        ["anil.verma@mail.example", "Anil Verma"],
        ["priya.sharma@mail.example", "Priya Sharma"],
        ["imran.qureshi@mail.example", "Imran Qureshi"]
       ].map(([v, n]) => S.jsx("option", {
        value: v,
        children: n
       }, v))
      })]
     }), S.jsxs("button", {
      className: "btn",
      style: {
       width: "100%",
       marginTop: 18,
       padding: "12px 16px",
       background: "#14325E",
       color: "#fff"
      },
      onClick: () => go2(r),
      children: ["Enter as ", se[r].title]
     })]
    }), S.jsx("button", {
     className: "btn ghost",
     style: {
      width: "100%",
      marginTop: 10,
      padding: "11px 16px",
      background: "#fff",
      color: "#14325E",
      borderColor: "#14325E"
     },
     onClick: () => {
      window.PeechaTour ? window.PeechaTour.choose().then(l => {
       l && n()
      }) : n()
     },
     children: "▶ Take the 3-minute guided demo"
    }), S.jsx("p", {
     style: {
      fontSize: 12,
      color: "#6C7780",
      marginTop: 16,
      lineHeight: 1.5
     },
     children: "Demo environment — no credentials are collected. Every person, account, wallet and complaint is synthetic. Officer login uses MojoAuth in the event build."
    })]
   })]
  })]
 })
}
const Kp = "modulepreload",
 Wp = function(e, t) {
  return new URL(e, t).href
 },
 tu = {},
 $e = function(t, n, r) {
  let l = Promise.resolve();
  if (n && n.length > 0) {
   const i = document.getElementsByTagName("link"),
    s = document.querySelector("meta[property=csp-nonce]"),
    a = (s == null ? void 0 : s.nonce) || (s == null ? void 0 : s.getAttribute("nonce"));
   l = Promise.allSettled(n.map(h => {
    if (h = Wp(h, r), h in tu) return;
    tu[h] = !0;
    const d = h.endsWith(".css"),
     k = d ? '[rel="stylesheet"]' : "";
    if (!!r)
     for (let N = i.length - 1; N >= 0; N--) {
      const p = i[N];
      if (p.href === h && (!d || p.rel === "stylesheet")) return
     } else if (document.querySelector(`link[href="${h}"]${k}`)) return;
    const v = document.createElement("link");
    if (v.rel = d ? "stylesheet" : Kp, d || (v.as = "script"), v.crossOrigin = "", v.href = h, a && v.setAttribute("nonce", a), document.head.appendChild(v), d) return new Promise((N, p) => {
     v.addEventListener("load", N), v.addEventListener("error", () => p(new Error(`Unable to preload CSS for ${h}`)))
    })
   }))
  }

  function o(i) {
   const s = new Event("vite:preloadError", {
    cancelable: !0
   });
   if (s.payload = i, window.dispatchEvent(s), !s.defaultPrevented) throw i
  }
  return l.then(i => {
   for (const s of i || []) s.status === "rejected" && o(s.reason);
   return t().catch(o)
  })
 };

function Od(e = 1e3) {
 const [t, n] = H.useState(Date.now());
 return H.useEffect(() => {
  const r = setInterval(() => n(Date.now()), e);
  return () => clearInterval(r)
 }, [e]), t
}

function Ch({
 title: e,
 desc: t,
 sources: n = [],
 actions: r
}) {
 const {
  S: l,
  lastSync: o,
  degraded: i
 } = xt(), s = Od(1e3), a = Math.max(1, Math.round((s - o) / 1e3));
 return S.jsxs("div", {
  className: "page-head",
  children: [S.jsxs("div", {
   style: {
    minWidth: 0,
    flex: 1
   },
   children: [S.jsx("h1", {
    className: "page-title",
    children: e
   }), S.jsx("p", {
    className: "page-desc",
    children: t
   }), r && S.jsx("div", {
    className: "page-actions",
    children: r
   })]
  }), S.jsxs("div", {
   className: "gov",
   children: [S.jsxs("div", {
    className: "gov-top",
    children: [S.jsxs("div", {
     className: "gov-txt",
     children: [S.jsx("div", {
      className: "gov-kicker",
      children: "Hackyard Build 2026 · IIT Guwahati"
     }), S.jsxs("div", {
      className: "gov-name",
      children: ["Peecha — follow the", S.jsx("br", {}), "fraud rupee"]
     }), S.jsx("div", {
      className: "gov-sub",
      children: "Mule accounts → P2P seller → USDT → exchange"
     })]
    }), S.jsx(Is, {
     className: "gov-seal",
     size: 58
    })]
   }), S.jsxs("div", {
    className: "gov-meta",
    children: [i ? S.jsx("span", {
     style: {
      color: "var(--risk-med)"
     },
     children: "● Link down · approvals queued"
    }) : S.jsxs("span", {
     children: [S.jsx("span", {
      className: "dot",
      children: "●"
     }), " Synced ", a, "s ago"]
    }), S.jsx("span", {
     children: "·"
    }), S.jsxs("span", {
     children: [$s(l.clock), " · ", me(l.clock), " IST"]
    }), n.length > 0 && S.jsxs(S.Fragment, {
     children: [S.jsx("span", {
      children: "·"
     }), S.jsx("span", {
      children: n.join(" · ")
     })]
    })]
   })]
  })]
 })
}

function Eh({
 label: e,
 value: t,
 sub: n,
 tone: r,
 onClick: l
}) {
 return S.jsxs("div", {
  className: `kpi ${l?"click":""}`,
  onClick: l,
  ...l ? {
   role: "button",
   tabIndex: 0,
   onKeyDown: o => {
    o.key === "Enter" && l()
   }
  } : {},
  children: [S.jsx("div", {
   className: "k-lbl",
   children: e
  }), S.jsx("div", {
   className: `k-val ${r?"c-"+r:""}`,
   children: t
  }), n && S.jsx("div", {
   className: "k-sub",
   children: n
  })]
 })
}

function Ph({
 title: e,
 sub: t,
 right: n,
 children: r,
 className: l = "",
 bodyClass: o = "card-body",
 style: i,
 id: s
}) {
 return S.jsxs("section", {
  className: `card ${l}`,
  style: i,
  id: s,
  children: [(e || n) && S.jsxs("div", {
   className: "card-head",
   children: [S.jsxs("div", {
    style: {
     minWidth: 0
    },
    children: [e && S.jsx("h2", {
     className: "card-title",
     children: e
    }), t && S.jsx("p", {
     className: "card-sub",
     children: t
    })]
   }), n]
  }), S.jsx("div", {
   className: o,
   children: r
  })]
 })
}

function Ud({
 tone: e = "neutral",
 dot: t = !1,
 children: n,
 title: r
}) {
 return S.jsxs("span", {
  className: `pill ${e}`,
  title: r,
  children: [t && S.jsx("span", {
   className: "d"
  }), n]
 })
}

function Yp(e, t) {
 const n = t ? t.settings.holdThr : 70,
  r = t ? t.settings.callLo : 40;
 return e >= n ? "High" : e >= r ? "Medium" : "Low"
}

function Th({
 score: e,
 big: t
}) {
 const n = xt();
 if (e == null) return S.jsx(Ud, {
  tone: "neutral",
  children: "not scored"
 });
 const r = Math.round(e),
  l = Yp(r, n);
 return S.jsxs("span", {
  className: `score-pill b-${l.toLowerCase()} ${t?"big":""}`,
  title: `Mule-risk score ${r}/100 · ${l}`,
  children: [S.jsx("b", {
   children: r
  }), S.jsx("span", {
   className: "score-meter",
   children: S.jsx("i", {
    style: {
     width: `${r}%`
    }
   })
  }), S.jsx("span", {
   className: "score-word",
   children: l
  })]
 })
}
const Qp = {
 recoverable: {
  label: "Recoverable",
  tone: "rec"
 },
 held: {
  label: "Held",
  tone: "rec-solid"
 },
 "held-empty": {
  label: "Held (empty)",
  tone: "neutral"
 },
 moved: {
  label: "Passed on",
  tone: "neutral"
 },
 victim: {
  label: "Victim",
  tone: "accent"
 },
 converted: {
  label: "₹ → USDT",
  tone: "crypto"
 },
 exited: {
  label: "Gone",
  tone: "exit"
 },
 outside: {
  label: "Outside our data",
  tone: "outside"
 },
 crypto: {
  label: "In crypto wallet",
  tone: "crypto"
 },
 exchange: {
  label: "At exchange — freezable",
  tone: "crypto-rec"
 },
 frozen: {
  label: "Frozen at exchange",
  tone: "rec-solid"
 },
 "frozen-empty": {
  label: "Frozen (empty)",
  tone: "neutral"
 },
 stopped: {
  label: "Blocked before arrival",
  tone: "rec"
 }
};

function Mh({
 status: e
}) {
 const t = Qp[e] || {
  label: e,
  tone: "neutral"
 };
 return S.jsx(Ud, {
  tone: t.tone,
  dot: !0,
  children: t.label
 })
}

function Nh({
 tot: e,
 height: t = 12,
 legend: n = !0
}) {
 const r = Math.max(1, e.stolen),
  l = [
   ["Secured (held / frozen)", e.secured, "var(--rec)", "solid"],
   ["Recoverable, not yet secured", e.recoverable - e.secured, "var(--rec)", "light"],
   ["In private crypto wallets", e.wallet, "var(--crypto)", "solid"],
   ["Outside our data", e.outside, "var(--outside)", "solid"],
   ["Gone (cash / bridge)", e.gone, "var(--exit)", "solid"]
  ];
 return S.jsxs("div", {
  children: [S.jsx("div", {
   className: "moneybar",
   style: {
    height: t
   },
   role: "img",
   "aria-label": l.map(([o, i]) => `${o} ${pe(i)}`).join(", "),
   children: l.map(([o, i, s, a]) => i > 1 ? S.jsx("i", {
    title: `${o}: ${pe(i)}`,
    className: a,
    style: {
     width: `${i/r*100}%`,
     "--c": s
    }
   }, o) : null)
  }), n && S.jsx("div", {
   className: "mb-legend",
   children: l.map(([o, i, s, a]) => S.jsxs("span", {
    children: [S.jsx("i", {
     className: a,
     style: {
      "--c": s
     }
    }), o, " ", S.jsx("b", {
     children: _e(i)
    })]
   }, o))
  })]
 })
}

function $h(e) {
 return {
  onClick: e,
  tabIndex: 0,
  role: "button",
  onKeyDown: t => {
   (t.key === "Enter" || t.key === " ") && (t.preventDefault(), e())
  }
 }
}

function Ih({
 label: e,
 width: t,
 children: n
}) {
 const {
  close: r,
  back: l,
  modalStack: o
 } = xt();
 return S.jsx("div", {
  className: "backdrop",
  onClick: r,
  children: S.jsxs("div", {
   className: "modal",
   style: t ? {
    width: `min(${t}px, 100%)`
   } : void 0,
   onClick: i => i.stopPropagation(),
   role: "dialog",
   "aria-modal": "true",
   "aria-label": e,
   children: [S.jsxs("div", {
    className: "modal-bar",
    children: [o.length > 0 ? S.jsx("button", {
     className: "modal-back",
     onClick: l,
     children: "← Back"
    }) : S.jsx("span", {}), S.jsx("button", {
     className: "modal-x",
     onClick: r,
     "aria-label": "Close",
     children: "✕"
    })]
   }), n]
  })
 })
}

function jh({
 options: e,
 value: t,
 onChange: n
}) {
 return S.jsx("div", {
  className: "seg",
  role: "tablist",
  children: e.map(([r, l]) => S.jsx("button", {
   role: "tab",
   "aria-selected": t === r,
   className: t === r ? "on" : "",
   onClick: () => n(r),
   children: l
  }, r))
 })
}

function _h(e, t, n = "text/plain") {
 if (typeof window < "u" && window.PeechaRT) return void window.PeechaRT.save(e, t, n);
 const r = new Blob([t], {
   type: n
  }),
  l = URL.createObjectURL(r),
  o = document.createElement("a");
 o.href = l, o.download = e, document.body.appendChild(o), o.click(), o.remove(), setTimeout(() => URL.revokeObjectURL(l), 1e3)
}

function Rh({
 id: e,
 children: t
}) {
 const {
  open: n,
  D: r
 } = xt(), l = r.W.accounts[e], o = r.W.wallets[e];
 return !l && !o ? S.jsx("span", {
  className: "mono",
  children: t || e
 }) : S.jsx("button", {
  className: "link-chip",
  onClick: i => {
   i.stopPropagation(), n(l ? "account" : "wallet", e)
  },
  children: t || (l ? l.name : `${e.slice(0,6)}…${e.slice(-4)}`)
 })
}

function Kl(e, t, n) {
 const r = e.approvals[`${t}|${n.id}`];
 return n.kind === "hold" || n.kind === "exchange" ? n.executed ? "done" : r ? "partial" : "draft" : r ? "done" : "draft"
}

function Ah(e, t) {
 const n = e.pack(t),
  r = e.D.states[t].tot,
  l = n.filter(i => Kl(e, t, i) === "done").length,
  o = n.some(i => (i.kind === "hold" || i.kind === "exchange") && Kl(e, t, i) !== "done");
 return l ? o ? {
  label: "Partly secured · new actions drafted",
  tone: "med",
  items: n,
  done: l
 } : r.wallet > 1e3 ? {
  label: "All holds done · watching crypto",
  tone: "rec",
  items: n,
  done: l
 } : {
  label: "All holds done · monitoring",
  tone: "rec",
  items: n,
  done: l
 } : {
  label: "Pack drafted · awaiting approval",
  tone: "accent",
  items: n,
  done: l
 }
}
const Dh = {
  hold: "Bank hold",
  exchange: "Exchange freeze",
  issuer: "Issuer request",
  p2p: "P2P seller request",
  ext: "Other-bank trace",
  str: "STR draft"
 },
 Fd = H.lazy(() => $e(() => import("./Inbox-DjOgoqAQ.js"), [], import.meta.url)),
 Gp = H.lazy(() => $e(() => import("./Trail--XxNU5VG.js"), [], import.meta.url)),
 Xp = H.lazy(() => $e(() => import("./Accounts-jiqAHyYF.js"), [], import.meta.url)),
 bp = H.lazy(() => $e(() => import("./Crypto-BqUjZHoZ.js"), __vite__mapDeps([0, 1]), import.meta.url)),
 qp = H.lazy(() => $e(() => import("./Action-DTQ8EHbi.js"), __vite__mapDeps([2, 1]), import.meta.url)),
 Zp = H.lazy(() => $e(() => import("./Prevent-Y66rWjSt.js"), __vite__mapDeps([3, 4]), import.meta.url)),
 Jp = H.lazy(() => $e(() => import("./Model-BM8R4W3D.js"), [], import.meta.url)),
 eh = H.lazy(() => $e(() => import("./Audit-DQxHr_U5.js"), [], import.meta.url)),
 th = H.lazy(() => $e(() => import("./Settings-BLrKZC7V.js"), [], import.meta.url)),
 nh = H.lazy(() => $e(() => import("./AccountModal-BJD0wbb7.js"), [], import.meta.url)),
 rh = H.lazy(() => $e(() => import("./WalletModal-BsbTC53B.js"), __vite__mapDeps([5, 6]), import.meta.url)),
 lh = H.lazy(() => $e(() => import("./CommandPalette-CNIx8Fix.js"), [], import.meta.url)),
 oh = H.lazy(() => $e(() => import("./Copilot-BeGpfLz7.js"), __vite__mapDeps([7, 1]), import.meta.url)),
 ih = H.lazy(() => $e(() => import("./PhoneCall-CY1IJGsx.js"), [], import.meta.url)),
 sh = H.lazy(() => $e(() => import("./ImportModal-DFwgwIST.js"), [], import.meta.url));
const RolesLz = q => H.lazy(() => $e(() => import("./Roles-p1a7k2.js").then(m => ({
  default: m[q]
 })), [], import.meta.url)),
 HoldsPg = RolesLz("Holds"),
 TrailPg = RolesLz("TrailAction"),
 MinePg = RolesLz("Mine"),
 CasesPg = RolesLz("Cases"),
 ReportsPg = RolesLz("Reports"),
 FilePg = RolesLz("FileComplaint");
/* officer screens: use the live backend pages (Officer.js) when the API is reachable, else the demo page */
const OfficerLz = H.lazy(() => $e(() => import("./Officer.js"), [], import.meta.url)),
 OfflineLz = H.lazy(() => $e(() => import("./Officer.js").then(m => ({
  default: m.Offline
 })), [], import.meta.url)),
 liveGate = (Demo, page) => function LiveGate() {
  const e = xt(),
   A = window.PeechaAPI,
   s = H.useSyncExternalStore(A.subscribe, A.get),
   key = e.user ? e.user.key : "",
   role = key === "analyst" ? "analyst:" + e.bank : key;
  H.useEffect(() => {
   (key === "officer" || key === "analyst") && A.use(role)
  }, [role, s.status]);
  if (key !== "officer" && key !== "analyst") return S.jsx(Demo, {});
  const isLive = s.role === role && s.status === "live";
  if (page === "settings") return S.jsx(Demo, {});
  if (!isLive) return S.jsx(H.Suspense, {
   fallback: null,
   children: S.jsx(OfflineLz, {
    state: s.role === role ? s : null
   })
  });
  return S.jsx(H.Suspense, {
   fallback: S.jsx("div", {
    className: "empty",
    children: "Loading…"
   }),
   children: S.jsx(OfficerLz, {
    page
   })
  })
 };
const nu = [
  ["inbox", "▤", "Case inbox"],
  ["trail", "⟿", "Money trail"],
  ["accounts", "◉", "Mule radar"],
  ["action", "✎", "Action pack"],
  ["prevent", "☎", "Prevention calls"],
  ["model", "▧", "Model & metrics"],
  ["audit", "⛓", "Audit trail"],
  ["settings", "⚙", "Settings"]
 ],
 ah = {
  inbox: "Inbox",
  trail: "Trail",
  accounts: "Radar",
  crypto: "Crypto",
  action: "Actions",
  prevent: "Calls",
  model: "Model",
  audit: "Audit",
  settings: "Settings"
 },
uh = {
  inbox: liveGate(CasesPg, "inbox"),
  trail: liveGate(TrailPg, "trail"),
  accounts: liveGate(Xp, "accounts"),
  action: liveGate(HoldsPg, "action"),
  prevent: liveGate(Zp, "prevent"),
  model: liveGate(Jp, "model"),
  audit: liveGate(eh, "audit"),
  settings: liveGate(th, "settings"),
  holds: liveGate(HoldsPg, "holds"),
  mine: MinePg,
  reports: ReportsPg
 };

function ch() {
 const e = xt(),
  t = Od(1e3),
  n = [...e.log].reverse().slice(0, 7),
  r = i => i.replace(/&/g, "&amp;").replace(/</g, "&lt;"),
  l = n.map(i => `<b>${r(i.t)}</b> ${r(i.kind)} — ${r(i.text)}`).join("  •  "),
  o = Math.max(1, Math.round((t - e.lastSync) / 1e3));
 if (window.PeechaAPI.get().status === "live") return null;
 return S.jsxs("div", {
  className: `ticker ${e.degraded?"degraded":""}`,
  role: "status",
  "aria-live": "off",
  children: [S.jsx("span", {
   className: "ping",
   style: {
    color: e.degraded ? "var(--risk-med)" : "var(--exit)"
   }
  }), S.jsx("span", {
   className: "live-lbl",
   style: {
    color: e.degraded ? "var(--risk-med)" : "var(--exit)"
   },
   children: e.degraded ? "Offline" : "Live"
  }), S.jsx("div", {
   className: "marquee-wrap",
   children: S.jsxs("div", {
    className: "marquee",
    children: [S.jsx("span", {
     dangerouslySetInnerHTML: {
      __html: l
     }
    }), S.jsx("span", {
     dangerouslySetInnerHTML: {
      __html: l
     }
    })]
   })
  }), S.jsxs("span", {
   className: "ticker-meta",
   children: [e.log.length, " log entries"]
  }), S.jsx("span", {
   className: "ticker-meta",
   children: e.degraded ? `Link lost ${e.linkLostAt}` : `Synced ${o}s ago`
  })]
 })
}

function dh() {
 const e = xt(),
  {
   D: t,
   S: n
  } = e,
  r = uh[routeOf(e)] || Fd;
 let l = 0,
  o = null;
 for (const a of t.order) {
  const h = e.pack(a).filter(d => Kl(e, a, d) !== "done" && (d.kind === "hold" || d.kind === "exchange")).length;
  l += h, h && !o && (o = a)
 }
 const i = e.user,
  s = t.cases.find(a => a.demo) || null;
 const A = window.PeechaAPI,
  LV = H.useSyncExternalStore(A.subscribe, A.get),
  rk = i.key === "analyst" ? "analyst:" + e.bank : i.key,
  LIVE = LV.status === "live" && LV.role === rk,
  meta = LV.meta || {},
  flagged = LIVE ? meta.flagged || 0 : t.candidates.filter(k => !e.calls[k]).length,
  pend = meta.pendingHolds || 0,
  ck = LIVE && meta.clock ? new Date(/Z|[+-]\d\d:?\d\d$/.test(meta.clock) ? meta.clock : meta.clock + "Z") : new Date();
 Od(30000);
 return S.jsxs(S.Fragment, {
  children: [S.jsxs("aside", {
   className: "sidebar",
   "aria-label": "Main navigation",
   children: [S.jsxs("div", {
    className: "brand",
    children: [S.jsxs("div", {
     children: [S.jsx("div", {
      className: "brand-name",
      children: "Peecha"
     }), S.jsx("div", {
      className: "brand-sub",
      children: "Follow the fraud rupee"
     })]
    }), S.jsx(Is, {
     className: "brand-mono",
     size: 44
    })]
   }), S.jsx("nav", {
    className: "nav",
    children: navOf(i.key).map(([a, h, d, g]) => S.jsxs("button", {
     className: `nav-btn ${g.includes(routeOf(e))?"active":""}`,
     onClick: () => e.go(a),
     "aria-current": g.includes(routeOf(e)) ? "page" : void 0,
     children: [S.jsx("span", {
      className: "nav-ico",
      "aria-hidden": "true",
      children: h
     }), d, a === "accounts" && flagged > 0 && S.jsx("span", {
      className: "nav-badge",
      children: flagged
     })]
    }, a))
   }), i.key === "officer" && S.jsx("button", {
    className: `queue-btn ${LIVE?pend===0?"ok":"":l===0?"ok":""}`,
    onClick: () => LIVE ? e.go("holds") : o ? e.openCase(o, "action") : e.go("action"),
    children: LIVE ? pend === 0 ? "✓ No holds waiting for you" : `${pend} hold${pend>1?"s":""} await your confirmation` : l === 0 ? "✓ No holds or freezes pending" : `${l} hold/freeze${l>1?"s":""} await your approval`
   }), S.jsxs("div", {
    className: "signed",
    children: [S.jsx("div", {
     className: "lbl",
     children: "Signed in as"
    }), S.jsx("div", {
     className: "nm",
     children: i.name
    }), S.jsxs("div", {
     className: "rl",
     children: [i.title, " · ", i.unit]
    }), S.jsxs("div", {
     className: "links",
     children: [S.jsx("select", {
      className: "link-btn",
      "aria-label": "Switch demo role",
      value: e.session,
      onChange: a => e.switchRole(a.target.value),
      style: {
       cursor: "pointer"
      },
      children: Object.values(se).map(a => S.jsxs("option", {
       value: a.key,
       children: ["Role: ", a.title]
      }, a.key))
     }), i.key === "analyst" && S.jsx("select", {
      className: "link-btn",
      "aria-label": "Switch bank",
      value: e.bank,
      onChange: a => e.switchRole("analyst", {
       bank: a.target.value
      }),
      style: {
       cursor: "pointer"
      },
      children: Object.keys(Ze).filter(k => window.PeechaAPI.banks[k]).map(k => S.jsx("option", {
       value: k,
       children: "Bank: " + gh[k]
      }, k))
     }), S.jsx("button", {
      className: "link-btn",
      onClick: e.logout,
      children: "Sign out"
     })]
    })]
   })]
  }), S.jsx("nav", {
   className: "tabbar",
   "aria-label": "Sections",
   children: navOf(i.key).map(([a, h, d, g]) => S.jsxs("button", {
    className: g.includes(routeOf(e)) ? "on" : "",
    onClick: () => e.go(a),
    "aria-current": g.includes(routeOf(e)) ? "page" : void 0,
    children: [S.jsx("span", {
     "aria-hidden": "true",
     children: h
    }), d]
   }, a))
  }), S.jsxs("div", {
   className: "main",
   children: [S.jsx("div", {
    className: "bg-glow",
    "aria-hidden": "true"
   }), S.jsx(Ld, {
    className: "watermark",
    size: 420,
    sweep: !0
   }), S.jsxs("div", {
    className: "content",
    children: [S.jsx(H.Suspense, {
     fallback: null,
     children: S.jsx(FactsLz, {})
    }), S.jsxs("div", {
     className: "topbar",
     children: [S.jsx("div", {
      style: {
       flex: 1
      }
     }), S.jsxs("div", {
      className: "clock-chip",
      title: LIVE ? meta.clock ? "Demo clock (set in Settings)" : "Current time" : "Demo clock (IST)",
      children: [S.jsx(tr, {
       name: "clock",
       size: 15
      }), S.jsxs("span", {
       children: !0 ? [ck.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short"
       }), " · ", S.jsx("b", {
        className: "mono",
        children: ck.toLocaleTimeString("en-IN", {
         hour: "2-digit",
         minute: "2-digit"
        })
       })] : [$s(n.clock), " · ", S.jsx("b", {
        className: "mono",
        children: me(n.clock)
       })]
      })]
     }), S.jsx("button", {
      className: "tool-btn icon",
      onClick: e.toggleTheme,
      title: e.theme === "dark" ? "Switch to light" : "Switch to dark",
      "aria-label": "Toggle dark mode",
      children: S.jsx(tr, {
       name: e.theme === "dark" ? "moon" : "sun",
       size: 18
      })
     }), false && S.jsx("button", {
      className: "tool-btn tour-btn",
      onClick: e.startTour,
      disabled: e.tourOn,
      children: "▶ Demo tour"
     }), i.key === "officer" && S.jsxs("button", {
      className: "tool-btn",
      onClick: () => e.togglePalette(!0),
      children: [S.jsx(tr, {
       name: "search",
       size: 14
      }), "Search ", S.jsx("span", {
       className: "kbd",
       children: "Ctrl K"
      })]
     }), false && S.jsxs("button", {
      className: "tool-btn",
      onClick: e.retrace,
      title: `Agent re-trace: advance the clock ${e.settings.step} min and re-follow every open case`,
      children: [S.jsx(tr, {
       name: "refresh",
       size: 14
      }), "Re-trace"]
     })]
    }), S.jsxs("div", {
     className: "scope-row",
     children: [S.jsx("span", {
      className: "chip",
      children: LIVE ? i.key === "officer" ? `Scope: all complaints · ${LV.items.length}` : i.key === "analyst" ? `Scope: ${Ze[e.bank]} · ${LV.items.length} case${LV.items.length===1?"":"s"}` : `Your complaints · ${LV.items.length}` : "Not connected"
     }), !1 && s && S.jsxs("span", {
      className: "chip warn",
      children: ["⏱ ", s.id, ": ", kd(n.clock - s.fraudAt), " since the fraud"]
     }), !1 && e.lastRetrace && S.jsxs("span", {
      className: "chip",
      style: {
       color: "var(--changed)"
      },
      children: ["Last re-trace ", me(e.lastRetrace.at), " · ", e.lastRetrace.newHops, " new hop", e.lastRetrace.newHops === 1 ? "" : "s", e.lastRetrace.blocked ?
       ` · ${e.lastRetrace.blocked} blocked` : ""
      ]
     }), !1 && S.jsx("span", {
      className: "chip proto",
      children: "Synthetic data"
     })]
    }), e.degraded && S.jsxs("div", {
     className: "banner",
     role: "alert",
     children: [S.jsx(tr, {
      name: "unlink",
      size: 18
     }), S.jsxs("span", {
      children: [S.jsxs("b", {
       children: ["Link to bank and exchange gateways lost at ", e.linkLostAt, "."]
      }), " Tracing keeps working on local data; approvals are queued (", e.queued, ") and sent when the link returns."]
     }), S.jsx("button", {
      className: "tool-btn",
      onClick: e.toggleLink,
      children: "Restore link"
     })]
    }), S.jsx(TabsBar, {}), S.jsx(H.Suspense, {
     fallback: S.jsx("div", {
      style: {
       padding: 40
      },
      className: "muted",
      children: "Loading…"
     }),
     children: S.jsx(r, {})
    })]
   })]
  }), S.jsxs(H.Suspense, {
   fallback: null,
   children: [e.modal && e.modal.type === "account" && S.jsx(nh, {
    id: e.modal.id
   }, e.modal.id), e.modal && e.modal.type === "wallet" && S.jsx(rh, {
    id: e.modal.id
   }, e.modal.id), e.modal && e.modal.type === "import" && S.jsx(sh, {}), e.modal && e.modal.type === "file" && S.jsx(FilePg, {}), e.paletteOpen && S.jsx(lh, {}), e.copilotOpen && S.jsx(oh, {},
    e.copilotSeed || "cp"), e.call && S.jsx(ih, {})]
  }), i.key !== "consumer" && S.jsx("button", {
   className: "fab glow",
   onClick: () => e.toggleCopilot(),
   "aria-label": e.copilotOpen ? "Close copilot" : "Open copilot",
   children: e.copilotOpen ? "✕" : "AI"
  }), e.toastMsg && S.jsx("div", {
   className: "toast",
   role: "status",
   children: e.toastMsg
  })]
 })
}
const Ie = "C-3021";
let vl = null;
const Oo = () => setTimeout(() => {
  const e = document.getElementById("trail-card");
  e && e.scrollIntoView({
   behavior: "smooth",
   block: "start"
  })
 }, 450),
 Tn = () => {
  vl && clearInterval(vl), vl = null
 },
 ru = (e, t) => e.pack(Ie).filter(n => Kl(e, Ie, n) !== "done" && !0),
 dn = e => e.D.states[Ie] ? e.D.states[Ie].tot : null,
 Et = [{
  run: e => {
   Tn(), e.session ? e.session !== "officer" && e.switchRole("officer") : e.login("officer"), e.resetDemo(!0), e.go("inbox")
  },
  title: "The problem",
  text: () =>
   "India logged 24 lakh+ cyber-fraud complaints in 2025. Two older cases here are already mostly gone. Meanwhile a student account in Guwahati has just passed on ₹2 lakh — its bank alert fired, but nobody has linked it to a victim.",
  dwell: 9500
 }, {
  run: e => e.ingestComplaint(),
  title: "A 1930 complaint arrives",
  text: e =>
   `C-3021: ₹2 lakh fake-job scam. Peecha traced it in ${e.D.ms.toFixed(0)} ms over ${e.D.txCount.toLocaleString("en-IN")} transactions and put it on top: ${dn(e)?_e(dn(e).recoverable):""} can still be stopped.`,
  dwell: 8e3
 }, {
  run: (e, t) => {
   e.openCase(Ie, "trail"), Oo();
   let r = e.D.W.cases.find(l => l.id === Ie).fraudAt - 3;
   e.setViewTime(r), Tn(), vl = setInterval(() => {
    r += 1, r >= t.current.S.clock ? (Tn(), t.current.setViewTime(null)) : t.current.setViewTime(r)
   }, 85)
  },
  title: "The money trail, replayed",
  text: () =>
   "Victim → a student's account → four more accounts within 38 minutes → ATM cash and a P2P crypto seller → USDT on TRON. Green boxes still hold the victim's money; that is what can be stopped.",
  dwell: 10500
 }, {
  run: e => {
   Tn(), e.setViewTime(null), e.open("account", "AC0952")
  },
  title: "Why this account",
  text: e =>
   `Rohit Saikia, 20, student, account 34 days old: mule score ${e.D.scores.AC0952?Math.round(e.D.scores.AC0952.score):"—"}. Every point is explained — pass-through, shared device, profile mismatch, complaint money traced in.`,
  dwell: 9e3
 }, {
  run: e => {
   e.close(), e.openCase(Ie, "crypto")
  },
  title: "Across the seam (on the same trail)",
  text: () =>
   "Two mule accounts paid a P2P seller ₹99,000; minutes later the seller released USDT to the scammer's wallet. Bank tools stop at the seller — Peecha keeps following the money on-chain.",
  dwell: 8e3
 }, {
  run: e => e.openCase(Ie, "action"),
  title: "The action pack",
  text: e => `The agent drafted ${e.pack(Ie).length} actions: a debit-hold letter per bank, a P2P seller request, a USDT issuer request and the STR narrative — each tied to evidence.`,
  dwell: 7e3
 }, {
  run: e => e.approveItems(Ie, ru(e)),
  title: "The officer approves",
  text: e => `Holds placed at ${me(e.S.clock)}: ${dn(e)?_e(dn(e).secured):""} secured in one click. Each approval is logged with name and time.`,
  dwell: 7e3
 }, {
  run: e => {
   e.retrace(), e.openCase(Ie, "trail"), Oo()
  },
  title: "25 minutes later: re-trace",
  text: e =>
   `At 14:38 Meena Kalita's account tried to move the money on — blocked by the hold. But the USDT reached an exchange deposit address, so the agent drafted a freeze request at once. ${e.lastRetrace?`(${e.lastRetrace.blocked} transfer blocked)`:""}`,
  dwell: 9500
 }, {
  run: e => {
   e.approveItems(Ie, ru(e)), e.openCase(Ie, "action")
  },
  title: "Freeze at the exchange",
  text: () => "The officer approves the exchange freeze. Exchanges can freeze a user's deposit; self-custody wallets cannot be frozen, so they stay on watch.",
  dwell: 6500
 }, {
  run: e => {
   e.retrace(), e.openCase(Ie, "trail"), Oo()
  },
  title: "The scammer tries to cash out",
  text: e => `At 15:10 the USDT was pushed towards a bridge — the freeze stopped it. ${dn(e)?`${_e(dn(e).secured)} of ₹2 lakh secured`:""} within about two hours of the fraud.`,
  dwell: 9e3
 }, {
  run: e => {
   e.go("prevent"), e.D.candidates[0] && e.startCall(e.D.candidates[0])
  },
  title: "Prevention, in Hindi",
  text: () => "A new account has just started the mule pattern. Instead of a hold, Peecha calls the holder in Hindi and warns them — before they become an accused.",
  dwell: 14e3
 }, {
  run: e => {
   e.endCall(), e.go("model")
  },
  title: "Honest numbers",
  text: e =>
   `On accounts the model never saw: precision ${(e.D.evalr.precision*100).toFixed(0)}%, recall ${(e.D.evalr.recall*100).toFixed(0)}%, ${e.D.evalr.falsePer1000.toFixed(1)} false alarms per 1,000 — measured live in the browser.`,
  dwell: 7500
 }, {
  run: e => e.go("audit"),
  title: "Audit trail",
  text: () => "Every complaint, trace, approval and call sits in one SHA-256 hash chain. Try “Tamper test”, then “Verify chain”.",
  dwell: 6500
 }, {
  run: e => e.go("inbox"),
  title: "Tour complete",
  text: () => "Trace → Score → Act → Prevent. Explore freely: re-trace from the top bar, switch roles from the sidebar, or ask the AI copilot (also in Hindi).",
  dwell: 0
 }];

const TourLz = H.lazy(() => $e(() => import("./Tour.js"), [], import.meta.url));
const FactsLz = H.lazy(() => $e(() => import("./Facts.js"), [], import.meta.url));

function fh() {
 const e = xt();
 return e.tourOn ? S.jsx(H.Suspense, {
  fallback: null,
  children: S.jsx(TourLz, {})
 }) : null
}

function ph() {
 const {
  session: e
 } = xt();
 return S.jsxs(S.Fragment, {
  children: [e ? S.jsx(dh, {}) : S.jsx(Vp, {}), S.jsx(fh, {})]
 })
}
gd(document.getElementById("root")).render(S.jsx(sf.StrictMode, {
 children: S.jsx(Hp, {
  children: S.jsx(ph, {})
 })
}));
export {
 Rh as A, Ze as B, Ph as C, se as D, Ft as E, Vl as F, Ih as G, Md as H, tr as I, gh as J, Eh as K, Op as L, Nh as M, nu as N, Up as O, Ch as P, ir as Q, sf as R, Th as S, wh as T, ji as U, kh as V,
 Ud as a, pe as b, Ah as c, kd as d, H as e, jh as f, yh as g, me as h, _e as i, S as j, _h as k, er as l, vh as m, Np as n, Mh as o, Kl as p, Sh as q, $h as r, mh as s, Dh as t, xt as u, Qt as v,
 jt as w, $d as x, xh as y, Fp as z
};