<template>
  <el-form :model="form"
  :rules="rules"
  ref="rform"
  label-width="100px">
  <el-form-item label="用户名" prop="name">
    <el-input v-model.trim="form.name"
    placeholder="用户名"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input placeholder="密码"
    type="password"
    v-model.trim="form.password"
    auto-complete="off"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('rform')">
      提交
    </el-button>
  </el-form-item>
</el-form>
</template>

<script>
const qs = require('qs')

export default {
  name: 'signin',
  data() {
    return {
      form: {
        name: '',
        password: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const res = await this.$http({
              method: 'post',
              url: 'sessions',
              data: qs.stringify(this.form),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            })
            this.$store.commit('updateUser', res.data.user)
            this.$router.replace('/')
          } catch (e) {
            // 不需要进一步处理
          }
        } else {
          console.log('Error', '表单有误')
        }
      })
    },
  },
}
</script>
