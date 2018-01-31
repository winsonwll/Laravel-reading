<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBookTable extends Migration
{
    /**
     * 运行数据库迁移
     *
     * @return void
     */
    public function up()
    {
        Schema::create('book', function (Blueprint $table) {
            $table->increments('id');                           //图书id
            $table->string('title', 100);                       //书名
            $table->string('summary', 100)->nullable();         //概要
            $table->string('catalog', 100);                     //序言
            $table->integer('gid')->unsigned();                 //类别id
            $table->integer('doubanId')->unsigned();            //豆瓣图书id
            $table->string('author');                           //作者
            $table->string('coverimgMedium');                  //封面小
            $table->string('coverimgLarge');                   //封面大
            $table->string('pubdate');                          //出版日期
            $table->decimal('score', 2, 1)->nullable();         //豆瓣评分
            $table->longText('detail');                          //图书详情
            $table->string('audio')->nullable();                //音频
            $table->decimal('duration', 5, 2)->nullable();      //音频时长
            $table->integer('viewCnt')->unsigned()->default(0); //浏览数
            $table->integer('commentCnt')->unsigned()->default(0); //评论数
            $table->integer('wishCnt')->unsigned()->default(0);     //点赞数
            $table->integer('collectCnt')->unsigned()->default(0); //收藏数
            $table->unsignedTinyInteger('status')->default(0);      //状态 0 未上线 1 已上线 2 已下线 3 已删除
            $table->dateTime('created_at')->nullable();             //创建时间
            $table->dateTime('updated_at')->nullable();             //更新时间
        });
    }

    /**
     * 回滚数据库迁移
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('book');
    }
}
