<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRecordTable extends Migration
{
    /**
     * 运行数据库迁移
     *
     * @return void
     */
    public function up()
    {
        Schema::create('record', function (Blueprint $table) {
            $table->increments('id');                    //记录id
            $table->string('uid');                       //用户id
            $table->string('bid');                       //图书id
            $table->unsignedTinyInteger('like')->default(1);         //点赞  1,未点赞   2,点赞
            $table->unsignedTinyInteger('collect')->default(1);      //收藏  1,未收藏   2,收藏
            $table->dateTime('created_at')->nullable();                 //创建时间
            $table->dateTime('updated_at')->nullable();                 //更新时间
        });
    }

    /**
     * 回滚数据库迁移
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('record');
    }
}
