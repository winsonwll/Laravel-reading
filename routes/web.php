<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/***********************************后台相关***********************************/
Route::group(['prefix' => 'admin'], function () {
    Route::group(['middleware'=>'check.login'], function(){
        //验证码
        Route::get('captcha/{tmp}','Admin\LoginController@captcha');

        //执行登录
        Route::post('login','Admin\LoginController@doLogin');
    });

    Route::group(['middleware'=>'check.admin.login'], function(){
        // 上线
        Route::post('book/online/{id}','Admin\BookController@doOnline');
        // 下线
        Route::post('book/offline/{id}','Admin\BookController@doOffline');

        // 图书管理
        Route::resource('book', 'Admin\BookController');

        // 管理员管理
        Route::resource('admin', 'Admin\AdminController');

        //退出后台
        Route::get('logout','Admin\LoginController@logout');
    });
});


# Vue
Route::combine([
    '/',
    '/login',
    '/index',

    '/bookindex',
    '/bookadd',
    '/bookedit/{id}',
    '/bookshow/{id}',

    '/adminindex',
    '/adminadd',
    '/adminedit/{id}'
], function () {
    return view('index');
});