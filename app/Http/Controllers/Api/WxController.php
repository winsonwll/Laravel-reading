<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Config;
use Intervention\Image\ImageManagerStatic as Image;

class WxController extends Controller
{
    /**
     * 生成分享朋友圈图片
     *
     * @param Request $request
     * @return Response
     */
    public function shareTimeline(Request $request) {
        $path = $request->input('path');
        $image = $request->input('image');

        if(empty($path)) {
            return response()->json([
                'status' => 201,
                'msg' => '路径不能为空'
            ]);
        }
        if(empty($image)) {
            return response()->json([
                'status' => 202,
                'msg' => '图片地址不能为空'
            ]);
        }

        $timelineBg = [
            'images/timeline_bg01.jpg',
            'images/timeline_bg02.jpg',
            'images/timeline_bg03.jpg',
            'images/timeline_bg04.jpg',
            'images/timeline_bg05.jpg',
            'images/timeline_bg06.jpg',
            'images/timeline_bg07.jpg',
            'images/timeline_bg08.jpg'
        ];

        $r = mt_rand(0,7);

        switch($r) {
            case 0:
                $pos1 = [
                    'pos' => 'top-left',
                    'x' => 100,
                    'y' => 183,
                    'width' => 200,
                    'height' => 275
                ];

                $pos2 = [
                    'pos' => 'top-right',
                    'x' => 33,
                    'y' => 95,
                    'width' => 100,
                    'height' => 100
                ];
            break;

            case 1:
                $pos1 = [
                    'pos' => 'bottom-right',
                    'x' => 50,
                    'y' => 40,
                    'width' => 200,
                    'height' => 275
                ];

                $pos2 = [
                    'pos' => 'top-left',
                    'x' => 30,
                    'y' => 100,
                    'width' => 100,
                    'height' => 100
                ];
            break;

            case 2:
                $pos1 = [
                    'pos' => 'bottom-left',
                    'x' => 50,
                    'y' => 40,
                    'width' => 200,
                    'height' => 275
                ];

                $pos2 = [
                    'pos' => 'top-right',
                    'x' => 33,
                    'y' => 100,
                    'width' => 100,
                    'height' => 100
                ];
            break;

            case 3:
                $pos1 = [
                    'pos' => 'bottom-right',
                    'x' => 30,
                    'y' => 20,
                    'width' => 200,
                    'height' => 275
                ];

                $pos2 = [
                    'pos' => 'top-left',
                    'x' => 30,
                    'y' => 100,
                    'width' => 100,
                    'height' => 100
                ];
            break;

            case 4:
                $pos1 = [
                    'pos' => 'bottom-right',
                    'x' => 30,
                    'y' => 20,
                    'width' => 200,
                    'height' => 275
                ];

                $pos2 = [
                    'pos' => 'top-left',
                    'x' => 30,
                    'y' => 100,
                    'width' => 100,
                    'height' => 100
                ];
            break;

            case 5:
                $pos1 = [
                    'pos' => 'bottom-left',
                    'x' => 30,
                    'y' => 20,
                    'width' => 200,
                    'height' => 275
                ];

                $pos2 = [
                    'pos' => 'top-right',
                    'x' => 55,
                    'y' => 50,
                    'width' => 100,
                    'height' => 100
                ];
            break;

            case 6:
                $pos1 = [
                    'pos' => 'bottom-right',
                    'x' => 35,
                    'y' => 20,
                    'width' => 200,
                    'height' => 275
                ];

                $pos2 = [
                    'pos' => 'bottom-left',
                    'x' => 125,
                    'y' => 40,
                    'width' => 100,
                    'height' => 100
                ];
            break;

            case 7:
                $pos1 = [
                    'pos' => 'bottom-right',
                    'x' => 35,
                    'y' => 20,
                    'width' => 200,
                    'height' => 275
                ];

                $pos2 = [
                    'pos' => 'bottom-left',
                    'x' => 205,
                    'y' => 140,
                    'width' => 100,
                    'height' => 100
                ];
            break;
        }

        //创建图像
        $img = Image::make($timelineBg[$r]);

        $wxacode_dir = Config::get('app.wxacode_dir');
        if(!is_dir($wxacode_dir)) {
            mkdir($wxacode_dir, 0777, true);
        }

        //图书封面
        $dst = $this->getDoubanCover($image);
        $dst = Image::make($dst)->resize($pos1['width'], null, function($constraint){
            // 调整图像的宽到300，并约束宽高比(高自动)
            $constraint->aspectRatio();
        });  


        $img->insert($dst, $pos1['pos'], $pos1['x'], $pos1['y']);

        //小程序码水印
        $src = $this->getWxaqrcode($path);
        $src = Image::make($src)->resize($pos2['width'], $pos2['height']);
        $img->insert($src, $pos2['pos'], $pos2['x'], $pos2['y']);

        //将处理后的图片重新保存到其他路径
        $filename = time().rand(1000,9999).'.jpg';
        $res = $img->save($wxacode_dir.$filename);

        if($res) {
            return response()->json([
                'status' => 0,
                'msg' => 'success',
                'data' => getenv('APP_URL').'/'.$wxacode_dir.$filename
            ]);
        } else {
            return response()->json([
                'status' => 203,
                'msg' => '合成图片失败'
            ]);
        }
    }


    // 获取豆瓣图书封面图
    public function getDoubanCover($img) {
        $wxacode_dir = Config::get('app.wxacode_dir');
        if(!is_dir($wxacode_dir)) {
            mkdir($wxacode_dir, 0777, true);
        }

        $filename = 'douban_'.time().rand(1000,9999).'.jpg';
        //将豆瓣图书封面图存入相应文件夹下
        file_put_contents($wxacode_dir.$filename, file_get_contents($img));

        return $wxacode_dir.$filename;
    }

    // 获取小程序码
    public function getWxaqrcode($path, $width = 430) {
        $access_token = $this->get_access_token();

        $url = 'https://api.weixin.qq.com/wxa/getwxacode?access_token='.$access_token;
        $path = $path;
        $width = $width;
        $data = '{"path":"'.$path.'","width":'.$width.'}';

        $res = $this->request_post($url, $data);
        if($res) {
            $wxacode_dir = Config::get('app.wxacode_dir');
            if(!is_dir($wxacode_dir)) {
                mkdir($wxacode_dir, 0777, true);
            }

            $filename = 'wxacode_'.time().rand(1000,9999).'.jpg';
            //将生成的小程序码存入相应文件夹下
            file_put_contents($wxacode_dir.$filename, $res);

            return $wxacode_dir.$filename;
        } else {
            return response()->json([
                'status' => 202,
                'msg' => '获取小程序码失败'
            ]);
        }
    }
    
    // 获取的access_token
    private function get_access_token() {
        $url = 'https://api.weixin.qq.com/cgi-bin/token';
        $post_data['grant_type']    = 'client_credential';
        $post_data['appid']     = 'wx0d326b8edb8d8f1a';
        $post_data['secret'] = 'c380339dfb9fedd3148bd7d67830e0fc';
        
        $o = "";
        foreach ( $post_data as $k => $v ) 
        {
            $o.= "$k=" . urlencode( $v ). "&" ;
        }
        $post_data = substr($o,0,-1);
        $res = json_decode($this->request_post($url, $post_data));
        return $res->access_token;
    }

    // post请求微信接口
    private function request_post($url = '', $param = '') {
        if (empty($url) || empty($param)) {
            return false;
        }
        
        $postUrl = $url;
        $curlPost = $param;
        $curl = curl_init();//初始化curl
        curl_setopt($curl, CURLOPT_URL,$postUrl);//抓取指定网页
        curl_setopt($curl, CURLOPT_HEADER, 0);//设置header
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);//要求结果为字符串且输出到屏幕上
        curl_setopt($curl, CURLOPT_POST, 1);//post提交方式
        curl_setopt($curl, CURLOPT_POSTFIELDS, $curlPost);
        $data = curl_exec($curl);//运行curl
        curl_close($curl);
        
        return $data;
    }
}
