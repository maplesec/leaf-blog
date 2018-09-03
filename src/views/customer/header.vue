<template>
    <header id="header" class="header bg-white">
        <div class="navbar-container">
            <a class="navbar-logo" href="/">
                <img src="/static/logo/leaf.png"  alt="Leaf Blog"/>
                <span>Leaf Blog</span>
            </a>
            <div>
                <el-input placeholder="Search..." v-model="searchValue" style="width:200px" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="handleSearch()"></el-button>
                </el-input>
            </div>
        </div>
    </header>
</template>

<script>
    const module = 'article';
    export default {
        data () {
            return {
                searchValue: '',
                module: module
            }
        },
        computed: {
            loading(){
                return this.$store.state[this.module].list.loading;
            }
        },
        methods: {
            handleSearch () {
                this.$store.dispatch(`${this.module}/setPagination`, {filter: this.searchValue});
                this.initTable();
            },
            initTable (isSearch) {
                this.$store.dispatch(`${this.module}/getList`).then((e) => {
                    //TODO: 出错的提示
                    this.$formatMessage(e, '获取用户列表', 'none');
                })
            },
        }
    }
</script>
<style>
    /*header*/
    .header {
        line-height: 68px;
        position: fixed;
        z-index: 10;
        top: 0;
        display: block;
        width: 100%;
        height: 70px;
        padding: 0;
        text-align: right;
        -webkit-box-shadow: 0 1px 5px rgba(0,0,0,.1);
        -moz-box-shadow: 0 1px 5px rgba(0,0,0,.1);
        box-shadow: 0 1px 5px rgba(0,0,0,.1);
    }

    .navbar-container {
        position: relative;
        width: 1040px;
        max-width: 100%;
        height: 70px;
        margin: 0 auto;
    }

    .navbar-logo {
        font-size: 22px;
        line-height: 22px;
        position: absolute;
        top: 50%;
        left: 0;
        display: block;
        width: auto;
        max-width: 50%;
        height: 22px;
        margin-top: -15px;
        margin-left: 25px;
        text-decoration: none;
    }

    .navbar-logo img {
        width: auto;
        height: 32px;
        outline: 0;
        border-radius: 16px;
    }

    .navbar-logo span {
        color: #8c939d;
        font-size: 16px;
        position: relative;
        top: -7px;
    }
</style>
