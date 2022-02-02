/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: '',
    payload: ''
  },

  mutations: {
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken
    },
    setPayload(state, payload) {
      state.payload = payload
    },
    setPayloadFirstName(state, firstName) {
      state.payload.firstName = firstName
    },
    setPayloadLastName(state, lastName) {
      state.payload.lastName = lastName
    }
  },

  actions: {
    async logout({ commit }) {
      commit('setAccessToken', null)
      commit('setPayload', null)
      Vue.prototype.$axios.defaults.headers.common['Authorization'] = null
      await Vue.prototype.$plugins.Storage.remove({ key: 'session' })
      router.push('/')
    },

    b64DecodeUnicode({ commit }, { accessToken }) {
      return decodeURIComponent(atob(accessToken).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
    }
  }
})
