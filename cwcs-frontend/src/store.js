/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

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
    logout({ commit }) {
      if(this.state.payload) {
        Vue.prototype.$socket.emit('LOGOUT', { accountId: this.state.payload.id, role: this.state.payload.role, firstName: this.state.payload.firstName, lastName: this.state.payload.lastName, roomName: this.state.payload.roomName, workstationName: this.state.payload.workstationName, addressMac: this.state.payload.addressMac })
      }
      commit('setAccessToken', null)
      commit('setPayload', null)
      Vue.prototype.$axios.defaults.headers.common['Authorization'] = null
      Vue.prototype.$cookies.remove('accessToken')
      Vue.prototype.$cookies.remove('io')
      router.push('/')
    },

    b64DecodeUnicode({ commit }, { accessToken }) {
      return decodeURIComponent(atob(accessToken).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
    }
  }
})
