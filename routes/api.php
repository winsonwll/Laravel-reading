<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['prefix' => 'read'], function () {
	//登录
	Route::get('login', 'Api\UserController@login');

	//获取图书列表
	Route::get('getBooks','Api\BookController@getBooks');
	//获取热门搜索词
	Route::get('getHotKeys','Api\BookController@getHotKeys');
	//搜索
	Route::get('getSearch','Api\BookController@getSearch');

	//具体图书请求
	Route::get('getBook/{id}','Api\BookController@getBook');

	//具体图书评论
	Route::get('getComment','Api\BookController@getComment');

	//我的点赞
    Route::get('like/{bid}','Api\BookController@getMyLike');
    //我的收藏
    Route::get('collect/{bid}','Api\BookController@getMyCollect');


	Route::group(['middleware' => 'auth:api'], function(){
	    //查看用户详情
	    //Route::post('details', 'Api\UserController@details');
	});

	//阅读接口转发
	Route::get('api/reading/carousel','Api\RedirectController@reading_carousel');
	Route::get('api/reading/index','Api\RedirectController@reading_index');
	Route::get('api/essay/{id}','Api\RedirectController@reading_essay');
	Route::get('api/serialcontent/{id}','Api\RedirectController@reading_serialcontent');
	Route::get('api/question/{id}','Api\RedirectController@reading_question');
	Route::get('api/{type}/bymonth/{month}','Api\RedirectController@reading_month');


	//音乐接口转发
	Route::get('api/music/idlist/0','Api\RedirectController@music_idlist');
	Route::get('api/music/bymonth/{month}','Api\RedirectController@music_bymonth');
	Route::get('api/music/detail/{id}','Api\RedirectController@music_detail');


	//游记接口转发
	Route::get('v2/index/','Api\RedirectController@trips_index');
	Route::get('v2/search/','Api\RedirectController@trips_search');
	Route::get('trips/{id}/waypoints/','Api\RedirectController@trips_waypoints');
	Route::get('trips/{tripId}/waypoints/{waypointId}/','Api\RedirectController@trips_waypoint');
	Route::get('trips/{tripId}/waypoints/{waypointId}/replies/','Api\RedirectController@trips_replies');
	Route::get('users/{userId}/v2','Api\RedirectController@trips_user');

	//天气接口转发
	Route::get('baidu_location','Api\RedirectController@baidu_location');
	Route::get('darksky_forecast/{latitude}/{longitude}','Api\RedirectController@darksky_forecast');

	//送祝福
	Route::get('wishes','Api\RedirectController@wishes');

	//图像识别
	Route::post('recognition/{classify}','Api\RecognitionController@imageClassify');

	//生成分享朋友圈图片
	Route::get('share_timeline','Api\WxController@shareTimeline');
});