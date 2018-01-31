import axios from 'axios'
import { BASE_API } from '../utils/config'

window.axios.defaults.headers.common = {
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
    'X-Requested-With': 'XMLHttpRequest'
};

// 创建axios实例
const service = axios.create({
    baseURL: BASE_API,          // api的base_url
    timeout: 5000              // 请求超时时间
})


// 获取图片验证码
export const fetchCaptcha = `${BASE_API}captcha/` + new Date().getTime()

// 登录
export function fetchLogin( params = {} ) {
    return service({
        url: 'login',
        method: 'post',
        data: params
    })
}
// 退出登录
export function fetchLogout() {
    return service({
        url: 'logout',
        method: 'get'
    })
}

/*************** 图书管理 ***************/
// 获取图书列表
export function fetchBookList( params = {} ) {
    return service({
        url: 'book',
        method: 'get',
        params: params
    })
}

// 上线
export function fetchBookOnline( id ) {
    return service({
        url: `book/online/${id}`,
        method: 'post'
    })
}
// 下线
export function fetchBookOffline( id ) {
    return service({
        url: `book/offline/${id}`,
        method: 'post'
    })
}
// 删除
export function fetchBookDel( id ) {
    return service({
        url: `book/${id}`,
        method: 'delete'
    })
}
// 编辑
export function fetchBookEdit( id ) {
    return service({
        url: `book/${id}`,
        method: 'get'
    })
}
// 保存修改
export function fetchBookSaveEdit( id, params = {} ) {
    return service({
        url: `book/${id}`,
        method: 'patch',
        data: params
    })
}
// 保存添加
export function fetchBookSaveAdd( params = {} ) {
    return service({
        url: 'book',
        method: 'post',
        data: params
    })
}
// 查看
export function fetchBookShow( id ) {
    return service({
        url: `book/${id}`,
        method: 'get'
    })
}


/*************** 管理员管理 ***************/
// 获取用户列表
export function fetchAdminList() {
    return service({
        url: 'admin',
        method: 'get'
    })
}
// 删除
export function fetchAdminDel( id ) {
    return service({
        url: `admin/${id}`,
        method: 'delete'
    })
}
// 编辑
export function fetchAdminEdit( id ) {
    return service({
        url: `admin/${id}`,
        method: 'get'
    })
}
// 保存修改
export function fetchAdminSaveEdit( id, params = {} ) {
    return service({
        url: `admin/${id}`,
        method: 'patch',
        data: params
    })
}
// 保存添加
export function fetchAdminSaveAdd( params = {} ) {
    return service({
        url: 'admin',
        method: 'post',
        data: params
    })
}
