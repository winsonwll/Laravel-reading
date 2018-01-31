<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Session;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * 登录
     *
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request){
        //验证用户登录凭证
        $code = $request->input('code', '');
        if($code == '') {
            return response()->json([
                'status' =>1,
                'msg' => '用户登录凭证不能为空'
            ]);
        }

        //验证用户信息
        $userInfo = $request->input('userInfo', '');
        if($userInfo == '') {
            return response()->json([
                'status' =>2,
                'msg' => '用户信息不能为空'
            ]);
        }

        $userInfo = json_decode($userInfo, true);


        $appid = 'wx0d326b8edb8d8f1a';
        $appsecret = 'c380339dfb9fedd3148bd7d67830e0fc';
        $url = 'https://api.weixin.qq.com/sns/jscode2session?appid='.$appid.'&secret='.$appsecret.'&js_code='.$code.'&grant_type=authorization_code';

        $res = $this->curl_get($url);
        $res = json_decode($res, true);
        //$sessionid = $res['openid'].$res['session_key'];

        $data['nickname'] = $userInfo['nickName'];
        $data['avator'] = $userInfo['avatarUrl'];
        $data['sex'] = $userInfo['gender'];
        $data['client_type'] = $this->clientType();    //设备类型
        $data['last_login_ip'] = $_SERVER["REMOTE_ADDR"];
        $data['last_login_time'] = date('Y-m-d H:i:s');

        $user = User::where('openid', $res['openid'])->first();
        if($user){
            //执行更新
            User::where('id', $user['id'])->update($data);
            $uid = $user['id'];
        } else {
            //执行注册
            //User::create($data);

            $uid = User::insertGetId( ['openid' => $res['openid']] );
        }

        if($uid){
            return response()->json([
                'status' => 0,
                'msg' => '登录成功',
                'data' => (string)$uid
            ]);
        }else{
            return response()->json([
                'status' => 1,
                'msg' => '登录失败'
            ]);
        }
    }


    /**
     * details api
     *
     * @return \Illuminate\Http\Response
     */
    public function details()
    {
        $res = Auth::user();

        if($res){
            return response()->json([
                'status' => 0,
                'msg' => '请求成功',
                'data' => (object)$res
            ]);
        }else{
            return response()->json([
                'status' => 1,
                'msg' => 'Error：未经授权'
            ]);
        }
    }

    /**
     * 退出 api
     *
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        if(Auth::check()){
            Auth::logout();
        }

        return response()->json([
            'status' => 0,
            'msg' => '退出成功'
        ]);
    }

    /**
     * 获取设备类型
     */
    private function clientType() {
        $client_type = '';
        $agent = strtolower($_SERVER['HTTP_USER_AGENT']);

        $iphone = (strpos($agent, 'iphone')) ? true : false;
        $ipad = (strpos($agent, 'ipad')) ? true : false;
        $android = (strpos($agent, 'android')) ? true : false;
        if($iphone){
            $client_type = 0;
        } elseif ($ipad){
            $client_type = 1;
        } elseif ($android){
            $client_type = 2;
        } else{
            $client_type = 3;
        }

        return $client_type;
    }


    // 使用curl方法
    private function curl_get($url)
    {
        // 初始化 curl
        $ch = curl_init($url);

        // 参数设置
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);

        // 执行发送请求
        $res = curl_exec($ch);

        return $res;
    }
}
