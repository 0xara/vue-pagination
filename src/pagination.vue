<!--suppress EqualityComparisonWithCoercionJS -->
<template>
    <ul :class="listStyle">
        <li v-if="prevText" :class="{disabled: disabled || _prevPage===_currentPage}">
            <span v-text="_prevText" :class="[{current: _prevPage===_currentPage}, _prevClass]" v-if="_prevPage===_currentPage || disabled">prev</span>
            <a :href="hrefTextPrefix ? hrefTextPrefix+(_prevPage+1) : 'javascript:void(0)'" :class="_prevClass" v-text="_prevText" v-if="_prevPage!==_currentPage && !disabled" @click="selectPage(_prevPage)">prev</a>
        </li>

        <li-button v-for="pageIndex in _startEdges.indexes" :key="pageIndex" :index="pageIndex" :current="_currentPage" :disabled="disabled" :prefix="hrefTextPrefix" @select-page="selectPage(pageIndex)"></li-button>
        <li class="disabled" v-if="_startEdges.ellipse"><span class="ellipse" v-html="ellipseText"></span></li>
        <li-button :index="_startEdges.edges" :current="_currentPage" :disabled="disabled" :prefix="hrefTextPrefix" v-if="_startEdges.edges !== false" @select-page="selectPage(_startEdges.edges)"></li-button>

        <li-button v-for="pageIndex in _intervalLinks" :key="pageIndex" :index="pageIndex" :current="_currentPage" :disabled="disabled" :prefix="hrefTextPrefix" @select-page="selectPage(pageIndex)"></li-button>

        <li-button :index="_endEdges.edges" :current="_currentPage" :disabled="disabled" :prefix="hrefTextPrefix" v-if="_endEdges.edges !== false" @select-page="selectPage(_endEdges.edges)"></li-button>
        <li class="disabled" v-if="_endEdges.ellipse"><span class="ellipse" v-html="ellipseText"></span></li>
        <li-button v-for="pageIndex in _endEdges.indexes" :key="pageIndex" :index="pageIndex" :current="_currentPage" :disabled="disabled" :prefix="hrefTextPrefix" @select-page="selectPage(pageIndex)"></li-button>

        <li v-if="nextText" :class="{disabled: disabled || _nextPage===_currentPage}">
            <span v-text="_nextText" class="next" :class="[{current: _nextPage===_currentPage}, _nextClass]" v-if="_nextPage===_currentPage || disabled">next</span>
            <a :href="hrefTextPrefix ? hrefTextPrefix+(_nextPage+1) : 'javascript:void(0)'" :class="_nextClass" v-text="_nextText" v-if="_nextPage!==_currentPage && !disabled" @click="selectPage(_nextPage)">next</a>
        </li>
    </ul>
</template>

<script>

    import liButton from './paginationButton.vue'

    export default {
		name: 'Pagination',

    	components: {
    		liButton
        },

    	props:{
			items: {default:1},
			itemsOnPage: {default:1},
			pages: {default:0},
			displayedPages: {default: 5},
			edges: {default:2},
			currentPage: {default: 1},
			hrefTextPrefix:{default: '#page-'},
			hrefTextSuffix:{default: ''},
            prevText: {default: 'prev'},
			nextText: {default: 'next'},
			ellipseText: {default: '&hellip;'},
			ellipsePageSet: {default: true},
			selectOnClick: {default: true},
			invertPageOrder : {default: false},
			useStartEdge : {default: true},
			useEndEdge : {default: true},
			disable : {default: false},
			listStyle: { default: 'v-pagination' }
        },

        computed:{
    		_pages() {
    			if(this.pages) return this.pages;
    			return Math.ceil(this.items / this.itemsOnPage) ? Math.ceil(this.items / this.itemsOnPage) : 1
            },
            _currentPage() {
				if (this.currentPage) {
					const index = this.prepareIndex(this.currentPage - 1);

					if((index + 1) !== this.currentPage) {
						this.selectPage(index);
                    }
					return index;
				}

				return !this.invertPageOrder ? 0 : this._pages - 1;
            },
            _halfDisplayed() {
    			return this.displayedPages / 2;
            },
            _startEdges() {
				const indexes = [];
				let ellipse = false;
				let edges = false;

    			if(!this.invertPageOrder) {
					if (this._interval.start > 0 && this.edges > 0) {
						if(this.useStartEdge) {
							var end = Math.min(this.edges, this._interval.start);
							for (let i = 0; i < end; i++) {
								indexes.push(i);
							}
						}
						if (this.edges < this._interval.start && (this._interval.start - this.edges != 1)) {
							ellipse = true;
						} else if (this._interval.start - this.edges == 1) {
							edges = this.edges;
						}
					}
                } else {
					if (this._interval.end < this._pages && this.edges > 0) {
						if(this.useStartEdge) {
							var begin = Math.max(this._pages - this.edges, this._interval.end);
							for (let i = this._pages - 1; i >= begin; i--) {
								indexes.push(i);
							}
						}

						if (this._pages - this.edges > this._interval.end && (this._pages - this.edges - this._interval.end != 1)) {
							ellipse = true;
						} else if (this._pages - this.edges - this._interval.end == 1) {
							edges = this._interval.end;
						}
					}
                }

    			return {
					indexes,
                    ellipse,
                    edges
                }
            },
            _intervalLinks() {
    			const indexes = [];

				if (!this.invertPageOrder) {
					for (let i = this._interval.start; i < this._interval.end; i++) {
						indexes.push(i);
					}
				} else {
					for (let i = this._interval.end - 1; i >= this._interval.start; i--) {
						indexes.push(i);
					}
				}
    			return indexes;
            },

            _endEdges() {
				const indexes = [];
				let ellipse = false;
				let edges = false;

				if (!this.invertPageOrder) {
					if (this._interval.end < this._pages && this.edges > 0) {
						if (this._pages - this.edges > this._interval.end && (this._pages - this.edges - this._interval.end != 1)) {
							ellipse = true;
						} else if (this._pages - this.edges - this._interval.end == 1) {
							edges = this._interval.end;
						}
						if(this.useEndEdge) {
							var begin = Math.max(this._pages - this.edges, this._interval.end);
							for (let i = begin; i < this._pages; i++) {
								indexes.push(i);
							}
						}
					}
				} else {
					if (this._interval.start > 0 && this.edges > 0) {
						if (this.edges < this._interval.start && (this._interval.start - this.edges != 1)) {
							ellipse = true;
						} else if (this._interval.start - this.edges == 1) {
							edges = this.edges;
						}

						if(this.useEndEdge) {
							var end = Math.min(this.edges, this._interval.start);
							for (let i = end - 1; i >= 0; i--) {
								indexes.push(i);
							}
						}
					}
				}

				return {
					indexes,
					ellipse,
					edges
				}
            },

			_interval() {
				return {
					start: Math.ceil(this._currentPage > this._halfDisplayed ? Math.max(Math.min(this._currentPage - this._halfDisplayed, (this._pages - this.displayedPages)), 0) : 0),
					end: Math.ceil(this._currentPage > this._halfDisplayed ? Math.min(this._currentPage + this._halfDisplayed, this._pages) : Math.min(this.displayedPages, this._pages))
				};
			},

			_prevPage() {
    			return this.prepareIndex(!this.invertPageOrder ? this._currentPage - 1 : this._currentPage + 1);
            },

            _nextPage() {
    			return this.prepareIndex(!this.invertPageOrder ? this._currentPage + 1 : this._currentPage - 1);
            },

			disabled() {
    			return this.disable;
            },

            _nextText() {
    			return !this.invertPageOrder ? this.nextText : this.prevText;
            },

			_prevText() {
				return !this.invertPageOrder ? this.prevText : this.nextText;
			},

			_nextClass() {
				return !this.invertPageOrder ? 'next' : 'prev';
			},

			_prevClass() {
				return !this.invertPageOrder ? 'prev' : 'next';
			}
        },


    	methods:{
    		selectPage(index) {
    			this.$emit('select-page',this.prepareIndex(index) + 1)
            },
			prevPage() {
    			this.selectPage(this._currentPage - 1);
            },
			nextPage() {
				this.selectPage(this._currentPage + 1);
			},
			getPagesCount() {
    			return this._pages;
            },
			getCurrentPage() {
    			return this._currentPage;
            },
            prepareIndex(index) {
    			return index < 0 ? 0 : (index < this._pages ? index : this._pages - 1);
            }
        }
    }

</script>

<style>
    ul.v-pagination {
        list-style: none;
    }

    .v-pagination {
        display: inline-block;
        overflow: hidden;
        padding: 0 5px 5px 0;
        margin: 0;
    }

    .v-pagination ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .v-pagination li {
        list-style: none;
        padding: 0;
        margin: 0;
        float: left;
        user-select: none;
    }
    span.ellipse.clickable {
        cursor: pointer;
    }

    .ellipse input {
        width: 3em;
    }

    /*------------------------------------*\
        Compact Theme Styles
    \*------------------------------------*/
    .compact-theme span {
        cursor:pointer;
    }

    .compact-theme a, .compact-theme span {
        float: left;
        color: #333;
        font-size:14px;
        line-height:24px;
        font-weight: normal;
        text-align: center;
        border: 1px solid #AAA;
        border-left: none;
        min-width: 14px;
        padding: 0 7px;
        box-shadow: 2px 2px 2px rgba(0,0,0,0.2);
        background: linear-gradient(top, #ffffff 0%,#efefef 100%); /* W3C */
    }

    .compact-theme a:hover, .compact-theme li:not(.disabled):not(.active) span:hover {
        text-decoration: none;
        background: linear-gradient(top, #efefef 0%,#bbbbbb 100%); /* W3C */
    }

    .compact-theme li:first-child a, .compact-theme li:first-child span {
        border-left: 1px solid #AAA;
        border-radius: 3px 0 0 3px;
    }

    .compact-theme li:last-child a, .compact-theme li:last-child span {
        border-radius: 0 3px 3px 0;
    }

    .compact-theme .current {
        background: linear-gradient(top, #bbbbbb 0%,#efefef 100%); /* W3C */
        cursor: default;
    }

    .compact-theme .ellipse {
        background: #EAEAEA;
        padding: 0 10px;
        cursor: default;
    }

    /*------------------------------------*\
        Light Theme Styles
    \*------------------------------------*/
    .light-theme span {
        cursor:pointer;
    }

    .light-theme a, .light-theme span {
        float: left;
        color: #666;
        font-size:14px;
        line-height:24px;
        font-weight: normal;
        text-align: center;
        border: 1px solid #BBB;
        min-width: 14px;
        padding: 0 7px;
        margin: 0 5px 0 0;
        border-radius: 3px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        background: linear-gradient(top, #ffffff 0%,#efefef 100%); /* W3C */
    }

    .light-theme a:hover, .light-theme li:not(.disabled):not(.active) span:hover {
        text-decoration: none;
        background: #FCFCFC;
    }

    .light-theme .current {
        background: #666;
        color: #FFF;
        border-color: #444;
        box-shadow: 0 1px 0 rgba(255,255,255,1), 0 0 2px rgba(0, 0, 0, 0.3) inset;
        cursor: default;
    }

    .light-theme .ellipse {
        background: none;
        border: none;
        border-radius: 0;
        box-shadow: none;
        font-weight: bold;
        cursor: default;
    }

    /*------------------------------------*\
        Dark Theme Styles
    \*------------------------------------*/
    .dark-theme span {
        cursor:pointer;
    }

    .dark-theme a, .dark-theme span {
        float: left;
        color: #CCC;
        font-size:14px;
        line-height:24px;
        font-weight: normal;
        text-align: center;
        border: 1px solid #222;
        min-width: 14px;
        padding: 0 7px;
        margin: 0 5px 0 0;
        border-radius: 3px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        background: linear-gradient(top, #555 0%,#333 100%); /* W3C */
    }

    .dark-theme a:hover, .dark-theme li:not(.disabled):not(.active) span:hover {
        text-decoration: none;
        background: #444;
    }

    .dark-theme .current {
        background: #222;
        color: #FFF;
        border-color: #000;
        box-shadow: 0 1px 0 rgba(255,255,255,0.2), 0 0 1px 1px rgba(0, 0, 0, 0.1) inset;
        cursor: default;
    }

    .dark-theme .ellipse {
        background: none;
        border: none;
        border-radius: 0;
        box-shadow: none;
        font-weight: bold;
        cursor: default;
    }
</style>