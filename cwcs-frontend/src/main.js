import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/tailwind.css'
import axios from 'axios'
import VueCookies from 'vue-cookies'
import VueSocketIO from 'vue-socket.io'
import * as macaddress from 'macaddress'
import VTooltip from 'v-tooltip'

import Default from '@/layouts/Default'
import Sidebar from '@/layouts/Sidebar'

Vue.prototype.$axios = axios
Vue.prototype.$macaddress = macaddress

Vue.use(VueCookies)
Vue.use(VTooltip)

Vue.use(new VueSocketIO({
  debug: false,
  connection: process.env.VUE_APP_API_URL
}))

Vue.config.productionTip = false

function b64DecodeUnicode(accessToken) {
  return decodeURIComponent(atob(accessToken).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
}

try {
  const accessToken = VueCookies.get('accessToken')
  const payload = JSON.parse(b64DecodeUnicode(accessToken.split('.')[1]))
  store.commit('setAccessToken', accessToken)
  store.commit('setPayload', payload)
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
  Vue.prototype.$socket.emit('LOGIN', { accountId: payload.id, role: payload.role, firstName: payload.firstName, lastName: payload.lastName, roomName: payload.roomName, workstationName: payload.workstationName, addressMac: payload.addressMac })
} catch(error) {
  //console.log({ error })
  store.dispatch('logout')
}

axios.interceptors.response.use(undefined, function (err) {
  return new Promise(function () {
    if (err.response.status === 401) {
      store.dispatch('logout')
    }
    throw err
  })
})

Vue.component('default-layout', Default)
Vue.component('sidebar-layout', Sidebar)

new Vue({
  router,
  store,
  render: function (h) {
    return h(App)
  }
}).$mount('#app')
