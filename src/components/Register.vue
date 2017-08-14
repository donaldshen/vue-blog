<template>
  <el-form :model="form"
  :rules="rules"
  ref="rform"
  label-width="100px">
  <el-form-item label="用户名" prop="name">
    <el-input v-model.trim="form.name"
    placeholder="用户名"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password" :required="true">
    <el-input placeholder="密码"
    type="password"
    v-model.trim="form.password"
    auto-complete="off"></el-input>
  </el-form-item>
  <el-form-item label="重复密码" prop="rePassword" :required="true">
    <el-input placeholder="重复密码" type="password" v-model.trim="form.rePassword" auto-complete="off"></el-input>
  </el-form-item>
  <el-form-item label="个人简介">
    <el-input type="textarea" :autosize="{minRows: 2, maxRows: 5}" v-model="form.bio">
    </el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('rform')">
      提交
    </el-button>
  </el-form-item>
</el-form>
</template>

<script>
export default {
  name: 'register',
  data () {
    return {
      form: {
        name: '',
        password: '',
        rePassword: '',
        bio: '',
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
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密码'))
              } else {
                if (this.form.rePassword) {
                  this.$refs.rform.validateField('rePassword')
                }
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
        rePassword: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'))
              } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const user = Object.assign({}, this.form)
          delete user.rePassword

          try {
            const res = await this.$http({
              method: 'post',
              url: 'users',
              data: this.$qs.stringify(user),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            })
            // 不使用提交前的user，因为server会加工数据
            this.$store.commit('updateUser', res.data.user)
            this.$router.replace('/')
          } catch (e) {
            //
          }
        } else {
          console.log('Error', '表单有误')
        }
      })
    },
  },
}
</script>
