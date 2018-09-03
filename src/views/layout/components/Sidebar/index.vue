<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="!sidebar.opened">
      <router-link :to="'/admin/user'">
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">用户</span>
        </el-menu-item>
      </router-link>
      <router-link :to="'/admin/role'">
        <el-menu-item index="3">
          <i class="el-icon-document"></i>
          <span slot="title">角色</span>
        </el-menu-item>
      </router-link>
      <router-link :to="'/admin/resource'">
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">资源</span>
        </el-menu-item>
      </router-link>
      <router-link :to="'/admin/draft'">
        <el-menu-item index="5">
          <i class="el-icon-menu"></i>
          <span slot="title">文章</span>
        </el-menu-item>
      </router-link>
      <router-link :to="'/admin/category'">
        <el-menu-item index="6">
          <i class="el-icon-menu"></i>
          <span slot="title">类别</span>
        </el-menu-item>
      </router-link>
    </el-menu>
  </el-scrollbar>

</template>

<style>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
    height: 100%;
  }

  .sidebar-container .scrollbar-wrapper {
    height: calc(100% + 15px);
  }

  .sidebar-container .scrollbar-wrapper .el-scrollbar__view {
    height: 100%;
  }

  .el-menu-vertical-demo{
    height: 100%;
  }
</style>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters('app', [
          'sidebar'
      ])
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

