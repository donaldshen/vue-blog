<template>
  <el-form :model="post" :rules="rules" ref="post">
    <el-form-item label="标题" prop="title">
      <el-input v-model.trim="post.title"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="content">
      <el-input type="textarea" :autosize="{minRows: 4, maxRows: 10}" v-model="post.content">
      </el-input>
    </el-form-item>
    <el-form-item v-if="post.content" label="预览">
      <div id="preview" v-html="preview">
      </div>
    </el-form-item>
    <el-form-item>
      <el-radio-group v-model="post.access" size="small">
        <el-radio-button label="public">公开</el-radio-button>
        <el-radio-button label="private">私密</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('post')">
        发布<i class="el-icon-upload el-icon--right"></i>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      post: {
        title: '',
        content: '',
        access: 'public'
      },
      rules: {
        title: [
          {
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '请输入内容',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    author () {
      return this.$store.state.user.name
    },
    preview () {
      return this.$marked(this.post.content)
    }
  },
  methods: {
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const post = {
            author: this.author,
            title: this.post.title,
            content: this.post.content,
            access: this.post.access
          }
          try {
            const res = await this.$http({
              method: 'post',
              url: 'posts',
              data: this.$qs.stringify(post),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
            this.$message({
              message: res.data.message,
              type: 'success'
            })
            this.$router.replace('/')
          } catch (e) {
            //
          }
        } else {
          console.log('Error', '表单有误')
        }
      })
    }
  }
}
</script>

<style>
:root {
  --darkWhite: #F9FAFC;
}

#preview {
  background-color: var(--darkWhite);
  clear: both;
  border: 1px solid #bfcbd9;
  border-radius: 4px;
  padding: 0 10px;
}
</style>
