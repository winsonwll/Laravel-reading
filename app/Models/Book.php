<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $table = 'book';
    protected $primaryKey = 'id';

    //不可被批量赋值的属性。即所有的属性都可以被批量赋值
    protected $guarded = [];
}
