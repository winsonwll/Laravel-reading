<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 图书管理</el-breadcrumb-item>
                <el-breadcrumb-item>图书列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="handle-box">
            <el-select v-model="listQuery.gid" placeholder="选择类别" class="handle-select">
                <el-option
                        v-for="item in bookOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>

            <el-input v-model.trim="listQuery.keyword" placeholder="输入关键词" class="handle-input"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜 索</el-button>
        </div>

        <el-table
                :data="list"
                stripe
                border
                v-loading="loading"
                element-loading-text="拼命加载中..."
                style="width: 100%">
            <el-table-column prop="id" label="ID" width="40" align="center"></el-table-column>
            <el-table-column prop="title" label="书名" align="center"></el-table-column>
            <el-table-column prop="catalog" label="序言" align="center"></el-table-column>
            <el-table-column prop="genre" label="类别" align="center"></el-table-column>
            <el-table-column label="来自豆瓣信息" align="center">
                <el-table-column prop="doubanId" label="豆瓣ID" align="center"></el-table-column>
                <el-table-column prop="author" label="作者" align="center"></el-table-column>
                <el-table-column prop="coverimgMedium" label="封面" width="122" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.coverimgMedium" />
                    </template>
                </el-table-column>
                <el-table-column prop="summary" label="概要" align="center"></el-table-column>
                <el-table-column prop="pubdate" label="出版日期" align="center"></el-table-column>
                <el-table-column prop="score" label="评分" width="50" align="center"></el-table-column>
            </el-table-column>
            <el-table-column label="数据统计" align="center">
                <el-table-column prop="viewCnt" label="浏览" width="60" align="center"></el-table-column>
                <el-table-column prop="wishCnt" label="点赞" width="60" align="center"></el-table-column>
                <el-table-column prop="collectCnt" label="收藏" width="60" align="center"></el-table-column>
                <el-table-column prop="commentCnt" label="评论" width="60" align="center"></el-table-column>
            </el-table-column>
            <el-table-column prop="state" label="状态" align="center">
                <template slot-scope="scope">
                    {{scope.row.state}}
                    <el-button size="small" type="warning" @click="handleOffline(scope.$index, scope.row)" v-if="scope.row.status == 1">下线</el-button>
                    <el-button size="small" type="primary" @click="handleOnline(scope.$index, scope.row)" v-else>上线</el-button>
                </template>

            </el-table-column>
            <el-table-column label="操作" prop="status" align="center">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleShow(scope.$index, scope.row)">查看</el-button>
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.status != 3">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination">
            <el-pagination
                    @current-change="handleCurrentChange"
                    layout="total, prev, pager, next"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { fetchBookList, fetchBookOnline, fetchBookOffline, fetchBookDel } from '../../fetch'
    import { ERR_OK, bookOptions } from '../../utils/config'

    export default {
        data() {
            return {
                loading: true,
                listQuery: {
                    page: 1,
                    gid: undefined,
                    keyword: undefined
                },
                bookOptions,
                list: [],
                total: 0
            }
        },

        created(){
            this.getData();
        },

        methods: {
            // 获取图书列表
            getData(){
                this.loading = true;

                fetchBookList(this.listQuery)
                    .then((res) => {
                        if(res && res.data.status == ERR_OK){
                            let result = res.data.data;

                            this.list = result.data;
                            this.list.forEach((val, index, arr) => {
                                val.genre = this.bookOptions[val.gid].label;

                                switch (val.status){
                                    case 0:
                                        val.state = '未上线';
                                        break;
                                    case 1:
                                        val.state = '已上线';
                                        break;
                                    case 2:
                                        val.state = '已下线';
                                        break;
                                    case 3:
                                        val.state = '已删除';
                                        break;
                                }
                            });
                            this.total = result.total;
                        }else {
                            this.$message.error('获取图书列表失败');
                        }
                    })
                    .catch((error) => {
                        this.$message.error(error);
                    })

                this.loading = false;
            },

            // 上线
            handleOnline(index, row) {
                let id = row.id;

                this.$confirm('此操作将上线图书：' + row.title + ', 是否继续?', '温馨提示', { type: 'warning' })
                        .then(() => {
                            fetchBookOnline(id)
                                .then((res) => {
                                    if(res && res.data.status == ERR_OK){
                                        this.list[index].status = 1;
                                        this.list[index].state = '已上线';
                                        this.$message.success('上线成功');
                                    }else {
                                        this.$message.error('上线失败');
                                    }
                                })
                                .catch((error) => {
                                    this.$message.error(error);
                                })
                        })
                        .catch(() => {
                            console.log('已取消操作')
                        })
            },

            // 下线
            handleOffline(index, row) {
                let id = row.id;

                this.$confirm('此操作将下线图书：' + row.title + ', 是否继续?', '温馨提示', { type: 'warning' })
                        .then(() => {
                            fetchBookOffline(id)
                                .then((res) => {
                                    if(res && res.data.status == ERR_OK){
                                        this.list[index].status = 2;
                                        this.list[index].state = '已下线';
                                        this.$message.success('下线成功');
                                    }else {
                                        this.$message.error('下线失败');
                                    }
                                })
                                .catch((error) => {
                                    this.$message.error(error);
                                })
                        })
                        .catch(() => {
                            console.log('已取消操作')
                        })
            },

            // 删除
            handleDelete(index, row) {
                let id = row.id;

                this.$confirm('此操作将删除图书：' + row.title + ', 是否继续?', '温馨提示', { type: 'warning' })
                        .then(() => { // 向请求服务端删除
                            fetchBookDel(id)
                                .then((res) => {
                                    if(res && res.data.status == ERR_OK){
                                        const index = this.list.indexOf(row);
                                        this.list.splice(index, 1);
                                        --this.total;
                                        this.$message.success('删除成功');
                                    }else {
                                        this.$message.error('删除失败');
                                    }
                                })
                                .catch((error) => {
                                    this.$message.error(error);
                                })
                        })
                        .catch(() => {
                            console.log('已取消删除')
                        });
            },

            // 查看
            handleShow(index, row) {
                this.$router.push(`/bookshow/${row.id}`);
            },

            // 编辑
            handleEdit(index, row) {
                this.$router.push(`/bookedit/${row.id}`);
            },

            // 分页
            handleCurrentChange(val){
                this.listQuery.page = val;
                this.getData();
            },

            // 搜索
            handleSearch() {
                this.listQuery.page = 1;
                this.getData();
            }
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .el-table .cell .el-button {
        margin: 5px 0;
    }
</style>