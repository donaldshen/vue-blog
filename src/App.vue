<template>
  <div id="app">
    <Navbar></Navbar>
    <el-row type="flex" justify="center">
      <el-col id="content" :xs="18" :sm="14" :md="10">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'app',
  components: {
    Navbar
  }
}
</script>

<style>
:root {
  --vueGreen: #42b983;
  --textDark: #2c3e50;
}

body {
  margin: 0;
}

#app {
  font-size: 14px;
  color: var(--textDark);
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}

#content {
  padding: 10px 0;
}
</style>
