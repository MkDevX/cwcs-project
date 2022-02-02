<template>
  <div>
    <div class="flex items-center justify-between px-5 text-lg border-b border-gray-400">
      <div class="flex items-center rounded-lg py-1">
        <svg class="w-10 h-10 text-gray-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16z"/></svg>
        <h1 class="text-lg text-gray-500 font-semibold uppercase">Zgłoszenia</h1>
      </div>
      <router-link to="/user-panel/add-user-notification" title="Dodaj zgłoszenie" class="flex items-center justify-center bg-green-600 hover:bg-green-500 cursor-pointer text-sm text-white tracking-wide py-2 px-2 rounded focus:outline-none" :class="{ 'opacity-50 cursor-not-allowed hover:bg-green-600': accessNotifications }" :event="accessNotifications ? '' : 'click'">
        <svg class="w-5 h-5 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
      </router-link>
    </div>
     <div v-if="!pending && notifications.length" class="w-full px-4 py-5">
      <table class="text-left w-full border-collapse">
        <thead>
          <tr>
            <th class="py-2 px-1 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">L.P</th>
            <th class="py-2 px-1 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700 truncate">Data dodania zgłoszenia</th>
            <th class="py-2 px-1 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700 truncate">Data zauważenia usterki</th>
            <th class="py-2 px-1 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">Status</th>
            <th class="py-2 px-1 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-b border-gray-700">Zarządzanie</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(notification, index) in notifications" :key="index" class="hover:bg-gray-400" v-tooltip.bottom="{ content: notification.notificationDescription, classes: 'max-w-sm text-white text-sm bg-gray-600 border-2 border-gray-700 rounded-lg shadow-2xl py-1 px-1 my-1' }">
            <td class="py-2 px-2 border-b border-gray-500">
              {{ index + 1 }}
            </td>
            <td class="py-2 px-2 border-b border-gray-500">{{ notification.dateNotification }}</td>
            <td class="py-2 px-2 border-b border-gray-500">{{ notification.dateFaultNotice }}</td>
            <td class="py-2 px-2 border-b border-gray-500"><span v-if="notification.notificationStatus" class="text-red-700 font-bold">OTWARTE</span><span v-if="!notification.notificationStatus" class="text-green-700 font-bold">ZAMKNIĘTE</span></td>
            <td class="py-2 px-2 border-b border-gray-500">
              <div class="flex items-center justify-center">
                <router-link :to="'/user-panel/edit-user-notification/' + notification._id" title="Edytuj" class="flex items-center justify-center text-white font-bold mr-1 py-1 px-2 rounded text-xs bg-gray-600 hover:bg-gray-500" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-600': accessNotifications || !notification.notificationStatus }" :event="accessNotifications || !notification.notificationStatus ? '' : 'click'">
                  <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                </router-link>
                <button @click="showModalWindow(index)" title="Usuń" class="flex items-center justify-center text-white font-bold py-1 px-2 rounded text-xs bg-red-600 hover:bg-red-500" :class="{ 'opacity-50 cursor-not-allowed hover:bg-red-600': accessNotifications || !notification.notificationStatus }" :disabled="accessNotifications || !notification.notificationStatus">
                  <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                </button>
                <!-- MODAL WINDOW TO CONFIRM REMOVING ROOM -->
                <div class="hidden fixed w-full h-full top-0 left-0 flex items-center justify-center" :id="index">
                  <div @click.prevent="showModalWindow(index)" class="absolute w-full h-full bg-gray-900 opacity-50"></div>
                  <div class="bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                    <div class="modal-content py-4 text-left px-6" id="modal">
                      <div class="flex justify-between mb-5">
                        <p class="text-base font-bold">Czy napewno chcesz usunąć to zgłoszenie?</p>
                        <div @click="showModalWindow(index)" class="cursor-pointer z-50" :class="{ 'opacity-50 cursor-not-allowed': pending }">
                          <svg class="fill-current text-black w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path></svg>
                        </div>
                      </div>
                      <p>Data dodania zgłoszenia: <b>{{ notification.dateNotification }}</b></p>
                      <div class="flex justify-end mt-5">
                        <button @dblclick="removeNotification(notification._id)" class="px-4 py-2 bg-red-600 rounded hover:bg-red-500 text-white mr-2" :class="{ 'opacity-50 cursor-not-allowed hover:bg-red-600': pending }" :disabled="pending" type="button">
                          <div v-if="!pending">Tak</div>
                          <svg v-if="pending" class="w-6 h-6" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
                        </button>
                        <button @click="showModalWindow(index)" class="px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-500" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-600': pending }" :disabled="pending" type="button">Nie</button>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- END OF MODAL WINDOW TO CONFIRM REMOVING ROOM -->
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!notifications.length && !pending" class="flex flex-col w-full items-center justify-center my-2">
      <svg class="w-16 h-16 text-gray-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
      <div class="uppercase font-semibold text-gray-400">Brak zgłoszeń</div>
    </div>
    <div v-if="pending" class="flex w-full items-center justify-center my-2">
      <svg class="w-10 h-10" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#4A5568"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserNotifications',

  data() {
    return {
      notifications: [],
      pending: false
    }
  },

  async mounted() {
    await this.getNotifications()
  },

  computed: {
    accessNotifications() { return !this.$store.state.payload.accessNotifications },
    userId() { return this.$store.state.payload.id }
  },

  methods: {
    async getNotifications() {
      try {
        this.pending = true
        const result = await this.$axios.get(process.env.VUE_APP_API_URL + `/notifications/user/${this.$store.state.payload.id}`)
        this.notifications = result.data
        this.pending = false
        //console.log(this.notifications)
      } catch (error) {
        this.pending = false
        console.log({ error })
      }
    },
    async removeNotification(id) {
      try {
        this.pending = true
        await this.$axios.delete(process.env.VUE_APP_API_URL + `/notifications/${id}`)
        this.pending = false
        this.modalWindow = false
        await this.getNotifications()
      } catch (error) {
        this.pending = false
        this.modalWindow = false
        console.log({ error })
      }
    },

    showModalWindow(index) {
      if(!this.pending) {
        if(document.getElementById(index).className.includes('hidden')) {
          document.getElementById(index).className = document.getElementById(index).className.replace('hidden', 'block')
        } else if(document.getElementById(index).className.includes('block')) {
          document.getElementById(index).className = document.getElementById(index).className.replace('block', 'hidden')
        }
      }
    }
  }
}
</script>