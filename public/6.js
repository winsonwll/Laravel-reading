webpackJsonp([6],{168:function(e,t,r){"use strict";r.d(t,"a",function(){return o}),r.d(t,"b",function(){return a}),r.d(t,"c",function(){return n});var o="https://appvf.com/admin/",a=0,n=[{value:0,label:"全 部"},{value:1,label:"心灵成长"},{value:2,label:"婚姻亲子"},{value:3,label:"职场进阶"},{value:4,label:"管理创业"},{value:5,label:"文化历史"},{value:6,label:"其 他"}]},170:function(e,t,r){"use strict";r.d(t,"n",function(){return l}),t.o=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return u({url:"login",method:"post",data:e})},t.p=function(){return u({url:"logout",method:"get"})},t.h=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return u({url:"book",method:"get",params:e})},t.j=function(e){return u({url:"book/online/"+e,method:"post"})},t.i=function(e){return u({url:"book/offline/"+e,method:"post"})},t.f=function(e){return u({url:"book/"+e,method:"delete"})},t.g=function(e){return u({url:"book/"+e,method:"get"})},t.l=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return u({url:"book/"+e,method:"patch",data:t})},t.k=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return u({url:"book",method:"post",data:e})},t.m=function(e){return u({url:"book/"+e,method:"get"})},t.c=function(){return u({url:"admin",method:"get"})},t.a=function(e){return u({url:"admin/"+e,method:"delete"})},t.b=function(e){return u({url:"admin/"+e,method:"get"})},t.e=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return u({url:"admin/"+e,method:"patch",data:t})},t.d=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return u({url:"admin",method:"post",data:e})};var o=r(44),a=r.n(o),n=r(168);window.axios.defaults.headers.common={"X-CSRF-TOKEN":document.querySelector('meta[name="csrf-token"]').getAttribute("content"),"X-Requested-With":"XMLHttpRequest"};var u=a.a.create({baseURL:n.a,timeout:5e3}),l=n.a+"captcha/"+(new Date).getTime()},222:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=r(170),a=r(168);t.default={data:function(){var e=this;return{isDisabled:!1,id:void 0,ruleForm:{name:void 0,password:void 0,repassword:void 0,auth:"0"},rules:{name:[{required:!0,message:"请输入用户名",trigger:"blur"},{min:6,max:12,message:"用户名为6-12位字符",trigger:"blur"}],password:[{required:!0,validator:function(e,t,r){""===t?r(new Error("请输入密码")):((t.length<6||t.length>12)&&r(new Error("密码为 6-12 位字符")),r())},trigger:"blur"}],repassword:[{required:!0,validator:function(t,r,o){""===r?o(new Error("请再次输入密码")):r!==e.ruleForm.password?o(new Error("两次输入密码不一致!")):o()},trigger:"blur"}],auth:[{required:!0,message:"请选择权限",trigger:"change"}]},loading:!1}},computed:{isEdit:function(){return this.$route.meta.isEdit}},created:function(){this.isEdit&&(this.isDisabled=!0,this.id=this.$route.params.id,this.getAdminInfo())},methods:{getAdminInfo:function(){var e=this;Object(o.b)(this.id).then(function(t){if(t&&t.data.status==a.b){var r=t.data.data;r.password="",r.auth=r.auth+"",e.ruleForm=r}else e.$message.error("获取信息失败")}).catch(function(t){e.$message.error(t)})},onSubmit:function(){var e=this;this.$refs.ruleForm.validate(function(t){if(!t)return!1;e.loading=!0,e.isEdit?Object(o.e)(e.id,e.ruleForm).then(function(t){t&&t.data.status==a.b?(e.$message.success("修改成功"),setTimeout(function(){e.$router.push("/admin")},1e3)):e.$message.error("修改失败"),e.loading=!1}).catch(function(t){e.$message.error(t)}):Object(o.d)(e.ruleForm).then(function(t){t&&t.data.status==a.b?(e.$message.success("创建成功"),setTimeout(function(){e.$router.push("/admin")},1e3)):e.$message.error("创建失败"),e.loading=!1}).catch(function(t){e.$message.error(t)})})},cancelForm:function(){this.$router.go(-1)}}}},223:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("div",{staticClass:"crumbs"},[r("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[r("el-breadcrumb-item",[r("i",{staticClass:"el-icon-date"}),e._v(" 管理员管理")]),e._v(" "),r("el-breadcrumb-item",[e._v("添加管理员")])],1)],1),e._v(" "),r("div",{staticClass:"form-box"},[r("el-form",{ref:"ruleForm",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"150px"}},[r("el-tooltip",{attrs:{content:"用户名为 6-12 位字符",placement:"top"}},[r("el-form-item",{attrs:{label:"用户名",prop:"name"}},[r("el-input",{attrs:{disabled:e.isDisabled,placeholder:"请输入用户名"},model:{value:e.ruleForm.name,callback:function(t){e.$set(e.ruleForm,"name","string"==typeof t?t.trim():t)},expression:"ruleForm.name"}})],1)],1),e._v(" "),r("el-tooltip",{attrs:{content:"密码为 6-12 位字符",placement:"top"}},[r("el-form-item",{attrs:{label:"密 码",prop:"password"}},[r("el-input",{attrs:{type:"password","auto-complete":"off",placeholder:"请输入密码"},model:{value:e.ruleForm.password,callback:function(t){e.$set(e.ruleForm,"password","string"==typeof t?t.trim():t)},expression:"ruleForm.password"}})],1)],1),e._v(" "),r("el-form-item",{attrs:{label:"确认密码",prop:"repassword"}},[r("el-input",{attrs:{type:"password","auto-complete":"off",placeholder:"请输入密码"},model:{value:e.ruleForm.repassword,callback:function(t){e.$set(e.ruleForm,"repassword","string"==typeof t?t.trim():t)},expression:"ruleForm.repassword"}})],1),e._v(" "),r("el-form-item",{attrs:{label:"权 限",prop:"auth"}},[r("el-radio",{attrs:{label:"0"},model:{value:e.ruleForm.auth,callback:function(t){e.$set(e.ruleForm,"auth",t)},expression:"ruleForm.auth"}},[e._v("普通管理员")]),e._v(" "),r("el-radio",{attrs:{label:"1"},model:{value:e.ruleForm.auth,callback:function(t){e.$set(e.ruleForm,"auth",t)},expression:"ruleForm.auth"}},[e._v("超级管理员")])],1),e._v(" "),r("el-form-item",[r("el-button",{attrs:{type:"primary",loading:e.loading},on:{click:e.onSubmit}},[e._v("确认提交")]),e._v(" "),r("el-button",{on:{click:e.cancelForm}},[e._v("取 消")])],1)],1)],1)])},staticRenderFns:[]}},230:function(e,t,r){var o=r(73)(r(222),r(223),!1,null,null,null);e.exports=o.exports}});