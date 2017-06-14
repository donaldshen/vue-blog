<template>
  <div v-if="post">
    <PostContent :post="post"></PostContent>
    <el-button-group v-if="post.author.name===userName" id="manipulation">
      <el-button type="primary" icon="edit" @click="editPost"></el-button>
      <el-button type="primary" icon="delete" @click="deletePost"></el-button>
    </el-button-group>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import PostContent from './PostContent.vue'

export default {
  data() {
    return {
      editing: false,
    }
  },
  computed: {
    ...mapState(['posts']),
    ...mapGetters(['userName']),
    post() {
      return this.posts.find(post => post.id === this.$route.params.id)
    },
  },
  created() {
    if (this.post.access === 'private' && this.post.author.name !== this.userName) {
      this.$router.replace('/')
    }
  },
  methods: {
    editPost() {
      const temp = {
        title: this.post.title,
        content: this.post.content,
        access: this.post.access,
      }
      const h = this.$createElement
      this.$msgbox({
        title: '修改文章',
        message: h('el-form', [
          h('el-form-item', {
            props: { label: '标题' },
          }, [
            h('el-input', {
              props: { value: temp.title },
              on: {
                change(v) {
                  temp.title = v
                },
              },
            }),
          ]),
          h('el-form-item', {
            props: { label: '内容' },
          }, [
            h('el-input', {
              props: {
                type: 'textarea',
                autosize: { minRows: 4, maxRows: 10 },
                value: temp.content,
              },
              on: {
                change(v) {
                  temp.content = v
                },
              },
            }),
          ]),
          h('el-form-item', [
            // render函数不支持v-model。若想使用el-radio-group的话会很tricky
            // h('el-radio-group', {
            //   domProps: {
            //     value: temp.access,
            //   },
            //   on: {
            //     change: (v) => {
            //       console.log(v)
            //     },
            //   },
            // }, [
            //   h('el-radio-button', {
            //     props: {
            //       label: 'public',
            //     },
            //   }, '公开'),
            //   h('el-radio-button', {
            //     props: {
            //       label: 'private',
            //     },
            //     on: {
            //       '!click': () => {
            //         console.log('shit')
            //       },
            //     },
            //   }, '私密'),
            // ]),
            h('input', {
              attrs: {
                name: 'access',
                type: 'radio',
                checked: temp.access === 'public',
                // value: 'public',
              },
              on: {
                click() {
                  temp.access = 'public'
                },
              },
            }),
            h('label', '公开'),
            h('input', {
              attrs: {
                name: 'access',
                type: 'radio',
                checked: temp.access === 'private',
                // value: 'private',
              },
              on: {
                click() {
                  temp.access = 'private'
                },
              },
            }),
            h('label', '私密'),
          ]),
        ]),
        showCancelButton: true,
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            await this.$http({
              method: 'put',
              url: `posts/${this.post.id}`,
              data: this.$qs.stringify(temp),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            })
            Object.assign(this.post, temp)
          }
          done()
        },
      })
    },
    async deletePost() {
      await this.$http({
        method: 'delete',
        url: `posts/${this.post.id}`,
      })
      this.$router.replace('/')
    },
  },
  components: {
    PostContent,
  },
}
</script>

<style>
#manipulation {
  margin: 10px 0;
}
</style>
