<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Book;
use App\User;
use App\Models\Record;
use Curl\Curl;
use Config;

class BookController extends Controller
{
    /**
     * 请求图书列表.
     *
     * @param Request $request
     * @return Response
     */
    public function getBooks(Request $request)
    {
        // 读取数据 并且分页
        $list = Book::where(function($query) use ($request){
            if(!empty($request->input('gid'))){
                if($request->input('gid')){
                    $query->where('gid', $request->input('gid'));
                }else{
                    $query->whereNotNull('gid');
                }
            }
        })
            ->where('status', 1)
            ->orderBy('created_at', 'desc')
            ->paginate(5);

        if($list){
            foreach ($list as $k => $v) {
                $v['duration'] = $v['score'].' 评分';
            }

            return response()->json([
                'status' => 0,
                'msg' => '获取数据成功',
                'data' => $list
            ]);
        }else{
            return response()->json([
                'status' => 1,
                'msg' => '获取数据失败'
            ]);
        }
    }

    /**
     * 请求热门搜索词.
     *
     * @param Request $request
     * @return Response
     */
    public function getHotKeys(Request $request)
    {
        $hotKeys = array('正面管教', '自卑', '哲学', '医生的修炼', '幸福', '联盟', '亲密关系', '商业', '创业', '管理', '孔子');

        return response()->json([
            'status' => 0,
            'msg' => '获取数据成功',
            'data' => $hotKeys
        ]);
    }

    /**
     * 请求搜索.
     *
     * @param Request $request
     * @return Response
     */
    public function getSearch(Request $request)
    {
        if(empty($request->input('keyword'))){
            return response()->json([
                'status' => 2,
                'msg' => '请输入关键词'
            ]);
        }

        // 读取数据 并且分页
        $list = Book::where(function($query) use ($request){
            if($request->input('keyword')){
                $query->where('title','like','%'.$request->input('keyword').'%')
                    ->orWhere('author','like','%'.$request->input('keyword').'%');
            }
        })
            ->where('status', 1)
            ->orderBy('id', 'desc')
            ->get();

        if($list){
            return response()->json([
                'status' => 0,
                'msg' => '获取数据成功',
                'data' => $list
            ]);
        }else{
            return response()->json([
                'status' => 1,
                'msg' => '获取数据失败'
            ]);
        }
    }

    /**
     * 获取指定图书
     *
     * @param int $id
     * @return Response
     */
    public function getBook($id)
    {
        $list['book'] = Book::find($id);

        $list['recommend'] = Book::where('gid', $list['book']->gid)
            ->where('status', 1)
            ->where('id', '!=', $id)
            ->get();

        if($list['book']){
            $rand = mt_rand(1,20);
            $data['viewCnt'] = $list['book']['viewCnt'] + $rand;
            Book::where('id', $id)->update($data);

            return response()->json([
                'status' => 0,
                'msg' => '获取数据成功',
                'data' => $list
            ]);
        }else{
            return response()->json([
                'status' => 1,
                'msg' => '获取数据失败'
            ]);
        }
    }

    /**
     * 具体图书评论.
     *
     * @param Request $request
     * @return Response
     */
    public function getComment(Request $request)
    {
        $data = $request->all();

        // 去豆瓣抓取数据
        $curl = new Curl();
        $curl->setOpt(CURLOPT_RETURNTRANSFER, TRUE);
        $curl->setOpt(CURLOPT_SSL_VERIFYPEER, FALSE);
        // 通过豆瓣id获取图书评论
        /*$curl->get('https://api.douban.com/v2/book/'.$data['doubanId'].'/comments', array(
            'p' => $data['page'],
        ));*/

        $url = 'https://api.douban.com/v2/book/'.$data['doubanId'].'/comments?sort=hotest&start='.$data['page'];

        $curl->get($url);

        if ($curl->error) {
            return response()->json([
                'status' => 201,
                'msg' => $curl->error_code
            ]);
        } else {
            $comment = json_decode($curl->response);

            if($comment->comments){
                return response()->json([
                    'status' => 0,
                    'msg' => 'success',
                    'data' => $comment
                ]);
            }else{
                return response()->json([
                    'status' => 1,
                    'msg' => 'error'
                ]);
            }
        }

        $curl->close();
    }


    /**
     * 我的点赞
     *
     * @param int $id
     * @return Response
     */
    public function getMyLike($bid)
    {
        $array = explode(',', $bid);

        foreach ($array as $key => $value) {
            $list[] = Book::find($value);
        }

        if(count($array) == count($list)){
            return response()->json([
                'status' => 0,
                'msg' => '获取数据成功',
                'data' => $list
            ]);
        }else{
            return response()->json([
                'status' => 1,
                'msg' => '获取数据失败'
            ]);
        }
    }

    /**
     * 我的收藏
     *
     * @param int $id
     * @return Response
     */
    public function getMyCollect($bid)
    {
        $array = explode(',', $bid);

        foreach ($array as $key => $value) {
            $list[] = Book::find($value);
        }

        if(count($array) == count($list)){
            return response()->json([
                'status' => 0,
                'msg' => '获取数据成功',
                'data' => $list
            ]);
        }else{
            return response()->json([
                'status' => 1,
                'msg' => '获取数据失败'
            ]);
        }
    }
}
