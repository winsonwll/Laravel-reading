<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Book;
use Curl\Curl;

class BookController extends Controller
{
    /**
     * 显示图书列表.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        // 读取数据 并且分页
        $list = Book::where(function($query) use ($request){
                if($request->input('gid')){
                    if($request->input('gid')){
                        $query->where('gid', $request->input('gid'));
                    }else{
                        $query->whereNotNull('gid');
                    }
                }

                if($request->input('keyword')){
                    $query->where('title','like','%'.$request->input('keyword').'%');
                }
            })
            ->where('status', '!=', '3')
            ->orderBy('id', 'desc')
            ->paginate(10);

        return response()->json([
            'status' => 0,
            'msg' => 'success',
            'data' => $list
        ]);
    }

    /**
     * 创建新图书表单页面
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    
    /**
     * 将新创建的图书存储到存储器
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        $data = $request->all();

        // 去豆瓣抓取数据
        $curl = new Curl();
        $curl->setOpt(CURLOPT_RETURNTRANSFER, TRUE);
        $curl->setOpt(CURLOPT_SSL_VERIFYPEER, FALSE);
        // 通过搜索关键词获取图书信息
        /*$curl->get('https://api.douban.com/v2/book/search', array(
            'q' => $data['title'],
            'count' => '1'
        ));*/

        // 通过id获取图书信息
        $curl->get('https://api.douban.com/v2/book/'.$data['doubanId']);

        if ($curl->error) {
            return response()->json([
                'status' => 201,
                'msg' => $curl->error_code
            ]);
        } else {
            $book = json_decode($curl->response);
            //$book = $book->books[0];
            //$data['doubanId'] = $book->id;

            $data['summary'] = $book->subtitle;
            $data['author'] = implode(',', $book->author);
            $data['coverimgMedium'] = $book->images->medium;
            $data['coverimgLarge'] = $book->images->large;
            $data['pubdate'] = $book->pubdate;
            $data['score'] = $book->rating->average;
            $data['wishCnt'] = $book->rating->numRaters;

            // 通过id获取图书评论总数
            $curl->get('https://api.douban.com/v2/book/'.$data['doubanId'].'/comments');
            $data['commentCnt'] = json_decode($curl->response)->total;

            //执行创建
            $res = Book::create($data);
            if($res){
                //创建成功
                return response()->json([
                    'status' => 0,
                    'msg' => '图书创建成功'
                ]);
            }else{
                return response()->json([
                    'status' => 1,
                    'msg' => '图书创建失败'
                ]);
            }
        }

        $curl->close();
    }

    /**
     * 显示指定图书
     *
     * @param int $id
     * @return Response
     */
    public function show($id)
    {
        $res = Book::find($id);
        if($res){
            //成功
            return response()->json([
                'status' => 0,
                'msg' => 'success',
                'data' => $res
            ]);
        }else{
            return response()->json([
                'status' => 1,
                'msg' => 'error'
            ]);
        }
    }

    /**
     * 显示编辑指定图书的表单页面
     *
     * @param int $id
     * @return Response
     */
    public function edit($id)
    {

    }

    /**
     * 在存储器中更新指定图书
     *
     * @param Request $request
     * @param int $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        $data = $request->all();

        $res = Book::where('id', $id)->update($data);
        if($res){
            return response()->json([
                'status' => 0,
                'msg' => '修改成功'
            ]);
        }else{
            return response()->json([
                'status' => 1,
                'msg' => '修改失败'
            ]);
        }
    }

    /**
     * 从存储器中移除指定图书
     *
     * @param int $id
     * @return Response
     */
    public function destroy($id)
    {
        $data['status'] = 3;        //已删除

        //执行上线
        $res = Book::where('id', $id)->update($data);
        if($res){
            //成功
            return response()->json([
                'status' => 0,
                'msg' => '图书删除成功'
            ]);
        }else{
            return response()->json([
                'status' => 1,
                'msg' => '图书删除失败'
            ]);
        }
    }

    /**
     * 上线
     *
     * @param Request $request
     * @return Response
     */
    public function doOnline($id)
    {
        $data['status'] = 1;        //已上线

        //执行上线
        $res = Book::where('id', $id)->update($data);
        if($res){
            //成功
            return response()->json([
                'status' => 0,
                'msg' => '图书上线成功'
            ]);
        }else{
            return response()->json([
                'status' => 1,
                'msg' => '图书上线失败'
            ]);
        }
    }

    /**
     * 下线
     *
     * @param Request $request
     * @return Response
     */
    public function doOffline($id)
    {
        $data['status'] = 2;        //已下线

        //执行上线
        $res = Book::where('id', $id)->update($data);
        if($res){
            //成功
            return response()->json([
                'status' => 0,
                'msg' => '图书下线成功'
            ]);
        }else{
            return response()->json([
                'status' => 1,
                'msg' => '图书下线失败'
            ]);
        }
    }
}
