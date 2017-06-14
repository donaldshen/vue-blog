import axios from 'axios'
import Vue from 'vue'
import router from './router'
import store from './store'

Vue.prototype.$qs = require('qs')

const port = require('../config/default.js').serverPort

const serverURL = `http://localhost:${port}/api/`

const http = axios.create({
  baseURL: serverURL,
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': serverURL,
  },
})

http.interceptors.response.use((res) => {
  if (res.data.message) {
    Vue.prototype.$message({
      message: res.data.message,
      type: 'success',
    })
  }
  return res
}, (e) => {
  const data = e.response.data
  if (data) {
    Vue.prototype.$message.error(data.message)
    if (data.message === '未登录') {
      router.replace('/signin')
    } else if (data.message === '已登录') {
      router.replace('/')
    }
  } else {
    console.log('Error', e.message)
  }
  return Promise.reject(e)
})

Vue.prototype.$http = http
