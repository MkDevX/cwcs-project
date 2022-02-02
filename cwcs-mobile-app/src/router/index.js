import Vue from 'vue'
//import VueRouter from 'vue-router'
import { IonicVueRouter } from '@ionic/vue'
import Login from '../views/Login'
import Notifications from '../views/Notifications'

//Vue.use(VueRouter)
Vue.use(IonicVueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: Notifications
  }
]

const router = new IonicVueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
