<template>
  <el-menu theme="dark" mode="horizontal" :router="true" @select="handleSelect">
    <el-menu-item index="/">主页</el-menu-item>
    <template v-if="user">
      <el-submenu class="nav-item" index="1">
        <template slot="title">个人主页</template>
        <el-menu-item index="signout">退出登录</el-menu-item>
        <el-menu-item index="deleteAcount">删除用户</el-menu-item>
      </el-submenu>
      <el-menu-item class="nav-item" index="/create">新建文章</el-menu-item>
    </template>
    <template v-else>
      <el-menu-item class="nav-item" index="/register">注册</a></el-menu-item>
      <el-menu-item class="nav-item" index="/signin">登录</el-menu-item>
    </template>
  </el-menu>
</template>

<script>
export default {
  computed: {
    user () {
      return this.$store.state.user
    },
  },
  methods: {
    async handleSelect (index) {
      try {
        if (['signout', 'deleteAcount'].includes(index)) {
          const res = await this.$http({
            method: 'delete',
            url: index === 'signout' ? 'sessions' : 'users',
          })
          this.$message({
            message: res.data.message,
            type: 'success',
          })
          this.$store.commit('updateUser', null)
          this.$router.replace('/')
        }
      } catch (e) {
        //
      }
    },
  },
}
</script>

<style lang="css">
.nav-item {
  float: right !important;
}
</style>
