'use strict';

(() => {
	const G = Object.defineProperty;
	const X = (e, t, o) => {
		if (t in e) {
			G(e, t, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: o
			});
		} else {
			e[t] = o;
		}
	};
	const U = (e, t, o) => {
		const key = typeof t !== 'symbol' ? t + '' : t;
		X(e, key, o);
		return o;
	};
	const u = 'fs-attributes';
	const h = 'cmsattribute';
	const L = 'cmscore';
	const m = 'cmsslider';
	const _ = 'support';
	const M = async (...e) => {
		const t = [];
		for (const i of e) {
			const r = await window.fsAttributes?.[i]?.loading;
			t.push(r);
		}
		return t;
	};
	class d {
		static alertsActivated = false;

		static activateAlerts() {
			this.alertsActivated = true;
		}

		static alert(t, o) {
			if (this.alertsActivated) {
				window.alert(t);
			}
			if (o === 'error') {
				throw new Error(t);
			}
		}
	}
	U(d, 'alertsActivated', false);
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
		const {
			Webflow: t
		} = window;
		if (t && 'destroy' in t && 'ready' in t && 'require' in t) {
			if (e && e.length) {
				if (!e || t.destroy(), t.ready(), !e || e.includes('ix2')) {
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
						e || r.destroy();
						r.init();
						await Promise.all(c.map(l => n.dispatch(s.eventStateChanged(...l))));
					}
				}
				if (!e || e.includes('commerce')) {
					const r = t.require('commerce');
					const n = w();
					if (r && n) {
						r.destroy();
						r.init({
							siteId: n,
							apiUrl: 'https://render.webflow.com'
						});
					}
				}
				if (e != null && e.includes('lightbox')) {
					const o = t.require('lightbox');
					o?.ready();
				}
				if (e != null && e.includes('slider')) {
					const r = t.require('slider');
					r && (r.redraw(), r.ready());
				}
				if (e != null && e.includes('tabs')) {
					const i = t.require('tabs');
					i?.redraw();
				}
				new Promise(r => t.push(() => r()));
			}
		}
	};

	function P(e, t, o) {
		const i = window.fsAttributes[e];
		i.destroy = o || y;
		const r = i.resolve;
		r?.call(i, t);
		return t;
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
		e.cmscore ??= {};
		const {
			cmscore: t
		} = e;
		if (t.import) return t.import;
		try {
			t.import = import(W);
			t.import.then(o => {
				o && (t.version ??= o.version);
			});
			return t.import;
		} catch (o) {
			d.alert(`${o}`, 'error');
		}
	};
	const z = `fs-attributes-${_}`;
	const D = async () => {
		const {
			fsAttributes: e,
			location: t
		} = window;
		const {
			host: o,
			searchParams: i
		} = new URL(t.href);
		if (o.includes('webflow.io') && i.has(z)) {
			e.import?.(_, '1');
		}
	};
	const C = e => t => `${e}${t ? `-${t}` : ''}`;
	const x = e => {
		const t = (r, n, s) => {
			const a = e[r];
			const {
				key,
				values
			} = a;
			let p;
			if (!n) return `[${key}]`;
			const I = values ? values[n] : null;
			if (A(I)) {
				p = I;
			} else {
				p = I(s && 'instanceIndex' in s ? s.instanceIndex : undefined);
			}
			const E = s && 'caseInsensitive' in s && s.caseInsensitive ? 'i' : '';
			if (!s || !s.operator) return `[${key}="${p}"${E}]`;
			switch (s.operator) {
				case 'prefixed':
					return `[${key}^="${p}"${E}]`;
				case 'suffixed':
					return `[${key}$="${p}"${E}]`;
				case 'contains':
					return `[${key}*="${p}"${E}]`;
			}
		};

		function o(r, n) {
			const s = t('element', r, n);
			const a = (n?.scope || document);
			return n?.all ? [...a.querySelectorAll(s)] : a.querySelector(s);
		}
		return [t, o, (r, n) => {
			const s = e[n];
			return s ? r.getAttribute(s.key) : null;
		}];
	};
	const T = {
		preventLoad: {
			key: 'fs-attributes-preventload'
		},
		debugMode: {
			key: 'fs-attributes-debug'
		},
		src: {
			key: 'src',
			values: {
				finsweet: '@finsweet/attributes'
			}
		},
		dev: {
			key: 'fs-attributes-dev'
		}
	};
	const [g, qt] = x(T);
	const K = e => {
		const {
			currentScript: t
		} = document;
		const o = {};
		if (!t) {
			return {
				attributes: o,
				preventsLoad: false
			};
		}
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
		Q();
		let r = window.fsAttributes;
		if (!r) r = window.fsAttributes = {};
		r[t] ??= {};
		const {
			preventsLoad: n,
			attributes: s
		} = K(e);
		const a = r[t];
		a.version = o;
		a.init = i;
		if (!n) {
			if (!window.Webflow) {
				window.Webflow = [];
			}
			window.Webflow.push(() => i(s));
		}
	};
	const Q = () => {
		const e = Z();
		if (window.fsAttributes && !Array.isArray(window.fsAttributes)) {
			v(window.fsAttributes, e);
			return;
		}
		const t = J(e);
		v(t, e);
		tt(t);
		window.fsAttributes = t;
		window.FsAttributes = window.fsAttributes;
		D();
	};
	const J = e => {
		const t = {
			cms: {},
			push(...o) {
				for (const [n, s] of o) {
					const a = this[n];
					const r = a?.loading;
					r?.then(s);
				}
			},
			async import(o, i) {
				const r = t[o];
				if (r) return r;
				return new Promise(n => {
					const s = document.createElement('script');
					s.src = b(o, i);
					s.async = true;
					s.onload = () => {
						const [a] = v(t, [o]);
						n(a);
					};
					document.head.append(s);
				});
			},
			destroy() {
				for (const r of e) {
					const i = window.fsAttributes[r];
					i?.destroy?.();
				}
			}
		};
		return t;
	};
	const Z = () => {
		const e = g('src', 'finsweet', {
			operator: 'contains'
		});
		const t = g('dev');
		return [...document.querySelectorAll(`script${e}, script${t}`)].reduce((r, n) => {
			const a = n.getAttribute(T.dev.key) || n.src.match(/[\w-. ]+(?=(\.js)$)/)?.[0];
			if (a && !r.includes(a)) {
				r.push(a);
			}
			return r;
		}, []);
	};
	const v = (e, t) => t.map(i => {
		let r = e[i];
		if (!r) {
			r = e[i] = {};
			r.loading = new Promise(n => {
				r.resolve = s => {
					n(s);
					delete r.resolve;
				};
			});
		}
		return r;
	});
	const tt = e => {
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
		element: {
			key: it
		},
		resetIx: {
			key: V,
			values: F
		}
	} = B;
	const Y = e => {
		let t = [];
		let o = false;
		for (const r of e) {
			const n = r.getInstanceIndex(it);
			const s = document.querySelector(`.${f.slider}${S('element', 'slider', {
        instanceIndex: n
      })}`);
			if (!s) continue;
			(t[n || 0] || (t[n || 0] = {
				listInstances: [],
				slider: s
			})).listInstances.push(r);
			o = o || s.getAttribute(V) === F.true;
			o = o || r.getAttribute(V) === F.true;
		}
		t = t.filter(r => r && r.listInstances.length);
		return [t, o];
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
		const i = t.querySelectorAll(`.${at}`)[0].classList.value;
		for (const s of t.querySelectorAll(`.${at}`)) {
			s.remove();
		}
		const n = s => {
			for (const {
					element: a
				}
				of s) {
				a.removeAttribute(q);
				const c = document.createElement('div');
				c.setAttribute('class', i);
				c.appendChild(a);
				o.appendChild(c);
			}
		};
		for (const {
				wrapper: s,
				items: a
			}
			of e) {
			n(a);
			s.style.display = 'none';
		}
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
			if (i) n.push('ix2');
			await R(n);
		};
		for (const n of o) {
			const {
				listInstances: s
			} = n;
			const a = j(n);
			if (a) {
				for (const c of s) {
					c.restartSliders = true;
					if (!c.restartIx) {
						c.restartIx = i;
					}
					c.items = [];
					c.on('additems', async l => {
						c.items = [];
						a(l);
						await r();
					});
				}
			}
		}
		await r();
		return P(m, t, () => {
			for (const n of t) {
				n.destroy();
			}
		});
	};
	O({
		init: H,
		version: k,
		attributeKey: m
	});
})();
