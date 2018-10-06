<template>
  <el-container>
    <sidebar class="sidebar-container"></sidebar>
    <el-container class="right-main" :class="{'right-main-close': !sidebar.opened}">
      <el-header height="50px">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
        <div class="right-menu">
          <!-- <span>{{profile.name}}</span>
          <el-button size="mini" type="primary" @click="logout()">{{$t('common.logout')}}</el-button> -->

          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              {{profile.name}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">{{$t('common.logout')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

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
      },
      handleCommand (command) {
        switch(command){
          case 'logout':
            this.logout();
            break;
          default:
            break;
        }
      }
    }
  }
</script>

<style lang="scss">
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }

  .right-menu {
    float: right;
    height: 100%;
    padding: 12px 15px;
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
    position: fixed !important;
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

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
