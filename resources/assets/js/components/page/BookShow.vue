<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item><i class="el-icon-date"></i> 图书管理</el-breadcrumb-item>
                <el-breadcrumb-item>图书详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="info-box">
            <h3>基本信息</h3>
            <el-row :gutter="20">
                <el-col :span="4">ID</el-col>
                <el-col :span="20">{{ bookData.id }}</el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">书 名</el-col>
                <el-col :span="20">{{ bookData.title }}</el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">序 言</el-col>
                <el-col :span="20">{{ bookData.catalog }}</el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">类 别</el-col>
                <el-col :span="20">{{ bookData.genre }}</el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">图书详情</el-col>
                <el-col :span="20" v-html="bookData.detail"></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">音频</el-col>
                <el-col :span="20">
                    <audio :src="bookData.audio" v-if="bookData.audio">
                        您的浏览器不支持 audio 标签。
                    </audio>
                    <span v-else>暂无</span>
                </el-col>
            </el-row>

            <h3>来自豆瓣信息</h3>
            <el-row :gutter="20">
                <el-col :span="4">豆瓣ID</el-col>
                <el-col :span="20">{{ bookData.doubanId }}</el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">作 者</el-col>
                <el-col :span="20">{{ bookData.author }}</el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">封 面</el-col>
                <el-col :span="20"><img :src="bookData.coverimgMedium" /></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">概 要</el-col>
                <el-col :span="20">{{ bookData.summary }}</el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">出版日期</el-col>
                <el-col :span="20">{{ bookData.pubdate }}</el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">评 分</el-col>
                <el-col :span="20">{{ bookData.score }}</el-col>
            </el-row>

            <h3>数据统计</h3>
            <el-row :gutter="20">
                <el-col :span="4">浏 览</el-col>
                <el-col :span="20">{{ bookData.viewCnt }}</el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">点 赞</el-col>
                <el-col :span="20">{{ bookData.wishCnt }}</el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">收 藏</el-col>
                <el-col :span="20">{{ bookData.collectCnt }}</el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">评 论</el-col>
                <el-col :span="20">{{ bookData.commentCnt }}</el-col>
            </el-row>

            <h3>其他</h3>
            <el-row :gutter="20">
                <el-col :span="4">状 态</el-col>
                <el-col :span="20">{{ bookData.state }}</el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">创建时间</el-col>
                <el-col :span="20">{{ bookData.created_at }}</el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">更新时间</el-col>
                <el-col :span="20">{{ bookData.updated_at }}</el-col>
            </el-row>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { fetchBookShow } from '../../fetch'
    import { ERR_OK, bookOptions } from '../../utils/config'

    export default {
        data() {
            return {
                bookData: {},
                gid: undefined,
                bookOptions
            }
        },

        created(){
            this.getData();
        },

        methods: {
            getData(){
                let id = this.$route.params.id;

                fetchBookShow(id)
                    .then((res) => {
                        if(res && res.data.status == ERR_OK){
                            let result = res.data.data;
                            result.genre = this.bookOptions[result.gid].label;

                            switch (result.status){
                                case 0:
                                    result.state = '未上线';
                                    break;
                                case 1:
                                    result.state = '已上线';
                                    break;
                                case 2:
                                    result.state = '已下线';
                                    break;
                                case 3:
                                    result.state = '已删除';
                                    break;
                            }

                            this.bookData = result;
                        }else {
                            this.$message.error('获取图书信息失败');
                        }
                    })
                    .catch((error) => {
                        this.$router.go(-1);
                    })
            }
        }
    }
</script>

<style scoped>
    .info-box {
        width: 70%;
    }
    .el-col {
        padding: 15px 0;
        border-top: 1px solid #eee;
        color: #666;
    }
    h3 {
        font-size: 14px;
        padding: 15px 0;;
    }
</style>