import Vue from 'vue'
import Router from 'vue-router'
import { getToken } from '../utils/auth'

Vue.use(Router)

const Login = resolve => require(['../components/page/Login.vue'], resolve)
const Home = resolve => require(['../components/common/Home.vue'], resolve)

// 图书管理
const BookIndex = resolve => require(['../components/page/BookIndex.vue'], resolve)
const BookAddEdit = resolve => require(['../components/page/BookAddEdit.vue'], resolve)
const BookShow = resolve => require(['../components/page/BookShow.vue'], resolve)

// 管理员管理
const AdminIndex = resolve => require(['../components/page/AdminIndex.vue'], resolve)
const AdminAddEdit = resolve => require(['../components/page/AdminAddEdit.vue'], resolve)

const router = new Router({
    mode: 'history', //后端支持可开
    saveScrollPosition: true,
    routes: [
        {
            name: '首页',
            path: '/',
            redirect: '/index'
        },
        {
            name: '登录',
            path: '/login',
            component: Login
        },
        {
            path: '/index',
            component: Home,
            redirect: '/bookindex',
            children: [
                {
                    name: '图书列表',
                    path: '/bookindex',
                    component: BookIndex
                },
                {
                    name: '添加图书',
                    path: '/bookadd',
                    component: BookAddEdit
                },
                {
                    name: '编辑图书',
                    path: '/bookedit/:id',
                    component: BookAddEdit,
                    meta: { isEdit: true }
                },
                {
                    name: '图书详情',
                    path: '/bookshow/:id',
                    component: BookShow
                },

                {
                    name: '管理员管理',
                    path: '/admin',
                    redirect: '/adminindex'
                },
                {
                    name: '管理员列表',
                    path: '/adminindex',
                    component: AdminIndex
                },
                {
                    name: '添加管理员',
                    path: '/adminadd',
                    component: AdminAddEdit
                },
                {
                    name: '编辑管理员',
                    path: '/adminedit/:id',
                    component: AdminAddEdit,
                    meta: { isEdit: true }
                }
            ]
        }
    ]
})

/*router.beforeEach((to, from, next) => {
    if (!getToken()) {
        if (to.path === '/login') {
            next()
        } else {
            next({
                path: '/login'
            })
        }
    } else {
        if (to.path === '/login') {
            next({
                path: '/'
            })
        } else {
            next()
        }
    }
})*/

export default router