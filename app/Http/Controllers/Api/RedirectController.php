<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Curl\Curl;

class RedirectController extends Controller
{

    private $api_one;
    private $api_breadtrip;

    public function __construct()
    {
        $this->api_one = 'http://v3.wufazhuce.com:8000';
        $this->api_breadtrip = 'http://api.breadtrip.com';
    }


    /**
     * 阅读接口请求数据
     *
     * @param Request $request
     * @return Response
     */
    public function reading_carousel()
    {
        $url = $this->api_one.'/api/reading/carousel';
        $res = $this->curl_get($url);
        $res = json_decode($res, true);

        if ($res) {
            return $res;
        } else {
            return response()->json([
                'status' => 201,
                'msg' => '请求数据失败'
            ]);
        }
    }

    public function reading_index()
    {
        $url = $this->api_one.'/api/reading/index';
        $res = $this->curl_get($url);
        $res = json_decode($res, true);

        if ($res) {
            return $res;
        } else {
            return response()->json([
                'status' => 201,
                'msg' => '请求数据失败'
            ]);
        }
    }


    public function reading_essay($id)
    {
        $url = $this->api_one.'/api/essay/'.$id;
        $res = $this->curl_get($url);
        $res = json_decode($res, true);

        if ($res) {
            return $res;
        } else {
            return response()->json([
                'status' => 201,
                'msg' => '请求数据失败'
            ]);
        }
    }

    public function reading_serialcontent($id)
    {
        $url = $this->api_one.'/api/serialcontent/'.$id;
        $res = $this->curl_get($url);
        $res = json_decode($res, true);

        if ($res) {
            return $res;
        } else {
            return response()->json([
                'status' => 201,
                'msg' => '请求数据失败'
            ]);
        }
    }

    public function reading_question($id)
    {
        $url = $this->api_one.'/api/question/'.$id;
        $res = $this->curl_get($url);
        $res = json_decode($res, true);

        if ($res) {
            return $res;
        } else {
            return response()->json([
                'status' => 201,
                'msg' => '请求数据失败'
            ]);
        }
    }


    public function reading_month($type, $month)
    {
        $url = $this->api_one.'/api/'.$type.'/bymonth/'.$month;
        $res = $this->curl_get($url);
        $res = json_decode($res, true);

        if ($res) {
            return $res;
        } else {
            return response()->json([
                'status' => 201,
                'msg' => '请求数据失败'
            ]);
        }
    }




    /**
     * 音乐接口请求数据
     *
     * @param Request $request
     * @return Response
     */
    public function music_idlist()
    {
        $url = $this->api_one.'/api/music/idlist/0';
        $res = $this->curl_get($url);
        $res = json_decode($res, true);

        if ($res) {
            return $res;
        } else {
            return response()->json([
                'status' => 201,
                'msg' => '请求数据失败'
            ]);
        }
    }

    public function music_bymonth($month)
    {
        $url = $this->api_one.'/api/music/bymonth/'.$month;
        $res = $this->curl_get($url);
        $res = json_decode($res, true);

        if ($res) {
            return $res;
        } else {
            return response()->json([
                'status' => 201,
                'msg' => '请求数据失败'
            ]);
        }
    }

    public function music_detail($id)
    {
        $url = $this->api_one.'/api/music/detail/'.$id;
        $res = $this->curl_get($url);
        $res = json_decode($res, true);

        if ($res) {
            return $res;
        } else {
            return response()->json([
                'status' => 201,
                'msg' => '请求数据失败'
            ]);
        }
    }


    /**
     * 游记接口请求数据
     *
     * @param Request $request
     * @return Response
     */
    public function trips_index(Request $request)
    {
        $next_start = $request->input('next_start');
        $url = $this->api_breadtrip.'/v2/index/?next_start='.$next_start;
        //$url = $this->api_breadtrip.'/v2/index/';
        $res = $this->curl_get($url);
        $res = json_decode($res, true);

        if ($res) {
            return $res;
        } else {
            return response()->json([
                'status' => 201,
                'msg' => '请求数据失败'
            ]);
        }
    }

    public function trips_search(Request $request)
    {
        $key = $request->input('key');
        $start = $request->input('start');

        $url = $this->api_breadtrip.'/v2/search/?key='.$key.'&start='.$start;
        $res = $this->curl_get($url);
        $res = json_decode($res, true);

        if ($res) {
            return $res;
        } else {
            return response()->json([
                'status' => 201,
                'msg' => '请求数据失败'
            ]);
        }
    }

    public function trips_waypoints($id)
    {
        $url = $this->api_breadtrip.'/trips/'.$id.'/waypoints/';
        $res = $this->curl_get($url);
        $res = json_decode($res, true);

        if ($res) {
            return $res;
        } else {
            return response()->json([
                'status' => 201,
                'msg' => '请求数据失败'
            ]);
        }
    }

    public function trips_waypoint($tripId, $waypointId)
    {
        $url = $this->api_breadtrip.'/trips/'.$tripId.'/waypoints/'.$waypointId.'/';
        $res = $this->curl_get($url);
        $res = json_decode($res, true);

        if ($res) {
            return $res;
        } else {
            return response()->json([
                'status' => 201,
                'msg' => '请求数据失败'
            ]);
        }
    }

    public function trips_replies($tripId, $waypointId)
    {
        $url = $this->api_breadtrip.'/trips/'.$tripId.'/waypoints/'.$waypointId.'/replies/';
        $res = $this->curl_get($url);
        $res = json_decode($res, true);

        if ($res) {
            return $res;
        } else {
            return response()->json([
                'status' => 201,
                'msg' => '请求数据失败'
            ]);
        }
    }

    public function trips_user($userId)
    {
        $url = $this->api_breadtrip.'/users/'.$userId.'/v2/';
        $res = $this->curl_get($url);
        $res = json_decode($res, true);

        if ($res) {
            return $res;
        } else {
            return response()->json([
                'status' => 201,
                'msg' => '请求数据失败'
            ]);
        }
    }



    /**
     * 天气接口请求数据
     *
     * @param Request $request
     * @return Response
     */
    public function baidu_location()
    {
        $url = 'http://api.map.baidu.com/location/ip?ak=tr44ulLmCKfj51tm9LViW1BYGo14mDp3&coor=bd09ll';
        $res = $this->curl_get($url);
        $res = json_decode($res, true);

        if ($res) {
            return $res;
        } else {
            return response()->json([
                'status' => 201,
                'msg' => '请求数据失败'
            ]);
        }
    }

    public function darksky_forecast($latitude, $longitude)
    {
        $url = 'https://api.darksky.net/forecast/cb4b12e15af2771d497f762476d754f5/'.$latitude.','.$longitude.'?lang=zh&units=ca';
        $res = $this->curl_get($url);
        $res = json_decode($res, true);

        if ($res) {
            return $res;
        } else {
            return response()->json([
                'status' => 201,
                'msg' => '请求数据失败'
            ]);
        }
    }



    /**
     * 送祝福接口请求数据
     *
     * @param Request $request
     * @return Response
     */
    public function wishes(Request $request)
    {
        $data = $request->all();

        $url = 'https://www.cpcwe.com/wishes/'.$data['path'].'?app_name=wishes&relation_id='.$data['relation'].'&gender_id='.$data['gender'].'&wishes_id='.$data['wishes'];

        // 去豆瓣抓取数据
        $curl = new Curl();
        $curl->setOpt(CURLOPT_RETURNTRANSFER, TRUE);
        $curl->setOpt(CURLOPT_SSL_VERIFYPEER, FALSE);

        // 通过id获取图书信息
        $curl->get($url);

        if ($curl->error) {
            return response()->json([
                'status' => 201,
                'msg' => $curl->error_code
            ]);
        } else {
            $res = json_decode($curl->response, true);
            return $res;
        }
    }


    // 使用curl方法
    private function curl_get($url)
    {
        // 初始化 curl
        $ch = curl_init();

        //设置抓取的url
        curl_setopt($ch, CURLOPT_URL, $url);

        // 参数设置
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);

        // 执行发送请求
        $res = curl_exec($ch);

        //关闭URL请求
        curl_close($ch);

        return $res;
    }
}
