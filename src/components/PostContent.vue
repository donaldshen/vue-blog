<template>
  <el-card>
    <router-link class="el-button el-button--text title" :to="{ name: 'post', params: { id: post.id } }" tag="button">{{post.title}}</router-link>
    <div class="author">
      <span class="name">{{post.author.name}}</span>，
      <span class="bio">{{post.author.bio}}</span>
    </div>
    <hr>
    <div v-html="content"></div>
    <div class="status">
      发布于 {{birth}}
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    post: Object
  },
  computed: {
    content () {
      return this.$marked(this.post.content)
    },
    birth () {
      return new Date(this.post.birth).toLocaleDateString()
    }
  }
}
</script>

<style>
:root {
  --silver: #8492A6;
  --darkBlue: #1D8CE0;
}

.title {
  font-size: 18px;
  color: var(--darkBlue);
}

.name {
  font-weight: bold;
}

.bio {
  color: var(--silver);
}

.status {
  color: var(--silver);
}
</style>
