webpackJsonp([13],{

/***/ 196:
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(251)
}
var normalizeComponent = __webpack_require__(76)
/* script */
var __vue_script__ = __webpack_require__(253)
/* template */
var __vue_template__ = __webpack_require__(254)
/* template functional */
  var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-124e70c2"
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
Component.options.__file = "resources\\assets\\js\\components\\page\\BookShow.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-124e70c2", Component.options)
  } else {
    hotAPI.reload("data-v-124e70c2", Component.options)
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

/***/ 251:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(252);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(198)("99c46224", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-124e70c2\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./BookShow.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-124e70c2\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0&bustCache!./BookShow.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 252:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(75)(undefined);
// imports


// module
exports.push([module.i, "\n.info-box[data-v-124e70c2] {\n    width: 70%;\n}\n.el-col[data-v-124e70c2] {\n    padding: 15px 0;\n    border-top: 1px solid #eee;\n    color: #666;\n}\nh3[data-v-124e70c2] {\n    font-size: 14px;\n    padding: 15px 0;\n}\n.bot-btn[data-v-124e70c2] {\n    margin-top: 20px;\n}\n", ""]);

// exports


/***/ }),

/***/ 253:
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
            bookData: {},
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
            }]
        };
    },
    created: function created() {
        this.getData();
    },

    methods: {
        getData: function getData() {
            var _this = this;

            var self = this;
            var url = __WEBPACK_IMPORTED_MODULE_0__config__["a" /* apiDomain */] + 'book/' + this.$route.params.id;

            this.$http.get(url).then(function (res) {
                if (res && res.status == 200 && res.data.status) {
                    var result = res.data.data;

                    result.coverimgs = result.coverimgs.split(',')[0];
                    result.genre = self.options[result.gid].label;
                    switch (result.status) {
                        case 0:
                            result.state = '未上线';
                            break;
                        case 1:
                            result.state = '已上线';
                            break;
                        case 2:
                            result.state = '已下线';
                            break;
                        case 3:
                            result.state = '已删除';
                            break;
                    }

                    self.bookData = result;
                } else {
                    _this.$message.error('获取图书信息失败！');
                }
            }).catch(function (error) {
                _this.$message.error(error);
                setTimeout(function () {
                    _this.$router.go(-1);
                }, 1e3);
            });
        }
    }
});

/***/ }),

/***/ 254:
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c(
      "div",
      { staticClass: "crumbs" },
      [
        _c(
          "el-breadcrumb",
          { attrs: { "separator-class": "el-icon-arrow-right" } },
          [
            _c("el-breadcrumb-item", [
              _c("i", { staticClass: "el-icon-date" }),
              _vm._v(" 图书管理")
            ]),
            _vm._v(" "),
            _c("el-breadcrumb-item", [_vm._v("图书信息")])
          ],
          1
        )
      ],
      1
    ),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "info-box" },
      [
        _c("h3", [_vm._v("基本信息")]),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("ID")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _vm._v(_vm._s(_vm.bookData.id))
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("书 名")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _vm._v(_vm._s(_vm.bookData.title))
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("序 言")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _vm._v(_vm._s(_vm.bookData.catalog))
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("类 别")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _vm._v(_vm._s(_vm.bookData.genre))
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("图书详情")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _vm._v(_vm._s(_vm.bookData.detail))
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("音频")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _vm.bookData.audio
                ? _c("audio", { attrs: { src: _vm.bookData.audio } }, [
                    _vm._v(
                      "\n                    您的浏览器不支持 audio 标签。\n                "
                    )
                  ])
                : _c("span", [_vm._v("暂无")])
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c("h3", [_vm._v("来自豆瓣信息")]),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("豆瓣ID")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _vm._v(_vm._s(_vm.bookData.doubanId))
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("作 者")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _vm._v(_vm._s(_vm.bookData.author))
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("封 面")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _c("img", { attrs: { src: _vm.bookData.coverimgs } })
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("概 要")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _vm._v(_vm._s(_vm.bookData.summary))
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("出版日期")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _vm._v(_vm._s(_vm.bookData.pubdate))
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("评 分")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _vm._v(_vm._s(_vm.bookData.score))
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c("h3", [_vm._v("数据统计")]),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("浏 览")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _vm._v(_vm._s(_vm.bookData.viewCnt))
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("点 赞")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _vm._v(_vm._s(_vm.bookData.wishCnt))
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("收 藏")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _vm._v(_vm._s(_vm.bookData.collectCnt))
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("评 论")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _vm._v(_vm._s(_vm.bookData.commentCnt))
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c("h3", [_vm._v("其他")]),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("状 态")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _vm._v(_vm._s(_vm.bookData.state))
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("创建时间")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _vm._v(_vm._s(_vm.bookData.created_at))
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "el-row",
          { attrs: { gutter: 20 } },
          [
            _c("el-col", { attrs: { span: 4 } }, [_vm._v("更新时间")]),
            _vm._v(" "),
            _c("el-col", { attrs: { span: 20 } }, [
              _vm._v(_vm._s(_vm.bookData.updated_at))
            ])
          ],
          1
        ),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "bot-btn" },
          [
            _vm.bookData.status == 1
              ? _c(
                  "el-button",
                  {
                    attrs: { type: "warning" },
                    on: { click: function($event) {} }
                  },
                  [_vm._v("下线")]
                )
              : _c(
                  "el-button",
                  {
                    attrs: { type: "primary" },
                    on: { click: function($event) {} }
                  },
                  [_vm._v("上线")]
                ),
            _vm._v(" "),
            _c(
              "el-button",
              {
                on: {
                  click: function($event) {
                    _vm.handleEdit(_vm.bookData)
                  }
                }
              },
              [_vm._v("编辑")]
            ),
            _vm._v(" "),
            _vm.bookData.status != 3
              ? _c(
                  "el-button",
                  {
                    attrs: { type: "danger" },
                    on: {
                      click: function($event) {
                        _vm.handleDelete(_vm.bookData)
                      }
                    }
                  },
                  [_vm._v("删除")]
                )
              : _vm._e()
          ],
          1
        )
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-124e70c2", module.exports)
  }
}

/***/ })

});