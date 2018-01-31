<template>
    <el-aside width="180px" class="el-menu--dark">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" background-color="#2E363F" text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" background-color="#1F2D3D" text-color="#bfcbd9" active-text-color="#20a0ff">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index" :route="{ path:'/'+subItem.index }">{{ subItem.title }}</el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </el-aside>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'el-icon-menu',
                        index: 'book',
                        title: '图书管理',
                        subs: [
                            {
                                index: 'bookindex',
                                title: '图书列表'
                            },
                            {
                                index: 'bookadd',
                                title: '添加图书'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-date',
                        index: 'admin',
                        title: '管理员管理'
                    }
                ]
            }
        },
        computed: {
            onRoutes(){
                return this.$route.path.replace('/', '');
            }
        }
    }
</script>

<style scoped>
    .el-aside {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow: hidden;
    }
    .el-menu {
        border-right: none;
    }

    .el-aside > ul {
        height: 100%;
    }

    .el-menu--dark .el-submenu .el-menu .el-menu-item {
        background-color: #1f2d3d !important;
    }

    .el-menu--dark .el-submenu .el-menu .el-menu-item:hover {
        background-color: #48576a !important;
    }
</style>
