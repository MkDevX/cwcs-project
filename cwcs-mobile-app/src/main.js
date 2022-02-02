import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Ionic from '@ionic/vue'
import '@ionic/core/css/ionic.bundle.css'
import '@/assets/css/tailwind.css'
import axios from 'axios'
import { Plugins } from '@capacitor/core'
import VueSocketIO from 'vue-socket.io'
import VueTouch from 'vue-touch'

Vue.prototype.$axios = axios
Vue.prototype.$plugins = Plugins

Vue.use(Ionic)
Vue.use(VueTouch)

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

(async() => {
  try {
    const session = await Plugins.Storage.get({ key: 'session' })
    const { accessToken } = await JSON.parse(session.value)
    const payload = JSON.parse(b64DecodeUnicode(accessToken.split('.')[1]))
    store.commit('setAccessToken', accessToken)
    store.commit('setPayload', payload)
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    if(router.currentRoute.path !== '/notifications') router.push('/notifications')
  } catch(error) {
    //console.log({ error })
    await store.dispatch('logout')
  } 
  finally {
    axios.interceptors.response.use(undefined, function (err) {
      return new Promise(function() {
        if (err.response.status === 401) {
          (async() => { await store.dispatch('logout') })()
        }
        throw err
      })
    })
    
    Plugins.App.addListener('backButton', () => {
      Plugins.App.exitApp()
    })

    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})()
