import Vue from 'vue'
import Router from 'vue-router'

//ADMINISTRATOR, EMPLOYEE, USER
import Login from './views/Login'
import Settings from './views/Settings'


//ADMINISTRATOR
import AdminRegistration from './views/ManagementPanel/Administrator/AdminRegistration'
import Employees from './views/ManagementPanel/Administrator/Employees/Employees'
import AddEmployee from './views/ManagementPanel/Administrator/Employees/AddEmployee'
import EditEmployee from './views/ManagementPanel/Administrator/Employees/EditEmployee'

//ADMINISTRATOR && EMPLOYEE
import Notifications from './views/ManagementPanel/Notifications/Notifications'
import EditNotification from './views/ManagementPanel/Notifications/EditNotification'
import Users from './views/ManagementPanel/Users/Users'
import AddUser from './views/ManagementPanel/Users/AddUser'
import EditUser from './views/ManagementPanel/Users/EditUser'
import UserDetails from './views/ManagementPanel/Users/UserDetails'
import Rooms from './views/ManagementPanel/Rooms/Rooms'
import Workstations from './views/ManagementPanel/Workstations/Workstations'

//USER
import UserNotifications from './views/UserPanel/UserNotifications/UserNotifications'
import AddUserNotification from './views/UserPanel/UserNotifications/AddUserNotification'
import EditUserNotification from './views/UserPanel/UserNotifications/EditUserNotification'

Vue.use(Router)

export default new Router({
  //mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/settings',
      name: 'Settings',
      meta: { layout: 'sidebar' },
      component: Settings
    },
    {
      path: '/management-panel/administrator/registration',
      name: 'AdminRegistration',
      component: AdminRegistration
    },
    {
      path: '/management-panel/administrator/employees',
      name: 'Employees',
      meta: { layout: 'sidebar' },
      component: Employees
    },
    {
      path: '/management-panel/administrator/add-employee',
      name: 'AddEmployee',
      meta: { layout: 'sidebar' },
      component: AddEmployee
    },
    {
      path: '/management-panel/administrator/edit-employee/:id',
      name: 'EditEmployee',
      meta: { layout: 'sidebar' },
      component: EditEmployee
    },
    
    {
      path: '/management-panel/users',
      name: 'Users',
      meta: { layout: 'sidebar' },
      component: Users
    },
    {
      path: '/management-panel/add-user',
      name: 'AddUser',
      meta: { layout: 'sidebar' },
      component: AddUser
    },
    {
      path: '/management-panel/edit-user/:id',
      name: 'EditUser',
      meta: { layout: 'sidebar' },
      component: EditUser
    },
    {
      path: '/management-panel/user-details/:id',
      name: 'UserDetails',
      meta: { layout: 'sidebar' },
      component: UserDetails
    },
    {
      path: '/management-panel/notifications',
      name: 'Notifications',
      meta: { layout: 'sidebar' },
      component: Notifications
    },
    {
      path: '/management-panel/edit-notification/:id',
      name: 'EditNotification',
      meta: { layout: 'sidebar' },
      component: EditNotification
    },
    {
      path: '/management-panel/rooms',
      name: 'Rooms',
      meta: { layout: 'sidebar' },
      component: Rooms
    },
    {
      path: '/management-panel/workstations/:roomId/:roomName',
      name: 'Workstations',
      meta: { layout: 'sidebar' },
      component: Workstations
    },
    {
      path: '/user-panel/user-notifications',
      name: 'UserNotifications',
      meta: { layout: 'sidebar' },
      component: UserNotifications
    },
    {
      path: '/user-panel/add-user-notification',
      name: 'AddUserNotification',
      meta: { layout: 'sidebar' },
      component: AddUserNotification
    },
    {
      path: '/user-panel/edit-user-notification/:id',
      name: 'EditUserNotification',
      meta: { layout: 'sidebar' },
      component: EditUserNotification
    }
  ]
})
