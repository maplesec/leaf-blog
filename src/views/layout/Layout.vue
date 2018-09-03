<template>
  <el-container>
    <sidebar class="sidebar-container"></sidebar>
    <el-container class="right-main" :class="{'right-main-close': !sidebar.opened}">
      <el-header height="50px">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
        <div class="right-menu">
          <span>{{profile.name}}</span>
          <el-button size="mini" type="primary" @click="logout()">{{$t('common.logout')}}</el-button>
        </div>
      </el-header>
      <el-main>
        <tags-view></tags-view>
        <app-main></app-main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import { Sidebar, TagsView, AppMain} from './components'
  import Hamburger from '@/components/Hamburger'
  import { mapGetters } from 'vuex'
  import * as api from '@/services/user'

  export default {
    name: 'layout',
    components: {
      Sidebar,
      Hamburger,
      TagsView,
      AppMain
    },
    data() {
      return {
        isCollapse: true
      };
    },
    computed: {
      ...mapGetters('app', [
        'sidebar',
        'profile'
      ])
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },
      logout () {
        this.$doRequest(api.logout(), '登出').then((res) => {
          this.$router.push({name: 'login'});
        })
      }
    }
  }
</script>

<style>
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }

  .right-menu {
    float: right;
    height: 100%;
  }

  .el-header {
    padding: 0;
    border-bottom: solid 1px #e6e6e6;
  }

  .app-main {
    padding: 20px;
  }

  .sidebar-container{
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
  }

  .right-main{
    margin-left: 200px;
    transition: margin-left 0.35s;
  }

  .right-main-close{
    margin-left: 65px !important;
  }
</style>
