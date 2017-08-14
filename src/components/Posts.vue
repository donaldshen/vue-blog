<template lang="html">
  <div>
    <PostContent class="post" v-for="post in postsDisplay"
    :post="post"
    :key="post.id"></PostContent>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import PostContent from './PostContent.vue'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState(['posts']),
    ...mapGetters(['userName']),
    postsDisplay () {
      return this.posts.filter(post => post.access === 'public' || this.userName === post.author.name)
    },
  },
  components: {
    PostContent,
  },
}
</script>

<style>
.post {
  margin-bottom: 20px;
}
</style>
