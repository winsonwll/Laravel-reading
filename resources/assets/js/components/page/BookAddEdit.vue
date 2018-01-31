<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item><i class="el-icon-date"></i> 图书管理</el-breadcrumb-item>
                <el-breadcrumb-item v-if="isEdit">编辑图书</el-breadcrumb-item>
                <el-breadcrumb-item v-else>添加图书</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="form-box">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="书 名" prop="title">
                    <el-input v-model.trim="form.title" placeholder="请输入书名"></el-input>
                </el-form-item>

                <el-form-item label="豆瓣id" prop="doubanId">
                    <el-input v-model.trim="form.doubanId" placeholder="请输入豆瓣id" :disabled="is_disabled">
                        <el-button slot="append" icon="el-icon-search" @click="handleDouban">去豆瓣</el-button>
                    </el-input>
                </el-form-item>

                <el-form-item label="序 言" prop="catalog">
                    <el-input v-model.trim="form.catalog" placeholder="一句话序言"></el-input>
                </el-form-item>

                <template v-if="isEdit">
                    <el-form-item label="概 要" prop="summary">
                        <el-input v-model.trim="form.summary" placeholder="一句话序言概要"></el-input>
                    </el-form-item>
                </template>

                <el-form-item label="类 别" prop="gid">
                    <el-select v-model="form.gid" placeholder="请选择">
                        <el-option
                                v-for="item in bookOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="图书详情" prop="detail" style="width: 980px">
                    <quill-editor ref="myTextEditor" v-model="form.detail" :options="editorOption" @change="onEditorChange($event)"></quill-editor>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit('form')" :loading="loading">确认提交</el-button>
                    <el-button @click="onCancel">取 消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import { fetchBookEdit, fetchBookSaveEdit, fetchBookSaveAdd } from '../../fetch'
    import { ERR_OK, bookOptions } from '../../utils/config'
    import { quillEditor } from 'vue-quill-editor'

    export default {
        data() {
            return {
                id: undefined,
                bookOptions,
                editorOption: {
                    placeholder: '请输入图书详情'
                },
                is_disabled: false,
                form: {
                    title: undefined,
                    doubanId: undefined,
                    catalog: undefined,
                    summary: undefined,
                    gid: undefined,
                    detail: undefined,
                },
                rules: {
                    title: [
                        { required: true, message: '请输入书名', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    doubanId: [
                        { required: true, message: '请输入豆瓣id', trigger: 'blur' }
                    ],
                    catalog: [
                        { required: true, message: '请输入一句话序言', trigger: 'blur' }
                    ],
                    summary: [
                        { required: true, message: '请输入一句话概要', trigger: 'blur' }
                    ],
                    gid: [
                        { type: 'number', required: true, message: '请选择类别', trigger: 'change' }
                    ],
                    detail: [
                        { required: true, message: '请输入图书详情', trigger: 'blur' }
                    ]
                },
                loading: false
            }
        },

        computed: {
            isEdit() {
                return this.$route.meta.isEdit
            },
            editor() {
                return this.$refs.myTextEditor.quillEditor;
            }
        },

        created() {
            if (this.isEdit) {
                this.id = this.$route.params.id;
                this.is_disabled = true;
                this.getData();
            }
        },

        methods: {
            getData(){
                fetchBookEdit(this.id)
                    .then((res) => {
                        if(res && res.data.status == ERR_OK){
                            this.form = res.data.data;
                        }else {
                            this.$message.error('获取图书信息失败');
                        }
                    })
                    .catch((error) => {
                        this.$router.go(-1);
                    })
            },

            onEditorChange({ editor, html, text }) {
                this.form.detail = html;
            },

            handleDouban() {
                if(!this.form.title) return;

                let url = `https://book.douban.com/subject_search?search_text=${this.form.title}`;
                window.open(url);
            },

            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.loading = true;

                        if (this.isEdit) {
                            // 修改提交
                            fetchBookSaveEdit(this.id, {
                                title: this.form.title,
                                catalog: this.form.catalog,
                                summary: this.form.summary,
                                gid: this.form.gid,
                                detail: this.form.detail
                            })
                                .then((res) => {
                                    if(res && res.data.status == ERR_OK){
                                        this.$message.success('修改成功');
                                        setTimeout(() => {
                                            this.$router.push('/bookindex');
                                        }, 1e3)
                                    }else {
                                        this.$message.error('修改失败');
                                    }
                                    this.loading = false;
                                })
                                .catch((error) => {
                                    this.$message.error(error);
                                })
                        } else{
                            // 添加提交
                            fetchBookSaveAdd(this.form)
                                .then((res) => {
                                    if(res && res.data.status == ERR_OK){
                                        this.$message.success('创建成功')
                                        setTimeout(() => {
                                            this.$router.push('/bookindex')
                                        }, 1e3)
                                    }else {
                                        this.$message.error('创建失败')
                                    }
                                    this.loading = false
                                })
                                .catch((error) => {
                                    this.$message.error(error)
                                })
                        }
                    } else {
                        return false;
                    }
                })
            },

            onCancel() {
                this.$router.go(-1);
            }
        },

        components: {
            quillEditor
        }
    }
</script>