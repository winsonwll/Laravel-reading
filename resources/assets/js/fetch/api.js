import axios from 'axios'

//export const BASE_API = 'http://127.0.0.1:8000/api/'
export const BASE_API = 'http://www.appvf.com/api/'
export const ERR_OK = 0

// 创建axios实例
const service = axios.create({
    baseURL: BASE_API,          // api的base_url
    timeout: 5000,              // 请求超时时间
    headers: {                  // Laravel5.4 Vue 框架中 X-CSRF-TOKEN 的设置
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    }
})


// 获取图片验证码
export const fetchCaptcha = `${BASE_API}captcha/` + new Date().getTime()

// 获取短信验证码
export function fetchSmscode( params = {} ) {
    return service({
        url: 'sendSms',
        method: 'post',
        data: params
    })
}

// 注册
export function fetchReg( params = {} ) {
    return service({
        url: 'register',
        method: 'post',
        data: params
    })
}

// 登录
export function fetchLogin( params = {} ) {
    return service({
        url: 'login',
        method: 'post',
        data: params
    })
}

// 获取详情
export function fetchDetail() {
    let access_token = localStorage.getItem('access_token')

    service.defaults.headers.common = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${access_token}`
     }

    return service({
        url: 'details',
        method: 'post'
    })
}

// 图书请求
export function fetchBooks() {
    return service({
        url: 'getLoans',
        method: 'post'
    })
}

// 点击申请
export function fetchApply( params = {} ) {
    let access_token = localStorage.getItem('access_token')

    service.defaults.headers.common = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${access_token}`
    }

    return service({
        url: 'postApply',
        method: 'get',
        params: params
    })
}

// 退出登录
export function fetchLogout() {
    return service({
        url: 'logout',
        method: 'get'
    })
}