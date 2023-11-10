'use strict';

(() => {
    const G = Object.defineProperty;
    const X = (e, t, o) => t in e ? G(e, t, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: o
    }) : e[t] = o;
    const U = (e, t, o) => (X(e, typeof t !== 'symbol' ? t + '' : t, o), o);
    const u = 'fs-attributes';
    const h = 'cmsattribute';
    const L = 'cmscore';
    const m = 'cmsslider';
    const _ = 'support';
    const M = async (...e) => {
        let o;
        const t = [];
        for (const i of e) {
            const r = await ((o = window.fsAttributes[i]) == null ? void 0 : o.loading);
            t.push(r);
        }
        return t;
    };
    const d = class {
        static activateAlerts() {
            this.alertsActivated = !0;
        }
        static alert(t, o) {
            if (this.alertsActivated && window.alert(t), o === 'error') throw new Error(t);
        }
    };
    U(d, 'alertsActivated', !1);
    const y = () => {};
    const f = {
        slider: 'w-slider',
        slide: 'w-slide',
        sliderMask: 'w-slider-mask',
        sliderNav: 'w-slider-nav',
        sliderDot: 'w-slider-dot',
        activeSliderDot: 'w-active'
    };
    const A = e => typeof e === 'string';
    const w = () => document.documentElement.getAttribute('data-wf-site');
    const R = async e => {
        let o, i;
        const {
            Webflow: t
        } = window;
        if (!(!t || !('destroy' in t) || !('ready' in t) || !('require' in t)) && !(e && !e.length)) {
            if (!e || (t.destroy(), t.ready()), !e || e.includes('ix2')) {
                const r = t.require('ix2');
                if (r) {
                    const {
                        store: n,
                        actions: s
                    } = r;
                    const {
                        eventState: a
                    } = n.getState().ixSession;
                    const c = Object.entries(a);
                    e || r.destroy(), r.init(), await Promise.all(c.map(l => n.dispatch(s.eventStateChanged(...l))));
                }
            }
            if (!e || e.includes('commerce')) {
                const r = t.require('commerce');
                const n = w();
                r && n && (r.destroy(), r.init({
                    siteId: n,
                    apiUrl: 'https://render.webflow.com'
                }));
            }
            if (e != null && e.includes('lightbox') && ((o = t.require('lightbox')) == null || o.ready()), e != null && e.includes('slider')) {
                const r = t.require('slider');
                r && (r.redraw(), r.ready());
            }
            return e != null && e.includes('tabs') && ((i = t.require('tabs')) == null || i.redraw()), new Promise(r => t.push(() => r(void 0)));
        }
    };

    function P(e, t, o) {
        let r;
        const i = window.fsAttributes[e];
        return i.destroy = o || y, (r = i.resolve) == null || r.call(i, t), t;
    }
    const b = (e, t = '1', o = 'iife') => {
        const r = `${e}${o === 'esm' ? '.esm' : ''}.js`;
        return `https://src.matthewpenkala.com/fs-slider/${r}`;
    };
    const W = b(L, '1');
    const N = async () => {
        const {
            fsAttributes: e
        } = window;
        e.cmscore || (e.cmscore = {});
        const {
            cmscore: t
        } = e;
        if (t.import) return t.import;
        try {
            return t.import = import(W), t.import.then(o => {
                o && (t.version || (t.version = o.version));
            }), t.import;
        } catch (o) {
            d.alert(`${o}`, 'error');
        }
    };
    const z = `${u}-${_}`;
    const D = async () => {
        let r;
        const {
            fsAttributes: e,
            location: t
        } = window;
        const {
            host: o,
            searchParams: i
        } = new URL(t.href);
        return !o.includes('webflow.io') || !i.has(z) ? !1 : (r = e.import) == null ? void 0 : r.call(e, _, '1');
    };
    const C = e => t => `${e}${t ? `-${t}` : ''}`;
    const x = e => {
        const t = (r, n, s) => {
            const a = e[r];
            const {
                key: c,
                values: l
            } = a;
            let p;
            if (!n) return `[${c}]`;
            const I = l == null ? void 0 : l[n];
            A(I) ? p = I : p = I(s && 'instanceIndex' in s ? s.instanceIndex : void 0);
            const E = s && 'caseInsensitive' in s && s.caseInsensitive ? 'i' : '';
            if (!(s != null && s.operator)) return `[${c}="${p}"${E}]`;
            switch (s.operator) {
            case 'prefixed':
                return `[${c}^="${p}"${E}]`;
            case 'suffixed':
                return `[${c}$="${p}"${E}]`;
            case 'contains':
                return `[${c}*="${p}"${E}]`;
            }
        };

        function o(r, n) {
            const s = t('element', r, n);
            const a = (n == null ? void 0 : n.scope) || document;
            return n != null && n.all ? [...a.querySelectorAll(s)] : a.querySelector(s);
        }
        return [t, o, (r, n) => {
            const s = e[n];
            return s ? r.getAttribute(s.key) : null;
        }];
    };
    const T = {
        preventLoad: {
            key: `${u}-preventload`
        },
        debugMode: {
            key: `${u}-debug`
        },
        src: {
            key: 'src',
            values: {
                finsweet: '@finsweet/attributes'
            }
        },
        dev: {
            key: `${u}-dev`
        }
    };
    const [g, qt] = x(T);
    const K = e => {
        const {
            currentScript: t
        } = document;
        const o = {};
        if (!t) return {
            attributes: o,
            preventsLoad: !1
        };
        const r = {
            preventsLoad: A(t.getAttribute(T.preventLoad.key)),
            attributes: o
        };
        for (const n in e) {
            const s = t.getAttribute(e[n]);
            r.attributes[n] = s;
        }
        return r;
    };
    const O = ({
        scriptAttributes: e,
        attributeKey: t,
        version: o,
        init: i
    }) => {
        let a;
        Q(), (a = window.fsAttributes)[t] || (a[t] = {});
        const {
            preventsLoad: r,
            attributes: n
        } = K(e);
        const s = window.fsAttributes[t];
        s.version = o, s.init = i, r || (window.Webflow || (window.Webflow = []), window.Webflow.push(() => i(n)));
    };
    var Q = () => {
        const e = Z();
        if (window.fsAttributes && !Array.isArray(window.fsAttributes)) {
            v(window.fsAttributes, e);
            return;
        }
        const t = J(e);
        v(t, e), tt(t), window.fsAttributes = t, window.FsAttributes = window.fsAttributes, D();
    };
    var J = e => {
        const t = {
            cms: {},
            push(...o) {
                let i, r;
                for (const [n, s] of o)(r = (i = this[n]) == null ? void 0 : i.loading) == null || r.then(s);
            },
            async import(o, i) {
                const r = t[o];
                return r || new Promise(n => {
                    const s = document.createElement('script');
                    s.src = b(o, i), s.async = !0, s.onload = () => {
                        const [a] = v(t, [o]);
                        n(a);
                    }, document.head.append(s);
                });
            },
            destroy() {
                let o, i;
                for (const r of e)(i = (o = window.fsAttributes[r]) == null ? void 0 : o.destroy) == null || i.call(o);
            }
        };
        return t;
    };
    var Z = () => {
        const e = g('src', 'finsweet', {
            operator: 'contains'
        });
        const t = g('dev');
        return [...document.querySelectorAll(`script${e}, script${t}`)].reduce((r, n) => {
            let a;
            const s = n.getAttribute(T.dev.key) || ((a = n.src.match(/[\w-. ]+(?=(\.js)$)/)) == null ? void 0 : a[0]);
            return s && !r.includes(s) && r.push(s), r;
        }, []);
    };
    var v = (e, t) => t.map(i => {
        let r;
        let n = e[i];
        return n || (e[i] = {}, n = e[i], n.loading = new Promise(n => (r = n, n.resolve = s => {
            r(s), delete n.resolve;
        })), n);
    });
    var tt = e => {
        const t = Array.isArray(window.fsAttributes) ? window.fsAttributes : [];
        e.push(...t);
    };
    const k = '1.7.1';
    const $ = `fs-${m}`;
    const rt = 'list';
    const ot = 'slider';
    const st = 'resetix';
    const nt = {
        true: 'true'
    };
    const B = {
        element: {
            key: `${$}-element`,
            values: {
                list: C(rt),
                slider: C(ot)
            }
        },
        resetIx: {
            key: `${$}-${st}`,
            values: nt
        }
    };
    const [S, re] = x(B);
    const {
        element: it,
        resetIx: V,
        values: F
    } = B;
    const Y = e => {
        let i;
        let t = [];
        let o = !1;
        for (const r of e) {
            const n = r.getInstanceIndex(it);
            const s = document.querySelector(`.${f.slider}${S('element', 'slider', {
        instanceIndex: n
      })}`);
            if (!s) continue;
            (t[i = n || 0] || (t[i] = {
                listInstances: [],
                slider: s
            })).listInstances.push(r), o || (o = s.getAttribute(V) === F.true), o || (o = r.getAttribute(V) === F.true);
        }
        return t = t.filter(r => r && r.listInstances.length), [t, o];
    };
    const q = 'role';
    const {
        slide: at,
        sliderMask: ct
    } = f;
    const j = ({
        listInstances: e,
        slider: t
    }) => {
        const o = t.querySelector(`.${ct}`);
        const i = t.querySelectorAll(`.${at}`);
        if (!o || !i.length) return;
        const r = i[0].classList.value;
        for (const s of i) s.remove();
        const n = s => {
            for (const {
                    element: a
                }
                of s) {
                a.removeAttribute(q);
                const c = document.createElement('div');
                c.setAttribute('class', r), c.appendChild(a), o.appendChild(c);
            }
        };
        for (const {
                wrapper: s,
                items: a
            }
            of e) n(a), s.style.display = 'none';
        return n;
    };
    const H = async () => {
        const e = await N();
        if (!e) return [];
        await M(h);
        const t = e.createCMSListInstances([S('element', 'list', {
            operator: 'prefixed'
        })]);
        const [o, i] = Y(t);
        const r = async () => {
            const n = ['slider'];
            i && n.push('ix2'), await R(n);
        };
        for (const n of o) {
            const {
                listInstances: s
            } = n;
            const a = j(n);
            if (a) {
                for (const c of s) {
                    c.restartSliders = !0, c.restartIx || (c.restartIx = i), c.items = [], c.on('additems', async l => {
                        c.items = [], a(l), await r();
                    });
                }
            }
        }
        return await r(), P(m, t, () => {
            for (const n of t) n.destroy();
        });
    };
    O({
        init: H,
        version: k,
        attributeKey: m
    });
})();