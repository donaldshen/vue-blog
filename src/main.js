// async/await need this
import 'babel-regenerator-runtime'
import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import marked from 'marked'
import './axios'
import router from './router'
import store from './store'
import App from './App.vue'

Vue.use(Element)
Vue.prototype.$marked = marked

// user for test
window.vm = new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
