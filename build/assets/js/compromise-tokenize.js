!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : ((t =
        "undefined" != typeof globalThis ? globalThis : t || self).nlp = e());
})(this, function () {
  "use strict";
  function t(e) {
    return (t =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              "function" == typeof Symbol &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? "symbol"
              : typeof t;
          })(e);
  }
  function e(t, e) {
    if (!(t instanceof e))
      throw new TypeError("Cannot call a class as a function");
  }
  function r(t, e) {
    for (var r = 0; r < e.length; r++) {
      var n = e[r];
      (n.enumerable = n.enumerable || !1),
        (n.configurable = !0),
        "value" in n && (n.writable = !0),
        Object.defineProperty(t, n.key, n);
    }
  }
  function n(t, e, n) {
    return e && r(t.prototype, e), n && r(t, n), t;
  }
  function i(t, e) {
    if ("function" != typeof e && null !== e)
      throw new TypeError("Super expression must either be null or a function");
    (t.prototype = Object.create(e && e.prototype, {
      constructor: { value: t, writable: !0, configurable: !0 },
    })),
      e && s(t, e);
  }
  function o(t) {
    return (o = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function s(t, e) {
    return (s =
      Object.setPrototypeOf ||
      function (t, e) {
        return (t.__proto__ = e), t;
      })(t, e);
  }
  function a(t, e) {
    return !e || ("object" != typeof e && "function" != typeof e)
      ? (function (t) {
          if (void 0 === t)
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called"
            );
          return t;
        })(t)
      : e;
  }
  function u(t) {
    var e = (function () {
      if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
      if (Reflect.construct.sham) return !1;
      if ("function" == typeof Proxy) return !0;
      try {
        return (
          Boolean.prototype.valueOf.call(
            Reflect.construct(Boolean, [], function () {})
          ),
          !0
        );
      } catch (t) {
        return !1;
      }
    })();
    return function () {
      var r,
        n = o(t);
      if (e) {
        var i = o(this).constructor;
        r = Reflect.construct(n, arguments, i);
      } else r = n.apply(this, arguments);
      return a(this, r);
    };
  }
  var c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(
    ""
  );
  var h = function (t) {
      for (var e = (t = t || "_") + "-", r = 0; r < 7; r++)
        e += c[Math.floor(Math.random() * c.length)];
      return e;
    },
    l = {
      "!": "¡",
      "?": "¿Ɂ",
      '"': '“”"❝❞',
      "'": "‘‛❛❜",
      "-": "—–",
      a: "ªÀÁÂÃÄÅàáâãäåĀāĂăĄąǍǎǞǟǠǡǺǻȀȁȂȃȦȧȺΆΑΔΛάαλАадѦѧӐӑӒӓƛɅæ",
      b: "ßþƀƁƂƃƄƅɃΒβϐϦБВЪЬвъьѢѣҌҍ",
      c: "¢©ÇçĆćĈĉĊċČčƆƇƈȻȼͻͼͽϲϹϽϾСсєҀҁҪҫ",
      d: "ÐĎďĐđƉƊȡƋƌǷ",
      e: "ÈÉÊËèéêëĒēĔĕĖėĘęĚěƎƏƐǝȄȅȆȇȨȩɆɇΈΕΞΣέεξϱϵ϶ЀЁЕЭеѐёҼҽҾҿӖӗӘәӚӛӬӭ",
      f: "ƑƒϜϝӺӻҒғſ",
      g: "ĜĝĞğĠġĢģƓǤǥǦǧǴǵ",
      h: "ĤĥĦħƕǶȞȟΉΗЂЊЋНнђћҢңҤҥҺһӉӊ",
      I: "ÌÍÎÏ",
      i: "ìíîïĨĩĪīĬĭĮįİıƖƗȈȉȊȋΊΐΪίιϊІЇії",
      j: "ĴĵǰȷɈɉϳЈј",
      k: "ĶķĸƘƙǨǩΚκЌЖКжкќҚқҜҝҞҟҠҡ",
      l: "ĹĺĻļĽľĿŀŁłƚƪǀǏǐȴȽΙӀӏ",
      m: "ΜϺϻМмӍӎ",
      n: "ÑñŃńŅņŇňŉŊŋƝƞǸǹȠȵΝΠήηϞЍИЙЛПийлпѝҊҋӅӆӢӣӤӥπ",
      o: "ÒÓÔÕÖØðòóôõöøŌōŎŏŐőƟƠơǑǒǪǫǬǭǾǿȌȍȎȏȪȫȬȭȮȯȰȱΌΘΟθοσόϕϘϙϬϭϴОФоѲѳӦӧӨөӪӫ",
      p: "ƤƿΡρϷϸϼРрҎҏÞ",
      q: "Ɋɋ",
      r: "ŔŕŖŗŘřƦȐȑȒȓɌɍЃГЯгяѓҐґ",
      s: "ŚśŜŝŞşŠšƧƨȘșȿЅѕ",
      t: "ŢţŤťŦŧƫƬƭƮȚțȶȾΓΤτϮТт",
      u: "µÙÚÛÜùúûüŨũŪūŬŭŮůŰűŲųƯưƱƲǓǔǕǖǗǘǙǚǛǜȔȕȖȗɄΰμυϋύ",
      v: "νѴѵѶѷ",
      w: "ŴŵƜωώϖϢϣШЩшщѡѿ",
      x: "×ΧχϗϰХхҲҳӼӽӾӿ",
      y: "ÝýÿŶŷŸƳƴȲȳɎɏΎΥΫγψϒϓϔЎУучўѰѱҮүҰұӮӯӰӱӲӳ",
      z: "ŹźŻżŽžƩƵƶȤȥɀΖζ",
    },
    f = {};
  Object.keys(l).forEach(function (t) {
    l[t].split("").forEach(function (e) {
      f[e] = t;
    });
  });
  var p = function (t) {
      var e = t.split("");
      return (
        e.forEach(function (t, r) {
          f[t] && (e[r] = f[t]);
        }),
        e.join("")
      );
    },
    v = /([A-Z]\.)+[A-Z]?,?$/,
    d = /^[A-Z]\.,?$/,
    m = /[A-Z]{2,}('s|,)?$/,
    g = /([a-z]\.){1,}[a-z]\.?$/,
    b = function (t) {
      return (
        !0 === v.test(t) ||
        !0 === g.test(t) ||
        !0 === d.test(t) ||
        !0 === m.test(t)
      );
    },
    y = /[a-z\u00C0-\u00FF] ?\/ ?[a-z\u00C0-\u00FF]/,
    A = function (t) {
      var e = (t = (t = (t = t || "").toLowerCase()).trim());
      return (
        (t = p(t)),
        !0 === y.test(t) && (t = t.replace(/\/.*/, "")),
        (t = (t = (t = (t = (t = (t = (t = t.replace(/^[#@]/, "")).replace(
          /[,;.!?]+$/,
          ""
        )).replace(
          /[\u0027\u0060\u00B4\u2018\u2019\u201A\u201B\u2032\u2035\u2039\u203A]+/g,
          "'"
        )).replace(
          /[\u0022\u00AB\u00BB\u201C\u201D\u201E\u201F\u2033\u2034\u2036\u2037\u2E42\u301D\u301E\u301F\uFF02]+/g,
          '"'
        )).replace(/\u2026/g, "...")).replace(/\u2013/g, "-")).replace(
          /([aeiou][ktrp])in$/,
          "$1ing"
        )),
        !0 === /^(re|un)-?[^aeiou]./.test(t) && (t = t.replace("-", "")),
        b(t) && (t = t.replace(/\./g, "")),
        !1 === /^[:;]/.test(t) &&
          (t = (t = (t = t.replace(/\.{3,}$/g, "")).replace(
            /[",\.!:;\?\)]+$/g,
            ""
          )).replace(/^['"\(]+/g, "")),
        "" === (t = (t = t.replace(/[\u200B-\u200D\uFEFF]/g, "")).trim()) &&
          (t = e),
        (t = t.replace(/([0-9]),([0-9])/g, "$1$2"))
      );
    },
    w = function (t) {
      return (t = (t = t.replace(/['’]s$/, "")).replace(/s['’]$/, "s"));
    },
    x = /^[ \n\t\.’'\[\](){}⟨⟩:,،、‒–—―…!.‹›«»‐\-?‘’;\/⁄·&*•^†‡°¡¿※№÷×ºª%‰+−=‱¶′″‴§~|‖¦©℗®℠™¤₳฿\u0022|\uFF02|\u0027|\u201C|\u2018|\u201F|\u201B|\u201E|\u2E42|\u201A|\u00AB|\u2039|\u2035|\u2036|\u2037|\u301D|\u0060|\u301F]+/,
    P = /[ \n\t\.’'\[\](){}⟨⟩:,،、‒–—―…!.‹›«»‐\-?‘’;\/⁄·&*@•^†‡°¡¿※#№÷×ºª‰+−=‱¶′″‴§~|‖¦©℗®℠™¤₳฿\u0022|\uFF02|\u0027|\u201D|\u2019|\u201D|\u2019|\u201D|\u201D|\u2019|\u00BB|\u203A|\u2032|\u2033|\u2034|\u301E|\u00B4|\u301E]+$/,
    j = /\//,
    E = /['’]/,
    O = /^[a-z]\.([a-z]\.)+/i,
    k = /^[-+\.][0-9]/,
    C = /^'[0-9]{2}/,
    F = function (t) {
      var e = t,
        r = "",
        n = "";
      "" ===
        (t = (t = t.replace(x, function (e) {
          return ("-" !== (r = e) && "+" !== r && "." !== r) || !k.test(t)
            ? "'" === r && C.test(t)
              ? ((r = ""), e)
              : ""
            : ((r = ""), e);
        })).replace(P, function (i) {
          return (
            (n = i),
            E.test(i) && /[sn]['’]$/.test(e) && !1 === E.test(r)
              ? ((n = n.replace(E, "")), "'")
              : !0 === O.test(t)
              ? ((n = n.replace(/\./, "")), ".")
              : ""
          );
        })) &&
        ((e = e.replace(/ *$/, function (t) {
          return (n = t || ""), "";
        })),
        (t = e),
        (r = ""),
        (n = n));
      var i = A(t),
        o = { text: t, clean: i, reduced: w(i), pre: r, post: n };
      return (
        j.test(t) &&
          t.split(j).forEach(function (t) {
            (o.alias = o.alias || {}), (o.alias[t.trim()] = !0);
          }),
        o
      );
    };
  function T(t) {
    var e = { exports: {} };
    return t(e, e.exports), e.exports;
  }
  var N = T(function (t, e) {
      var r = /^[A-Z][a-z'\u00C0-\u00FF]/,
        n = /^[A-Z]+s?$/;
      (e.toUpperCase = function () {
        return (this.text = this.text.toUpperCase()), this;
      }),
        (e.toLowerCase = function () {
          return (this.text = this.text.toLowerCase()), this;
        }),
        (e.toTitleCase = function () {
          return (
            (this.text = this.text.replace(
              /^ *[a-z\u00C0-\u00FF]/,
              function (t) {
                return t.toUpperCase();
              }
            )),
            this
          );
        }),
        (e.isUpperCase = function () {
          return n.test(this.text);
        }),
        (e.isTitleCase = function () {
          return r.test(this.text);
        }),
        (e.titleCase = e.isTitleCase);
    }),
    $ = T(function (t, e) {
      var r = /(\u0022|\uFF02|\u0027|\u201C|\u2018|\u201F|\u201B|\u201E|\u2E42|\u201A|\u00AB|\u2039|\u2035|\u2036|\u2037|\u301D|\u0060|\u301F)/,
        n = /(\u0022|\uFF02|\u0027|\u201D|\u2019|\u201D|\u2019|\u201D|\u201D|\u2019|\u00BB|\u203A|\u2032|\u2033|\u2034|\u301E|\u00B4|\u301E)/;
      (e.hasPost = function (t) {
        return -1 !== this.post.indexOf(t);
      }),
        (e.hasPre = function (t) {
          return -1 !== this.pre.indexOf(t);
        }),
        (e.hasQuote = function () {
          return r.test(this.pre) || n.test(this.post);
        }),
        (e.hasQuotation = e.hasQuote),
        (e.hasComma = function () {
          return this.hasPost(",");
        }),
        (e.hasPeriod = function () {
          return !0 === this.hasPost(".") && !1 === this.hasPost("...");
        }),
        (e.hasExclamation = function () {
          return this.hasPost("!");
        }),
        (e.hasQuestionMark = function () {
          return this.hasPost("?") || this.hasPost("¿");
        }),
        (e.hasEllipses = function () {
          return (
            this.hasPost("..") ||
            this.hasPost("…") ||
            this.hasPre("..") ||
            this.hasPre("…")
          );
        }),
        (e.hasSemicolon = function () {
          return this.hasPost(";");
        }),
        (e.hasSlash = function () {
          return /\//.test(this.text);
        }),
        (e.hasHyphen = function () {
          var t = /^(-|–|—)$/;
          return t.test(this.post) || t.test(this.pre);
        }),
        (e.hasDash = function () {
          var t = / (-|–|—) /;
          return t.test(this.post) || t.test(this.pre);
        }),
        (e.hasContraction = function () {
          return Boolean(this.implicit);
        }),
        (e.addPunctuation = function (t) {
          return (
            ("," !== t && ";" !== t) || (this.post = this.post.replace(t, "")),
            (this.post = t + this.post),
            this
          );
        });
    }),
    V = function (t, e) {
      var r = t.length,
        n = e.length;
      if (0 === r) return n;
      if (0 === n) return r;
      var i = (n > r ? n : r) + 1;
      if (Math.abs(r - n) > (i || 100)) return i || 100;
      for (var o, s, a, u, c, h, l = [], f = 0; f < i; f++)
        (l[f] = [f]), (l[f].length = i);
      for (var p = 0; p < i; p++) l[0][p] = p;
      for (var v = 1; v <= r; ++v)
        for (s = t[v - 1], o = 1; o <= n; ++o) {
          if (v === o && l[v][o] > 4) return r;
          (u = s === (a = e[o - 1]) ? 0 : 1),
            (c = l[v - 1][o] + 1),
            (h = l[v][o - 1] + 1) < c && (c = h),
            (h = l[v - 1][o - 1] + u) < c && (c = h);
          var d =
            v > 1 &&
            o > 1 &&
            s === e[o - 2] &&
            t[v - 2] === a &&
            (h = l[v - 2][o - 2] + u) < c;
          l[v][o] = d ? h : c;
        }
      return l[r][n];
    },
    B = function (t, e) {
      var r =
        arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 3;
      if (t === e) return 1;
      if (t.length < r || e.length < r) return 0;
      var n = V(t, e),
        i = Math.max(t.length, e.length),
        o = 0 === i ? 0 : n / i,
        s = 1 - o;
      return s;
    },
    I = function () {},
    S = function (t, e, r, n) {
      if (e.id === t.id) return !0;
      if (!0 === e.anything) return !0;
      if (!0 === e.start && 0 !== r) return !1;
      if (!0 === e.end && r !== n - 1) return !1;
      if (void 0 !== e.word) {
        if (null !== t.implicit && t.implicit === e.word) return !0;
        if (void 0 !== t.alias && t.alias.hasOwnProperty(e.word)) return !0;
        if (!0 === e.soft && e.word === t.root) return !0;
        if (void 0 !== e.fuzzy) {
          var i = B(e.word, t.reduced);
          if (i > e.fuzzy) return !0;
          if (!0 === e.soft && (i = B(e.word, t.root)) > e.fuzzy) return !0;
        }
        return e.word === t.clean || e.word === t.text || e.word === t.reduced;
      }
      return void 0 !== e.tag
        ? !0 === t.tags[e.tag]
        : void 0 !== e.method
        ? "function" == typeof t[e.method] && !0 === t[e.method]()
        : void 0 !== e.regex
        ? e.regex.test(t.clean)
        : void 0 !== e.fastOr
        ? !(!t.implicit || !0 !== e.fastOr.hasOwnProperty(t.implicit)) ||
          e.fastOr.hasOwnProperty(t.reduced) ||
          e.fastOr.hasOwnProperty(t.text)
        : void 0 !== e.choices &&
          ("and" === e.operator
            ? e.choices.every(function (e) {
                return I(t, e, r, n);
              })
            : e.choices.some(function (e) {
                return I(t, e, r, n);
              }));
    },
    z = (I = function (t, e, r, n) {
      var i = S(t, e, r, n);
      return !0 === e.negative ? !i : i;
    }),
    D = {},
    _ = {
      doesMatch: function (t, e, r) {
        return z(this, t, e, r);
      },
      isAcronym: function () {
        return b(this.text);
      },
      isImplicit: function () {
        return "" === this.text && Boolean(this.implicit);
      },
      isKnown: function () {
        return Object.keys(this.tags).some(function (t) {
          return !0 !== D[t];
        });
      },
      setRoot: function (t) {
        var e = t.transforms,
          r = this.implicit || this.clean;
        if (
          (this.tags.Plural && (r = e.toSingular(r, t)),
          this.tags.Verb && !this.tags.Negative && !this.tags.Infinitive)
        ) {
          var n = null;
          this.tags.PastTense
            ? (n = "PastTense")
            : this.tags.Gerund
            ? (n = "Gerund")
            : this.tags.PresentTense
            ? (n = "PresentTense")
            : this.tags.Participle
            ? (n = "Participle")
            : this.tags.Actor && (n = "Actor"),
            (r = e.toInfinitive(r, t, n));
        }
        this.root = r;
      },
    },
    M = /[\s-]/,
    G = /^[A-Z-]+$/,
    q = {
      textOut: function (t, e, r) {
        t = t || {};
        var n = this.text,
          i = this.pre,
          o = this.post;
        return (
          !0 === t.reduced && (n = this.reduced || ""),
          !0 === t.root && (n = this.root || ""),
          !0 === t.implicit && this.implicit && (n = this.implicit || ""),
          !0 === t.normal && (n = this.clean || this.text || ""),
          !0 === t.root && (n = this.root || this.reduced || ""),
          !0 === t.unicode && (n = p(n)),
          !0 === t.titlecase &&
            ((this.tags.ProperNoun && !this.titleCase()) ||
              (this.tags.Acronym
                ? (n = n.toUpperCase())
                : G.test(n) && !this.tags.Acronym && (n = n.toLowerCase()))),
          !0 === t.lowercase && (n = n.toLowerCase()),
          !0 === t.acronyms && this.tags.Acronym && (n = n.replace(/\./g, "")),
          (!0 !== t.whitespace && !0 !== t.root) ||
            ((i = ""),
            (o = " "),
            (!1 !== M.test(this.post) && !t.last) || this.implicit || (o = "")),
          !0 !== t.punctuation ||
            t.root ||
            (!0 === this.hasPost(".")
              ? (o = "." + o)
              : !0 === this.hasPost("?")
              ? (o = "?" + o)
              : !0 === this.hasPost("!")
              ? (o = "!" + o)
              : !0 === this.hasPost(",")
              ? (o = "," + o)
              : !0 === this.hasEllipses() && (o = "..." + o)),
          !0 !== e && (i = ""),
          !0 !== r && (o = ""),
          !0 === t.abbreviations &&
            this.tags.Abbreviation &&
            (o = o.replace(/^\./, "")),
          i + n + o
        );
      },
    },
    L = { Auxiliary: 1, Possessive: 1 },
    W = function (t, e) {
      var r = Object.keys(t.tags),
        n = e.tags;
      return (r = r.sort(function (t, e) {
        return L[e] || !n[e]
          ? -1
          : n[e]
          ? n[t]
            ? n[t].lineage.length > n[e].lineage.length
              ? 1
              : n[t].isA.length > n[e].isA.length
              ? -1
              : 0
            : 0
          : 1;
      }));
    },
    U = {
      text: !0,
      tags: !0,
      implicit: !0,
      whitespace: !0,
      clean: !1,
      id: !1,
      index: !1,
      offset: !1,
      bestTag: !1,
    },
    R = {
      json: function (t, e) {
        t = t || {};
        var r = {};
        return (
          (t = Object.assign({}, U, t)).text && (r.text = this.text),
          t.normal && (r.normal = this.clean),
          t.tags && (r.tags = Object.keys(this.tags)),
          t.clean && (r.clean = this.clean),
          (t.id || t.offset) && (r.id = this.id),
          t.implicit && null !== this.implicit && (r.implicit = this.implicit),
          t.whitespace && ((r.pre = this.pre), (r.post = this.post)),
          t.bestTag && (r.bestTag = W(this, e)[0]),
          r
        );
      },
    },
    H = Object.assign({}, N, $, _, q, R);
  function Q() {
    return "undefined" != typeof window && window.document;
  }
  var Z = function (t, e) {
      for (t = t.toString(); t.length < e; ) t += " ";
      return t;
    },
    J = function (t, e, r) {
      if (Q())
        console.log("%c" + Z(t.clean, 3) + "  + " + e + " ", "color: #6accb2;");
      else {
        var n = "[33m" + Z(t.clean, 15) + "[0m + [32m" + e + "[0m ";
        r && (n = Z(n, 35) + " " + r), console.log(n);
      }
    },
    Y = function (t, e, r) {
      if (Q())
        console.log("%c" + Z(t.clean, 3) + "  - " + e + " ", "color: #AB5850;");
      else {
        var n = "[33m" + Z(t.clean, 3) + " [31m - #" + e + "[0m ";
        r && (n = Z(n, 35) + " " + r), console.log(n);
      }
    },
    K = function (t) {
      return t.charAt(0).toUpperCase() + t.substr(1);
    },
    X = function (t, e, r, n) {
      var i = n.tags;
      if (
        "" !== e &&
        "." !== e &&
        "-" !== e &&
        ("#" === e[0] && (e = e.replace(/^#/, "")),
        (e = K(e)),
        !0 !== t.tags[e])
      ) {
        var o = n.isVerbose();
        !0 === o && J(t, e, r),
          (t.tags[e] = !0),
          !0 === i.hasOwnProperty(e) &&
            (i[e].isA.forEach(function (e) {
              (t.tags[e] = !0), !0 === o && J(t, "→ " + e);
            }),
            t.unTag(i[e].notA, "←", n));
      }
    },
    tt = function (t, e, r, n) {
      if ("string" != typeof e)
        for (var i = 0; i < e.length; i++) X(t, e[i], r, n);
      else X(t, e, r, n);
    },
    et = /^[a-z]/,
    rt = function (t, e, r, n) {
      var i,
        o = n.isVerbose();
      if ("*" === e) return (t.tags = {}), t;
      (e = e.replace(/^#/, "")),
        !0 === et.test(e) &&
          (e = (i = e).charAt(0).toUpperCase() + i.substr(1)),
        !0 === t.tags[e] && (delete t.tags[e], !0 === o && Y(t, e, r));
      var s = n.tags;
      if (s[e])
        for (var a = s[e].lineage, u = 0; u < a.length; u++)
          !0 === t.tags[a[u]] &&
            (delete t.tags[a[u]], !0 === o && Y(t, " - " + a[u]));
      return t;
    },
    nt = function (t, e, r, n) {
      if ("string" != typeof e && e)
        for (var i = 0; i < e.length; i++) rt(t, e[i], r, n);
      else rt(t, e, r, n);
    },
    it = function t(e, r, n) {
      var i = n.tags;
      if (("#" === r[0] && (r = r.replace(/^#/, "")), void 0 === i[r]))
        return !0;
      for (var o = i[r].notA || [], s = 0; s < o.length; s++)
        if (!0 === e.tags[o[s]]) return !1;
      return void 0 === i[r].isA || t(e, i[r].isA, n);
    },
    ot = {
      tag: function (t, e, r) {
        return tt(this, t, e, r), this;
      },
      tagSafe: function (t, e, r) {
        return it(this, t, r) && tt(this, t, e, r), this;
      },
      unTag: function (t, e, r) {
        return nt(this, t, e, r), this;
      },
      canBe: function (t, e) {
        return it(this, t, e);
      },
    },
    st = (function () {
      function t() {
        var r =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
        e(this, t), (r = String(r));
        var n = F(r);
        (this.text = n.text || ""),
          (this.clean = n.clean),
          (this.reduced = n.reduced),
          (this.root = null),
          (this.implicit = null),
          (this.pre = n.pre || ""),
          (this.post = n.post || ""),
          (this.tags = {}),
          (this.prev = null),
          (this.next = null),
          (this.id = h(n.clean)),
          (this.isA = "Term"),
          n.alias && (this.alias = n.alias);
      }
      return (
        n(t, [
          {
            key: "set",
            value: function (t) {
              var e = F(t);
              return (this.text = e.text), (this.clean = e.clean), this;
            },
          },
        ]),
        t
      );
    })();
  (st.prototype.clone = function () {
    var t = new st(this.text);
    return (
      (t.pre = this.pre),
      (t.post = this.post),
      (t.clean = this.clean),
      (t.reduced = this.reduced),
      (t.root = this.root),
      (t.implicit = this.implicit),
      (t.tags = Object.assign({}, this.tags)),
      t
    );
  }),
    Object.assign(st.prototype, H),
    Object.assign(st.prototype, ot);
  var at = st,
    ut = {
      terms: function (t) {
        if (0 === this.length) return [];
        if (this.cache.terms)
          return void 0 !== t ? this.cache.terms[t] : this.cache.terms;
        for (
          var e = [this.pool.get(this.start)], r = 0;
          r < this.length - 1;
          r += 1
        ) {
          var n = e[e.length - 1].next;
          if (null === n) {
            console.error(
              "Compromise error: Linked list broken in phrase '" +
                this.start +
                "'"
            );
            break;
          }
          var i = this.pool.get(n);
          if ((e.push(i), void 0 !== t && t === r)) return e[t];
        }
        return void 0 === t && (this.cache.terms = e), void 0 !== t ? e[t] : e;
      },
      clone: function (t) {
        var e = this;
        if (t) {
          var r = this.buildFrom(this.start, this.length);
          return (r.cache = this.cache), r;
        }
        var n = this.terms().map(function (t) {
          return t.clone();
        });
        return (
          n.forEach(function (t, r) {
            e.pool.add(t),
              n[r + 1] && (t.next = n[r + 1].id),
              n[r - 1] && (t.prev = n[r - 1].id);
          }),
          this.buildFrom(n[0].id, n.length)
        );
      },
      lastTerm: function () {
        var t = this.terms();
        return t[t.length - 1];
      },
      hasId: function (t) {
        if (0 === this.length || !t) return !1;
        if (this.start === t) return !0;
        if (this.cache.terms) {
          for (var e = this.cache.terms, r = 0; r < e.length; r++)
            if (e[r].id === t) return !0;
          return !1;
        }
        for (var n = this.start, i = 0; i < this.length - 1; i += 1) {
          var o = this.pool.get(n);
          if (void 0 === o)
            return (
              console.error(
                "Compromise error: Linked list broken. Missing term '"
                  .concat(n, "' in phrase '")
                  .concat(this.start, "'\n")
              ),
              !1
            );
          if (o.next === t) return !0;
          n = o.next;
        }
        return !1;
      },
      wordCount: function () {
        return this.terms().filter(function (t) {
          return "" !== t.text;
        }).length;
      },
      fullSentence: function () {
        for (var t = this.terms(0); t.prev; ) t = this.pool.get(t.prev);
        for (var e = t.id, r = 1; t.next; )
          (t = this.pool.get(t.next)), (r += 1);
        return this.buildFrom(e, r);
      },
    },
    ct = function (t) {
      return t.replace(/ +$/, "");
    },
    ht = {
      text: function () {
        var t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          e = arguments.length > 1 ? arguments[1] : void 0,
          r = arguments.length > 2 ? arguments[2] : void 0;
        "string" == typeof t &&
          (t =
            "normal" === t
              ? {
                  whitespace: !0,
                  unicode: !0,
                  lowercase: !0,
                  punctuation: !0,
                  acronyms: !0,
                  abbreviations: !0,
                  implicit: !0,
                  normal: !0,
                }
              : "clean" === t
              ? {
                  titlecase: !1,
                  lowercase: !0,
                  punctuation: !0,
                  whitespace: !0,
                  unicode: !0,
                  implicit: !0,
                  normal: !0,
                }
              : "reduced" === t
              ? {
                  punctuation: !1,
                  titlecase: !1,
                  lowercase: !0,
                  whitespace: !0,
                  unicode: !0,
                  implicit: !0,
                  reduced: !0,
                }
              : "implicit" === t
              ? { punctuation: !0, implicit: !0, whitespace: !0, trim: !0 }
              : "root" === t
              ? {
                  titlecase: !1,
                  lowercase: !0,
                  punctuation: !0,
                  whitespace: !0,
                  unicode: !0,
                  implicit: !0,
                  root: !0,
                }
              : {});
        var n = this.terms(),
          i = !1;
        n[0] && null === n[0].prev && null === n[n.length - 1].next && (i = !0);
        var o = n.reduce(function (o, s, a) {
          if (0 === a && "" === s.text && null !== s.implicit && !t.implicit)
            return o;
          t.last = r && a === n.length - 1;
          var u = !0,
            c = !0;
          return (
            !1 === i &&
              (0 === a && e && (u = !1), a === n.length - 1 && r && (c = !1)),
            o + s.textOut(t, u, c)
          );
        }, "");
        return !0 === i && r && (o = ct(o)), !0 === t.trim && (o = o.trim()), o;
      },
    },
    lt = {
      trim: function () {
        var t = this.terms();
        if (t.length > 0) {
          t[0].pre = t[0].pre.replace(/^\s+/, "");
          var e = t[t.length - 1];
          e.post = e.post.replace(/\s+$/, "");
        }
        return this;
      },
    },
    ft = /[.?!]\s*$/,
    pt = function (t, e) {
      e[0].pre = t[0].pre;
      var r,
        n,
        i = t[t.length - 1],
        o = e[e.length - 1];
      (o.post =
        ((r = i.post), (n = o.post), ft.test(n) ? n + r.match(/\s*$/) : r)),
        (i.post = ""),
        "" === i.post && (i.post += " ");
    },
    vt = function (t, e, r) {
      var n = t.terms(),
        i = e.terms();
      pt(n, i),
        (function (t, e, r) {
          var n = t[t.length - 1],
            i = e[e.length - 1],
            o = n.next;
          (n.next = e[0].id), (i.next = o), o && (r.get(o).prev = i.id);
          var s = t[0].id;
          s && (e[0].prev = s);
        })(n, i, t.pool);
      var o,
        s = [t],
        a = t.start,
        u = [r];
      return (
        (u = u.concat(r.parents())).forEach(function (t) {
          var e = t.list.filter(function (t) {
            return t.hasId(a);
          });
          s = s.concat(e);
        }),
        (s = (o = s).filter(function (t, e) {
          return o.indexOf(t) === e;
        })).forEach(function (t) {
          t.length += e.length;
        }),
        (t.cache = {}),
        t
      );
    },
    dt = / /,
    mt = function (t, e, r) {
      var n = t.start,
        i = e.terms();
      !(function (t) {
        var e = t[t.length - 1];
        !1 === dt.test(e.post) && (e.post += " ");
      })(i),
        (function (t, e, r) {
          var n = r[r.length - 1];
          n.next = t.start;
          var i = t.pool,
            o = i.get(t.start);
          o.prev && (i.get(o.prev).next = e.start),
            (r[0].prev = t.terms(0).prev),
            (t.terms(0).prev = n.id);
        })(t, e, i);
      var o,
        s = [t],
        a = [r];
      return (
        (a = a.concat(r.parents())).forEach(function (t) {
          var r = t.list.filter(function (t) {
            return t.hasId(n) || t.hasId(e.start);
          });
          s = s.concat(r);
        }),
        (s = (o = s).filter(function (t, e) {
          return o.indexOf(t) === e;
        })).forEach(function (t) {
          (t.length += e.length),
            t.start === n && (t.start = e.start),
            (t.cache = {});
        }),
        t
      );
    },
    gt = function (t, e) {
      var r = e.pool(),
        n = t.terms(),
        i = r.get(n[0].prev) || {},
        o = r.get(n[n.length - 1].next) || {};
      n[0].implicit && i.implicit && (i.set(i.implicit), (i.post += " ")),
        (function (t, e, r, n) {
          var i = t.parents();
          i.push(t),
            i.forEach(function (t) {
              var i = t.list.find(function (t) {
                return t.hasId(e);
              });
              i &&
                ((i.length -= r),
                i.start === e && (i.start = n.id),
                (i.cache = {}));
            }),
            (t.list = t.list.filter(function (t) {
              return !(!t.start || !t.length);
            }));
        })(e, t.start, t.length, o),
        i && (i.next = o.id),
        o && (o.prev = i.id);
    },
    bt = {
      append: function (t, e) {
        return vt(this, t, e), this;
      },
      prepend: function (t, e) {
        return mt(this, t, e), this;
      },
      delete: function (t) {
        return gt(this, t), this;
      },
      replace: function (t, e) {
        var r = this.length;
        vt(this, t, e);
        var n = this.buildFrom(this.start, this.length);
        (n.length = r), gt(n, e);
      },
      splitOn: function (t) {
        var e = this.terms(),
          r = { before: null, match: null, after: null },
          n = e.findIndex(function (e) {
            return e.id === t.start;
          });
        if (-1 === n) return r;
        var i = e.slice(0, n);
        i.length > 0 && (r.before = this.buildFrom(i[0].id, i.length));
        var o = e.slice(n, n + t.length);
        o.length > 0 && (r.match = this.buildFrom(o[0].id, o.length));
        var s = e.slice(n + t.length, e.length);
        return (
          s.length > 0 &&
            (r.after = this.buildFrom(s[0].id, s.length, this.pool)),
          r
        );
      },
    },
    yt = {
      json: function () {
        var t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
          e = arguments.length > 1 ? arguments[1] : void 0,
          r = {};
        return (
          t.text && (r.text = this.text()),
          t.normal && (r.normal = this.text("normal")),
          t.clean && (r.clean = this.text("clean")),
          t.reduced && (r.reduced = this.text("reduced")),
          t.implicit && (r.implicit = this.text("implicit")),
          t.root && (r.root = this.text("root")),
          t.trim &&
            (r.text && (r.text = r.text.trim()),
            r.normal && (r.normal = r.normal.trim()),
            r.reduced && (r.reduced = r.reduced.trim())),
          t.terms &&
            (!0 === t.terms && (t.terms = {}),
            (r.terms = this.terms().map(function (r) {
              return r.json(t.terms, e);
            }))),
          r
        );
      },
    },
    At = {
      lookAhead: function (t) {
        t || (t = ".*");
        var e = this.pool,
          r = [],
          n = this.terms();
        return (
          (function t(n) {
            var i = e.get(n);
            i && (r.push(i), i.prev && t(i.next));
          })(n[n.length - 1].next),
          0 === r.length ? [] : this.buildFrom(r[0].id, r.length).match(t)
        );
      },
      lookBehind: function (t) {
        t || (t = ".*");
        var e = this.pool,
          r = [];
        return (
          (function t(n) {
            var i = e.get(n);
            i && (r.push(i), i.prev && t(i.prev));
          })(e.get(this.start).prev),
          0 === r.length
            ? []
            : this.buildFrom(r[r.length - 1].id, r.length).match(t)
        );
      },
    },
    wt = Object.assign({}, ut, ht, lt, bt, yt, At),
    xt = function (t, e) {
      if (0 === e.length) return !0;
      for (var r = 0; r < e.length; r += 1) {
        var n = e[r];
        if (!0 !== n.optional && !0 !== n.negative && !0 === n.start && r > 0)
          return !0;
        if (!0 === n.anything && !0 === n.negative) return !0;
      }
      return !1;
    },
    Pt = T(function (t, e) {
      (e.getGreedy = function (t, e) {
        for (
          var r = Object.assign({}, t.regs[t.r], { start: !1, end: !1 }),
            n = t.t;
          t.t < t.terms.length;
          t.t += 1
        ) {
          if (e && t.terms[t.t].doesMatch(e, t.start_i + t.t, t.phrase_length))
            return t.t;
          var i = t.t - n + 1;
          if (void 0 !== r.max && i === r.max) return t.t;
          if (
            !1 === t.terms[t.t].doesMatch(r, t.start_i + t.t, t.phrase_length)
          )
            return void 0 !== r.min && i < r.min ? null : t.t;
        }
        return t.t;
      }),
        (e.greedyTo = function (t, e) {
          var r = t.t;
          if (!e) return t.terms.length;
          for (; r < t.terms.length; r += 1)
            if (!0 === t.terms[r].doesMatch(e, t.start_i + r, t.phrase_length))
              return r;
          return null;
        }),
        (e.isEndGreedy = function (t, e) {
          if (
            !0 === t.end &&
            !0 === t.greedy &&
            e.start_i + e.t < e.phrase_length - 1
          ) {
            var r = Object.assign({}, t, { end: !1 });
            if (
              !0 === e.terms[e.t].doesMatch(r, e.start_i + e.t, e.phrase_length)
            )
              return !0;
          }
          return !1;
        }),
        (e.doOrBlock = function (t) {
          for (
            var r =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : 0,
              n = t.regs[t.r],
              i = !1,
              o = 0;
            o < n.choices.length;
            o += 1
          ) {
            var s = n.choices[o];
            if (
              (i = s.every(function (e, n) {
                var i = 0,
                  o = t.t + n + r + i;
                if (void 0 === t.terms[o]) return !1;
                var s = t.terms[o].doesMatch(e, o + t.start_i, t.phrase_length);
                if (!0 === s && !0 === e.greedy)
                  for (var a = 1; a < t.terms.length; a += 1) {
                    var u = t.terms[o + a];
                    if (u) {
                      if (!0 !== u.doesMatch(e, t.start_i + a, t.phrase_length))
                        break;
                      i += 1;
                    }
                  }
                return (r += i), s;
              }))
            ) {
              r += s.length;
              break;
            }
          }
          return i && !0 === n.greedy ? e.doOrBlock(t, r) : r;
        }),
        (e.doAndBlock = function (t) {
          var e = 0;
          return (
            !0 ===
              t.regs[t.r].choices.every(function (r) {
                var n = r.every(function (e, r) {
                  var n = t.t + r;
                  return (
                    void 0 !== t.terms[n] &&
                    t.terms[n].doesMatch(e, n, t.phrase_length)
                  );
                });
                return !0 === n && r.length > e && (e = r.length), n;
              }) && e
          );
        }),
        (e.getGroup = function (t, e, r) {
          if (t.groups[t.groupId]) return t.groups[t.groupId];
          var n = t.terms[e].id;
          return (
            (t.groups[t.groupId] = { group: String(r), start: n, length: 0 }),
            t.groups[t.groupId]
          );
        });
    }),
    jt = function (t, e, r, n) {
      for (
        var i = {
          t: 0,
          terms: t,
          r: 0,
          regs: e,
          groups: {},
          start_i: r,
          phrase_length: n,
          hasGroup: !1,
          groupId: null,
          previousGroup: null,
        };
        i.r < e.length;
        i.r += 1
      ) {
        var o = e[i.r];
        if (
          ((i.hasGroup =
            "string" == typeof o.named || "number" == typeof o.named),
          !0 === i.hasGroup)
        ) {
          var s = e[i.r - 1];
          s && s.named === o.named && i.previousGroup
            ? (i.groupId = i.previousGroup)
            : ((i.groupId = h(o.named)), (i.previousGroup = i.groupId));
        }
        if (!i.terms[i.t]) {
          if (
            !1 ===
            e.slice(i.r).some(function (t) {
              return !t.optional;
            })
          )
            break;
          return null;
        }
        if (!0 !== o.anything || !0 !== o.greedy) {
          if (void 0 !== o.choices && "or" === o.operator) {
            var a = Pt.doOrBlock(i);
            if (a) {
              if (!0 === o.negative) return null;
              if (!0 === i.hasGroup) Pt.getGroup(i, i.t, o.named).length += a;
              i.t += a;
              continue;
            }
            if (!o.optional) return null;
          }
          if (void 0 !== o.choices && "and" === o.operator) {
            var u = Pt.doAndBlock(i);
            if (u) {
              if (!0 === o.negative) return null;
              if (!0 === i.hasGroup) Pt.getGroup(i, i.t, o.named).length += u;
              i.t += u;
              continue;
            }
            if (!o.optional) return null;
          }
          var c = i.terms[i.t],
            l = c.doesMatch(o, i.start_i + i.t, i.phrase_length);
          if (!0 === o.anything || !0 === l || Pt.isEndGreedy(o, i)) {
            var f = i.t;
            if (o.optional && e[i.r + 1] && o.negative) continue;
            if (o.optional && e[i.r + 1]) {
              var p = c.doesMatch(e[i.r + 1], i.start_i + i.t, i.phrase_length);
              if (o.negative || p) {
                var v = i.terms[i.t + 1];
                (v &&
                  v.doesMatch(e[i.r + 1], i.start_i + i.t, i.phrase_length)) ||
                  (i.r += 1);
              }
            }
            if (
              ((i.t += 1),
              !0 === o.end && i.t !== i.terms.length && !0 !== o.greedy)
            )
              return null;
            if (!0 === o.greedy) {
              if (((i.t = Pt.getGreedy(i, e[i.r + 1])), null === i.t))
                return null;
              if (o.min && o.min > i.t) return null;
              if (!0 === o.end && i.start_i + i.t !== n) return null;
            }
            if (!0 === i.hasGroup) {
              var d = Pt.getGroup(i, f, o.named);
              i.t > 1 && o.greedy ? (d.length += i.t - f) : d.length++;
            }
          } else {
            if (o.negative) {
              var m = Object.assign({}, o);
              if (
                ((m.negative = !1),
                !0 ===
                  i.terms[i.t].doesMatch(m, i.start_i + i.t, i.phrase_length))
              )
                return null;
            }
            if (!0 !== o.optional) {
              if (i.terms[i.t].isImplicit() && e[i.r - 1] && i.terms[i.t + 1]) {
                if (
                  i.terms[i.t - 1] &&
                  i.terms[i.t - 1].implicit === e[i.r - 1].word
                )
                  return null;
                if (
                  i.terms[i.t + 1].doesMatch(
                    o,
                    i.start_i + i.t,
                    i.phrase_length
                  )
                ) {
                  i.t += 2;
                  continue;
                }
              }
              return null;
            }
          }
        } else {
          var g = Pt.greedyTo(i, e[i.r + 1]);
          if (void 0 !== o.min && g - i.t < o.min) return null;
          if (void 0 !== o.max && g - i.t > o.max) {
            i.t = i.t + o.max;
            continue;
          }
          if (null === g) return null;
          !0 === i.hasGroup && (Pt.getGroup(i, i.t, o.named).length = g - i.t),
            (i.t = g);
        }
      }
      return { match: i.terms.slice(0, i.t), groups: i.groups };
    },
    Et = function (t, e, r) {
      if (!r || 0 === r.length) return r;
      if (
        e.some(function (t) {
          return t.end;
        })
      ) {
        var n = t[t.length - 1];
        r = r.filter(function (t) {
          return -1 !== t.match.indexOf(n);
        });
      }
      return r;
    },
    Ot = /(?:^|\s)([\!\[\^]*(?:<[^<]*>)?\/.*?[^\\\/]\/[\?\]\+\*\$~]*)(?:\s|$)/g,
    kt = /(?:^|\s)([\!\[\^]*(?:<[^<]*>)?\(.*?[^\\\)]\)[\?\]\+\*\$~]*)(?:\s|$)/g,
    Ct = / /g,
    Ft = function (t) {
      return (t = (t = t.map(function (t) {
        return t.trim();
      })).filter(function (t) {
        return t;
      }));
    },
    Tt = function (t) {
      var e = t.split(Ot),
        r = [];
      e.forEach(function (t) {
        r = r.concat(t.split(kt));
      }),
        (r = Ft(r));
      var n = [];
      return (
        r.forEach(function (t) {
          !(function (t) {
            return (
              /^[\!\[\^]*(<[^<]*>)?\(/.test(t) && /\)[\?\]\+\*\$~]*$/.test(t)
            );
          })(t) &&
          !(function (t) {
            return (
              /^[\!\[\^]*(<[^<]*>)?\//.test(t) && /\/[\?\]\+\*\$~]*$/.test(t)
            );
          })(t)
            ? (n = n.concat(t.split(Ct)))
            : n.push(t);
        }),
        (n = Ft(n))
      );
    },
    Nt = /\{([0-9]+,?[0-9]*)\}/,
    $t = /&&/,
    Vt = new RegExp(/^< *?(\S+) *?>/),
    Bt = function (t) {
      return t[t.length - 1];
    },
    It = function (t) {
      return t[0];
    },
    St = function (t) {
      return t.substr(1);
    },
    zt = function (t) {
      return t.substr(0, t.length - 1);
    },
    Dt = function (t) {
      return (t = St(t)), (t = zt(t));
    },
    _t = function t(e) {
      for (var r, n = {}, i = 0; i < 2; i += 1) {
        if (
          ("$" === Bt(e) && ((n.end = !0), (e = zt(e))),
          "^" === It(e) && ((n.start = !0), (e = St(e))),
          ("[" === It(e) || "]" === Bt(e)) &&
            ((n.named = !0),
            "[" === It(e)
              ? (n.groupType = "]" === Bt(e) ? "single" : "start")
              : (n.groupType = "end"),
            (e = (e = e.replace(/^\[/, "")).replace(/\]$/, "")),
            "<" === It(e)))
        ) {
          var o = Vt.exec(e);
          o.length >= 2 && ((n.named = o[1]), (e = e.replace(o[0], "")));
        }
        if (
          ("+" === Bt(e) && ((n.greedy = !0), (e = zt(e))),
          "*" !== e &&
            "*" === Bt(e) &&
            "\\*" !== e &&
            ((n.greedy = !0), (e = zt(e))),
          "?" === Bt(e) && ((n.optional = !0), (e = zt(e))),
          "!" === It(e) && ((n.negative = !0), (e = St(e))),
          "(" === It(e) && ")" === Bt(e))
        ) {
          $t.test(e)
            ? ((n.choices = e.split($t)), (n.operator = "and"))
            : ((n.choices = e.split("|")), (n.operator = "or")),
            (n.choices[0] = St(n.choices[0]));
          var s = n.choices.length - 1;
          (n.choices[s] = zt(n.choices[s])),
            (n.choices = n.choices.map(function (t) {
              return t.trim();
            })),
            (n.choices = n.choices.filter(function (t) {
              return t;
            })),
            (n.choices = n.choices.map(function (e) {
              return e.split(/ /g).map(t);
            })),
            (e = "");
        }
        if ("/" === It(e) && "/" === Bt(e))
          return (e = Dt(e)), (n.regex = new RegExp(e)), n;
        if ("~" === It(e) && "~" === Bt(e))
          return (e = Dt(e)), (n.soft = !0), (n.word = e), n;
      }
      return (
        !0 === Nt.test(e) &&
          (e = e.replace(Nt, function (t, e) {
            var r = e.split(/,/g);
            return (
              1 === r.length
                ? ((n.min = Number(r[0])), (n.max = Number(r[0])))
                : ((n.min = Number(r[0])), (n.max = Number(r[1] || 999))),
              (n.greedy = !0),
              (n.optional = !0),
              ""
            );
          })),
        "#" === It(e)
          ? ((n.tag = St(e)),
            (n.tag = (r = n.tag).charAt(0).toUpperCase() + r.substr(1)),
            n)
          : "@" === It(e)
          ? ((n.method = St(e)), n)
          : "." === e
          ? ((n.anything = !0), n)
          : "*" === e
          ? ((n.anything = !0), (n.greedy = !0), (n.optional = !0), n)
          : (e &&
              ((e = (e = e.replace("\\*", "*")).replace("\\.", ".")),
              (n.word = e.toLowerCase())),
            n)
      );
    },
    Mt = function (t) {
      for (var e, r = !1, n = -1, i = 0; i < t.length; i++) {
        var o = t[i];
        "single" !== o.groupType || !0 !== o.named
          ? ("start" === o.groupType &&
              ((r = !0),
              (e =
                "string" == typeof o.named || "number" == typeof o.named
                  ? o.named
                  : (n += 1))),
            r && (o.named = e),
            "end" === o.groupType && (r = !1))
          : ((n += 1), (o.named = n));
      }
      return t;
    },
    Gt = function (t) {
      return t.map(function (t) {
        if (
          void 0 !== t.choices &&
          !0 ===
            t.choices.every(function (t) {
              if (1 !== t.length) return !1;
              var e = t[0];
              return (
                void 0 !== e.word &&
                !0 !== e.negative &&
                !0 !== e.optional &&
                !0 !== e.method
              );
            })
        ) {
          var e = {};
          t.choices.forEach(function (t) {
            e[t[0].word] = !0;
          }),
            (t.fastOr = e),
            delete t.choices;
        }
        return t;
      });
    },
    qt = function (t) {
      var e =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        r = t.filter(function (t) {
          return t.groupType;
        }).length;
      return r > 0 && (t = Mt(t)), e.fuzzy || (t = Gt(t)), t;
    },
    Lt = function (t) {
      return "[object Array]" === Object.prototype.toString.call(t);
    },
    Wt = function (t) {
      return [
        {
          choices: t.map(function (t) {
            return [{ word: t }];
          }),
          operator: "or",
        },
      ];
    },
    Ut = function (t) {
      if (!t || !t.list || !t.list[0]) return [];
      var e = [];
      return (
        t.list.forEach(function (t) {
          var r = [];
          t.terms().forEach(function (t) {
            r.push(t.id);
          }),
            e.push(r);
        }),
        [{ idBlocks: e }]
      );
    },
    Rt = function (t, e) {
      return (
        !0 === e.fuzzy && (e.fuzzy = 0.85),
        "number" == typeof e.fuzzy &&
          (t = t.map(function (t) {
            return (
              e.fuzzy > 0 && t.word && (t.fuzzy = e.fuzzy),
              t.choices &&
                t.choices.forEach(function (t) {
                  t.forEach(function (t) {
                    t.fuzzy = e.fuzzy;
                  });
                }),
              t
            );
          })),
        t
      );
    },
    Ht = function (e) {
      var r =
        arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
      if (null == e || "" === e) return [];
      if ("object" === t(e)) {
        if (Lt(e)) {
          if (0 === e.length || !e[0]) return [];
          if ("object" === t(e[0])) return e;
          if ("string" == typeof e[0]) return Wt(e);
        }
        return e && "Doc" === e.isA ? Ut(e) : [];
      }
      "number" == typeof e && (e = String(e));
      var n = Tt(e);
      return (
        (n = n.map(function (t) {
          return _t(t);
        })),
        (n = qt(n, r)),
        (n = Rt(n, r))
      );
    },
    Qt = function (t, e) {
      for (
        var r = [],
          n = e[0].idBlocks,
          i = function (e) {
            n.forEach(function (n) {
              0 !== n.length
                ? n.every(function (r, n) {
                    return (o = e), t[e + n].id === r;
                  }) &&
                  (r.push({ match: t.slice(e, e + n.length) }),
                  (e += n.length - 1))
                : (o = e);
            }),
              (o = e);
          },
          o = 0;
        o < t.length;
        o += 1
      )
        i(o);
      return r;
    },
    Zt = function (t, e) {
      var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
      if (("string" == typeof e && (e = Ht(e)), !0 === xt(t, e))) return [];
      var n = e.filter(function (t) {
          return !0 !== t.optional && !0 !== t.negative;
        }).length,
        i = t.terms(),
        o = [];
      if (e[0].idBlocks) {
        var s = Qt(i, e);
        if (s && s.length > 0) return Et(i, e, s);
      }
      if (!0 === e[0].start) {
        var a = jt(i, e, 0, i.length);
        return (
          a &&
            a.match &&
            a.match.length > 0 &&
            ((a.match = a.match.filter(function (t) {
              return t;
            })),
            o.push(a)),
          Et(i, e, o)
        );
      }
      for (var u = 0; u < i.length && !(u + n > i.length); u += 1) {
        var c = jt(i.slice(u), e, u, i.length);
        if (
          c &&
          c.match &&
          c.match.length > 0 &&
          ((u += c.match.length - 1),
          (c.match = c.match.filter(function (t) {
            return t;
          })),
          o.push(c),
          !0 === r)
        )
          return Et(i, e, o);
      }
      return Et(i, e, o);
    },
    Jt = function (t, e) {
      var r = {};
      Zt(t, e).forEach(function (t) {
        t.match.forEach(function (t) {
          r[t.id] = !0;
        });
      });
      var n = t.terms(),
        i = [],
        o = [];
      return (
        n.forEach(function (t) {
          !0 !== r[t.id] ? o.push(t) : o.length > 0 && (i.push(o), (o = []));
        }),
        o.length > 0 && i.push(o),
        i
      );
    },
    Yt = {
      match: function (t) {
        var e = this,
          r = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
          n = Zt(this, t, r);
        return (n = n.map(function (t) {
          var r = t.match,
            n = t.groups,
            i = e.buildFrom(r[0].id, r.length, n);
          return (i.cache.terms = r), i;
        }));
      },
      has: function (t) {
        return Zt(this, t, !0).length > 0;
      },
      not: function (t) {
        var e = this,
          r = Jt(this, t);
        return (r = r.map(function (t) {
          return e.buildFrom(t[0].id, t.length);
        }));
      },
      canBe: function (t, e) {
        for (
          var r = this, n = [], i = this.terms(), o = !1, s = 0;
          s < i.length;
          s += 1
        ) {
          var a = i[s].canBe(t, e);
          !0 === a &&
            (!0 === o ? n[n.length - 1].push(i[s]) : n.push([i[s]]), (o = a));
        }
        return (n = n
          .filter(function (t) {
            return t.length > 0;
          })
          .map(function (t) {
            return r.buildFrom(t[0].id, t.length);
          }));
      },
    },
    Kt = function t(r, n, i) {
      e(this, t),
        (this.start = r),
        (this.length = n),
        (this.isA = "Phrase"),
        Object.defineProperty(this, "pool", {
          enumerable: !1,
          writable: !0,
          value: i,
        }),
        Object.defineProperty(this, "cache", {
          enumerable: !1,
          writable: !0,
          value: {},
        }),
        Object.defineProperty(this, "groups", {
          enumerable: !1,
          writable: !0,
          value: {},
        });
    };
  (Kt.prototype.buildFrom = function (t, e, r) {
    var n = new Kt(t, e, this.pool);
    return (
      r && Object.keys(r).length > 0
        ? (n.groups = r)
        : (n.groups = this.groups),
      n
    );
  }),
    Object.assign(Kt.prototype, Yt),
    Object.assign(Kt.prototype, wt);
  var Xt = { term: "terms" };
  Object.keys(Xt).forEach(function (t) {
    return (Kt.prototype[t] = Kt.prototype[Xt[t]]);
  });
  var te = Kt,
    ee = (function () {
      function t() {
        var r =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        e(this, t),
          Object.defineProperty(this, "words", { enumerable: !1, value: r });
      }
      return (
        n(t, [
          {
            key: "add",
            value: function (t) {
              return (this.words[t.id] = t), this;
            },
          },
          {
            key: "get",
            value: function (t) {
              return this.words[t];
            },
          },
          {
            key: "remove",
            value: function (t) {
              delete this.words[t];
            },
          },
          {
            key: "merge",
            value: function (t) {
              return Object.assign(this.words, t.words), this;
            },
          },
          {
            key: "stats",
            value: function () {
              return { words: Object.keys(this.words).length };
            },
          },
        ]),
        t
      );
    })();
  ee.prototype.clone = function () {
    var t = this,
      e = Object.keys(this.words).reduce(function (e, r) {
        var n = t.words[r].clone();
        return (e[n.id] = n), e;
      }, {});
    return new ee(e);
  };
  var re = ee,
    ne = function (t) {
      t.forEach(function (e, r) {
        r > 0 && (e.prev = t[r - 1].id), t[r + 1] && (e.next = t[r + 1].id);
      });
    },
    ie = /(\S.+?[.!?\u203D\u2E18\u203C\u2047-\u2049])(?=\s+|$)/g,
    oe = /\S/,
    se = /[ .][A-Z]\.? *$/i,
    ae = /(?:\u2026|\.{2,}) *$/,
    ue = /((?:\r?\n|\r)+)/,
    ce = /[a-z0-9\u00C0-\u00FF\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]/i,
    he = /^\s+/,
    le = function (t, e) {
      if (!0 === se.test(t)) return !1;
      if (!0 === ae.test(t)) return !1;
      if (!1 === ce.test(t)) return !1;
      var r = t
          .replace(/[.!?\u203D\u2E18\u203C\u2047-\u2049] *$/, "")
          .split(" "),
        n = r[r.length - 1].toLowerCase();
      return !e.hasOwnProperty(n);
    },
    fe = function (t, e) {
      var r = e.cache.abbreviations;
      t = t || "";
      var n = [],
        i = [];
      if (!(t = String(t)) || "string" != typeof t || !1 === oe.test(t))
        return n;
      for (
        var o = (function (t) {
            for (var e = [], r = t.split(ue), n = 0; n < r.length; n++)
              for (var i = r[n].split(ie), o = 0; o < i.length; o++)
                e.push(i[o]);
            return e;
          })((t = t.replace(" ", " "))),
          s = 0;
        s < o.length;
        s++
      ) {
        var a = o[s];
        if (void 0 !== a && "" !== a) {
          if (!1 === oe.test(a)) {
            if (i[i.length - 1]) {
              i[i.length - 1] += a;
              continue;
            }
            if (o[s + 1]) {
              o[s + 1] = a + o[s + 1];
              continue;
            }
          }
          i.push(a);
        }
      }
      for (var u = 0; u < i.length; u++) {
        var c = i[u];
        i[u + 1] && !1 === le(c, r)
          ? (i[u + 1] = c + (i[u + 1] || ""))
          : c && c.length > 0 && (n.push(c), (i[u] = ""));
      }
      if (0 === n.length) return [t];
      for (var h = 1; h < n.length; h += 1) {
        var l = n[h].match(he);
        null !== l && ((n[h - 1] += l[0]), (n[h] = n[h].replace(he, "")));
      }
      return n;
    },
    pe = /\S/,
    ve = /^[!?.]+$/,
    de = /(\S+)/,
    me = /[a-z] ?\/ ?[a-z]*$/,
    ge = [
      ".",
      "?",
      "!",
      ":",
      ";",
      "-",
      "–",
      "—",
      "--",
      "...",
      "(",
      ")",
      "[",
      "]",
      '"',
      "'",
      "`",
    ];
  ge = ge.reduce(function (t, e) {
    return (t[e] = !0), t;
  }, {});
  var be = function (t) {
      if (!0 === /^(re|un)-?[^aeiou]./.test(t)) return !1;
      if (
        !0 ===
        /^([a-z\u00C0-\u00FF`"'/]+)(-|–|—)([a-z0-9\u00C0-\u00FF].*)/i.test(t)
      )
        return !0;
      return !0 === /^([0-9]{1,4})(-|–|—)([a-z\u00C0-\u00FF`"'/-]+$)/i.test(t);
    },
    ye = function (t) {
      var e = [],
        r = t.split(/[-–—]/),
        n = "-",
        i = t.match(/[-–—]/);
      i && i[0] && (n = i);
      for (var o = 0; o < r.length; o++)
        o === r.length - 1 ? e.push(r[o]) : e.push(r[o] + n);
      return e;
    },
    Ae = function (t) {
      var e = [],
        r = [];
      if (
        ("number" == typeof (t = t || "") && (t = String(t)),
        (function (t) {
          return "[object Array]" === Object.prototype.toString.call(t);
        })(t))
      )
        return t;
      for (var n = t.split(de), i = 0; i < n.length; i++)
        !0 !== be(n[i]) ? r.push(n[i]) : (r = r.concat(ye(n[i])));
      for (var o = "", s = 0; s < r.length; s++) {
        var a = r[s];
        !0 === pe.test(a) && !1 === ge.hasOwnProperty(a) && !1 === ve.test(a)
          ? (e.length > 0 ? ((e[e.length - 1] += o), e.push(a)) : e.push(o + a),
            (o = ""))
          : (o += a);
      }
      return (
        o && (0 === e.length && (e[0] = ""), (e[e.length - 1] += o)),
        (e = (e = (function (t) {
          for (var e = 1; e < t.length - 1; e++)
            me.test(t[e]) &&
              ((t[e - 1] += t[e] + t[e + 1]), (t[e] = null), (t[e + 1] = null));
          return t;
        })(e)).filter(function (t) {
          return t;
        }))
      );
    },
    we = function (t) {
      return "[object Array]" === Object.prototype.toString.call(t);
    },
    xe = function () {
      var t =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
        e = arguments.length > 1 ? arguments[1] : void 0,
        r = arguments.length > 2 ? arguments[2] : void 0,
        n = null;
      "string" != typeof t &&
        ("number" == typeof t ? (t = String(t)) : we(t) && (n = t)),
        (n = (n = n || fe(t, e)).map(function (t) {
          return Ae(t);
        })),
        (r = r || new re());
      var i = n.map(function (t) {
        (t = t.map(function (t) {
          var e = new at(t);
          return r.add(e), e;
        })),
          ne(t);
        var e = new te(t[0].id, t.length, r);
        return (e.cache.terms = t), e;
      });
      return i;
    },
    Pe = function (t, e) {
      var r = new re();
      return t.map(function (t, n) {
        var i = t.terms.map(function (i, o) {
          var s = new at(i.text);
          return (
            (s.pre = void 0 !== i.pre ? i.pre : ""),
            void 0 === i.post &&
              ((i.post = " "),
              o >= t.terms.length - 1 &&
                ((i.post = ". "), n >= t.terms.length - 1 && (i.post = "."))),
            (s.post = void 0 !== i.post ? i.post : " "),
            i.tags &&
              i.tags.forEach(function (t) {
                return s.tag(t, "", e);
              }),
            r.add(s),
            s
          );
        });
        return ne(i), new te(i[0].id, i.length, r);
      });
    },
    je = ["Person", "Place", "Organization"],
    Ee = {
      Noun: { notA: ["Verb", "Adjective", "Adverb"] },
      Singular: { isA: "Noun", notA: "Plural" },
      ProperNoun: { isA: "Noun" },
      Person: {
        isA: ["ProperNoun", "Singular"],
        notA: ["Place", "Organization", "Date"],
      },
      FirstName: { isA: "Person" },
      MaleName: { isA: "FirstName", notA: ["FemaleName", "LastName"] },
      FemaleName: { isA: "FirstName", notA: ["MaleName", "LastName"] },
      LastName: { isA: "Person", notA: ["FirstName"] },
      NickName: { isA: "Person", notA: ["FirstName", "LastName"] },
      Honorific: { isA: "Noun", notA: ["FirstName", "LastName", "Value"] },
      Place: { isA: "Singular", notA: ["Person", "Organization"] },
      Country: { isA: ["Place", "ProperNoun"], notA: ["City"] },
      City: { isA: ["Place", "ProperNoun"], notA: ["Country"] },
      Region: { isA: ["Place", "ProperNoun"] },
      Address: { isA: "Place" },
      Organization: {
        isA: ["Singular", "ProperNoun"],
        notA: ["Person", "Place"],
      },
      SportsTeam: { isA: "Organization" },
      School: { isA: "Organization" },
      Company: { isA: "Organization" },
      Plural: { isA: "Noun", notA: ["Singular"] },
      Uncountable: { isA: "Noun" },
      Pronoun: { isA: "Noun", notA: je },
      Actor: { isA: "Noun", notA: je },
      Activity: { isA: "Noun", notA: ["Person", "Place"] },
      Unit: { isA: "Noun", notA: je },
      Demonym: { isA: ["Noun", "ProperNoun"], notA: je },
      Possessive: { isA: "Noun" },
    },
    Oe = {
      Verb: { notA: ["Noun", "Adjective", "Adverb", "Value"] },
      PresentTense: { isA: "Verb", notA: ["PastTense", "FutureTense"] },
      Infinitive: { isA: "PresentTense", notA: ["PastTense", "Gerund"] },
      Imperative: { isA: "Infinitive" },
      Gerund: {
        isA: "PresentTense",
        notA: ["PastTense", "Copula", "FutureTense"],
      },
      PastTense: { isA: "Verb", notA: ["FutureTense"] },
      FutureTense: { isA: "Verb" },
      Copula: { isA: "Verb" },
      Modal: { isA: "Verb", notA: ["Infinitive"] },
      PerfectTense: { isA: "Verb", notA: "Gerund" },
      Pluperfect: { isA: "Verb" },
      Participle: { isA: "PastTense" },
      PhrasalVerb: { isA: "Verb" },
      Particle: { isA: "PhrasalVerb" },
      Auxiliary: { notA: ["Noun", "Adjective", "Value"] },
    },
    ke = {
      Value: { notA: ["Verb", "Adjective", "Adverb"] },
      Ordinal: { isA: "Value", notA: ["Cardinal"] },
      Cardinal: { isA: "Value", notA: ["Ordinal"] },
      Fraction: { isA: "Value", notA: ["Noun"] },
      RomanNumeral: { isA: "Cardinal", notA: ["Ordinal", "TextValue"] },
      TextValue: { isA: "Value", notA: ["NumericValue"] },
      NumericValue: { isA: "Value", notA: ["TextValue"] },
      Money: { isA: "Cardinal" },
      Percent: { isA: "Value" },
    },
    Ce = ["Noun", "Verb", "Adjective", "Adverb", "Value", "QuestionWord"],
    Fe = {
      Adjective: { notA: ["Noun", "Verb", "Adverb", "Value"] },
      Comparable: { isA: ["Adjective"] },
      Comparative: { isA: ["Adjective"] },
      Superlative: { isA: ["Adjective"], notA: ["Comparative"] },
      NumberRange: { isA: ["Contraction"] },
      Adverb: { notA: ["Noun", "Verb", "Adjective", "Value"] },
      Date: { notA: ["Verb", "Adverb", "Preposition", "Adjective"] },
      Month: { isA: ["Date", "Singular"], notA: ["Year", "WeekDay", "Time"] },
      WeekDay: { isA: ["Date", "Noun"] },
      Timezone: { isA: ["Date", "Noun"], notA: ["Adjective", "ProperNoun"] },
      Time: { isA: ["Date"], notA: ["AtMention"] },
      Determiner: { notA: Ce },
      Conjunction: { notA: Ce },
      Preposition: { notA: Ce },
      QuestionWord: { notA: ["Determiner"] },
      Currency: { isA: ["Noun"] },
      Expression: { notA: ["Noun", "Adjective", "Verb", "Adverb"] },
      Abbreviation: {},
      Url: {
        notA: [
          "HashTag",
          "PhoneNumber",
          "Verb",
          "Adjective",
          "Value",
          "AtMention",
          "Email",
        ],
      },
      PhoneNumber: {
        notA: ["HashTag", "Verb", "Adjective", "Value", "AtMention", "Email"],
      },
      HashTag: {},
      AtMention: {
        isA: ["Noun"],
        notA: ["HashTag", "Verb", "Adjective", "Value", "Email"],
      },
      Emoji: { notA: ["HashTag", "Verb", "Adjective", "Value", "AtMention"] },
      Emoticon: {
        notA: ["HashTag", "Verb", "Adjective", "Value", "AtMention"],
      },
      Email: { notA: ["HashTag", "Verb", "Adjective", "Value", "AtMention"] },
      Acronym: { notA: ["Plural", "RomanNumeral"] },
      Negative: { notA: ["Noun", "Adjective", "Value"] },
      Condition: { notA: ["Verb", "Adjective", "Noun", "Value"] },
    },
    Te = {
      Noun: "blue",
      Verb: "green",
      Negative: "green",
      Date: "red",
      Value: "red",
      Adjective: "magenta",
      Preposition: "cyan",
      Conjunction: "cyan",
      Determiner: "cyan",
      Adverb: "cyan",
    },
    Ne = function (t) {
      return (
        Object.keys(t).forEach(function (e) {
          t[e].color
            ? (t[e].color = t[e].color)
            : Te[e]
            ? (t[e].color = Te[e])
            : t[e].isA.some(function (r) {
                return !!Te[r] && ((t[e].color = Te[r]), !0);
              });
        }),
        t
      );
    },
    $e = function (t) {
      return (
        Object.keys(t).forEach(function (e) {
          for (var r = t[e], n = r.isA.length, i = 0; i < n; i++) {
            var o = r.isA[i];
            t[o] && (r.isA = r.isA.concat(t[o].isA));
          }
          r.isA = (function (t) {
            return t.filter(function (t, e, r) {
              return r.indexOf(t) === e;
            });
          })(r.isA);
        }),
        t
      );
    },
    Ve = function (t) {
      var e = Object.keys(t);
      return (
        e.forEach(function (r) {
          var n = t[r];
          (n.notA = n.notA || []),
            n.isA.forEach(function (e) {
              if (t[e] && t[e].notA) {
                var r =
                  "string" == typeof t[e].notA ? [t[e].isA] : t[e].notA || [];
                n.notA = n.notA.concat(r);
              }
            });
          for (var i = 0; i < e.length; i++) {
            var o = e[i];
            -1 !== t[o].notA.indexOf(r) && n.notA.push(o);
          }
          n.notA = (function (t) {
            return t.filter(function (t, e, r) {
              return r.indexOf(t) === e;
            });
          })(n.notA);
        }),
        t
      );
    },
    Be = function (t) {
      var e = Object.keys(t);
      return (
        e.forEach(function (r) {
          var n = t[r];
          n.lineage = [];
          for (var i = 0; i < e.length; i++)
            -1 !== t[e[i]].isA.indexOf(r) && n.lineage.push(e[i]);
        }),
        t
      );
    },
    Ie = function (t) {
      return (
        (t = (function (t) {
          return (
            Object.keys(t).forEach(function (e) {
              var r = t[e];
              (r.isA = r.isA || []),
                "string" == typeof r.isA && (r.isA = [r.isA]),
                (r.notA = r.notA || []),
                "string" == typeof r.notA && (r.notA = [r.notA]);
            }),
            t
          );
        })(t)),
        (t = $e(t)),
        (t = Ve(t)),
        (t = Ne(t)),
        (t = Be(t))
      );
    },
    Se = function (t, e) {
      Object.keys(t).forEach(function (r) {
        e[r] = t[r];
      });
    },
    ze = (function () {
      var t = {};
      return Se(Ee, t), Se(Oe, t), Se(ke, t), Se(Fe, t), (t = Ie(t));
    })(),
    De = {},
    _e = function (t) {
      return t;
    },
    Me = {
      Unit: function (t, e) {
        t[e] = ["Abbreviation", "Unit"];
      },
      Cardinal: function (t, e) {
        t[e] = ["TextValue", "Cardinal"];
      },
      TextOrdinal: function (t, e) {
        (t[e] = ["Ordinal", "TextValue"]),
          (t[e + "s"] = ["TextValue", "Fraction"]);
      },
      Singular: function (t, e, r) {
        t[e] = "Singular";
        var n = r.transforms.toPlural(e, r);
        t[n] = t[n] || "Plural";
      },
      Infinitive: function (t, e, r) {
        t[e] = "Infinitive";
        for (
          var n = r.transforms.conjugate(e, r), i = Object.keys(n), o = 0;
          o < i.length;
          o++
        ) {
          var s = n[i[o]];
          t[s] = t[s] || i[o];
        }
      },
      Comparable: function (t, e, r) {
        t[e] = "Comparable";
        for (
          var n = r.transforms.adjectives(e), i = Object.keys(n), o = 0;
          o < i.length;
          o++
        ) {
          var s = n[i[o]];
          t[s] = t[s] || i[o];
        }
      },
      PhrasalVerb: function (t, e, r) {
        t[e] = ["PhrasalVerb", "Infinitive"];
        for (
          var n = e.split(" "),
            i = r.transforms.conjugate(n[0], r),
            o = Object.keys(i),
            s = 0;
          s < o.length;
          s++
        ) {
          var a = i[o[s]] + " " + n[1];
          (t[a] = t[a] || ["PhrasalVerb", o[s]]), (r.hasCompound[i[o[s]]] = !0);
        }
      },
      Demonym: function (t, e, r) {
        t[e] = "Demonym";
        var n = r.transforms.toPlural(e, r);
        t[n] = t[n] || ["Demonym", "Plural"];
      },
    },
    Ge = function (t, e, r) {
      Object.keys(t).forEach(function (n) {
        var i = t[n];
        ("Abbreviation" !== i && "Unit" !== i) ||
          (r.cache.abbreviations[n] = !0);
        var o = n.split(" ");
        o.length > 1 && (r.hasCompound[o[0]] = !0),
          void 0 === Me[i]
            ? void 0 !== e[n]
              ? ("string" == typeof e[n] && (e[n] = [e[n]]),
                "string" == typeof i ? e[n].push(i) : (e[n] = e[n].concat(i)))
              : (e[n] = i)
            : Me[i](e, n, r);
      });
    },
    qe = function (t) {
      var e = Object.assign({}, De);
      return (
        Object.keys(De).forEach(function (r) {
          var n = De[r];
          Object.keys(n).forEach(function (t) {
            n[t] = r;
          }),
            Ge(n, e, t);
        }),
        e
      );
    },
    Le = Ge,
    We = function (t) {
      for (
        var e = t.irregulars.nouns, r = Object.keys(e), n = 0;
        n < r.length;
        n++
      ) {
        var i = r[n];
        (t.words[i] = "Singular"), (t.words[e[i]] = "Plural");
      }
      for (
        var o = t.irregulars.verbs,
          s = Object.keys(o),
          a = function (e) {
            var r = s[e];
            t.words[r] = t.words[r] || "Infinitive";
            var n = t.transforms.conjugate(r, t);
            (n = Object.assign(n, o[r])),
              Object.keys(n).forEach(function (e) {
                (t.words[n[e]] = t.words[n[e]] || e),
                  "Participle" === t.words[n[e]] && (t.words[n[e]] = e);
              });
          },
          u = 0;
        u < s.length;
        u++
      )
        a(u);
    },
    Ue = { nouns: De, verbs: De },
    Re = {
      conjugate: _e,
      adjectives: _e,
      toPlural: _e,
      toSingular: _e,
      toInfinitive: _e,
    },
    He = !1,
    Qe = (function () {
      function t() {
        e(this, t),
          Object.defineProperty(this, "words", {
            enumerable: !1,
            value: {},
            writable: !0,
          }),
          Object.defineProperty(this, "hasCompound", {
            enumerable: !1,
            value: {},
            writable: !0,
          }),
          Object.defineProperty(this, "irregulars", {
            enumerable: !1,
            value: Ue,
            writable: !0,
          }),
          Object.defineProperty(this, "tags", {
            enumerable: !1,
            value: Object.assign({}, ze),
            writable: !0,
          }),
          Object.defineProperty(this, "transforms", {
            enumerable: !1,
            value: Re,
            writable: !0,
          }),
          Object.defineProperty(this, "taggers", {
            enumerable: !1,
            value: [],
            writable: !0,
          }),
          Object.defineProperty(this, "cache", {
            enumerable: !1,
            value: { abbreviations: {} },
          }),
          (this.words = qe(this)),
          We(this);
      }
      return (
        n(t, [
          {
            key: "verbose",
            value: function (t) {
              return (He = t), this;
            },
          },
          {
            key: "isVerbose",
            value: function () {
              return He;
            },
          },
          {
            key: "addWords",
            value: function (t) {
              var e = {};
              Object.keys(t).forEach(function (r) {
                var n = t[r];
                (r = r.toLowerCase().trim()), (e[r] = n);
              }),
                Le(e, this.words, this);
            },
          },
          {
            key: "addConjugations",
            value: function (t) {
              return Object.assign(this.irregulars.verbs, t), this;
            },
          },
          {
            key: "addPlurals",
            value: function (t) {
              return Object.assign(this.irregulars.nouns, t), this;
            },
          },
          {
            key: "addTags",
            value: function (t) {
              return (
                (t = Object.assign({}, t)),
                (this.tags = Object.assign(this.tags, t)),
                (this.tags = Ie(this.tags)),
                this
              );
            },
          },
          {
            key: "postProcess",
            value: function (t) {
              return this.taggers.push(t), this;
            },
          },
          {
            key: "stats",
            value: function () {
              return {
                words: Object.keys(this.words).length,
                plurals: Object.keys(this.irregulars.nouns).length,
                conjugations: Object.keys(this.irregulars.verbs).length,
                compounds: Object.keys(this.hasCompound).length,
                postProcessors: this.taggers.length,
              };
            },
          },
        ]),
        t
      );
    })(),
    Ze = function (t) {
      return JSON.parse(JSON.stringify(t));
    };
  Qe.prototype.clone = function () {
    var t = new Qe();
    return (
      (t.words = Object.assign({}, this.words)),
      (t.hasCompound = Object.assign({}, this.hasCompound)),
      (t.irregulars = Ze(this.irregulars)),
      (t.tags = Ze(this.tags)),
      (t.transforms = this.transforms),
      (t.taggers = this.taggers),
      t
    );
  };
  var Je = Qe,
    Ye = T(function (t, e) {
      (e.all = function () {
        return this.parents()[0] || this;
      }),
        (e.parent = function () {
          return this.from ? this.from : this;
        }),
        (e.parents = function (t) {
          var e = [];
          return (
            (function t(r) {
              r.from && (e.push(r.from), t(r.from));
            })(this),
            (e = e.reverse()),
            "number" == typeof t ? e[t] : e
          );
        }),
        (e.clone = function (t) {
          var e = this.list.map(function (e) {
            return e.clone(t);
          });
          return this.buildFrom(e);
        }),
        (e.wordCount = function () {
          return this.list.reduce(function (t, e) {
            return (t += e.wordCount());
          }, 0);
        }),
        (e.wordcount = e.wordCount);
    }),
    Ke = T(function (t, e) {
      (e.first = function (t) {
        return void 0 === t ? this.get(0) : this.slice(0, t);
      }),
        (e.last = function (t) {
          if (void 0 === t) return this.get(this.list.length - 1);
          var e = this.list.length;
          return this.slice(e - t, e);
        }),
        (e.slice = function (t, e) {
          var r = this.list.slice(t, e);
          return this.buildFrom(r);
        }),
        (e.eq = function (t) {
          var e = this.list[t];
          return void 0 === e ? this.buildFrom([]) : this.buildFrom([e]);
        }),
        (e.get = e.eq),
        (e.firstTerms = function () {
          return this.match("^.");
        }),
        (e.firstTerm = e.firstTerms),
        (e.lastTerms = function () {
          return this.match(".$");
        }),
        (e.lastTerm = e.lastTerms),
        (e.termList = function (t) {
          for (var e = [], r = 0; r < this.list.length; r++)
            for (var n = this.list[r].terms(), i = 0; i < n.length; i++)
              if ((e.push(n[i]), void 0 !== t && void 0 !== e[t])) return e[t];
          return e;
        });
      (e.groups = function (t) {
        return void 0 === t
          ? (function (t) {
              for (
                var e = {},
                  r = {},
                  n = function (e) {
                    for (
                      var n = t.list[e],
                        i = Object.keys(n.groups).map(function (t) {
                          return n.groups[t];
                        }),
                        o = 0;
                      o < i.length;
                      o++
                    ) {
                      var s = i[o],
                        a = s.group,
                        u = s.start,
                        c = s.length;
                      r[a] || (r[a] = []), r[a].push(n.buildFrom(u, c));
                    }
                  },
                  i = 0;
                i < t.list.length;
                i++
              )
                n(i);
              for (var o = Object.keys(r), s = 0; s < o.length; s++) {
                var a = o[s];
                e[a] = t.buildFrom(r[a]);
              }
              return e;
            })(this)
          : ("number" == typeof t && (t = String(t)),
            (function (t, e) {
              for (
                var r = [],
                  n = function (n) {
                    var i = t.list[n],
                      o = Object.keys(i.groups);
                    (o = o.filter(function (t) {
                      return i.groups[t].group === e;
                    })).forEach(function (t) {
                      r.push(
                        i.buildFrom(i.groups[t].start, i.groups[t].length)
                      );
                    });
                  },
                  i = 0;
                i < t.list.length;
                i++
              )
                n(i);
              return t.buildFrom(r);
            })(this, t) || this.buildFrom([]));
      }),
        (e.group = e.groups),
        (e.sentences = function (t) {
          var e = [];
          return (
            this.list.forEach(function (t) {
              e.push(t.fullSentence());
            }),
            "number" == typeof t ? this.buildFrom([e[t]]) : this.buildFrom(e)
          );
        }),
        (e.sentence = e.sentences);
    }),
    Xe = function (t, e) {
      if (t._cache && !0 === t._cache.set) {
        for (
          var r =
              ((a = []),
              (u = []),
              e.forEach(function (t) {
                !0 !== t.optional &&
                  !0 !== t.negative &&
                  (void 0 !== t.tag && a.push(t.tag),
                  void 0 !== t.word && u.push(t.word));
              }),
              { tags: a, words: u }),
            n = r.words,
            i = r.tags,
            o = 0;
          o < n.length;
          o++
        )
          if (void 0 === t._cache.words[n[o]]) return !1;
        for (var s = 0; s < i.length; s++)
          if (void 0 === t._cache.tags[i[s]]) return !1;
      }
      var a, u;
      return !0;
    },
    tr = T(function (t, e) {
      (e.match = function (t) {
        var e =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        ("string" != typeof e && "number" != typeof e && null !== e) ||
          (e = { group: e });
        var r = Ht(t, e);
        if (0 === r.length) return this.buildFrom([]);
        if (!1 === Xe(this, r)) return this.buildFrom([]);
        var n = this.list.reduce(function (t, e) {
          return t.concat(e.match(r));
        }, []);
        return void 0 !== e.group && null !== e.group && "" !== e.group
          ? this.buildFrom(n).groups(e.group)
          : this.buildFrom(n);
      }),
        (e.not = function (t) {
          var e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            r = Ht(t, e);
          if (0 === r.length || !1 === Xe(this, r)) return this;
          var n = this.list.reduce(function (t, e) {
            return t.concat(e.not(r));
          }, []);
          return this.buildFrom(n);
        }),
        (e.matchOne = function (t) {
          var e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            r = Ht(t, e);
          if (!1 === Xe(this, r)) return this.buildFrom([]);
          for (var n = 0; n < this.list.length; n++) {
            var i = this.list[n].match(r, !0);
            return this.buildFrom(i);
          }
          return this.buildFrom([]);
        }),
        (e.if = function (t) {
          var e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            r = Ht(t, e);
          if (!1 === Xe(this, r)) return this.buildFrom([]);
          var n = this.list.filter(function (t) {
            return !0 === t.has(r);
          });
          return this.buildFrom(n);
        }),
        (e.ifNo = function (t) {
          var e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            r = Ht(t, e),
            n = this.list.filter(function (t) {
              return !1 === t.has(r);
            });
          return this.buildFrom(n);
        }),
        (e.has = function (t) {
          var e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            r = Ht(t, e);
          return (
            !1 !== Xe(this, r) &&
            this.list.some(function (t) {
              return !0 === t.has(r);
            })
          );
        }),
        (e.lookAhead = function (t) {
          var e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          t || (t = ".*");
          var r = Ht(t, e),
            n = [];
          return (
            this.list.forEach(function (t) {
              n = n.concat(t.lookAhead(r));
            }),
            (n = n.filter(function (t) {
              return t;
            })),
            this.buildFrom(n)
          );
        }),
        (e.lookAfter = e.lookAhead),
        (e.lookBehind = function (t) {
          var e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          t || (t = ".*");
          var r = Ht(t, e),
            n = [];
          return (
            this.list.forEach(function (t) {
              n = n.concat(t.lookBehind(r));
            }),
            (n = n.filter(function (t) {
              return t;
            })),
            this.buildFrom(n)
          );
        }),
        (e.lookBefore = e.lookBehind),
        (e.before = function (t) {
          var e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            r = Ht(t, e),
            n = this.if(r).list,
            i = n.map(function (t) {
              var e = t.terms().map(function (t) {
                  return t.id;
                }),
                n = t.match(r)[0],
                i = e.indexOf(n.start);
              return 0 === i || -1 === i ? null : t.buildFrom(t.start, i);
            });
          return (
            (i = i.filter(function (t) {
              return null !== t;
            })),
            this.buildFrom(i)
          );
        }),
        (e.after = function (t) {
          var e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            r = Ht(t, e),
            n = this.if(r).list,
            i = n.map(function (t) {
              var e = t.terms(),
                n = e.map(function (t) {
                  return t.id;
                }),
                i = t.match(r)[0],
                o = n.indexOf(i.start);
              if (-1 === o || !e[o + i.length]) return null;
              var s = e[o + i.length].id,
                a = t.length - o - i.length;
              return t.buildFrom(s, a);
            });
          return (
            (i = i.filter(function (t) {
              return null !== t;
            })),
            this.buildFrom(i)
          );
        }),
        (e.hasAfter = function (t) {
          var e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          return this.filter(function (r) {
            return r.lookAfter(t, e).found;
          });
        }),
        (e.hasBefore = function (t) {
          var e =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          return this.filter(function (r) {
            return r.lookBefore(t, e).found;
          });
        });
    }),
    er = function (t, e, r, n) {
      var i = [];
      "string" == typeof t && (i = t.split(" ")),
        e.list.forEach(function (o) {
          var s = o.terms();
          !0 === r &&
            (s = s.filter(function (r) {
              return r.canBe(t, e.world);
            })),
            s.forEach(function (r, o) {
              i.length > 1
                ? i[o] && "." !== i[o] && r.tag(i[o], n, e.world)
                : r.tag(t, n, e.world);
            });
        });
    },
    rr = {
      tag: function (t, e) {
        return t ? (er(t, this, !1, e), this) : this;
      },
      tagSafe: function (t, e) {
        return t ? (er(t, this, !0, e), this) : this;
      },
      unTag: function (t, e) {
        var r = this;
        return (
          this.list.forEach(function (n) {
            n.terms().forEach(function (n) {
              return n.unTag(t, e, r.world);
            });
          }),
          this
        );
      },
      canBe: function (t) {
        if (!t) return this;
        var e = this.world,
          r = this.list.reduce(function (r, n) {
            return r.concat(n.canBe(t, e));
          }, []);
        return this.buildFrom(r);
      },
    },
    nr = {
      map: function (e) {
        var r = this;
        if (!e) return this;
        var n = this.list.map(function (t, n) {
          var i = r.buildFrom([t]);
          i.from = null;
          var o = e(i, n);
          return o && o.list && o.list[0] ? o.list[0] : o;
        });
        return 0 ===
          (n = n.filter(function (t) {
            return t;
          })).length
          ? this.buildFrom(n)
          : "object" !== t(n[0]) || "Phrase" !== n[0].isA
          ? n
          : this.buildFrom(n);
      },
      forEach: function (t, e) {
        var r = this;
        return t
          ? (this.list.forEach(function (n, i) {
              var o = r.buildFrom([n]);
              !0 === e && (o.from = null), t(o, i);
            }),
            this)
          : this;
      },
      filter: function (t) {
        var e = this;
        if (!t) return this;
        var r = this.list.filter(function (r, n) {
          var i = e.buildFrom([r]);
          return (i.from = null), t(i, n);
        });
        return this.buildFrom(r);
      },
      find: function (t) {
        var e = this;
        if (!t) return this;
        var r = this.list.find(function (r, n) {
          var i = e.buildFrom([r]);
          return (i.from = null), t(i, n);
        });
        return r ? this.buildFrom([r]) : void 0;
      },
      some: function (t) {
        var e = this;
        return t
          ? this.list.some(function (r, n) {
              var i = e.buildFrom([r]);
              return (i.from = null), t(i, n);
            })
          : this;
      },
      random: function (t) {
        if (!this.found) return this;
        var e = Math.floor(Math.random() * this.list.length);
        if (void 0 === t) {
          var r = [this.list[e]];
          return this.buildFrom(r);
        }
        return (
          e + t > this.length && (e = (e = this.length - t) < 0 ? 0 : e),
          this.slice(e, e + t)
        );
      },
    },
    ir = function (t) {
      return t.split(/[ -]/g);
    },
    or = function (t, e, r) {
      for (
        var n = (function (t) {
            var e =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : [],
              r = {};
            return (
              t.forEach(function (t, n) {
                var i = !0;
                void 0 !== e[n] && (i = e[n]),
                  (t = (t = (t || "").toLowerCase()).replace(/[,;.!?]+$/, ""));
                var o = ir(t).map(function (t) {
                  return t.trim();
                });
                (r[o[0]] = r[o[0]] || {}),
                  1 === o.length
                    ? (r[o[0]].value = i)
                    : ((r[o[0]].more = r[o[0]].more || []),
                      r[o[0]].more.push({ rest: o.slice(1), value: i }));
              }),
              r
            );
          })(t, e),
          i = [],
          o = function (t) {
            for (
              var e = r.list[t],
                o = e.terms().map(function (t) {
                  return t.reduced;
                }),
                s = function (t) {
                  void 0 !== n[o[t]] &&
                    (void 0 !== n[o[t]].more &&
                      n[o[t]].more.forEach(function (r) {
                        void 0 !== o[t + r.rest.length] &&
                          !0 ===
                            r.rest.every(function (e, r) {
                              return e === o[t + r + 1];
                            }) &&
                          i.push({
                            id: e.terms()[t].id,
                            value: r.value,
                            length: r.rest.length + 1,
                          });
                      }),
                    void 0 !== n[o[t]].value &&
                      i.push({
                        id: e.terms()[t].id,
                        value: n[o[t]].value,
                        length: 1,
                      }));
                },
                a = 0;
              a < o.length;
              a++
            )
              s(a);
          },
          s = 0;
        s < r.list.length;
        s++
      )
        o(s);
      return i;
    },
    sr = T(function (t, e) {
      (e.lookup = function (t) {
        var e,
          r = this,
          n = [],
          i =
            (e = t) && "[object Object]" === Object.prototype.toString.call(e);
        !0 === i &&
          (t = Object.keys(t).map(function (e) {
            return n.push(t[e]), e;
          })),
          "string" == typeof t && (t = [t]),
          !0 !== this._cache.set && this.cache();
        var o = or(t, n, this),
          s = this.list[0];
        if (!0 === i) {
          var a = {};
          return (
            o.forEach(function (t) {
              (a[t.value] = a[t.value] || []),
                a[t.value].push(s.buildFrom(t.id, t.length));
            }),
            Object.keys(a).forEach(function (t) {
              a[t] = r.buildFrom(a[t]);
            }),
            a
          );
        }
        return (
          (o = o.map(function (t) {
            return s.buildFrom(t.id, t.length);
          })),
          this.buildFrom(o)
        );
      }),
        (e.lookUp = e.lookup);
    }),
    ar = {
      cache: function (t) {
        var e = this;
        t = t || {};
        var r = {},
          n = {};
        return (
          (this._cache.words = r),
          (this._cache.tags = n),
          (this._cache.set = !0),
          this.list.forEach(function (i, o) {
            (i.cache = i.cache || {}),
              i.terms().forEach(function (i) {
                (r[i.reduced] && !r.hasOwnProperty(i.reduced)) ||
                  ((r[i.reduced] = r[i.reduced] || []),
                  r[i.reduced].push(o),
                  Object.keys(i.tags).forEach(function (t) {
                    (n[t] = n[t] || []), n[t].push(o);
                  }),
                  t.root && (i.setRoot(e.world), (r[i.root] = [o])));
              });
          }),
          this
        );
      },
      uncache: function () {
        return (
          (this._cache = {}),
          this.list.forEach(function (t) {
            t.cache = {};
          }),
          this.parents().forEach(function (t) {
            (t._cache = {}),
              t.list.forEach(function (t) {
                t.cache = {};
              });
          }),
          this
        );
      },
    },
    ur = function (t) {
      return t.charAt(0).toUpperCase() + t.substr(1);
    },
    cr = {
      replaceWith: function (e) {
        var r = this,
          n =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return e
          ? (!0 === n && (n = { keepTags: !0 }),
            !1 === n && (n = { keepTags: !1 }),
            (n = n || {}),
            this.uncache(),
            this.list.forEach(function (i) {
              var o,
                s = e;
              if (
                ("function" == typeof e && (s = e(i)),
                s && "object" === t(s) && "Doc" === s.isA)
              )
                (o = s.list), r.pool().merge(s.pool());
              else {
                if ("string" != typeof s) return;
                !1 !== n.keepCase && i.terms(0).isTitleCase() && (s = ur(s)),
                  (o = xe(s, r.world, r.pool()));
                var a = r.buildFrom(o);
                a.tagger(), (o = a.list);
              }
              if (!0 === n.keepTags) {
                var u = i.json({ terms: { tags: !0 } }).terms;
                o[0].terms().forEach(function (t, e) {
                  u[e] && t.tagSafe(u[e].tags, "keptTag", r.world);
                });
              }
              i.replace(o[0], r);
            }),
            this)
          : this.delete();
      },
      replace: function (t, e, r) {
        return void 0 === e
          ? this.replaceWith(t, r)
          : (this.match(t).replaceWith(e, r), this);
      },
    },
    hr = T(function (t, e) {
      var r = function (t) {
          return t && "[object Object]" === Object.prototype.toString.call(t);
        },
        n = function (t, e) {
          var r = xe(t, e.world)[0],
            n = e.buildFrom([r]);
          return n.tagger(), (e.list = n.list), e;
        };
      (e.append = function () {
        var t = this,
          e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
        return e
          ? this.found
            ? (this.uncache(),
              this.list.forEach(function (n) {
                var i;
                r(e) && "Doc" === e.isA
                  ? (i = e.list[0].clone())
                  : "string" == typeof e && (i = xe(e, t.world, t.pool())[0]),
                  t.buildFrom([i]).tagger(),
                  n.append(i, t);
              }),
              this)
            : n(e, this)
          : this;
      }),
        (e.insertAfter = e.append),
        (e.insertAt = e.append),
        (e.prepend = function (t) {
          var e = this;
          return t
            ? this.found
              ? (this.uncache(),
                this.list.forEach(function (n) {
                  var i;
                  r(t) && "Doc" === t.isA
                    ? (i = t.list[0].clone())
                    : "string" == typeof t && (i = xe(t, e.world, e.pool())[0]),
                    e.buildFrom([i]).tagger(),
                    n.prepend(i, e);
                }),
                this)
              : n(t, this)
            : this;
        }),
        (e.insertBefore = e.prepend),
        (e.concat = function () {
          this.uncache();
          for (var t = this.list.slice(0), e = 0; e < arguments.length; e++) {
            var r = arguments[e];
            if ("string" == typeof r) {
              var n = xe(r, this.world);
              t = t.concat(n);
            } else
              "Doc" === r.isA
                ? (t = t.concat(r.list))
                : "Phrase" === r.isA && t.push(r);
          }
          return this.buildFrom(t);
        }),
        (e.delete = function (t) {
          var e = this;
          this.uncache();
          var r = this;
          return (
            t && (r = this.match(t)),
            r.list.forEach(function (t) {
              return t.delete(e);
            }),
            this
          );
        }),
        (e.remove = e.delete);
    }),
    lr = { clean: !0, reduced: !0, root: !0 },
    fr = {
      text: function (e) {
        var r = this;
        e = e || {};
        var n = !1;
        0 === this.parents().length && (n = !0),
          ("root" === e || ("object" === t(e) && e.root)) &&
            this.list.forEach(function (t) {
              t.terms().forEach(function (t) {
                null === t.root && t.setRoot(r.world);
              });
            });
        var i = this.list.reduce(function (t, i, o) {
          var s = !n && 0 === o,
            a = !n && o === r.list.length - 1;
          return t + i.text(e, s, a);
        }, "");
        return (
          (!0 !== lr[e] &&
            !0 !== e.reduced &&
            !0 !== e.clean &&
            !0 !== e.root) ||
            (i = i.trim()),
          i
        );
      },
    },
    pr = function (t, e, r) {
      var n = (function (t) {
        var e = 0,
          r = 0,
          n = {};
        return (
          t.termList().forEach(function (t) {
            (n[t.id] = {
              index: r,
              start: e + t.pre.length,
              length: t.text.length,
            }),
              (e += t.pre.length + t.text.length + t.post.length),
              (r += 1);
          }),
          n
        );
      })(t.all());
      (r.terms.index || r.index) &&
        e.forEach(function (t) {
          t.terms.forEach(function (t) {
            t.index = n[t.id].index;
          }),
            (t.index = t.terms[0].index);
        }),
        (r.terms.offset || r.offset) &&
          e.forEach(function (t) {
            t.terms.forEach(function (t) {
              t.offset = n[t.id] || {};
            }),
              (t.offset = {
                index: t.terms[0].offset.index,
                start:
                  t.terms[0].offset.start - t.text.indexOf(t.terms[0].text),
                length: t.text.length,
              });
          });
    },
    vr = T(function (t, e) {
      var r = { text: !0, terms: !0, trim: !0 },
        n = function (t) {
          return (
            (t = Object.assign({}, r, t)).unique && (t.reduced = !0),
            t.offset &&
              ((t.text = !0),
              (t.terms && !0 !== t.terms) || (t.terms = {}),
              (t.terms.offset = !0)),
            (t.index || t.terms.index) &&
              ((t.terms = !0 === t.terms ? {} : t.terms), (t.terms.id = !0)),
            t
          );
        };
      (e.json = function () {
        var t = this,
          e =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        if ("number" == typeof e && this.list[e]) return this.list[e].json(r);
        !0 === (e = n(e)).root &&
          this.list.forEach(function (e) {
            e.terms().forEach(function (e) {
              null === e.root && e.setRoot(t.world);
            });
          });
        var i = this.list.map(function (r) {
          return r.json(e, t.world);
        });
        if (
          ((e.terms.offset || e.offset || e.terms.index || e.index) &&
            pr(this, i, e),
          e.frequency || e.freq || e.count)
        ) {
          var o = {};
          this.list.forEach(function (t) {
            var e = t.text("reduced");
            (o[e] = o[e] || 0), (o[e] += 1);
          }),
            this.list.forEach(function (t, e) {
              i[e].count = o[t.text("reduced")];
            });
        }
        if (e.unique) {
          var s = {};
          i = i.filter(function (t) {
            return !0 !== s[t.reduced] && ((s[t.reduced] = !0), !0);
          });
        }
        return i;
      }),
        (e.data = e.json);
    }),
    dr = T(function (t) {
      var e = "[0m",
        r = function (t, e) {
          for (t = t.toString(); t.length < e; ) t += " ";
          return t;
        };
      var n = {
          green: "#7f9c6c",
          red: "#914045",
          blue: "#6699cc",
          magenta: "#6D5685",
          cyan: "#2D85A8",
          yellow: "#e6d7b3",
          black: "#303b50",
        },
        i = {
          green: function (t) {
            return "[32m" + t + e;
          },
          red: function (t) {
            return "[31m" + t + e;
          },
          blue: function (t) {
            return "[34m" + t + e;
          },
          magenta: function (t) {
            return "[35m" + t + e;
          },
          cyan: function (t) {
            return "[36m" + t + e;
          },
          yellow: function (t) {
            return "[33m" + t + e;
          },
          black: function (t) {
            return "[30m" + t + e;
          },
        };
      t.exports = function (t) {
        return "undefined" != typeof window && window.document
          ? ((function (t) {
              var e = t.world.tags;
              t.list.forEach(function (t) {
                console.log('\n%c"' + t.text() + '"', "color: #e6d7b3;"),
                  t.terms().forEach(function (t) {
                    var i = Object.keys(t.tags),
                      o = t.text || "-";
                    t.implicit && (o = "[" + t.implicit + "]");
                    var s = "'" + o + "'";
                    s = r(s, 8);
                    var a = i.find(function (t) {
                        return e[t] && e[t].color;
                      }),
                      u = "steelblue";
                    e[a] && ((u = e[a].color), (u = n[u])),
                      console.log(
                        "   ".concat(s, "  -  %c").concat(i.join(", ")),
                        "color: ".concat(u || "steelblue", ";")
                      );
                  });
              });
            })(t),
            t)
          : (console.log(i.blue("=====")),
            t.list.forEach(function (e) {
              console.log(i.blue("  -----")),
                e.terms().forEach(function (e) {
                  var n = Object.keys(e.tags),
                    o = e.text || "-";
                  e.implicit && (o = "[" + e.implicit + "]");
                  var s = "'" + (o = i.yellow(o)) + "'";
                  s = r(s, 18);
                  var a =
                    i.blue("  ｜ ") +
                    s +
                    "  - " +
                    (function (t, e) {
                      return (t = t.map(function (t) {
                        if (!e.tags.hasOwnProperty(t)) return t;
                        var r = e.tags[t].color || "blue";
                        return i[r](t);
                      })).join(", ");
                    })(n, t.world);
                  console.log(a);
                });
            }),
            console.log(""),
            t);
      };
    }),
    mr = function (t) {
      var e = t.json({ text: !1, terms: !1, reduced: !0 }),
        r = {};
      e.forEach(function (t) {
        r[t.reduced] || ((t.count = 0), (r[t.reduced] = t)),
          (r[t.reduced].count += 1);
      });
      var n = Object.keys(r).map(function (t) {
        return r[t];
      });
      return (
        n.sort(function (t, e) {
          return t.count > e.count ? -1 : t.count < e.count ? 1 : 0;
        }),
        n
      );
    },
    gr = {
      debug: function () {
        return dr(this), this;
      },
      out: function (t) {
        if ("text" === t) return this.text();
        if ("normal" === t) return this.text("normal");
        if ("json" === t) return this.json();
        if ("offset" === t || "offsets" === t) return this.json({ offset: !0 });
        if ("array" === t)
          return this.json({ terms: !1 })
            .map(function (t) {
              return t.text;
            })
            .filter(function (t) {
              return t;
            });
        if ("freq" === t || "frequency" === t) return mr(this);
        if ("terms" === t) {
          var e = [];
          return (
            this.json({ text: !1, terms: { text: !0 } }).forEach(function (t) {
              var r = t.terms.map(function (t) {
                return t.text;
              });
              (r = r.filter(function (t) {
                return t;
              })),
                (e = e.concat(r));
            }),
            e
          );
        }
        return "tags" === t
          ? this.list.map(function (t) {
              return t.terms().reduce(function (t, e) {
                return (t[e.clean || e.implicit] = Object.keys(e.tags)), t;
              }, {});
            })
          : "debug" === t
          ? (dr(this), this)
          : this.text();
      },
    },
    br = {
      alpha: function (t, e) {
        var r = t.text("clean"),
          n = e.text("clean");
        return r < n ? -1 : r > n ? 1 : 0;
      },
      length: function (t, e) {
        var r = t.text().trim().length,
          n = e.text().trim().length;
        return r < n ? 1 : r > n ? -1 : 0;
      },
      wordCount: function (t, e) {
        var r = t.wordCount(),
          n = e.wordCount();
        return r < n ? 1 : r > n ? -1 : 0;
      },
    };
  (br.alphabetical = br.alpha), (br.wordcount = br.wordCount);
  var yr = {
      index: !0,
      sequence: !0,
      seq: !0,
      sequential: !0,
      chron: !0,
      chronological: !0,
    },
    Ar = {
      sort: function (t) {
        return "freq" === (t = t || "alpha") ||
          "frequency" === t ||
          "topk" === t
          ? ((r = {}),
            (n = { case: !0, punctuation: !1, whitespace: !0, unicode: !0 }),
            (e = this).list.forEach(function (t) {
              var e = t.text(n);
              (r[e] = r[e] || 0), (r[e] += 1);
            }),
            e.list.sort(function (t, e) {
              var i = r[t.text(n)],
                o = r[e.text(n)];
              return i < o ? 1 : i > o ? -1 : 0;
            }),
            e)
          : yr.hasOwnProperty(t)
          ? (function (t) {
              var e = {};
              return (
                t.json({ terms: { offset: !0 } }).forEach(function (t) {
                  e[t.terms[0].id] = t.terms[0].offset.start;
                }),
                (t.list = t.list.sort(function (t, r) {
                  return e[t.start] > e[r.start]
                    ? 1
                    : e[t.start] < e[r.start]
                    ? -1
                    : 0;
                })),
                t
              );
            })(this)
          : "function" == typeof (t = br[t] || t)
          ? ((this.list = this.list.sort(t)), this)
          : this;
        var e, r, n;
      },
      reverse: function () {
        var t = [].concat(this.list);
        return (t = t.reverse()), this.buildFrom(t);
      },
      unique: function () {
        var t = [].concat(this.list),
          e = {};
        return (
          (t = t.filter(function (t) {
            var r = t.text("reduced").trim() || t.text("implicit").trim();
            return !0 !== e.hasOwnProperty(r) && ((e[r] = !0), !0);
          })),
          this.buildFrom(t)
        );
      },
    },
    wr = /[\[\]{}⟨⟩:,،、‒–—―…‹›«»‐\-;\/⁄·*\•^†‡°¡¿※№÷×ºª%‰=‱¶§~|‖¦©℗®℠™¤₳฿]/g,
    xr = /['‘’“”"′″‴]+/g,
    Pr = {
      whitespace: function (t) {
        var e = t.list.map(function (t) {
          return t.terms();
        });
        e.forEach(function (t, r) {
          t.forEach(function (n, i) {
            !0 !== n.hasDash()
              ? ((n.pre = n.pre.replace(/\s/g, "")),
                (n.post = n.post.replace(/\s/g, "")),
                (t.length - 1 !== i || e[r + 1]) &&
                  ((n.implicit && !0 === Boolean(n.text)) ||
                    (!0 !== n.hasHyphen() && (n.post += " "))))
              : (n.post = " - ");
          });
        });
      },
      punctuation: function (t) {
        t.forEach(function (t) {
          !0 === t.hasHyphen() && (t.post = " "),
            (t.pre = t.pre.replace(wr, "")),
            (t.post = t.post.replace(wr, "")),
            (t.post = t.post.replace(/\.\.\./, "")),
            !0 === /!/.test(t.post) &&
              ((t.post = t.post.replace(/!/g, "")), (t.post = "!" + t.post)),
            !0 === /\?/.test(t.post) &&
              ((t.post = t.post.replace(/[\?!]*/, "")),
              (t.post = "?" + t.post));
        });
      },
      unicode: function (t) {
        t.forEach(function (t) {
          !0 !== t.isImplicit() && (t.text = p(t.text));
        });
      },
      quotations: function (t) {
        t.forEach(function (t) {
          (t.post = t.post.replace(xr, "")), (t.pre = t.pre.replace(xr, ""));
        });
      },
      adverbs: function (t) {
        t.match("#Adverb")
          .not("(not|nary|seldom|never|barely|almost|basically|so)")
          .remove();
      },
      abbreviations: function (t) {
        t.list.forEach(function (t) {
          var e = t.terms();
          e.forEach(function (t, r) {
            !0 === t.tags.Abbreviation &&
              e[r + 1] &&
              (t.post = t.post.replace(/^\./, ""));
          });
        });
      },
    },
    jr = {
      whitespace: !0,
      unicode: !0,
      punctuation: !0,
      emoji: !0,
      acronyms: !0,
      abbreviations: !0,
      case: !1,
      contractions: !1,
      parentheses: !1,
      quotations: !1,
      adverbs: !1,
      possessives: !1,
      verbs: !1,
      nouns: !1,
      honorifics: !1,
    },
    Er = {
      light: {},
      medium: {
        case: !0,
        contractions: !0,
        parentheses: !0,
        quotations: !0,
        adverbs: !0,
      },
    };
  Er.heavy = Object.assign({}, Er.medium, {
    possessives: !0,
    verbs: !0,
    nouns: !0,
    honorifics: !0,
  });
  var Or = {
      normalize: function (t) {
        "string" == typeof (t = t || {}) && (t = Er[t] || {}),
          (t = Object.assign({}, jr, t)),
          this.uncache();
        var e = this.termList();
        return (
          t.case && this.toLowerCase(),
          t.whitespace && Pr.whitespace(this),
          t.unicode && Pr.unicode(e),
          t.punctuation && Pr.punctuation(e),
          t.emoji && this.remove("(#Emoji|#Emoticon)"),
          t.acronyms && this.acronyms().strip(),
          t.abbreviations && Pr.abbreviations(this),
          (t.contraction || t.contractions) && this.contractions().expand(),
          t.parentheses && this.parentheses().unwrap(),
          (t.quotations || t.quotes) && Pr.quotations(e),
          t.adverbs && Pr.adverbs(this),
          (t.possessive || t.possessives) && this.possessives().strip(),
          t.verbs && this.verbs().toInfinitive(),
          (t.nouns || t.plurals) && this.nouns().toSingular(),
          t.honorifics && this.remove("#Honorific"),
          this
        );
      },
    },
    kr = T(function (t, e) {
      (e.splitOn = function (t) {
        if (!t) return this.parent().splitOn(this);
        var e = Ht(t),
          r = [];
        return (
          this.list.forEach(function (t) {
            var n = t.match(e);
            if (0 !== n.length) {
              var i = t;
              n.forEach(function (t) {
                var e = i.splitOn(t);
                e.before && r.push(e.before),
                  e.match && r.push(e.match),
                  (i = e.after);
              }),
                i && r.push(i);
            } else r.push(t);
          }),
          this.buildFrom(r)
        );
      }),
        (e.splitAfter = function (t) {
          if (!t) return this.parent().splitAfter(this);
          var e = Ht(t),
            r = [];
          return (
            this.list.forEach(function (t) {
              var n = t.match(e);
              if (0 !== n.length) {
                var i = t;
                n.forEach(function (t) {
                  var e = i.splitOn(t);
                  e.before && e.match
                    ? ((e.before.length += e.match.length), r.push(e.before))
                    : e.match && r.push(e.match),
                    (i = e.after);
                }),
                  i && r.push(i);
              } else r.push(t);
            }),
            this.buildFrom(r)
          );
        }),
        (e.split = e.splitAfter),
        (e.splitBefore = function (t) {
          if (!t) return this.parent().splitBefore(this);
          var e = Ht(t),
            r = [];
          return (
            this.list.forEach(function (t) {
              var n = t.match(e);
              if (0 !== n.length) {
                var i = t;
                n.forEach(function (t) {
                  var e = i.splitOn(t);
                  e.before && r.push(e.before),
                    e.match && e.after && (e.match.length += e.after.length),
                    (i = e.match);
                }),
                  i && r.push(i);
              } else r.push(t);
            }),
            this.buildFrom(r)
          );
        }),
        (e.segment = function (t, e) {
          (t = t || {}), (e = e || { text: !0 });
          var r = this,
            n = Object.keys(t);
          return (
            n.forEach(function (t) {
              r = r.splitOn(t);
            }),
            r.list.forEach(function (e) {
              for (var r = 0; r < n.length; r += 1)
                if (e.has(n[r])) return void (e.segment = t[n[r]]);
            }),
            r.list.map(function (t) {
              var r = t.json(e);
              return (r.segment = t.segment || null), r;
            })
          );
        });
    }),
    Cr = function (t, e) {
      var r = t.world;
      return (
        t.list.forEach(function (t) {
          t.terms().forEach(function (t) {
            return t[e](r);
          });
        }),
        t
      );
    },
    Fr = {
      toLowerCase: function () {
        return Cr(this, "toLowerCase");
      },
      toUpperCase: function () {
        return Cr(this, "toUpperCase");
      },
      toTitleCase: function () {
        return Cr(this, "toTitleCase");
      },
      toCamelCase: function () {
        return (
          this.list.forEach(function (t) {
            var e = t.terms();
            e.forEach(function (t, r) {
              0 !== r && t.toTitleCase(), r !== e.length - 1 && (t.post = "");
            });
          }),
          this
        );
      },
    },
    Tr = T(function (t, e) {
      (e.pre = function (t, e) {
        return void 0 === t
          ? this.list[0].terms(0).pre
          : (this.list.forEach(function (r) {
              var n = r.terms(0);
              !0 === e ? (n.pre += t) : (n.pre = t);
            }),
            this);
      }),
        (e.post = function (t, e) {
          return void 0 === t
            ? this.list.map(function (t) {
                var e = t.terms();
                return e[e.length - 1].post;
              })
            : (this.list.forEach(function (r) {
                var n = r.terms(),
                  i = n[n.length - 1];
                !0 === e ? (i.post += t) : (i.post = t);
              }),
              this);
        }),
        (e.trim = function () {
          return (
            (this.list = this.list.map(function (t) {
              return t.trim();
            })),
            this
          );
        }),
        (e.hyphenate = function () {
          return (
            this.list.forEach(function (t) {
              var e = t.terms();
              e.forEach(function (t, r) {
                0 !== r && (t.pre = ""), e[r + 1] && (t.post = "-");
              });
            }),
            this
          );
        }),
        (e.dehyphenate = function () {
          var t = /(-|–|—)/;
          return (
            this.list.forEach(function (e) {
              e.terms().forEach(function (e) {
                t.test(e.post) && (e.post = " ");
              });
            }),
            this
          );
        }),
        (e.deHyphenate = e.dehyphenate),
        (e.toQuotations = function (t, e) {
          return (
            (t = t || '"'),
            (e = e || '"'),
            this.list.forEach(function (r) {
              var n = r.terms();
              n[0].pre = t + n[0].pre;
              var i = n[n.length - 1];
              i.post = e + i.post;
            }),
            this
          );
        }),
        (e.toQuotation = e.toQuotations),
        (e.toParentheses = function (t, e) {
          return (
            (t = t || "("),
            (e = e || ")"),
            this.list.forEach(function (r) {
              var n = r.terms();
              n[0].pre = t + n[0].pre;
              var i = n[n.length - 1];
              i.post = e + i.post;
            }),
            this
          );
        });
    }),
    Nr = {
      join: function (t) {
        this.uncache();
        for (
          var e = this.list[0], r = e.length, n = {}, i = 1;
          i < this.list.length;
          i++
        ) {
          var o = this.list[i];
          n[o.start] = !0;
          var s = e.lastTerm();
          t && (s.post += t),
            (s.next = o.start),
            (o.terms(0).prev = s.id),
            (e.length += o.length),
            (e.cache = {});
        }
        var a = e.length - r;
        return (
          this.parents().forEach(function (t) {
            t.list.forEach(function (t) {
              for (var r = t.terms(), n = 0; n < r.length; n++)
                if (r[n].id === e.start) {
                  t.length += a;
                  break;
                }
              t.cache = {};
            }),
              (t.list = t.list.filter(function (t) {
                return !0 !== n[t.start];
              }));
          }),
          this.buildFrom([e])
        );
      },
    },
    $r = /[,\)"';:\-–—\.…]/,
    Vr = function (t, e) {
      if (t.found) {
        for (var r = t.termList(), n = 0; n < r.length - 1; n++) {
          var i = r[n];
          if ($r.test(i.post)) return;
        }
        r.forEach(function (t) {
          t.implicit = t.clean;
        }),
          (r[0].text += e),
          r.slice(1).forEach(function (t) {
            t.text = "";
          });
        for (var o = 0; o < r.length - 1; o++) {
          var s = r[o];
          s.post = s.post.replace(/ /, "");
        }
      }
    },
    Br = {
      contract: function () {
        var t = this.not("@hasContraction"),
          e = t.match("(we|they|you) are");
        return (
          Vr(e, "'re"),
          (e = t.match("(he|she|they|it|we|you) will")),
          Vr(e, "'ll"),
          (e = t.match("(he|she|they|it|we) is")),
          Vr(e, "'s"),
          (e = t.match("#Person is")),
          Vr(e, "'s"),
          (e = t.match("#Person would")),
          Vr(e, "'d"),
          (e = t.match(
            "(is|was|had|would|should|could|do|does|have|has|can) not"
          )),
          Vr(e, "n't"),
          (e = t.match("(i|we|they) have")),
          Vr(e, "'ve"),
          (e = t.match("(would|should|could) have")),
          Vr(e, "'ve"),
          (e = t.match("i am")),
          Vr(e, "'m"),
          (e = t.match("going to")),
          this
        );
      },
    },
    Ir = Object.assign(
      {},
      Ye,
      Ke,
      tr,
      rr,
      nr,
      sr,
      ar,
      cr,
      hr,
      fr,
      vr,
      gr,
      Ar,
      Or,
      kr,
      Fr,
      Tr,
      Nr,
      Br
    ),
    Sr = {};
  [
    ["terms", "."],
    ["hyphenated", "@hasHyphen ."],
    ["adjectives", "#Adjective"],
    ["hashTags", "#HashTag"],
    ["emails", "#Email"],
    ["emoji", "#Emoji"],
    ["emoticons", "#Emoticon"],
    ["atMentions", "#AtMention"],
    ["urls", "#Url"],
    ["adverbs", "#Adverb"],
    ["pronouns", "#Pronoun"],
    ["conjunctions", "#Conjunction"],
    ["prepositions", "#Preposition"],
  ].forEach(function (t) {
    Sr[t[0]] = function (e) {
      var r = this.match(t[1]);
      return "number" == typeof e && (r = r.get(e)), r;
    };
  }),
    (Sr.emojis = Sr.emoji),
    (Sr.atmentions = Sr.atMentions),
    (Sr.words = Sr.terms),
    (Sr.phoneNumbers = function (t) {
      var e = this.splitAfter("@hasComma");
      return (
        (e = e.match("#PhoneNumber+")),
        "number" == typeof t && (e = e.get(t)),
        e
      );
    }),
    (Sr.money = function (t) {
      var e = this.match("#Money #Currency?");
      return "number" == typeof t && (e = e.get(t)), e;
    }),
    (Sr.places = function (t) {
      var e = this.match("(#City && @hasComma) (#Region|#Country)"),
        r = this.not(e).splitAfter("@hasComma");
      return (
        (r = r.concat(e)).sort("index"),
        (r = r.match("#Place+")),
        "number" == typeof t && (r = r.get(t)),
        r
      );
    }),
    (Sr.organizations = function (t) {
      var e = this.clauses();
      return (
        (e = e.match("#Organization+")),
        "number" == typeof t && (e = e.get(t)),
        e
      );
    }),
    (Sr.entities = function (t) {
      var e = this.clauses(),
        r = e.people();
      return (
        (r = (r = (r = r.concat(e.places())).concat(e.organizations())).not([
          "someone",
          "man",
          "woman",
          "mother",
          "brother",
          "sister",
          "father",
        ])).sort("sequence"),
        "number" == typeof t && (r = r.get(t)),
        r
      );
    }),
    (Sr.things = Sr.entities),
    (Sr.topics = Sr.entities);
  var zr = Sr,
    Dr = /^(under|over)-?/,
    _r = function (t, e, r) {
      var n = r.words,
        i = t[e].reduced + " " + t[e + 1].reduced;
      return void 0 !== n[i] && !0 === n.hasOwnProperty(i)
        ? (t[e].tag(n[i], "lexicon-two", r),
          t[e + 1].tag(n[i], "lexicon-two", r),
          1)
        : e + 2 < t.length &&
          void 0 !== n[(i += " " + t[e + 2].reduced)] &&
          !0 === n.hasOwnProperty(i)
        ? (t[e].tag(n[i], "lexicon-three", r),
          t[e + 1].tag(n[i], "lexicon-three", r),
          t[e + 2].tag(n[i], "lexicon-three", r),
          2)
        : e + 3 < t.length &&
          void 0 !== n[(i += " " + t[e + 3].reduced)] &&
          !0 === n.hasOwnProperty(i)
        ? (t[e].tag(n[i], "lexicon-four", r),
          t[e + 1].tag(n[i], "lexicon-four", r),
          t[e + 2].tag(n[i], "lexicon-four", r),
          t[e + 3].tag(n[i], "lexicon-four", r),
          3)
        : 0;
    },
    Mr = function (t, e) {
      for (var r = e.words, n = e.hasCompound, i = 0; i < t.length; i += 1) {
        var o = t[i].clean;
        if (!0 === n[o] && i + 1 < t.length) {
          var s = _r(t, i, e);
          if (s > 0) {
            i += s;
            continue;
          }
        }
        if (void 0 === r[o] || !0 !== r.hasOwnProperty(o))
          if (o === t[i].reduced || !0 !== r.hasOwnProperty(t[i].reduced)) {
            if (!0 === Dr.test(o)) {
              var a = o.replace(Dr, "");
              !0 === r.hasOwnProperty(a) &&
                t[i].tag(r[a], "noprefix-lexicon", e);
            }
          } else t[i].tag(r[t[i].reduced], "lexicon", e);
        else t[i].tag(r[o], "lexicon", e);
      }
      return t;
    },
    Gr = function (t) {
      var e = t.termList();
      return (
        Mr(e, t.world),
        t.world.taggers.forEach(function (e) {
          e(t);
        }),
        t
      );
    },
    qr = function (t) {
      var r = (function (t) {
        i(o, t);
        var r = u(o);
        function o() {
          return e(this, o), r.apply(this, arguments);
        }
        return (
          n(o, [
            {
              key: "stripPeriods",
              value: function () {
                return (
                  this.termList().forEach(function (t) {
                    !0 === t.tags.Abbreviation &&
                      t.next &&
                      (t.post = t.post.replace(/^\./, ""));
                    var e = t.text.replace(/\./, "");
                    t.set(e);
                  }),
                  this
                );
              },
            },
            {
              key: "addPeriods",
              value: function () {
                return (
                  this.termList().forEach(function (t) {
                    (t.post = t.post.replace(/^\./, "")),
                      (t.post = "." + t.post);
                  }),
                  this
                );
              },
            },
          ]),
          o
        );
      })(t);
      return (
        (r.prototype.unwrap = r.prototype.stripPeriods),
        (t.prototype.abbreviations = function (t) {
          var e = this.match("#Abbreviation");
          return (
            "number" == typeof t && (e = e.get(t)),
            new r(e.list, this, this.world)
          );
        }),
        t
      );
    },
    Lr = /\./,
    Wr = function (t) {
      var r = (function (t) {
        i(o, t);
        var r = u(o);
        function o() {
          return e(this, o), r.apply(this, arguments);
        }
        return (
          n(o, [
            {
              key: "stripPeriods",
              value: function () {
                return (
                  this.termList().forEach(function (t) {
                    var e = t.text.replace(/\./g, "");
                    t.set(e);
                  }),
                  this
                );
              },
            },
            {
              key: "addPeriods",
              value: function () {
                return (
                  this.termList().forEach(function (t) {
                    var e = t.text.replace(/\./g, "");
                    (e = e.split("").join(".")),
                      !1 === Lr.test(t.post) && (e += "."),
                      t.set(e);
                  }),
                  this
                );
              },
            },
          ]),
          o
        );
      })(t);
      return (
        (r.prototype.unwrap = r.prototype.stripPeriods),
        (r.prototype.strip = r.prototype.stripPeriods),
        (t.prototype.acronyms = function (t) {
          var e = this.match("#Acronym");
          return (
            "number" == typeof t && (e = e.get(t)),
            new r(e.list, this, this.world)
          );
        }),
        t
      );
    },
    Ur = function (t) {
      return (
        (t.prototype.clauses = function (e) {
          var r = this.if("@hasComma")
              .notIf("@hasComma @hasComma")
              .notIf("@hasComma . .? (and|or) .")
              .notIf("(#City && @hasComma) #Country")
              .notIf("(#WeekDay && @hasComma) #Date")
              .notIf("(#Date && @hasComma) #Year")
              .notIf("@hasComma (too|also)$")
              .match("@hasComma"),
            n = this.splitAfter(r),
            i = n.quotations(),
            o = (n = n.splitOn(i)).parentheses(),
            s = (n = n.splitOn(o))
              .if(
                "#Copula #Adjective #Conjunction (#Pronoun|#Determiner) #Verb"
              )
              .match("#Conjunction"),
            a = (n = n.splitBefore(s)).if("if .{2,9} then .").match("then"),
            u = (n = (n = (n = (n = (n = (n = n.splitBefore(a)).splitBefore(
              "as well as ."
            )).splitBefore("such as .")).splitBefore(
              "in addition to ."
            )).splitAfter("@hasSemicolon")).splitAfter("@hasDash")).filter(
              function (t) {
                return t.wordCount() > 5 && t.match("#Verb+").length >= 2;
              }
            );
          if (u.found) {
            var c = u.splitAfter("#Noun .* #Verb .* #Noun+");
            n = n.splitOn(c.eq(0));
          }
          return (
            "number" == typeof e && (n = n.get(e)),
            new t(n.list, this, this.world)
          );
        }),
        t
      );
    },
    Rr = function (t) {
      var r = (function (t) {
        i(o, t);
        var r = u(o);
        function o(t, n, i) {
          var s;
          return e(this, o), ((s = r.call(this, t, n, i)).contracted = null), s;
        }
        return (
          n(o, [
            {
              key: "expand",
              value: function () {
                return (
                  this.list.forEach(function (t) {
                    var e = t.terms(),
                      r = e[0].isTitleCase();
                    e.forEach(function (t, r) {
                      t.set(t.implicit || t.text),
                        (t.implicit = void 0),
                        r < e.length - 1 && "" === t.post && (t.post += " ");
                    }),
                      r && e[0].toTitleCase();
                  }),
                  this
                );
              },
            },
          ]),
          o
        );
      })(t);
      return (
        (t.prototype.contractions = function (t) {
          var e = this.match("@hasContraction+");
          return (
            "number" == typeof t && (e = e.get(t)),
            new r(e.list, this, this.world)
          );
        }),
        (t.prototype.expanded = t.prototype.isExpanded),
        (t.prototype.contracted = t.prototype.isContracted),
        t
      );
    },
    Hr = function (t) {
      var r = function (t) {
          var e = t
              .splitAfter("@hasComma")
              .splitOn("(and|or) not?")
              .not("(and|or) not?"),
            r = t.match("[.] (and|or)", 0);
          return {
            things: e,
            conjunction: t.match("(and|or) not?"),
            beforeLast: r,
            hasOxford: r.has("@hasComma"),
          };
        },
        o = (function (t) {
          i(s, t);
          var o = u(s);
          function s() {
            return e(this, s), o.apply(this, arguments);
          }
          return (
            n(s, [
              {
                key: "conjunctions",
                value: function () {
                  return this.match("(and|or)");
                },
              },
              {
                key: "parts",
                value: function () {
                  return this.splitAfter("@hasComma").splitOn("(and|or) not?");
                },
              },
              {
                key: "items",
                value: function () {
                  return r(this).things;
                },
              },
              {
                key: "add",
                value: function (t) {
                  return (
                    this.forEach(function (e) {
                      var n = r(e).beforeLast;
                      n.append(t), n.termList(0).addPunctuation(",");
                    }),
                    this
                  );
                },
              },
              {
                key: "remove",
                value: function (t) {
                  return this.items().if(t).remove();
                },
              },
              {
                key: "hasOxfordComma",
                value: function () {
                  return this.filter(function (t) {
                    return r(t).hasOxford;
                  });
                },
              },
              {
                key: "addOxfordComma",
                value: function () {
                  var t = this.items(),
                    e = t.eq(t.length - 2);
                  return (
                    e.found && !1 === e.has("@hasComma") && e.post(", "), this
                  );
                },
              },
              {
                key: "removeOxfordComma",
                value: function () {
                  var t = this.items(),
                    e = t.eq(t.length - 2);
                  return (
                    e.found && !0 === e.has("@hasComma") && e.post(" "), this
                  );
                },
              },
            ]),
            s
          );
        })(t);
      return (
        (o.prototype.things = o.prototype.items),
        (t.prototype.lists = function (t) {
          var e = this.if("@hasComma+ .? (and|or) not? ."),
            r = e
              .match(
                "(#Noun|#Adjective|#Determiner|#Article)+ #Conjunction not? (#Article|#Determiner)? #Adjective? #Noun+"
              )
              .if("#Noun"),
            n = e.match(
              "(#Adjective|#Adverb)+ #Conjunction not? #Adverb? #Adjective+"
            ),
            i = e.match("(#Verb|#Adverb)+ #Conjunction not? #Adverb? #Verb+"),
            s = r.concat(n);
          return (
            (s = (s = s.concat(i)).if("@hasComma")),
            "number" == typeof t && (s = e.get(t)),
            new o(s.list, this, this.world)
          );
        }),
        t
      );
    },
    Qr = function (t) {
      return (
        !0 === t.has("#Plural") ||
        !0 !==
          t.has(
            "(#Pronoun|#Place|#Value|#Person|#Uncountable|#Month|#WeekDay|#Holiday|#Possessive)"
          )
      );
    },
    Zr = {
      hour: "an",
      heir: "an",
      heirloom: "an",
      honest: "an",
      honour: "an",
      honor: "an",
      uber: "an",
    },
    Jr = {
      a: !0,
      e: !0,
      f: !0,
      h: !0,
      i: !0,
      l: !0,
      m: !0,
      n: !0,
      o: !0,
      r: !0,
      s: !0,
      x: !0,
    },
    Yr = [/^onc?e/i, /^u[bcfhjkqrstn][aeiou]/i, /^eul/i],
    Kr = function (t) {
      if (t.has("#Person") || t.has("#Place")) return "";
      if (t.has("#Plural")) return "the";
      var e = t.text("normal").trim();
      if (Zr.hasOwnProperty(e)) return Zr[e];
      var r = e.substr(0, 1);
      if (t.has("^@isAcronym") && Jr.hasOwnProperty(r)) return "an";
      for (var n = 0; n < Yr.length; n++) if (Yr[n].test(e)) return "a";
      return /^[aeiou]/i.test(e) ? "an" : "a";
    },
    Xr = {
      isSingular: [
        /(ax|test)is$/i,
        /(octop|vir|radi|nucle|fung|cact|stimul)us$/i,
        /(octop|vir)i$/i,
        /(rl)f$/i,
        /(alias|status)$/i,
        /(bu)s$/i,
        /(al|ad|at|er|et|ed|ad)o$/i,
        /(ti)um$/i,
        /(ti)a$/i,
        /sis$/i,
        /(?:(^f)fe|(lr)f)$/i,
        /hive$/i,
        /(^aeiouy|qu)y$/i,
        /(x|ch|ss|sh|z)$/i,
        /(matr|vert|ind|cort)(ix|ex)$/i,
        /(m|l)ouse$/i,
        /(m|l)ice$/i,
        /(antenn|formul|nebul|vertebr|vit)a$/i,
        /.sis$/i,
        /^(?!talis|.*hu)(.*)man$/i,
      ],
      isPlural: [
        /(antenn|formul|nebul|vertebr|vit)ae$/i,
        /(octop|vir|radi|nucle|fung|cact|stimul)i$/i,
        /men$/i,
        /.tia$/i,
        /(m|l)ice$/i,
      ],
    },
    tn = /s$/,
    en = function (t) {
      return (
        !Xr.isSingular.find(function (e) {
          return e.test(t);
        }) &&
        (!0 === tn.test(t) ||
          !!Xr.isPlural.find(function (e) {
            return e.test(t);
          }) ||
          null)
      );
    },
    rn = {
      he: "his",
      she: "hers",
      they: "theirs",
      we: "ours",
      i: "mine",
      you: "yours",
      her: "hers",
      their: "theirs",
      our: "ours",
      my: "mine",
      your: "yours",
    },
    nn = function (t) {
      var e = t.text("text").trim();
      return rn.hasOwnProperty(e)
        ? (t.replaceWith(rn[e], !0), void t.tag("Possessive", "toPossessive"))
        : /s$/.test(e)
        ? ((e += "'"),
          t.replaceWith(e, !0),
          void t.tag("Possessive", "toPossessive"))
        : ((e += "'s"),
          t.replaceWith(e, !0),
          void t.tag("Possessive", "toPossessive"));
    },
    on = function (t) {
      var e = { main: t };
      if (t.has("#Noun (of|by|for) .")) {
        var r = t.splitAfter("[#Noun+]", 0);
        (e.main = r.eq(0)), (e.post = r.eq(1));
      }
      return e;
    },
    sn = {
      json: function (t) {
        var e = null;
        "number" == typeof t && ((e = t), (t = null)),
          (t = t || { text: !0, normal: !0, trim: !0, terms: !0 });
        var r = [];
        return (
          this.forEach(function (e) {
            var n = e.json(t)[0];
            (n.article = Kr(e)), r.push(n);
          }),
          null !== e ? r[e] : r
        );
      },
      adjectives: function () {
        var t = this.lookAhead(
          "^(that|who|which)? (was|is|will)? be? #Adverb? #Adjective+"
        );
        return (t = (t = t.concat(
          this.lookBehind("#Adjective+ #Adverb?$")
        )).match("#Adjective")).sort("index");
      },
      isPlural: function () {
        return this.if("#Plural");
      },
      hasPlural: function () {
        return this.filter(function (t) {
          return Qr(t);
        });
      },
      toPlural: function (t) {
        var e = this,
          r = this.world.transforms.toPlural;
        return (
          this.forEach(function (n) {
            if (!n.has("#Plural") && !1 !== Qr(n)) {
              var i = on(n).main,
                o = i.text("reduced");
              if (
                (i.has("#Singular") || !0 !== en(o)) &&
                ((o = r(o, e.world)), i.replace(o).tag("#Plural"), t)
              ) {
                var s = i.lookBefore("(an|a) #Adjective?$").not("#Adjective");
                !0 === s.found && s.remove();
              }
            }
          }),
          this
        );
      },
      toSingular: function (t) {
        var e = this,
          r = this.world.transforms.toSingular;
        return (
          this.forEach(function (n) {
            if (!n.has("^#Singular+$") && !1 !== Qr(n)) {
              var i = on(n).main,
                o = i.text("reduced");
              if (
                (i.has("#Plural") || !0 === en(o)) &&
                ((o = r(o, e.world)), i.replace(o).tag("#Singular"), t)
              ) {
                var s = n,
                  a = n.lookBefore("#Adjective");
                a.found && (s = a);
                var u = Kr(s);
                s.insertBefore(u);
              }
            }
          }),
          this
        );
      },
      toPossessive: function () {
        return (
          this.forEach(function (t) {
            nn(t);
          }),
          this
        );
      },
    },
    an = function (t) {
      var r = (function (t) {
        i(n, t);
        var r = u(n);
        function n() {
          return e(this, n), r.apply(this, arguments);
        }
        return n;
      })(t);
      return (
        Object.assign(r.prototype, sn),
        (t.prototype.nouns = function (t) {
          var e =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {},
            n = this.match("(#City && @hasComma) (#Region|#Country)"),
            i = this.not(n).splitAfter("@hasComma"),
            o = (i = i.concat(n)).quotations();
          return (
            o.found && (i = i.splitOn(o.eq(0))),
            (i = i.match("#Noun+ (of|by)? the? #Noun+?")),
            !0 !== e.keep_anaphora &&
              (i = (i = (i = (i = i.not("#Pronoun")).not("(there|these)")).not(
                "(#Month|#WeekDay)"
              )).not("(my|our|your|their|her|his)")),
            (i = i.not("(of|for|by|the)$")),
            "number" == typeof t && (i = i.get(t)),
            new r(i.list, this, this.world)
          );
        }),
        t
      );
    },
    un = /\(/,
    cn = /\)/,
    hn = function (t) {
      var r = (function (t) {
        i(o, t);
        var r = u(o);
        function o() {
          return e(this, o), r.apply(this, arguments);
        }
        return (
          n(o, [
            {
              key: "unwrap",
              value: function () {
                return (
                  this.list.forEach(function (t) {
                    var e = t.terms(0);
                    e.pre = e.pre.replace(un, "");
                    var r = t.lastTerm();
                    r.post = r.post.replace(cn, "");
                  }),
                  this
                );
              },
            },
          ]),
          o
        );
      })(t);
      return (
        (t.prototype.parentheses = function (t) {
          var e = [];
          return (
            this.list.forEach(function (t) {
              for (var r = t.terms(), n = 0; n < r.length; n += 1) {
                var i = r[n];
                if (un.test(i.pre))
                  for (var o = n; o < r.length; o += 1)
                    if (cn.test(r[o].post)) {
                      var s = o - n + 1;
                      e.push(t.buildFrom(i.id, s)), (n = o);
                      break;
                    }
              }
            }),
            "number" == typeof t
              ? ((e = e[t] ? [e[t]] : []), new r(e, this, this.world))
              : new r(e, this, this.world)
          );
        }),
        t
      );
    },
    ln = function (t) {
      var r = (function (t) {
        i(o, t);
        var r = u(o);
        function o(t, n, i) {
          var s;
          return e(this, o), ((s = r.call(this, t, n, i)).contracted = null), s;
        }
        return (
          n(o, [
            {
              key: "strip",
              value: function () {
                return (
                  this.list.forEach(function (t) {
                    t.terms().forEach(function (t) {
                      var e = t.text.replace(/'s$/, "");
                      t.set(e || t.text);
                    });
                  }),
                  this
                );
              },
            },
          ]),
          o
        );
      })(t);
      return (
        (t.prototype.possessives = function (t) {
          var e = this.match("#Noun+? #Possessive");
          return (
            "number" == typeof t && (e = e.get(t)),
            new r(e.list, this, this.world)
          );
        }),
        t
      );
    },
    fn = {
      '"': '"',
      "＂": "＂",
      "'": "'",
      "“": "”",
      "‘": "’",
      "‟": "”",
      "‛": "’",
      "„": "”",
      "⹂": "”",
      "‚": "’",
      "«": "»",
      "‹": "›",
      "‵": "′",
      "‶": "″",
      "‷": "‴",
      "〝": "〞",
      "`": "´",
      "〟": "〞",
    },
    pn = RegExp("(" + Object.keys(fn).join("|") + ")"),
    vn = function (t, e) {
      var r = t.verb,
        n = r.text("reduced");
      if (r.has("#Infinitive")) return n;
      var i = null;
      return (
        r.has("#PastTense")
          ? (i = "PastTense")
          : r.has("#Gerund")
          ? (i = "Gerund")
          : r.has("#PresentTense")
          ? (i = "PresentTense")
          : r.has("#Participle")
          ? (i = "Participle")
          : r.has("#Actor") && (i = "Actor"),
        e.transforms.toInfinitive(n, e, i)
      );
    },
    dn = function (t) {
      var e = t.verb;
      if (e.has("(are|were|does)") || t.auxiliary.has("(are|were|does)"))
        return !0;
      if (e.has("(is|am|do|was)") || t.auxiliary.has("(is|am|do|was)"))
        return !1;
      var r = (function (t) {
        return t.lookBehind("#Noun+").last();
      })(e);
      return (
        !!r.has("(we|they|you)") ||
        !!r.has("#Plural") ||
        (!r.has("#Singular") && null)
      );
    },
    mn = function (t, e) {
      var r = t.verb;
      if (!t.negative.found) {
        if (t.auxiliary.found)
          return (
            t.auxiliary.eq(0).append("not"),
            void (
              t.auxiliary.has("#Modal have not") &&
              t.auxiliary.replace("have not", "not have")
            )
          );
        if (r.has("(#Copula|will|has|had|do)")) r.append("not");
        else {
          if (r.has("#PastTense")) {
            var n = vn(t, e);
            return r.replaceWith(n, !0), void r.prepend("did not");
          }
          if (r.has("#PresentTense")) {
            var i = vn(t, e);
            return (
              r.replaceWith(i, !0),
              void (dn(t) ? r.prepend("do not") : r.prepend("does not"))
            );
          }
          if (r.has("#Gerund")) {
            var o = vn(t, e);
            return r.replaceWith(o, !0), void r.prepend("not");
          }
          dn(t) ? r.prepend("does not") : r.prepend("do not");
        }
      }
    },
    gn = function (t) {
      var e = t.lookBehind(),
        r = e.nouns(null, { keep_anaphora: !0 }).last();
      return (
        r.found ||
          (r = (r = e.match("(that|this|each)").last()).tag("#Noun").nouns()),
        r
      );
    },
    bn = function (t) {
      var e = {
        adverb: t.match("#Adverb+"),
        negative: t.match("#Negative"),
        auxiliary: t.match("#Auxiliary+").not("(#Negative|#Adverb)"),
        particle: t.match("#Particle"),
        verb: t.match("#Verb+").not("(#Adverb|#Negative|#Auxiliary|#Particle)"),
        original: t,
        subject: gn(t),
      };
      if (!e.verb.found)
        return (
          Object.keys(e).forEach(function (t) {
            e[t] = e[t].not(".");
          }),
          (e.verb = t),
          e
        );
      if (e.adverb && e.adverb.found) {
        var r = e.adverb.text("reduced") + "$";
        t.has(r) && (e.adverbAfter = !0);
      }
      return e;
    },
    yn = function (t) {
      var e = !1,
        r = dn(t),
        n = t.negative.found;
      t.verb.lookBehind("(i|we) (#Adverb|#Verb)?$").found && (e = !0);
      var i = {
        PastTense: "was",
        PresentTense: "is",
        FutureTense: "will be",
        Infinitive: "is",
        Gerund: "being",
        Actor: "",
        PerfectTense: "been",
        Pluperfect: "been",
      };
      return (
        !0 === e && ((i.PresentTense = "am"), (i.Infinitive = "am")),
        r &&
          ((i.PastTense = "were"),
          (i.PresentTense = "are"),
          (i.Infinitive = "are")),
        n &&
          ((i.PastTense += " not"),
          (i.PresentTense += " not"),
          (i.FutureTense = "will not be"),
          (i.Infinitive += " not"),
          (i.PerfectTense = "not " + i.PerfectTense),
          (i.Pluperfect = "not " + i.Pluperfect),
          (i.Gerund = "not " + i.Gerund)),
        i
      );
    },
    An = function (t) {
      var e = t.verb.text();
      return {
        PastTense: e + " have",
        PresentTense: e,
        FutureTense: e,
        Infinitive: e,
      };
    },
    wn = function (t, e) {
      var r = t.verb;
      if (
        r.has("#Copula") ||
        ("be" === r.out("normal") && t.auxiliary.has("will"))
      )
        return yn(t);
      if (t.auxiliary.has("are") && r.has("#Gerund")) {
        var n = t.original.clone(),
          i = n.clone().replace("are", "were"),
          o = n.clone().replace("are", "will be"),
          s = vn(t, e);
        return {
          PastTense: i.text(),
          PresentTense: n.text(),
          FutureTense: o.text(),
          Infinitive: s,
        };
      }
      if (r.has("#Modal")) return An(t);
      var a = t.verb.termList(0).hasHyphen(),
        u = vn(t, e);
      if (!u) return {};
      var c = e.transforms.conjugate(u, e);
      if (((c.Infinitive = u), t.particle.found)) {
        var h = t.particle.text(),
          l = !0 === a ? "-" : " ";
        Object.keys(c).forEach(function (t) {
          return (c[t] += l + h);
        });
      }
      var f = t.negative.found;
      return (
        f &&
          ((c.PastTense = "did not " + c.Infinitive),
          (c.PresentTense = "does not " + c.Infinitive),
          (c.Gerund = "not " + c.Gerund)),
        c.FutureTense ||
          (c.FutureTense = f
            ? "will not " + c.Infinitive
            : "will " + c.Infinitive),
        f && (c.Infinitive = "not " + c.Infinitive),
        c
      );
    },
    xn = function (t, e) {
      if (!t.auxiliary.has("(have|had)") || !t.verb.has("#Participle")) {
        var r = wn(t, e),
          n = r.Participle || r.PastTense;
        n && t.verb.replaceWith(n, !1),
          t.auxiliary.has("am .+? being") &&
            (t.auxiliary.remove("am"),
            t.auxiliary.replace("being", "have been")),
          t.auxiliary.has("have") || t.auxiliary.append("have"),
          t.verb.tag("Participle", "toParticiple"),
          t.auxiliary.replace("can", "could"),
          t.auxiliary.replace("be have", "have been"),
          t.auxiliary.replace("not have", "have not"),
          t.auxiliary.tag("Auxiliary");
      }
    },
    Pn = function (t) {
      return (
        !!t.auxiliary.has("(could|should|would|may|can|must)") ||
        !!t.auxiliary.has("am .+? being") ||
        !!t.auxiliary.has("had .+? been")
      );
    },
    jn = function (t) {
      return (
        t.auxiliary.remove("(will|are|am|being)"),
        t.auxiliary.remove("(did|does)"),
        t.auxiliary.remove("(had|has|have)"),
        t.particle.remove(),
        t.negative.remove(),
        t
      );
    },
    En = {
      json: function (t) {
        var e = this,
          r = null;
        "number" == typeof t && ((r = t), (t = null)),
          (t = t || { text: !0, normal: !0, trim: !0, terms: !0 });
        var n = [];
        return (
          this.forEach(function (r) {
            var i = r.json(t)[0],
              o = bn(r);
            (i.parts = {}),
              Object.keys(o).forEach(function (t) {
                o[t] && "Doc" === o[t].isA
                  ? (i.parts[t] = o[t].text("normal"))
                  : (i.parts[t] = o[t]);
              }),
              (i.isNegative = r.has("#Negative")),
              (i.conjugations = wn(o, e.world)),
              n.push(i);
          }),
          null !== r ? n[r] : n
        );
      },
      adverbs: function () {
        var t = [];
        this.forEach(function (e) {
          var r = bn(e).adverb;
          r.found && (t = t.concat(r.list));
        });
        var e = this.lookBehind("#Adverb+$");
        return (
          e.found && (t = e.list.concat(t)),
          (e = this.lookAhead("^#Adverb+")).found && (t = t.concat(e.list)),
          this.buildFrom(t)
        );
      },
      isPlural: function () {
        var t = this,
          e = [];
        return (
          this.forEach(function (r) {
            var n = bn(r);
            !0 === dn(n, t.world) && e.push(r.list[0]);
          }),
          this.buildFrom(e)
        );
      },
      isSingular: function () {
        var t = this,
          e = [];
        return (
          this.forEach(function (r) {
            var n = bn(r);
            !1 === dn(n, t.world) && e.push(r.list[0]);
          }),
          this.buildFrom(e)
        );
      },
      conjugate: function () {
        var t = this,
          e = [];
        return (
          this.forEach(function (r) {
            var n = bn(r),
              i = wn(n, t.world);
            e.push(i);
          }),
          e
        );
      },
      toPastTense: function () {
        var t = this;
        return (
          this.forEach(function (e) {
            var r = bn(e);
            if (Pn(r)) xn(r, t.world);
            else if (
              !(
                e.has("#Imperative") ||
                (e.has("be") && e.lookBehind("to$").found)
              )
            )
              if (r.verb.has("#Gerund") && r.auxiliary.has("(is|will|was)"))
                e.replace("is", "was");
              else {
                var n = wn(r, t.world).PastTense;
                n && (r = jn(r)).verb.replaceWith(n, !1);
              }
          }),
          this
        );
      },
      toPresentTense: function () {
        var t = this;
        return (
          this.forEach(function (e) {
            var r = bn(e),
              n = wn(r, t.world),
              i = n.PresentTense;
            if (
              (e.lookBehind("(i|we) (#Adverb|#Verb)?$").found &&
                (i = n.Infinitive),
              i)
            ) {
              if (r.auxiliary.has("(have|had) been"))
                return (
                  r.auxiliary.replace("(have|had) been", "am being"),
                  void (n.Particle && (i = n.Particle || n.PastTense))
                );
              r.verb.replaceWith(i, !1),
                r.verb.tag("PresentTense"),
                (r = jn(r)).auxiliary.remove("#Modal");
            }
          }),
          this
        );
      },
      toFutureTense: function () {
        var t = this;
        return (
          this.forEach(function (e) {
            var r = bn(e);
            if (!Pn(r)) {
              var n = wn(r, t.world).FutureTense;
              n &&
                ((r = jn(r)).auxiliary.remove("#Modal"),
                r.verb.replaceWith(n, !1),
                r.verb.tag("FutureTense"));
            }
          }),
          this
        );
      },
      toInfinitive: function () {
        var t = this;
        return (
          this.forEach(function (e) {
            var r = bn(e),
              n = wn(r, t.world).Infinitive;
            n && (e.replaceWith(n, !1), e.tag("Infinitive"));
          }),
          this
        );
      },
      toGerund: function () {
        var t = this;
        return (
          this.forEach(function (e) {
            var r = bn(e),
              n = wn(r, t.world).Gerund;
            n && (e.replaceWith(n, !1), e.tag("Gerund"));
          }),
          this
        );
      },
      toParticiple: function () {
        var t = this;
        return (
          this.forEach(function (e) {
            var r = bn(e),
              n = !r.auxiliary.found;
            xn(r, t.world),
              n && (r.verb.prepend(r.auxiliary.text()), r.auxiliary.remove());
          }),
          this
        );
      },
      isNegative: function () {
        return this.if("#Negative");
      },
      isPositive: function () {
        return this.ifNo("#Negative");
      },
      isImperative: function () {
        return this.if("#Imperative");
      },
      toNegative: function () {
        var t = this;
        return (
          this.list.forEach(function (e) {
            var r = t.buildFrom([e]),
              n = bn(r);
            mn(n, r.world);
          }),
          this
        );
      },
      toPositive: function () {
        var t = this.match("do not #Verb");
        return t.found && t.remove("do not"), this.remove("#Negative");
      },
      subject: function () {
        var t = [];
        return (
          this.forEach(function (e) {
            var r = gn(e);
            r.list[0] && t.push(r.list[0]);
          }),
          this.buildFrom(t)
        );
      },
    },
    On = [
      qr,
      Wr,
      Ur,
      Rr,
      Hr,
      an,
      hn,
      ln,
      function (t) {
        var r = (function (t) {
          i(o, t);
          var r = u(o);
          function o() {
            return e(this, o), r.apply(this, arguments);
          }
          return (
            n(o, [
              {
                key: "unwrap",
                value: function () {
                  return this;
                },
              },
            ]),
            o
          );
        })(t);
        return (
          (t.prototype.quotations = function (t) {
            var e = [];
            return (
              this.list.forEach(function (t) {
                for (var r = t.terms(), n = 0; n < r.length; n += 1) {
                  var i = r[n];
                  if (pn.test(i.pre))
                    for (
                      var o = (i.pre.match(pn) || [])[0], s = fn[o], a = n;
                      a < r.length;
                      a += 1
                    )
                      if (-1 !== r[a].post.indexOf(s)) {
                        var u = a - n + 1;
                        e.push(t.buildFrom(i.id, u)), (n = a);
                        break;
                      }
                }
              }),
              "number" == typeof t
                ? ((e = e[t] ? [e[t]] : []), new r(e, this, this.world))
                : new r(e, this, this.world)
            );
          }),
          (t.prototype.quotes = t.prototype.quotations),
          t
        );
      },
      function (t) {
        var r = (function (t) {
          i(n, t);
          var r = u(n);
          function n() {
            return e(this, n), r.apply(this, arguments);
          }
          return n;
        })(t);
        return (
          Object.assign(r.prototype, En),
          (r.prototype.negate = r.prototype.toNegative),
          (t.prototype.verbs = function (t) {
            var e = this.match(
                "(#Adverb|#Auxiliary|#Verb|#Negative|#Particle)+"
              ),
              n = (e = (e = e.not("^#Adverb+")).not("#Adverb+$")).match(
                "(#Adverb && @hasComma) #Adverb"
              ),
              i = e.not(n).splitAfter("@hasComma"),
              o = i.match("#PastTense #Gerund");
            return (
              o.has("(been|am|#Auxiliary) #Gerund") ||
                (i = i.splitBefore(o.match("#Gerund"))),
              (i = i.concat(n)).sort("index"),
              (i = i.if("#Verb")).has("(is|was)$") &&
                (i = i.splitBefore("(is|was)$")),
              i.has("#PresentTense #Adverb #PresentTense") &&
                (i = i.splitBefore("#Adverb #PresentTense")),
              "number" == typeof t && (i = i.get(t)),
              new r(i.list, this, this.world)
            );
          }),
          t
        );
      },
      function (t) {
        var r = (function (t) {
          i(n, t);
          var r = u(n);
          function n() {
            return e(this, n), r.apply(this, arguments);
          }
          return n;
        })(t);
        return (
          (t.prototype.people = function (t) {
            var e = this.splitAfter("@hasComma");
            return (
              (e = e.match("#Person+")),
              "number" == typeof t && (e = e.get(t)),
              new r(e.list, this, this.world)
            );
          }),
          t
        );
      },
    ],
    kn = function (t) {
      return (
        Object.keys(zr).forEach(function (e) {
          return (t.prototype[e] = zr[e]);
        }),
        On.forEach(function (e) {
          return e(t);
        }),
        t
      );
    },
    Cn = { misc: Ir, selections: zr },
    Fn = (function () {
      function t(r, n, i) {
        var o = this;
        e(this, t),
          (this.list = r),
          Object.defineProperty(this, "from", {
            enumerable: !1,
            value: n,
            writable: !0,
          }),
          void 0 === i && void 0 !== n && (i = n.world),
          Object.defineProperty(this, "world", {
            enumerable: !1,
            value: i,
            writable: !0,
          }),
          Object.defineProperty(this, "_cache", {
            enumerable: !1,
            writable: !0,
            value: {},
          }),
          Object.defineProperty(this, "found", {
            get: function () {
              return o.list.length > 0;
            },
          }),
          Object.defineProperty(this, "length", {
            get: function () {
              return o.list.length;
            },
          }),
          Object.defineProperty(this, "isA", {
            get: function () {
              return "Doc";
            },
          });
      }
      return (
        n(t, [
          {
            key: "tagger",
            value: function () {
              return Gr(this);
            },
          },
          {
            key: "pool",
            value: function () {
              return this.list.length > 0
                ? this.list[0].pool
                : this.all().list[0].pool;
            },
          },
        ]),
        t
      );
    })();
  (Fn.prototype.buildFrom = function (t) {
    return (
      (t = t.map(function (t) {
        return t.clone(!0);
      })),
      new Fn(t, this, this.world)
    );
  }),
    (Fn.prototype.fromText = function (t) {
      var e = xe(t, this.world, this.pool());
      return this.buildFrom(e);
    }),
    Object.assign(Fn.prototype, Cn.misc),
    Object.assign(Fn.prototype, Cn.selections),
    kn(Fn);
  var Tn = {
    untag: "unTag",
    and: "match",
    notIf: "ifNo",
    only: "if",
    onlyIf: "if",
  };
  Object.keys(Tn).forEach(function (t) {
    return (Fn.prototype[t] = Fn.prototype[Tn[t]]);
  });
  var Nn = Fn;
  return (function t(e) {
    var r = e,
      n = function () {
        var t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
          e = arguments.length > 1 ? arguments[1] : void 0;
        e && r.addWords(e);
        var n = xe(t, r),
          i = new Nn(n, null, r);
        return i.tagger(), i;
      };
    return (
      (n.tokenize = function () {
        var t =
            arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
          e = arguments.length > 1 ? arguments[1] : void 0,
          n = r;
        e && (((n = n.clone()).words = {}), n.addWords(e));
        var i = xe(t, n),
          o = new Nn(i, null, n);
        return (e || o.world.taggers.length > 0) && Gr(o), o;
      }),
      (n.extend = function (t) {
        return t(Nn, r, this, te, at, re), this;
      }),
      (n.fromJSON = function (t) {
        var e = Pe(t, r);
        return new Nn(e, null, r);
      }),
      (n.clone = function () {
        return t(r.clone());
      }),
      (n.verbose = function () {
        var t =
          !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        return r.verbose(t), this;
      }),
      (n.world = function () {
        return r;
      }),
      (n.parseMatch = function (t, e) {
        return Ht(t, e);
      }),
      (n.version = "13.10.3"),
      (n.import = n.load),
      (n.plugin = n.extend),
      n
    );
  })(new Je());
});
