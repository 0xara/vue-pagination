//
//
//
//
//
//
//

var script = {
  props: ['index', 'current', 'disabled', 'prefix'],

  methods: {
    selectPage: function selectPage() {
      this.$emit('select-page', this.index);
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function __vue_render__() {
  var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('li', { class: { disabled: _vm.disabled, active: _vm.current === _vm.index } }, [_vm.current === _vm.index || _vm.disabled ? _c('span', { class: { current: _vm.current === _vm.index }, domProps: { "textContent": _vm._s(_vm.index + 1) } }) : _vm._e(), _vm._v(" "), _vm.current !== _vm.index && !_vm.disabled ? _c('a', { staticClass: "page-link", attrs: { "href": _vm.prefix ? _vm.prefix + (_vm.index + 1) : 'javascript:void(0)' }, domProps: { "textContent": _vm._s(_vm.index + 1) }, on: { "click": function click($event) {
        return _vm.selectPage(_vm.index);
      } } }) : _vm._e()]);
};
var __vue_staticRenderFns__ = [];

/* style */
var __vue_inject_styles__ = undefined;
/* scoped */
var __vue_scope_id__ = undefined;
/* module identifier */
var __vue_module_identifier__ = undefined;
/* functional template */
var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

var liButton = normalizeComponent_1({ render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ }, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);

//

var script$1 = {
	name: 'Pagination',

	components: {
		liButton: liButton
	},

	props: {
		items: { default: 1 },
		itemsOnPage: { default: 1 },
		pages: { default: 0 },
		displayedPages: { default: 5 },
		edges: { default: 2 },
		currentPage: { default: 1 },
		hrefTextPrefix: { default: '#page-' },
		hrefTextSuffix: { default: '' },
		prevText: { default: 'prev' },
		nextText: { default: 'next' },
		ellipseText: { default: '&hellip;' },
		ellipsePageSet: { default: true },
		selectOnClick: { default: true },
		invertPageOrder: { default: false },
		useStartEdge: { default: true },
		useEndEdge: { default: true },
		disable: { default: false },
		listStyle: { default: 'v-pagination' }
	},

	computed: {
		_pages: function _pages() {
			if (this.pages) return this.pages;
			return Math.ceil(this.items / this.itemsOnPage) ? Math.ceil(this.items / this.itemsOnPage) : 1;
		},
		_currentPage: function _currentPage() {
			if (this.currentPage) {
				var index = this.prepareIndex(this.currentPage - 1);

				if (index + 1 !== this.currentPage) {
					this.selectPage(index);
				}
				return index;
			}

			return !this.invertPageOrder ? 0 : this._pages - 1;
		},
		_halfDisplayed: function _halfDisplayed() {
			return this.displayedPages / 2;
		},
		_startEdges: function _startEdges() {
			var indexes = [];
			var ellipse = false;
			var edges = false;

			if (!this.invertPageOrder) {
				if (this._interval.start > 0 && this.edges > 0) {
					if (this.useStartEdge) {
						var end = Math.min(this.edges, this._interval.start);
						for (var i = 0; i < end; i++) {
							indexes.push(i);
						}
					}
					if (this.edges < this._interval.start && this._interval.start - this.edges != 1) {
						ellipse = true;
					} else if (this._interval.start - this.edges == 1) {
						edges = this.edges;
					}
				}
			} else {
				if (this._interval.end < this._pages && this.edges > 0) {
					if (this.useStartEdge) {
						var begin = Math.max(this._pages - this.edges, this._interval.end);
						for (var _i = this._pages - 1; _i >= begin; _i--) {
							indexes.push(_i);
						}
					}

					if (this._pages - this.edges > this._interval.end && this._pages - this.edges - this._interval.end != 1) {
						ellipse = true;
					} else if (this._pages - this.edges - this._interval.end == 1) {
						edges = this._interval.end;
					}
				}
			}

			return {
				indexes: indexes,
				ellipse: ellipse,
				edges: edges
			};
		},
		_intervalLinks: function _intervalLinks() {
			var indexes = [];

			if (!this.invertPageOrder) {
				for (var i = this._interval.start; i < this._interval.end; i++) {
					indexes.push(i);
				}
			} else {
				for (var _i2 = this._interval.end - 1; _i2 >= this._interval.start; _i2--) {
					indexes.push(_i2);
				}
			}
			return indexes;
		},
		_endEdges: function _endEdges() {
			var indexes = [];
			var ellipse = false;
			var edges = false;

			if (!this.invertPageOrder) {
				if (this._interval.end < this._pages && this.edges > 0) {
					if (this._pages - this.edges > this._interval.end && this._pages - this.edges - this._interval.end != 1) {
						ellipse = true;
					} else if (this._pages - this.edges - this._interval.end == 1) {
						edges = this._interval.end;
					}
					if (this.useEndEdge) {
						var begin = Math.max(this._pages - this.edges, this._interval.end);
						for (var i = begin; i < this._pages; i++) {
							indexes.push(i);
						}
					}
				}
			} else {
				if (this._interval.start > 0 && this.edges > 0) {
					if (this.edges < this._interval.start && this._interval.start - this.edges != 1) {
						ellipse = true;
					} else if (this._interval.start - this.edges == 1) {
						edges = this.edges;
					}

					if (this.useEndEdge) {
						var end = Math.min(this.edges, this._interval.start);
						for (var _i3 = end - 1; _i3 >= 0; _i3--) {
							indexes.push(_i3);
						}
					}
				}
			}

			return {
				indexes: indexes,
				ellipse: ellipse,
				edges: edges
			};
		},
		_interval: function _interval() {
			return {
				start: Math.ceil(this._currentPage > this._halfDisplayed ? Math.max(Math.min(this._currentPage - this._halfDisplayed, this._pages - this.displayedPages), 0) : 0),
				end: Math.ceil(this._currentPage > this._halfDisplayed ? Math.min(this._currentPage + this._halfDisplayed, this._pages) : Math.min(this.displayedPages, this._pages))
			};
		},
		_prevPage: function _prevPage() {
			return this.prepareIndex(!this.invertPageOrder ? this._currentPage - 1 : this._currentPage + 1);
		},
		_nextPage: function _nextPage() {
			return this.prepareIndex(!this.invertPageOrder ? this._currentPage + 1 : this._currentPage - 1);
		},
		disabled: function disabled() {
			return this.disable;
		}
	},

	methods: {
		selectPage: function selectPage(index) {
			this.$emit('select-page', this.prepareIndex(index) + 1);
		},
		prevPage: function prevPage() {
			this.selectPage(this._currentPage - 1);
		},
		nextPage: function nextPage() {
			this.selectPage(this._currentPage + 1);
		},
		getPagesCount: function getPagesCount() {
			return this._pages;
		},
		getCurrentPage: function getCurrentPage() {
			return this._currentPage;
		},
		prepareIndex: function prepareIndex(index) {
			return index < 0 ? 0 : index < this._pages ? index : this._pages - 1;
		}
	}
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = "ul.v-pagination{list-style:none}.v-pagination{display:inline-block;overflow:hidden;padding:0 5px 5px 0;margin:0}.v-pagination ul{list-style:none;padding:0;margin:0}.v-pagination li{list-style:none;padding:0;margin:0;float:left;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}span.ellipse.clickable{cursor:pointer}.ellipse input{width:3em}.compact-theme span{cursor:pointer}.compact-theme a,.compact-theme span{float:left;color:#333;font-size:14px;line-height:24px;font-weight:400;text-align:center;border:1px solid #aaa;border-left:none;min-width:14px;padding:0 7px;-webkit-box-shadow:2px 2px 2px rgba(0,0,0,.2);box-shadow:2px 2px 2px rgba(0,0,0,.2);background:-webkit-gradient(linear,left top, left bottom,color-stop(0, #fff),to(#efefef));background:linear-gradient(top,#fff 0,#efefef 100%)}.compact-theme a:hover,.compact-theme li:not(.disabled):not(.active) span:hover{text-decoration:none;background:-webkit-gradient(linear,left top, left bottom,color-stop(0, #efefef),to(#bbb));background:linear-gradient(top,#efefef 0,#bbb 100%)}.compact-theme li:first-child a,.compact-theme li:first-child span{border-left:1px solid #aaa;border-radius:3px 0 0 3px}.compact-theme li:last-child a,.compact-theme li:last-child span{border-radius:0 3px 3px 0}.compact-theme .current{background:-webkit-gradient(linear,left top, left bottom,color-stop(0, #bbb),to(#efefef));background:linear-gradient(top,#bbb 0,#efefef 100%);cursor:default}.compact-theme .ellipse{background:#eaeaea;padding:0 10px;cursor:default}.light-theme span{cursor:pointer}.light-theme a,.light-theme span{float:left;color:#666;font-size:14px;line-height:24px;font-weight:400;text-align:center;border:1px solid #bbb;min-width:14px;padding:0 7px;margin:0 5px 0 0;border-radius:3px;-webkit-box-shadow:0 1px 2px rgba(0,0,0,.2);box-shadow:0 1px 2px rgba(0,0,0,.2);background:-webkit-gradient(linear,left top, left bottom,color-stop(0, #fff),to(#efefef));background:linear-gradient(top,#fff 0,#efefef 100%)}.light-theme a:hover,.light-theme li:not(.disabled):not(.active) span:hover{text-decoration:none;background:#fcfcfc}.light-theme .current{background:#666;color:#fff;border-color:#444;-webkit-box-shadow:0 1px 0 rgba(255,255,255,1),0 0 2px rgba(0,0,0,.3) inset;box-shadow:0 1px 0 rgba(255,255,255,1),0 0 2px rgba(0,0,0,.3) inset;cursor:default}.light-theme .ellipse{background:0 0;border:none;border-radius:0;-webkit-box-shadow:none;box-shadow:none;font-weight:700;cursor:default}.dark-theme span{cursor:pointer}.dark-theme a,.dark-theme span{float:left;color:#ccc;font-size:14px;line-height:24px;font-weight:400;text-align:center;border:1px solid #222;min-width:14px;padding:0 7px;margin:0 5px 0 0;border-radius:3px;-webkit-box-shadow:0 1px 2px rgba(0,0,0,.2);box-shadow:0 1px 2px rgba(0,0,0,.2);background:-webkit-gradient(linear,left top, left bottom,color-stop(0, #555),to(#333));background:linear-gradient(top,#555 0,#333 100%)}.dark-theme a:hover,.dark-theme li:not(.disabled):not(.active) span:hover{text-decoration:none;background:#444}.dark-theme .current{background:#222;color:#fff;border-color:#000;-webkit-box-shadow:0 1px 0 rgba(255,255,255,.2),0 0 1px 1px rgba(0,0,0,.1) inset;box-shadow:0 1px 0 rgba(255,255,255,.2),0 0 1px 1px rgba(0,0,0,.1) inset;cursor:default}.dark-theme .ellipse{background:0 0;border:none;border-radius:0;-webkit-box-shadow:none;box-shadow:none;font-weight:700;cursor:default}";
styleInject(css);

/* script */
var __vue_script__$1 = script$1;
/* template */
var __vue_render__$1 = function __vue_render__() {
  var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('ul', { class: _vm.listStyle }, [_vm.prevText ? _c('li', { class: { disabled: _vm.disabled || _vm._prevPage === _vm._currentPage } }, [_vm._prevPage === _vm._currentPage || _vm.disabled ? _c('span', { staticClass: "prev", class: { current: _vm._prevPage === _vm._currentPage }, domProps: { "textContent": _vm._s(_vm.prevText) } }, [_vm._v("prev")]) : _vm._e(), _vm._v(" "), _vm._prevPage !== _vm._currentPage && !_vm.disabled ? _c('a', { staticClass: "prev", attrs: { "href": _vm.hrefTextPrefix ? _vm.hrefTextPrefix + (_vm._prevPage + 1) : 'javascript:void(0)' }, domProps: { "textContent": _vm._s(_vm.prevText) }, on: { "click": function click($event) {
        return _vm.selectPage(_vm._prevPage);
      } } }, [_vm._v("prev")]) : _vm._e()]) : _vm._e(), _vm._v(" "), _vm._l(_vm._startEdges.indexes, function (pageIndex) {
    return _c('li-button', { key: pageIndex, attrs: { "index": pageIndex, "current": _vm._currentPage, "disabled": _vm.disabled, "prefix": _vm.hrefTextPrefix }, on: { "select-page": function selectPage($event) {
          return _vm.selectPage(pageIndex);
        } } });
  }), _vm._v(" "), _vm._startEdges.ellipse ? _c('li', { staticClass: "disabled" }, [_c('span', { staticClass: "ellipse", domProps: { "innerHTML": _vm._s(_vm.ellipseText) } })]) : _vm._e(), _vm._v(" "), _vm._startEdges.edges !== false ? _c('li-button', { attrs: { "index": _vm._startEdges.edges, "current": _vm._currentPage, "disabled": _vm.disabled, "prefix": _vm.hrefTextPrefix }, on: { "select-page": function selectPage($event) {
        return _vm.selectPage(_vm._startEdges.edges);
      } } }) : _vm._e(), _vm._v(" "), _vm._l(_vm._intervalLinks, function (pageIndex) {
    return _c('li-button', { key: pageIndex, attrs: { "index": pageIndex, "current": _vm._currentPage, "disabled": _vm.disabled, "prefix": _vm.hrefTextPrefix }, on: { "select-page": function selectPage($event) {
          return _vm.selectPage(pageIndex);
        } } });
  }), _vm._v(" "), _vm._endEdges.edges !== false ? _c('li-button', { attrs: { "index": _vm._endEdges.edges, "current": _vm._currentPage, "disabled": _vm.disabled, "prefix": _vm.hrefTextPrefix }, on: { "select-page": function selectPage($event) {
        return _vm.selectPage(_vm._endEdges.edges);
      } } }) : _vm._e(), _vm._v(" "), _vm._endEdges.ellipse ? _c('li', { staticClass: "disabled" }, [_c('span', { staticClass: "ellipse", domProps: { "innerHTML": _vm._s(_vm.ellipseText) } })]) : _vm._e(), _vm._v(" "), _vm._l(_vm._endEdges.indexes, function (pageIndex) {
    return _c('li-button', { key: pageIndex, attrs: { "index": pageIndex, "current": _vm._currentPage, "disabled": _vm.disabled, "prefix": _vm.hrefTextPrefix }, on: { "select-page": function selectPage($event) {
          return _vm.selectPage(pageIndex);
        } } });
  }), _vm._v(" "), _vm.nextText ? _c('li', { class: { disabled: _vm.disabled || _vm._nextPage === _vm._currentPage } }, [_vm._nextPage === _vm._currentPage || _vm.disabled ? _c('span', { staticClass: "next", class: { current: _vm._nextPage === _vm._currentPage }, domProps: { "textContent": _vm._s(_vm.nextText) } }, [_vm._v("next")]) : _vm._e(), _vm._v(" "), _vm._nextPage !== _vm._currentPage && !_vm.disabled ? _c('a', { staticClass: "next", attrs: { "href": _vm.hrefTextPrefix ? _vm.hrefTextPrefix + (_vm._nextPage + 1) : 'javascript:void(0)' }, domProps: { "textContent": _vm._s(_vm.nextText) }, on: { "click": function click($event) {
        return _vm.selectPage(_vm._nextPage);
      } } }, [_vm._v("next")]) : _vm._e()]) : _vm._e()], 2);
};
var __vue_staticRenderFns__$1 = [];

/* style */
var __vue_inject_styles__$1 = undefined;
/* scoped */
var __vue_scope_id__$1 = undefined;
/* module identifier */
var __vue_module_identifier__$1 = undefined;
/* functional template */
var __vue_is_functional_template__$1 = false;
/* style inject */

/* style inject SSR */

var Pagination = normalizeComponent_1({ render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 }, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, undefined, undefined);

// install function executed by Vue.use()
function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component(Pagination.name, Pagination);
}

// Create module definition for Vue.use()
var plugin = {
  install: install

  // To auto-install when vue is found
  /* global window global */
};var GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

// Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()
Pagination.install = install;

// It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;

export default Pagination;
