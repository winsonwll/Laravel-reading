<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use Config;

class RecognitionController extends Controller
{
    /**
     * 图像识别
     *
     * @param Request $request
     * @return Response
     */
    public function imageClassify(Request $request, $classify) {
        $upload = $_FILES['upload'];

        if(!empty($upload['tmp_name'])) {
            if(empty($upload['type'])) {
                return response()->json([
                    'status' => 202,
                    'msg' => '文件类型不合法'
                ]);
            }

            if(!in_array($upload['type'], array(
                    'image/jpg',
                    'image/jpeg',
                    'image/png',
                    'image/bmp'
                ))
            ) {
                return response()->json([
                    'status' => 202,
                    'msg' => '文件类型不合法'
                ]);
            }

            $upload_dir = Config::get('app.upload_dir');
            if(!is_dir($upload_dir)) {
                mkdir($upload_dir,0777,true);
            }

            $stored_path = $upload_dir.basename($_FILES['upload']['name']);
            $res = move_uploaded_file($_FILES['upload']['tmp_name'], $stored_path);

            if($res) {
                $access_token = $this->get_access_token();
                $base_url = 'https://aip.baidubce.com/rest/2.0/';
                switch ($classify) {
                    case 'face':
                        $url = $base_url.'face/v2/detect';
                        $post_data['face_fields'] = 'age,beauty,face_probability,expression,faceshape,gender,glasses,landmark,race,qualities';
                    break;

                    case 'dish':
                        $url = $base_url.'image-classify/v2/dish';
                        $post_data['filter_threshold'] = 0.95;
                    break;

                    case 'plant':
                        $url = $base_url.'image-classify/v1/plant';
                    break;
                }

                $postUrl = $url.'?access_token='.$access_token;

                $img_file = getenv('APP_URL').'/'.$stored_path;
                $img_info = getimagesize($img_file);
                //$image = "data:{$img_info['mime']};base64,".base64_encode(file_get_contents($img_file));
                $image = base64_encode(file_get_contents($img_file));

                $post_data['image'] = $image;
                $obj = "";
                foreach ( $post_data as $k => $v ) {
                    $obj.= "$k=" . urlencode( $v ). "&" ;
                }
                $post_data = substr($obj,0,-1);

                $headers = array( 'Content-Type' => 'application/x-www-form-urlencoded' );
                $curl = curl_init();//初始化curl
                curl_setopt($curl, CURLOPT_URL,$postUrl);//抓取指定网页
                curl_setopt($curl, CURLOPT_HEADER, 0);//设置header
                curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);//要求结果为字符串且输出到屏幕上
                curl_setopt($curl, CURLOPT_POST, 1);//post提交方式
                curl_setopt($curl, CURLOPT_POSTFIELDS, $post_data);
                $data = curl_exec($curl);//运行curl
                curl_close($curl);

                $result = json_decode($data, true);
                if($result) {
                    return response()->json([
                        'status' => 0,
                        'msg' => 'success',
                        'data' => $result
                    ]);
                } else {
                    return response()->json([
                        'status' => 202,
                        'msg' => '识别失败'
                    ]);
                }
            } else {
                return response()->json([
                    'status' => 201,
                    'msg' => '无法获取上传文件'
                ]);
            }
        } else {
            return response()->json([
                'status' => 201,
                'msg' => '无法获取上传文件'
            ]);
        }
    }

    // 获取的access_token
    private function get_access_token() {
        $url = 'https://aip.baidubce.com/oauth/2.0/token';
        $post_data['grant_type']    = 'client_credentials';
        $post_data['client_id']     = '5xYNmmNgGnU46EOoXG8ULSOk';
        $post_data['client_secret'] = 'E5vF2kjXVIUu5qTsAqNyURC0GsbmR8oY';
        
        $o = "";
        foreach ( $post_data as $k => $v ) 
        {
            $o.= "$k=" . urlencode( $v ). "&" ;
        }
        $post_data = substr($o,0,-1);
        $res = json_decode($this->request_post($url, $post_data));
        return $res->access_token;
    }

    // post请求百度接口
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
