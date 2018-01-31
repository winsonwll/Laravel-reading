webpackJsonp([14],{

/***/ 194:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(245)
}
var normalizeComponent = __webpack_require__(76)
/* script */
var __vue_script__ = __webpack_require__(247)
/* template */
var __vue_template__ = __webpack_require__(248)
/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-7b70ae5d"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources\\assets\\js\\components\\page\\BookIndex.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7b70ae5d", Component.options)
  } else {
    hotAPI.reload("data-v-7b70ae5d", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),

/***/ 198:
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(199)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),

/***/ 199:
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),

/***/ 200:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return apiDomain; });
/* unused harmony export loginUrl */
/* unused harmony export userUrl */
var apiDomain = 'http://127.0.0.1:8000/';
var loginUrl = apiDomain + 'oauth/token';
var userUrl = apiDomain + 'api/user';

/***/ }),

/***/ 245:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(246);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(198)("33a92d58", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7b70ae5d\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./BookIndex.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7b70ae5d\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./BookIndex.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 246:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(75)(undefined);
// imports


// module
exports.push([module.i, "\n.handle-box[data-v-7b70ae5d] {\n    margin-bottom: 20px;\n}\n.handle-select[data-v-7b70ae5d] {\n    width: 120px;\n}\n.handle-input[data-v-7b70ae5d] {\n    width: 300px;\n    display: inline-block;\n}\n.el-table .cell .el-button[data-v-7b70ae5d] {\n    margin: 5px 0;\n}\n", ""]);

// exports


/***/ }),

/***/ 247:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(200);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
    data: function data() {
        return {
            load: true,
            gid: '',
            options: [{
                value: '0',
                label: '全 部'
            }, {
                value: '1',
                label: '心灵成长'
            }, {
                value: '2',
                label: '婚姻亲子'
            }, {
                value: '3',
                label: '职场进阶'
            }, {
                value: '4',
                label: '管理创业'
            }, {
                value: '5',
                label: '文化历史'
            }, {
                value: '6',
                label: '其 他'
            }],
            keyword: '',
            tableData: [],

            cur_page: 1,
            total: 0,
            loading: false
        };
    },
    created: function created() {
        // 获取图书列表
        this.getData();
    },

    methods: {
        handleCurrentChange: function handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
        },

        // 获取图书列表
        getData: function getData() {
            var _this = this;

            var self = this;
            var url = __WEBPACK_IMPORTED_MODULE_0__config__["a" /* apiDomain */] + 'book';
            var params = {};

            if (self.gid || self.keyword) {
                params = {
                    gid: self.gid,
                    keyword: self.keyword,
                    page: self.cur_page
                };
            } else {
                params = {
                    page: self.cur_page
                };
            }

            this.load = true;

            this.$http.get(url, {
                params: params
            }).then(function (res) {
                if (res && res.status == 200 && res.data.status) {
                    var result = res.data.data;

                    self.tableData = result.data;
                    self.tableData.forEach(function (val, index, arr) {
                        val.coverimgs = val.coverimgs.split(',')[0];
                        val.genre = self.options[val.gid].label;
                        switch (val.status) {
                            case 0:
                                val.state = '未上线';
                                break;
                            case 1:
                                val.state = '已上线';
                                break;
                            case 2:
                                val.state = '已下线';
                                break;
                            case 3:
                                val.state = '已删除';
                                break;
                        }
                    });
                    self.total = result.total;
                } else {
                    _this.$message.error('获取图书列表失败！');
                }
            }).catch(function (error) {
                _this.$message.error(error);
            });

            this.load = false;
        },


        // 上线
        handleOnline: function handleOnline(index, row) {
            var _this2 = this;

            var id = row.id;
            var url = __WEBPACK_IMPORTED_MODULE_0__config__["a" /* apiDomain */] + 'book/online/' + id;
            if (this.loading) return;

            this.loading = true;
            this.$http.post(url).then(function (res) {
                if (res && res.status == 200 && res.data.status) {
                    _this2.tableData[index].status = 1;
                    _this2.tableData[index].state = '已上线';
                    _this2.$message.success('上线成功！');
                } else {
                    _this2.$message.error('上线失败！');
                }
                _this2.loading = false;
            }).catch(function (error) {
                _this2.$message.error(error);
            });
        },


        // 下线
        handleOffline: function handleOffline(index, row) {
            var _this3 = this;

            var id = row.id;
            var url = __WEBPACK_IMPORTED_MODULE_0__config__["a" /* apiDomain */] + 'book/offline/' + id;
            if (this.loading) return;

            this.loading = true;
            this.$http.post(url).then(function (res) {
                if (res && res.status == 200 && res.data.status) {
                    _this3.tableData[index].status = 2;
                    _this3.tableData[index].state = '已下线';
                    _this3.$message.success('下线成功！');
                } else {
                    _this3.$message.error('下线失败！');
                }
                _this3.loading = false;
            }).catch(function (error) {
                _this3.$message.error(error);
            });
        },


        // 查看
        handleShow: function handleShow(index, row) {
            var id = row.id;
            this.$router.push('/bookshow/' + id);
        },


        // 编辑
        handleEdit: function handleEdit(index, row) {
            var id = row.id;
            this.$router.push('/bookedit/' + id);
        },


        // 删除
        handleDelete: function handleDelete(index, row) {
            var _this4 = this;

            var id = row.id;
            var url = __WEBPACK_IMPORTED_MODULE_0__config__["a" /* apiDomain */] + 'book/' + id;

            if (this.loading) return;

            this.$confirm('此操作将删除图书 ' + row.title + ', 是否继续?', '提示', { type: 'warning' }).then(function () {
                // 向请求服务端删除
                _this4.loading = true;
                _this4.$http.delete(url).then(function (res) {
                    if (res && res.status == 200 && res.data.status) {
                        _this4.tableData[index].status = 3;
                        _this4.tableData[index].state = '已删除';
                        _this4.$message.success('删除成功！');
                    } else {
                        _this4.$message.error('删除失败！');
                    }
                    _this4.loading = false;
                }).catch(function (error) {
                    _this4.$message.error(error);
                });
            }).catch(function () {
                _this4.$message.info('已取消操作！');
            });
        },
        search: function search() {
            this.cur_page = 1;
            this.getData();
        }
    }
});

/***/ }),

/***/ 248:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "table" },
    [
      _c(
        "div",
        { staticClass: "crumbs" },
        [
          _c(
            "el-breadcrumb",
            { attrs: { "separator-class": "el-icon-arrow-right" } },
            [
              _c("el-breadcrumb-item", [
                _c("i", { staticClass: "el-icon-menu" }),
                _vm._v(" 图书管理")
              ]),
              _vm._v(" "),
              _c("el-breadcrumb-item", [_vm._v("图书列表")])
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "handle-box" },
        [
          _c(
            "el-select",
            {
              staticClass: "handle-select mr10",
              attrs: { placeholder: "选择类别" },
              model: {
                value: _vm.gid,
                callback: function($$v) {
                  _vm.gid = $$v
                },
                expression: "gid"
              }
            },
            _vm._l(_vm.options, function(item) {
              return _c("el-option", {
                key: item.value,
                attrs: { label: item.label, value: item.value }
              })
            })
          ),
          _vm._v(" "),
          _c("el-input", {
            staticClass: "handle-input mr10",
            attrs: { placeholder: "输入关键词" },
            model: {
              value: _vm.keyword,
              callback: function($$v) {
                _vm.keyword = $$v
              },
              expression: "keyword"
            }
          }),
          _vm._v(" "),
          _c(
            "el-button",
            {
              attrs: { type: "primary", icon: "search" },
              on: { click: _vm.search }
            },
            [_vm._v("搜索")]
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "el-table",
        {
          directives: [
            {
              name: "loading",
              rawName: "v-loading",
              value: _vm.load,
              expression: "load"
            }
          ],
          staticStyle: { width: "100%" },
          attrs: {
            data: _vm.tableData,
            stripe: "",
            border: "",
            "element-loading-text": "拼命加载中..."
          }
        },
        [
          _c("el-table-column", {
            attrs: { prop: "id", label: "ID", width: "40", align: "center" }
          }),
          _vm._v(" "),
          _c("el-table-column", {
            attrs: { prop: "title", label: "书名", align: "center" }
          }),
          _vm._v(" "),
          _c("el-table-column", {
            attrs: { prop: "catalog", label: "序言", align: "center" }
          }),
          _vm._v(" "),
          _c("el-table-column", {
            attrs: { prop: "genre", label: "类别", align: "center" }
          }),
          _vm._v(" "),
          _c(
            "el-table-column",
            { attrs: { label: "来自豆瓣信息", align: "center" } },
            [
              _c("el-table-column", {
                attrs: { prop: "doubanId", label: "豆瓣ID", align: "center" }
              }),
              _vm._v(" "),
              _c("el-table-column", {
                attrs: { prop: "author", label: "作者", align: "center" }
              }),
              _vm._v(" "),
              _c("el-table-column", {
                attrs: {
                  prop: "coverimgs",
                  label: "封面",
                  width: "122",
                  align: "center"
                },
                scopedSlots: _vm._u([
                  {
                    key: "default",
                    fn: function(scope) {
                      return [
                        _c("img", { attrs: { src: scope.row.coverimgs } })
                      ]
                    }
                  }
                ])
              }),
              _vm._v(" "),
              _c("el-table-column", {
                attrs: { prop: "summary", label: "概要", align: "center" }
              }),
              _vm._v(" "),
              _c("el-table-column", {
                attrs: { prop: "pubdate", label: "出版日期", align: "center" }
              }),
              _vm._v(" "),
              _c("el-table-column", {
                attrs: {
                  prop: "score",
                  label: "评分",
                  width: "50",
                  align: "center"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "el-table-column",
            { attrs: { label: "数据统计", align: "center" } },
            [
              _c("el-table-column", {
                attrs: {
                  prop: "viewCnt",
                  label: "浏览",
                  width: "60",
                  align: "center"
                }
              }),
              _vm._v(" "),
              _c("el-table-column", {
                attrs: {
                  prop: "wishCnt",
                  label: "点赞",
                  width: "60",
                  align: "center"
                }
              }),
              _vm._v(" "),
              _c("el-table-column", {
                attrs: {
                  prop: "collectCnt",
                  label: "收藏",
                  width: "60",
                  align: "center"
                }
              }),
              _vm._v(" "),
              _c("el-table-column", {
                attrs: {
                  prop: "commentCnt",
                  label: "评论",
                  width: "60",
                  align: "center"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c("el-table-column", {
            attrs: { prop: "state", label: "状态", align: "center" }
          }),
          _vm._v(" "),
          _c("el-table-column", {
            attrs: { label: "操作", prop: "status", align: "center" },
            scopedSlots: _vm._u([
              {
                key: "default",
                fn: function(scope) {
                  return [
                    scope.row.status == 1
                      ? _c(
                          "el-button",
                          {
                            attrs: {
                              size: "small",
                              type: "warning",
                              loading: _vm.loading
                            },
                            on: {
                              click: function($event) {
                                _vm.handleOffline(scope.$index, scope.row)
                              }
                            }
                          },
                          [_vm._v("下线")]
                        )
                      : _c(
                          "el-button",
                          {
                            attrs: {
                              size: "small",
                              type: "primary",
                              loading: _vm.loading
                            },
                            on: {
                              click: function($event) {
                                _vm.handleOnline(scope.$index, scope.row)
                              }
                            }
                          },
                          [_vm._v("上线")]
                        ),
                    _vm._v(" "),
                    _c(
                      "el-button",
                      {
                        attrs: { size: "small" },
                        on: {
                          click: function($event) {
                            _vm.handleShow(scope.$index, scope.row)
                          }
                        }
                      },
                      [_vm._v("查看")]
                    ),
                    _vm._v(" "),
                    _c(
                      "el-button",
                      {
                        attrs: { size: "small" },
                        on: {
                          click: function($event) {
                            _vm.handleEdit(scope.$index, scope.row)
                          }
                        }
                      },
                      [_vm._v("编辑")]
                    ),
                    _vm._v(" "),
                    scope.row.status != 3
                      ? _c(
                          "el-button",
                          {
                            attrs: {
                              size: "small",
                              type: "danger",
                              loading: _vm.loading
                            },
                            on: {
                              click: function($event) {
                                _vm.handleDelete(scope.$index, scope.row)
                              }
                            }
                          },
                          [_vm._v("删除")]
                        )
                      : _vm._e()
                  ]
                }
              }
            ])
          })
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "pagination" },
        [
          _c("el-pagination", {
            attrs: { layout: "total, prev, pager, next", total: _vm.total },
            on: { "current-change": _vm.handleCurrentChange }
          })
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7b70ae5d", module.exports)
  }
}

/***/ })

});