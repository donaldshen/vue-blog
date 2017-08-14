import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    posts: null,
  },
  getters: {
    userName (state) {
      return state.user ? state.user.name : null
    },
  },
  mutations: {
    updateUser (state, user) {
      state.user = user
    },
    updatePosts (state, posts) {
      state.posts = posts
    },
    updatePost (state, {post, data}) {
      Object.assign(post, data)
    },
  },
  actions: {
    async checkLogin ({ commit }) {
      const res = await Vue.prototype.$http({
        method: 'get',
        url: 'sessions',
      })
      commit('updateUser', res.data.user)
    },
    async fetchPosts ({ commit }) {
      try {
        const res = await Vue.prototype.$http({
          method: 'get',
          url: 'posts',
        })
        commit('updatePosts', res.data)
      } catch (e) {
        //
      }
    },
  },
  strict: process.env.NODE_ENV !== 'production',
})
