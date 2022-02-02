<template>
  <div class="ion-page">
    <ion-content>
      <v-touch @swipedown="getNotifications()">
        <div class="flex items-center justify-between text-lg border-b border-gray-400">
          <div class="flex items-center rounded-lg py-1">
            <svg class="w-10 h-10 text-gray-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16z"/></svg>
            <h1 class="text-lg text-gray-500 font-semibold uppercase">Zgłoszenia</h1>
          </div>
          <!-- <div>
            <ion-button @click="startPushNotificationPlugin()" color="success">START</ion-button>
            <ion-button @click="stopPushNotificationPlugin()" color="danger">STOP</ion-button>
          </div> -->
          <!-- <button @click="getNotifications()" class="flex items-center justify-center text-white font-bold mr-2 py-1 px-2 rounded text-xs bg-gray-500 hover:bg-gray-400 focus:outline-none" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-500': pending, 'hover:bg-gray-400': !pending }" :disabled="pending">
            <svg class="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
          </button> -->
        </div>
      </v-touch>
      <div v-if="!pending && notifications.length" class="w-full max-w-sm container mx-auto">
        <div v-for="(notification, index) in notifications" :key="index">
          <div class="my-2 mx-2 p-3 text-sm bg-gray-400 rounded-lg">
            <div class="flex flex-row items-center justify-between">
              <div class="text-gray-700 font-bold">Status :
                <span v-if="notification.notificationStatus" class="text-red-700 text-base">OTWARTE</span>
                <span v-if="!notification.notificationStatus" class="text-green-700 text-base">ZAMKNIĘTE</span>
              </div>
              <button @click="presentAlert(notification.dateNotification, notification.firstName, notification.lastName, notification.roomName, notification.workstationName, notification.notificationDescription)" class="flex items-center justify-center text-white font-bold py-1 px-2 rounded text-xs bg-blue-600 hover:bg-blue-500 focus:outline-none">
                <svg class="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
              </button>
            </div>
            <div class="mt-2">
              <div class="text-gray-700 font-bold">Data dodania zgłoszenia:</div>
              <div class="text-gray-600">{{ notification.dateNotification }}</div>
            </div>
            <div class="mt-2">
              <span class="text-gray-700 font-bold">Kategoria: </span>
              <span class="text-gray-600">{{ notification.categoryName }}</span>
            </div>
            <div class="mt-2 text-gray-700 font-bold">
              PRIORYTET :
              <span v-if="notification.notificationPriority == 'low'" class="text-blue-700 text-base">NISKI</span>
              <span v-if="notification.notificationPriority == 'medium'" class="text-yellow-700 text-base">ŚREDNI</span>
              <span v-if="notification.notificationPriority == 'high'" class="text-red-500 text-base">WYSOKI</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!notifications.length && !pending" class="flex flex-col w-full items-center justify-center my-2">
        <svg class="w-16 h-16 text-gray-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
        <div class="uppercase font-semibold text-gray-400">Brak zgłoszeń</div>
      </div>
      <div v-if="pending" class="flex w-full items-center justify-center my-2">
        <svg class="w-10 h-10" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#4A5568"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
      </div>
    </ion-content>
  </div>
</template>

<script>
export default {
  name: 'Notifications',

  data() {
    return {
      notifications: [],
      pending: false
    }
  },

  async mounted() {
    this.$plugins.SplashScreen.hide()

    await this.getNotifications()

    await this.sockets.subscribe('NOTIFICATIONS', async () => {      
      await this.getNotifications()
    })

    this.startPushNotificationPlugin()

    this.$root.$on('getNotifications', async () => { await this.getNotifications() })
  },

  async destroyed() {
    await this.sockets.unsubscribe('NOTIFICATIONS')
  },

  methods: {
    async getNotifications() {
      try {
        this.pending = true
        const result = await this.$axios.get(process.env.VUE_APP_API_URL + '/notifications')

        this.notifications = result.data.filter(notification => {
          if(notification.notificationStatus) {
            notification.categoryName = notification.categoryName.toString()

            if(notification.categoryName.length <= 0) {
              notification.categoryName = 'BRAK'
            }
            return notification
          }
        })
        this.pending = false
        //console.log(this.notifications)
      } catch (error) {
        this.pending = false
        console.log({ error })
      }
    },

    presentAlert(dateNotification, firstName, lastName, roomName, workstationName, notificationDescription) {
      return this.$ionic.alertController
        .create({
          header: 'Szczegóły zgłoszenia',
          subHeader: dateNotification,
          message: '<strong>Imię: </strong> ' + firstName + '<br>' + 
                   '<strong>Nazwisko: </strong> ' + lastName + '<br>' +
                   '<strong>Pomieszczenie: </strong> ' + roomName + '<br>' +
                   '<strong>Komputer: </strong> ' + workstationName + '<br>' +
                   '<strong>Opis usterki: </strong> ' + notificationDescription,
          buttons: ['OK'],
        })
        .then(a => a.present())
    },

    async startPushNotificationPlugin() {
      await this.$plugins.PushNotificationsPlugin.start()
      // .then(result => {
      //   alert(JSON.stringify(result))
      // }).catch(error => {
      //   alert(error)
      // }) 
    },

    async stopPushNotificationPlugin() {
      await this.$plugins.PushNotificationsPlugin.stop()
      // .then(result => {
      //   alert(JSON.stringify(result))
      // }).catch(error => {
      //   alert(error)
      // }) 
    }
    
  }
}
</script>