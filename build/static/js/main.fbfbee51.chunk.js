(this.webpackJsonpamcat4annotator =
  this.webpackJsonpamcat4annotator || []).push([
  [0],
  {
    262: function (e, t, n) {
      var c = {
        "./bg-BG.json": 263,
        "./ca-ES.json": 264,
        "./cs-CZ.json": 265,
        "./de-DE.json": 266,
        "./en-US.json": 176,
        "./es-ES.json": 267,
        "./et-EE.json": 268,
        "./fi-FI.json": 269,
        "./fr-FR.json": 270,
        "./he-IL.json": 271,
        "./it-IT.json": 272,
        "./ja-JP.json": 273,
        "./ko-KR.json": 274,
        "./nb-NO.json": 275,
        "./nn-NO.json": 276,
        "./pl-PL.json": 277,
        "./pt-BR.json": 278,
        "./ru-RU.json": 279,
        "./sv-SE.json": 280,
        "./tr-TR.json": 281,
        "./zh-CN.json": 282,
      };
      function a(e) {
        var t = r(e);
        return n(t);
      }
      function r(e) {
        if (!n.o(c, e)) {
          var t = new Error("Cannot find module '" + e + "'");
          throw ((t.code = "MODULE_NOT_FOUND"), t);
        }
        return c[e];
      }
      (a.keys = function () {
        return Object.keys(c);
      }),
        (a.resolve = r),
        (e.exports = a),
        (a.id = 262);
    },
    284: function (e, t, n) {
      "use strict";
      n.r(t);
      n(204);
      var c = n(0),
        a = n.n(c),
        r = n(47),
        o = n.n(r),
        i = n(95),
        s = n(14),
        l = n(12),
        u = n(10),
        j = function (e) {
          return { type: "SELECT_AMCAT_INDEX", payload: e };
        },
        d = function (e) {
          return { type: "SET_AMCAT_INDICES", payload: e };
        },
        b = n(311),
        O = n(304),
        h = n(306),
        f = n(285),
        x = n(64),
        p = n(2),
        g = function () {
          var e = Object(u.c)(function (e) {
              return e.amcat;
            }),
            t = Object(u.b)(),
            n = Object(c.useState)(!1),
            a = Object(l.a)(n, 2),
            r = a[0],
            o = a[1];
          return e
            ? Object(p.jsxs)(O.a, {
                closeIcon: !0,
                open: r,
                trigger: Object(p.jsx)(b.a.Item, {
                  icon: "power off",
                  name: "logout",
                }),
                onClose: function () {
                  return o(!1);
                },
                onOpen: function () {
                  return o(!0);
                },
                children: [
                  Object(p.jsx)(h.a, {
                    icon: "power off",
                    content: "Logout from ".concat(e.host),
                  }),
                  Object(p.jsx)(O.a.Content, {
                    children: Object(p.jsx)("p", {
                      children: "Do you really want to logout?",
                    }),
                  }),
                  Object(p.jsxs)(O.a.Actions, {
                    children: [
                      Object(p.jsxs)(f.a, {
                        color: "red",
                        onClick: function () {
                          o(!1);
                        },
                        children: [
                          Object(p.jsx)(x.a, { name: "remove" }),
                          " No",
                        ],
                      }),
                      Object(p.jsxs)(f.a, {
                        color: "green",
                        onClick: function () {
                          t({ type: "DELETE_AMCAT_SESSION" }), o(!1);
                        },
                        children: [
                          Object(p.jsx)(x.a, { name: "checkmark" }),
                          " Yes",
                        ],
                      }),
                    ],
                  }),
                ],
              })
            : null;
        },
        m = Object(s.i)(function (e) {
          var t = e.items,
            n = Object(u.c)(function (e) {
              return e.amcat;
            }),
            c = Object(s.h)(),
            a = t.map(function (e, t) {
              return Object(p.jsx)(
                b.a.Item,
                {
                  index: t,
                  as: i.b,
                  to: e.path,
                  header: 0 === t,
                  disabled: !n,
                  active: e.path === c.pathname,
                  children: e.label,
                },
                "item-" + t
              );
            });
          return Object(p.jsxs)(b.a, {
            color: "blue",
            fixed: "top",
            inverted: !0,
            children: [
              a,
              Object(p.jsx)(b.a.Menu, {
                position: "right",
                children: Object(p.jsx)(g, {}),
              }),
            ],
          });
        }),
        v = n(300),
        y = n(299),
        C = n(67),
        S = n.n(C),
        I = n(123),
        w = n(184),
        E = n(185),
        k = n(148),
        T = n.n(k);
      function A(e, t, n) {
        return R.apply(this, arguments);
      }
      function R() {
        return (R = Object(I.a)(
          S.a.mark(function e(t, n, c) {
            var a;
            return S.a.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      T.a.get("".concat(t, "/auth/token/"), {
                        auth: { username: n, password: c },
                      })
                    );
                  case 2:
                    return (
                      (a = e.sent),
                      e.abrupt("return", new N(t, n, a.data.token))
                    );
                  case 4:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        )).apply(this, arguments);
      }
      var N = (function () {
          function e(t, n, c) {
            Object(w.a)(this, e),
              (this.host = t),
              (this.email = n),
              (this.api = T.a.create({
                baseURL: t,
                headers: { Authorization: "Bearer ".concat(c) },
              }));
          }
          return (
            Object(E.a)(e, [
              {
                key: "getIndices",
                value: function () {
                  return this.api.get("/index/");
                },
              },
              {
                key: "getIndex",
                value: function (e) {
                  return this.api.get("/index/".concat(e));
                },
              },
              {
                key: "getFields",
                value: function (e) {
                  return this.api.get("/index/".concat(e, "/fields"));
                },
              },
              {
                key: "getFieldValues",
                value: function (e, t) {
                  return this.api.get(
                    "/index/".concat(e, "/fields/").concat(t, "/values")
                  );
                },
              },
              {
                key: "getDocument",
                value: function (e, t) {
                  return this.api.get(
                    "/index/".concat(e, "/documents/").concat(t)
                  );
                },
              },
              {
                key: "getQuery",
                value: function (e, t, n) {
                  var c =
                      arguments.length > 3 && void 0 !== arguments[3]
                        ? arguments[3]
                        : "2m",
                    a =
                      arguments.length > 4 && void 0 !== arguments[4]
                        ? arguments[4]
                        : 100,
                    r =
                      arguments.length > 5 && void 0 !== arguments[5]
                        ? arguments[5]
                        : {};
                  return (
                    (r.scroll = c),
                    (r.per_page = a),
                    n && (r.fields = n.join(",")),
                    t && (r.q = t),
                    console.log("tets"),
                    console.log(r),
                    this.api.get("/index/".concat(e, "/query"), { params: r })
                  );
                },
              },
              {
                key: "createIndex",
                value: function (e) {
                  var t =
                      arguments.length > 1 && void 0 !== arguments[1]
                        ? arguments[1]
                        : "NONE",
                    n = { name: e };
                  return (
                    "NONE" !== t && (n.guest_role = t),
                    console.log(n),
                    this.api.post("/index/", n)
                  );
                },
              },
              {
                key: "createDocuments",
                value: function (e, t) {
                  return this.api.post("/index/".concat(e, "/documents"), t);
                },
              },
              {
                key: "deleteIndex",
                value: function (e) {
                  return this.api.delete("/index/".concat(e));
                },
              },
            ]),
            e
          );
        })(),
        _ = n(309),
        D = n(193),
        P = n(302),
        F = n(308),
        L = n(305),
        G = "blue",
        M = function (e) {
          var t = e.items,
            n = Object(u.b)(),
            a = Object(c.useState)("http://127.0.0.1:5000"),
            r = Object(l.a)(a, 2),
            o = r[0],
            i = r[1],
            j = Object(c.useState)("admin"),
            d = Object(l.a)(j, 2),
            b = d[0],
            O = d[1],
            x = Object(c.useState)("admin"),
            g = Object(l.a)(x, 2),
            m = g[0],
            v = g[1],
            y = Object(c.useState)("idle"),
            C = Object(l.a)(y, 2),
            w = C[0],
            E = C[1],
            k = Object(s.g)(),
            T = (function () {
              var e = Object(I.a)(
                S.a.mark(function e() {
                  var c;
                  return S.a.wrap(
                    function (e) {
                      for (;;)
                        switch ((e.prev = e.next)) {
                          case 0:
                            return (
                              E("waiting"),
                              (e.prev = 1),
                              (e.next = 4),
                              A(o, b, m)
                            );
                          case 4:
                            (c = e.sent),
                              n({ type: "CREATE_AMCAT_SESSION", payload: c }),
                              E("success"),
                              k.push(t[0].path),
                              (e.next = 13);
                            break;
                          case 10:
                            (e.prev = 10), (e.t0 = e.catch(1)), E("error");
                          case 13:
                          case "end":
                            return e.stop();
                        }
                    },
                    e,
                    null,
                    [[1, 10]]
                  );
                })
              );
              return function () {
                return e.apply(this, arguments);
              };
            })();
          return Object(p.jsx)(_.a, {
            inverted: !0,
            textAlign: "center",
            style: { height: "100vh" },
            verticalAlign: "middle",
            children: Object(p.jsxs)(_.a.Column, {
              style: { maxWidth: 450 },
              children: [
                Object(p.jsxs)(h.a, {
                  as: "h2",
                  color: G,
                  textAlign: "center",
                  children: [
                    Object(p.jsx)(D.a, { src: "/amcat-logo.svg" }),
                    " Connect to an AmCAT server",
                  ],
                }),
                Object(p.jsx)(P.a, {
                  size: "large",
                  children: Object(p.jsxs)(F.a, {
                    stacked: !0,
                    children: [
                      Object(p.jsx)(P.a.Input, {
                        fluid: !0,
                        error: "error" === w,
                        value: o,
                        onChange: function (e, t) {
                          var n = t.value;
                          E("idle"), i(n);
                        },
                        icon: "home",
                        iconPosition: "left",
                        placeholder: "Host",
                      }),
                      Object(p.jsx)(P.a.Input, {
                        fluid: !0,
                        error: "error" === w,
                        value: b,
                        onChange: function (e, t) {
                          var n = t.value;
                          E("idle"), O(n);
                        },
                        icon: "user",
                        iconPosition: "left",
                        placeholder: "Email adress",
                      }),
                      Object(p.jsx)(P.a.Input, {
                        fluid: !0,
                        error: "error" === w,
                        value: m,
                        onChange: function (e, t) {
                          var n = t.value;
                          E("idle"), v(n);
                        },
                        icon: "lock",
                        iconPosition: "left",
                        placeholder: "Password",
                        type: "password",
                      }),
                      Object(p.jsx)(f.a, {
                        onClick: T,
                        color: G,
                        fluid: !0,
                        size: "large",
                        children: "Login",
                      }),
                    ],
                  }),
                }),
                Object(p.jsx)(L.a, {
                  children: "Don't have an account? Too bad",
                }),
              ],
            }),
          });
        },
        z = n(13),
        H = n(301),
        W = n(103),
        B = n(186),
        U = n(94),
        q = n(83),
        V = n(312),
        Q = n(99),
        J = n(149),
        Z = n(314),
        X = function (e) {
          var t = e.columns,
            n = e.data,
            a = e.selectedRow,
            r = e.setSelectedRow,
            o = e.defaultSize,
            i = void 0 === o ? 15 : o,
            s = Object(c.useState)(a ? a.ROW_ID : null),
            u = Object(l.a)(s, 2),
            j = u[0],
            d = u[1],
            b = Object(W.useTable)(
              {
                columns: t,
                data: n,
                initialState: { pageSize: i, globalFilter: "" },
              },
              W.useGlobalFilter,
              W.useSortBy,
              W.usePagination
            ),
            O = b.getTableProps,
            h = b.getTableBodyProps,
            f = b.headerGroups,
            g = b.prepareRow,
            m = b.page,
            v = b.pageCount,
            y = b.gotoPage,
            C = b.setPageSize,
            S = b.preGlobalFilteredRows,
            I = b.setGlobalFilter,
            w = b.state,
            E = w.pageIndex,
            k = w.globalFilter;
          Object(c.useEffect)(
            function () {
              d(a ? a.ROW_ID : null);
            },
            [a]
          );
          var T = function (e) {
              var t = e.preGlobalFilteredRows,
                n = e.globalFilter,
                c = e.setGlobalFilter,
                a = t && t.length;
              return Object(p.jsx)("span", {
                children: Object(p.jsx)("input", {
                  value: n || "",
                  onChange: function (e) {
                    c(e.target.value || void 0);
                  },
                  placeholder: "Search ".concat(a, " records..."),
                  style: { border: "0" },
                }),
              });
            },
            A = function (e) {
              return e.headers.map(function (e) {
                return Object(p.jsxs)(
                  B.a,
                  Object(z.a)(
                    Object(z.a)(
                      { className: e.headerClass },
                      e.getHeaderProps(e.getSortByToggleProps())
                    ),
                    {},
                    {
                      children: [
                        e.render("Header"),
                        Object(p.jsx)("span", {
                          children: e.isSorted
                            ? e.isSortedDesc
                              ? " \ud83d\udd3d"
                              : " \ud83d\udd3c"
                            : "",
                        }),
                      ],
                    }
                  )
                );
              });
            };
          return 0 === n.length
            ? null
            : Object(p.jsxs)(F.a, {
                style: { border: "0" },
                children: [
                  Object(p.jsx)(T, {
                    preGlobalFilteredRows: S,
                    globalFilter: k,
                    setGlobalFilter: I,
                  }),
                  Object(p.jsxs)(
                    V.a,
                    Object(z.a)(
                      Object(z.a)(
                        {
                          striped: !0,
                          fixed: !0,
                          singleLine: !0,
                          selectable: !0,
                        },
                        O()
                      ),
                      {},
                      {
                        children: [
                          Object(p.jsx)(Q.a, {
                            children: f.map(function (e) {
                              return Object(p.jsx)(
                                U.a,
                                Object(z.a)(
                                  Object(z.a)({}, e.getHeaderGroupProps()),
                                  {},
                                  { children: A(e) }
                                )
                              );
                            }),
                          }),
                          Object(p.jsx)(
                            J.a,
                            Object(z.a)(
                              Object(z.a)({}, h()),
                              {},
                              {
                                children: (function (e) {
                                  return e.map(function (e, t) {
                                    return (
                                      g(e),
                                      Object(p.jsx)(
                                        U.a,
                                        Object(z.a)(
                                          Object(z.a)(
                                            {
                                              active: !!j && j === e.id,
                                              onClick: function () {
                                                return (function (e) {
                                                  j && j === e.id
                                                    ? (r(null), d(null))
                                                    : (r(
                                                        Object(z.a)(
                                                          Object(z.a)(
                                                            {},
                                                            e.values
                                                          ),
                                                          {},
                                                          { ROW_ID: e.id }
                                                        )
                                                      ),
                                                      d(e.id));
                                                })(e);
                                              },
                                            },
                                            e.getRowProps()
                                          ),
                                          {},
                                          {
                                            children: e.cells.map(function (e) {
                                              return Object(p.jsx)(
                                                q.a,
                                                Object(z.a)(
                                                  Object(z.a)(
                                                    {},
                                                    e.getCellProps()
                                                  ),
                                                  {},
                                                  { children: e.render("Cell") }
                                                )
                                              );
                                            }),
                                          }
                                        )
                                      )
                                    );
                                  });
                                })(m),
                              }
                            )
                          ),
                        ],
                      }
                    )
                  ),
                  Object(p.jsx)(H.a, {
                    text: "show per page",
                    options: [10, 25, 50, 100, 500].map(function (e) {
                      return { value: e, text: e };
                    }),
                    onChange: function (e, t) {
                      C(t.value);
                    },
                  }),
                  Object(p.jsx)("div", {
                    style: {
                      marginTop: "3em",
                      display: "flex",
                      justifyContent: "flex-end",
                    },
                    children: Object(p.jsx)(Z.a, {
                      style: { border: "0" },
                      size: "mini",
                      firstItem: !1,
                      lastItem: !1,
                      nextItem: !1,
                      prevItem: !1,
                      boundaryRange: 1,
                      ellipsisItem: {
                        content: Object(p.jsx)(x.a, {
                          name: "ellipsis horizontal",
                        }),
                        icon: !0,
                      },
                      activePage: E + 1,
                      totalPages: v,
                      onPageChange: function (e, t) {
                        y(t.activePage - 1);
                      },
                    }),
                  }),
                ],
              });
        },
        Y = n(190),
        K = n(310),
        $ = n(298),
        ee = [
          { key: 0, value: "NONE", text: "No access" },
          { key: 10, value: "METAREADER", text: "Meta-reader" },
          { key: 20, value: "READER", text: "Reader" },
          { key: 30, value: "WRITER", text: "Writer" },
          { key: 40, value: "ADMIN", text: "Admin" },
        ],
        te = function () {
          var e = Object(u.c)(function (e) {
              return e.amcat;
            }),
            t = Object(u.c)(function (e) {
              return e.amcatIndices;
            }),
            n = Object(u.b)(),
            a = Object(c.useState)("inactive"),
            r = Object(l.a)(a, 2),
            o = r[0],
            i = r[1],
            s = Object(c.useState)(""),
            b = Object(l.a)(s, 2),
            g = b[0],
            m = b[1],
            v = Object(c.useState)("NONE"),
            y = Object(l.a)(v, 2),
            C = y[0],
            S = y[1],
            I = Object(c.useState)(null),
            w = Object(l.a)(I, 2),
            E = w[0],
            k = w[1];
          Object(c.useEffect)(
            function () {
              if (g.match(/[ "*|<>/?,A-Z]/)) {
                var e = g.match(/[ "*|<>/?]/gi),
                  t = Object(Y.a)(new Set(e)).map(function (e) {
                    return " " === e ? "space" : e;
                  });
                g.match(/[A-Z]/) && t.push("UPPERCASE"),
                  k("Illegal symbols: ".concat(t.join(" ")));
              } else k(null);
            },
            [g]
          );
          return t
            ? Object(p.jsxs)(O.a, {
                as: P.a,
                trigger: Object(p.jsxs)(f.a, {
                  primary: !0,
                  children: [
                    Object(p.jsx)(x.a, { name: "plus" }),
                    "Create new index",
                  ],
                }),
                onSubmit: function (c) {
                  return (
                    c.preventDefault(),
                    m(g.trim()),
                    console.log(g),
                    void (t.some(function (e) {
                      return e.name === g;
                    })
                      ? k("This Index name already exists")
                      : (i("pending"),
                        e
                          .createIndex(g, C)
                          .then(function (t) {
                            console.log(t.status),
                              e &&
                                e.getIndices().then(function (e) {
                                  n(j(null)), n(d(e.data));
                                }),
                              i("inactive");
                          })
                          .catch(function (e) {
                            console.log(e.message), console.log(e), i("error");
                          })))
                  );
                },
                open: "inactive" !== o,
                onClose: function () {
                  return i("inactive");
                },
                onOpen: function () {
                  m(""), S("NONE"), i("awaiting input");
                },
                size: "tiny",
                children: [
                  Object(p.jsx)(h.a, {
                    icon: "pencil",
                    content: "Create new index",
                    as: "h2",
                  }),
                  Object(p.jsx)(O.a.Content, {
                    children: Object(p.jsxs)(P.a.Group, {
                      children: [
                        Object(p.jsx)(P.a.Input, {
                          width: 12,
                          label: "Name",
                          required: !0,
                          type: "text",
                          error: E || null,
                          value: g,
                          onChange: function (e, t) {
                            i("awaiting input"), m(t.value);
                          },
                          placeholder: "Enter name",
                        }),
                        Object(p.jsxs)("div", {
                          children: [
                            Object(p.jsx)("b", { children: "Guest role" }),
                            Object(p.jsx)("br", {}),
                            Object(p.jsx)(P.a.Input, {
                              width: 4,
                              label: "Name",
                              as: H.a,
                              selection: !0,
                              value: C,
                              onChange: function (e, t) {
                                S(t.value);
                              },
                              options: ee,
                            }),
                          ],
                        }),
                      ],
                    }),
                  }),
                  Object(p.jsxs)(O.a.Actions, {
                    children: [
                      "error" === o
                        ? Object(p.jsx)("div", {
                            children:
                              "Could not create index for a reason not yet covered in the error handling...",
                          })
                        : null,
                      "pending" === o
                        ? Object(p.jsx)(K.a, {
                            active: !0,
                            inverted: !0,
                            children: Object(p.jsx)($.a, {
                              content: "Creating Index",
                            }),
                          })
                        : Object(p.jsx)(f.a, {
                            type: "submit",
                            color: "green",
                            icon: "save",
                            content: "Create",
                          }),
                    ],
                  }),
                ],
              })
            : null;
        },
        ne = function () {
          var e = Object(u.c)(function (e) {
              return e.amcat;
            }),
            t = Object(u.c)(function (e) {
              return e.amcatIndex;
            }),
            n = Object(u.b)(),
            a = Object(c.useState)("inactive"),
            r = Object(l.a)(a, 2),
            o = r[0],
            i = r[1],
            s = function (c) {
              i("pending"),
                console.log(t),
                e
                  .deleteIndex(t.name)
                  .then(function (t) {
                    console.log(t.status),
                      e &&
                        e.getIndices().then(function (e) {
                          n(j(null)), n(d(e.data));
                        }),
                      i("inactive");
                  })
                  .catch(function (e) {
                    console.log(e.message), console.log(e), i("error");
                  });
            };
          return t
            ? Object(p.jsxs)(O.a, {
                closeIcon: !0,
                open: "inactive" !== o,
                trigger: Object(p.jsxs)(f.a, {
                  name: "logout",
                  children: [
                    Object(p.jsx)(x.a, { name: "minus" }),
                    " Delete Index",
                  ],
                }),
                onClose: function () {
                  i("inactive");
                },
                onOpen: function () {
                  i("awaiting input");
                },
                children: [
                  Object(p.jsx)(h.a, {
                    icon: "trash",
                    content: "Delete Index ".concat(t.name),
                  }),
                  Object(p.jsx)(O.a.Content, {
                    children: Object(p.jsx)("p", {
                      children: "Do you really want to delete this Index?",
                    }),
                  }),
                  Object(p.jsxs)(O.a.Actions, {
                    children: [
                      "error" === o
                        ? Object(p.jsx)("div", {
                            children:
                              "Could not delete index for a reason not yet covered in the error handling...",
                          })
                        : null,
                      "pending" === o
                        ? Object(p.jsx)(K.a, {
                            active: !0,
                            inverted: !0,
                            children: Object(p.jsx)($.a, {
                              content: "Creating Index",
                            }),
                          })
                        : Object(p.jsxs)(p.Fragment, {
                            children: [
                              Object(p.jsxs)(f.a, {
                                color: "red",
                                onClick: s,
                                children: [
                                  Object(p.jsx)(x.a, { name: "remove" }),
                                  " No",
                                ],
                              }),
                              Object(p.jsxs)(f.a, {
                                color: "green",
                                onClick: s,
                                children: [
                                  Object(p.jsx)(x.a, { name: "checkmark" }),
                                  " Yes",
                                ],
                              }),
                            ],
                          }),
                    ],
                  }),
                ],
              })
            : null;
        },
        ce = function (e) {
          var t,
            n = e.type,
            a = void 0 === n ? "table" : n,
            r = Object(u.c)(function (e) {
              return e.amcat;
            }),
            o = Object(u.c)(function (e) {
              return e.amcatIndices;
            }),
            i = Object(u.c)(function (e) {
              return e.amcatIndex;
            }),
            s = Object(u.b)(),
            b = Object(c.useState)(i),
            O = Object(l.a)(b, 2),
            h = O[0],
            x = O[1];
          if (
            (Object(c.useEffect)(
              function () {
                s(j(h));
              },
              [h, s]
            ),
            Object(c.useEffect)(function () {
              r &&
                0 === o.length &&
                r.getIndices().then(function (e) {
                  s(d(e.data));
                });
            }, []),
            "table" === a)
          ) {
            return Object(p.jsxs)(y.a, {
              children: [
                Object(p.jsxs)(f.a.Group, {
                  widths: "2",
                  children: [Object(p.jsx)(te, {}), Object(p.jsx)(ne, {})],
                }),
                Object(p.jsx)(X, {
                  columns: [
                    {
                      Header: "Select Index",
                      accessor: "name",
                      headerClass: "thirteen wide",
                    },
                  ],
                  data: o,
                  selectedRow: h,
                  setSelectedRow: x,
                  defaultSize: 15,
                }),
              ],
            });
          }
          if ("dropdown" === a) {
            return Object(p.jsx)(H.a, {
              clearable: !0,
              selection: !0,
              options:
                ((t = o),
                t.map(function (e) {
                  return { key: e.name, text: e.name, value: e.name };
                })),
              value: i ? i.name : null,
              onChange: function (e, t) {
                return (function (e) {
                  if (e) {
                    var t = o.findIndex(function (t) {
                      return t.name === e;
                    });
                    console.log(t),
                      x(
                        Object(z.a)(
                          Object(z.a)({}, o[t]),
                          {},
                          { ROW_ID: t.toString() }
                        )
                      );
                  } else x(null);
                })(t.value);
              },
            });
          }
          return null;
        },
        ae = [
          { Header: "ID", accessor: "id", headerClass: "two wide" },
          { Header: "Date", accessor: "date", headerClass: "six wide" },
          { Header: "Title", accessor: "title", headerClass: "eight wide" },
        ],
        re = function () {
          var e = Object(u.c)(function (e) {
              return e.amcatIndex;
            }),
            t = Object(u.c)(function (e) {
              return e.article;
            }),
            n = Object(u.c)(function (e) {
              return e.articles;
            }),
            a = Object(u.b)(),
            r = Object(c.useState)(t),
            o = Object(l.a)(r, 2),
            i = o[0],
            s = o[1];
          return (
            Object(c.useEffect)(
              function () {
                a(
                  (function (e) {
                    return { type: "SELECT_ARTICLE", payload: e };
                  })(i)
                );
              },
              [i, a]
            ),
            e
              ? Object(p.jsx)(X, {
                  columns: ae,
                  data: n,
                  selectedRow: i,
                  setSelectedRow: s,
                  defaultSize: 15,
                })
              : null
          );
        },
        oe = function () {
          var e = Object(u.c)(function (e) {
              return e.amcat;
            }),
            t = Object(u.c)(function (e) {
              return e.amcatIndex;
            }),
            n = Object(u.b)(),
            a = Object(c.useState)(""),
            r = Object(l.a)(a, 2),
            o = r[0],
            i = r[1];
          return t
            ? Object(p.jsxs)(y.a, {
                children: [
                  Object(p.jsx)(f.a.Group, {
                    widths: "2",
                    children: Object(p.jsxs)(f.a, {
                      primary: !0,
                      type: "submit",
                      onClick: function () {
                        e.getQuery(
                          t.name,
                          o,
                          ["date", "title", "url"],
                          "2m",
                          100,
                          {}
                        )
                          .then(function (e) {
                            console.log(e.data.results),
                              n({
                                type: "SET_ARTICLES",
                                payload: e.data.results,
                              });
                          })
                          .catch(function (e) {
                            console.log(e);
                          });
                      },
                      children: [
                        Object(p.jsx)(x.a, { name: "search" }),
                        "Search",
                      ],
                    }),
                  }),
                  Object(p.jsx)(F.a, {
                    style: { border: "0" },
                    children: Object(p.jsx)(P.a, {
                      children: Object(p.jsx)(P.a.Group, {
                        children: Object(p.jsx)(P.a.TextArea, {
                          width: 16,
                          onChange: function (e, t) {
                            return i(t.value);
                          },
                        }),
                      }),
                    }),
                  }),
                ],
              })
            : null;
        },
        ie = function () {
          return Object(p.jsxs)(_.a, {
            style: { marginTop: "3em" },
            children: [
              Object(p.jsx)(_.a.Column, {
                floated: "left",
                width: 5,
                children: Object(p.jsx)(ce, { type: "table" }),
              }),
              Object(p.jsxs)(_.a.Column, {
                width: 10,
                children: [
                  Object(p.jsx)(_.a.Row, { children: Object(p.jsx)(oe, {}) }),
                  Object(p.jsx)(_.a.Row, { children: Object(p.jsx)(re, {}) }),
                ],
              }),
            ],
          });
        },
        se = n(191),
        le =
          (n(283),
          function (e) {
            var t = e.fields,
              n = e.fieldValues,
              c = e.setFieldValues,
              a = function (e, t) {
                var a = Object(z.a)({}, n);
                (a[e] = t), c(a);
              };
            return t
              ? Object.keys(t).map(function (e) {
                  return "text" === t[e]
                    ? Object(p.jsx)(
                        P.a.TextArea,
                        {
                          value: n[e] ? n[e] : "",
                          onChange: function (t, n) {
                            return a(e, n.value);
                          },
                          label: e,
                        },
                        e
                      )
                    : "date" === t[e]
                    ? Object(p.jsx)(
                        se.a,
                        {
                          label: e,
                          value: n[e] ? n[e] : "",
                          onChange: function (t, n) {
                            return a(e, n.value);
                          },
                        },
                        e
                      )
                    : "keyword" === t[e]
                    ? Object(p.jsxs)(
                        P.a.Field,
                        {
                          children: [
                            Object(p.jsx)("label", { children: e }),
                            Object(p.jsx)("input", {
                              value: n[e] ? n[e] : "",
                              onChange: function (t) {
                                return a(e, t.target.value);
                              },
                            }),
                          ],
                        },
                        e
                      )
                    : null;
                })
              : null;
          }),
        ue = function () {
          var e = Object(u.c)(function (e) {
              return e.amcat;
            }),
            t = Object(u.c)(function (e) {
              return e.amcatIndex;
            }),
            n = Object(c.useState)(null),
            a = Object(l.a)(n, 2),
            r = a[0],
            o = a[1],
            i = Object(c.useState)({}),
            s = Object(l.a)(i, 2),
            j = s[0],
            d = s[1];
          Object(c.useEffect)(function () {}, [j]),
            Object(c.useEffect)(
              function () {
                t && e
                  ? e.getFields(t.name).then(function (e) {
                      o(e.data);
                    })
                  : o(null);
              },
              [e, t]
            );
          return Object(p.jsxs)(P.a, {
            children: [
              Object(p.jsx)(le, {
                fields: r,
                fieldValues: j,
                setFieldValues: d,
              }),
              t
                ? Object(p.jsx)(f.a, {
                    primary: !0,
                    onClick: function () {
                      for (
                        var n = Object(z.a)({}, j), c = 0, a = Object.keys(n);
                        c < a.length;
                        c++
                      ) {
                        var r = a[c];
                        ("date" === r || /_date$/.test(r)) &&
                          (n[r] = n[r].toISOString());
                      }
                      e.createDocuments(t.name, [j])
                        .then(function (e) {
                          console.log(e.status), d({});
                        })
                        .catch(function (e) {
                          console.log(e);
                        });
                    },
                    children: "Create document",
                  })
                : null,
            ],
          });
        },
        je = function () {
          return Object(p.jsxs)(_.a, {
            style: { marginTop: "3em" },
            children: [
              Object(p.jsx)(_.a.Column, {
                floated: "left",
                width: 5,
                children: Object(p.jsx)(ce, { type: "table" }),
              }),
              Object(p.jsx)(_.a.Column, {
                width: 10,
                children: Object(p.jsx)(ue, {}),
              }),
            ],
          });
        },
        de = function () {
          var e = Object(u.c)(function (e) {
              return e.amcat;
            }),
            t = Object(u.c)(function (e) {
              return e.amcatIndex;
            }),
            n = Object(c.useState)([]),
            a = Object(l.a)(n, 2),
            r = a[0],
            o = a[1];
          Object(c.useEffect)(
            function () {
              if ((window.helloworld(), e && t)) {
                e.getQuery(
                  t.name,
                  "",
                  ["date", "title", "url", "text"],
                  "2m",
                  100,
                  {}
                )
                  .then(function (e) {
                    o(e.data.results), s(e.data.results[0].text);
                  })
                  .catch(function (e) {
                    console.log(e);
                  });
              }
            },
            [e, t]
          );
          var i,
            s = function (e) {
              console.log(e), console.log("tokens"), console.log(window.nlp(e));
            };
          return Object(p.jsxs)(_.a, {
            children: [
              Object(p.jsxs)(_.a.Row, {
                children: [
                  Object(p.jsx)(ce, { type: "dropdown" }),
                  Object(p.jsx)(H.a, {
                    selection: !0,
                    options:
                      ((i = r),
                      i.map(function (e, t) {
                        return { key: t, text: e.title, value: t };
                      })),
                  }),
                ],
              }),
              Object(p.jsx)(_.a.Row, {
                children: Object(p.jsx)(_.a.Column, { children: "test" }),
              }),
            ],
          });
        },
        be = n(192),
        Oe = function (e) {
          var t = e.Component,
            n = Object(be.a)(e, ["Component"]);
          return Object(u.c)(function (e) {
            return e.amcat;
          })
            ? Object(p.jsx)(
                s.b,
                Object(z.a)(
                  Object(z.a)({}, n),
                  {},
                  {
                    render: function (e) {
                      return Object(p.jsx)(
                        t,
                        Object(z.a)(Object(z.a)({}, n), e)
                      );
                    },
                  }
                )
              )
            : Object(p.jsx)(s.a, { to: "/" });
        },
        he = [
          { label: "Query", path: "/query", Component: ie },
          { label: "Create", path: "/create", Component: je },
          { label: "Annotate", path: "/annotate", Component: de },
        ],
        fe = function () {
          var e;
          return Object(p.jsxs)(i.a, {
            children: [
              Object(p.jsx)(m, { items: he }),
              Object(p.jsx)(v.a, {}),
              Object(p.jsx)(y.a, {
                style: { marginTop: "3em" },
                children: Object(p.jsxs)(s.d, {
                  children: [
                    Object(p.jsx)(s.b, {
                      exact: !0,
                      path: "/",
                      render: function () {
                        return Object(p.jsx)(M, { items: he });
                      },
                    }),
                    ((e = he),
                    e.map(function (e) {
                      return Object(p.jsx)(Oe, {
                        path: e.path,
                        Component: e.Component,
                      });
                    })),
                  ],
                }),
              }),
            ],
          });
        },
        xe = n(72),
        pe = Object(xe.b)({
          amcat: function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : null,
              t = arguments.length > 1 ? arguments[1] : void 0;
            switch (t.type) {
              case "CREATE_AMCAT_SESSION":
                return t.payload;
              case "DELETE_AMCAT_SESSION":
                return null;
              default:
                return e;
            }
          },
          amcatIndex: function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : null,
              t = arguments.length > 1 ? arguments[1] : void 0;
            switch (t.type) {
              case "SELECT_AMCAT_INDEX":
                return t.payload;
              default:
                return e;
            }
          },
          amcatIndices: function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : [],
              t = arguments.length > 1 ? arguments[1] : void 0;
            switch (t.type) {
              case "SET_AMCAT_INDICES":
                return t.payload;
              default:
                return e;
            }
          },
          article: function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : [],
              t = arguments.length > 1 ? arguments[1] : void 0;
            switch (t.type) {
              case "SELECT_ARTICLE":
                return t.payload;
              default:
                return e;
            }
          },
          articles: function () {
            var e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : [],
              t = arguments.length > 1 ? arguments[1] : void 0;
            switch (t.type) {
              case "SET_ARTICLES":
                return t.payload;
              default:
                return e;
            }
          },
        }),
        ge = Object(xe.c)(pe);
      o.a.render(
        Object(p.jsx)(a.a.StrictMode, {
          children: Object(p.jsx)(u.a, {
            store: ge,
            children: Object(p.jsx)(fe, {}),
          }),
        }),
        document.querySelector("#root")
      );
    },
  },
  [[284, 1, 2]],
]);
//# sourceMappingURL=main.fbfbee51.chunk.js.map
