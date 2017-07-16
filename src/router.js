import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Posts from './components/Posts.vue'
import Post from './components/Post.vue'
import SignIn from './components/SignIn.vue'
import Register from './components/Register.vue'
import Create from './components/Create.vue'

Vue.use(Router)
const router = new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: 'posts'
    },
    {
      path: '/posts',
      name: 'posts',
      component: Posts
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: Post
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn,
      meta: {
        requiresNotLogin: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        requiresNotLogin: true
      }
    },
    {
      path: '/create',
      name: 'create',
      component: Create,
      meta: {
        requiresLogin: true
      }
    }
  ],
  // need mode: 'history'
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        selector: to.hash
      }
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach(async (to, from, next) => {
  await store.dispatch('checkLogin')
  if (to.fullPath.includes('posts')) {
    await store.dispatch('fetchPosts')
  }

  if (to.matched.some(record => record.meta.requiresLogin)) {
    if (!store.state.user) {
      console.log('redirect to /signin')
      next('/signin')
      return
    }
  } else if (to.matched.some(record => record.meta.requiresNotLogin)) {
    if (store.state.user) {
      console.log('redirect to /')
      next('/')
      return
    }
  }
  next()
})

export default router
