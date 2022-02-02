<template>
  <div>
    <div class="flex items-center justify-between px-5 text-lg border-b border-gray-400">
    <div class="flex items-center rounded-lg py-1">
      <svg class="w-10 h-10 text-gray-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z"/></svg>
      <h1 class="text-lg text-gray-500 font-semibold uppercase">Użytkownicy</h1>
    </div>
    <router-link to="/management-panel/add-user" title="Dodaj użytkownika" class="flex items-center justify-center bg-green-600 hover:bg-green-500 cursor-pointer text-sm text-white tracking-wide py-2 px-2 rounded focus:outline-none" :class="{ 'opacity-50 cursor-not-allowed hover:bg-green-600': accessUsersManagement }" :event="accessUsersManagement ? '' : 'click'">
      <svg class="w-5 h-5 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
    </router-link>
    </div>
    <div v-if="!pending" class="w-full px-5 py-5">
      <table class="text-left w-full border-collapse">
        <thead>
          <tr>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">Użytkownik</th>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">Imię i Nazwisko</th>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">Uprawnienia</th>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">Status</th>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-b border-gray-700">Zarządzanie</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in users" :key="index" class="hover:bg-gray-400">
            <td class="py-2 px-2 border-b border-gray-500">{{ user.username }}</td>
            <td class="py-2 px-2 border-b border-gray-500">{{ user.firstName }} {{ user.lastName }}</td>
            <td class="py-2 px-2 border-b border-gray-500">
              <div class="flex items-center justify-center">
                <div :title="user.accessNotifications ? 'Dostęp do funkcji zgłoszeń(dodawanie, edycja, usuwanie).' : 'Brak dostępu do funkcji zgłoszeń(dodawanie, edycja, usuwanie).'">
                  <svg class="w-6 h-6 fill-current text-red-700 cursor-pointer" :class="{ 'text-green-700' : user.accessNotifications }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16z"/></svg>
                </div>
              </div>
            </td>
            <td class="border-b border-gray-500">
              <div v-if="user.status" class="flex items-center justify-center cursor-pointer py-2 px-2" v-tooltip.bottom="{ content: userStatusDetails(user.roomName, user.workstationName), classes: 'max-w-sm text-white text-sm bg-gray-600 border-2 border-gray-700 rounded-lg shadow-2xl py-1 px-1 my-2' }">
                <svg class="fill-current text-green-600 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
              </div>
              <div v-if="!user.status" title="OFFLINE" class="flex items-center justify-center cursor-pointer py-2 px-2">
                <svg class="fill-current text-red-600 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
              </div>
            </td>
            <td class="py-2 px-2 border-b border-gray-500">
              <div class="flex items-center justify-center">
                <router-link :to="'/management-panel/user-details/' + user._id" title="Szczegóły" class="flex items-center justify-center text-white font-bold mr-1 py-1 px-2 rounded text-xs bg-blue-700 hover:bg-blue-600">
                  <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                </router-link>
                <router-link :to="'/management-panel/edit-user/' + user._id" title="Edytuj" class="flex items-center justify-center text-white font-bold mr-1 py-1 px-2 rounded text-xs bg-gray-600 hover:bg-gray-500" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-600': accessUsersManagement }" :event="accessUsersManagement ? '' : 'click'">
                  <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                </router-link>
                <button @click="showModalWindow(index)" title="Usuń" class="flex items-center justify-center text-white font-bold py-1 px-2 rounded text-xs bg-red-600 hover:bg-red-500" :class="{ 'opacity-50 cursor-not-allowed hover:bg-red-600': accessUsersManagement }" :disabled="accessUsersManagement">
                  <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                </button>
                <!-- MODAL WINDOW TO CONFIRM REMOVING USER -->
                <div class="hidden fixed w-full h-full top-0 left-0 flex items-center justify-center" :id="index">
                  <div @click.prevent="showModalWindow(index)" class="absolute w-full h-full bg-gray-900 opacity-50"></div>
                  <div class="bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                    <div class="modal-content py-4 text-left px-6" id="modal">
                      <div class="flex justify-between mb-5">
                        <p class="text-base font-bold">Czy napewno chcesz usunąć tego użytkownika a w konsekwencji zgłoszenia przez niego dodane?</p>
                        <div @click="showModalWindow(index)" class="cursor-pointer z-50" :class="{ 'opacity-50 cursor-not-allowed': pending }">
                          <svg class="fill-current text-black w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path></svg>
                        </div>
                      </div>
                      <p>Nazwa użytkownika: <b>{{ user.username }}</b></p>
                      <p>Imię i nazwisko: <b>{{ user.firstName }} {{ user.lastName }}</b></p>
                      <div class="flex justify-end mt-5">
                        <button @dblclick="removeUserAccount(user._id)" class="px-4 py-2 bg-red-600 rounded hover:bg-red-500 text-white mr-2" :class="{ 'opacity-50 cursor-not-allowed hover:bg-red-600': pending }" :disabled="pending" type="button">
                          <div v-if="!pending">Tak</div>
                          <svg v-if="pending" class="w-6 h-6" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
                        </button>
                        <button @click="showModalWindow(index)" class="px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-500" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-600': pending }" :disabled="pending" type="button">Nie</button>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- END OF MODAL WINDOW TO CONFIRM REMOVING USER -->
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!users.length && !pending" class="flex flex-col w-full items-center justify-center my-2">
        <svg class="w-16 h-16 text-gray-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
        <div class="uppercase font-semibold text-gray-400">Brak użytkowników</div>
      </div>
    </div>
    <div v-if="pending" class="flex w-full items-center justify-center my-2">
      <svg class="w-10 h-10" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#4A5568"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Users',

  data() {
    return {
      users: [],
      statusDetails: false,
      pending: false
    }
  },

  async mounted() {
    await this.getUsersAccounts()

    await this.sockets.subscribe('USERS', (activeUsers) => {      
      this.users = this.users.map(user => { 
        const activeUser = activeUsers.find(o => o.accountId === user._id);
        return {
          ...user,
          status: activeUser ? true : false,
          addressMac: activeUser ? activeUser.addressMac : '',
          roomName: activeUser ? activeUser.roomName : '',
          workstationName: activeUser ? activeUser.workstationName : ''
        }
      })
    })
  },

  async destroyed() {
    await this.sockets.unsubscribe('USERS')
  },

  computed: {
    accessUsersManagement() { return this.$store.state.payload.role === 'admin' ? false : !this.$store.state.payload.accessUsersManagement }
  },

  methods: {
    async getUsersAccounts() {
      try {
        this.pending = true
        const result = await this.$axios.get(process.env.VUE_APP_API_URL + '/accounts/users')
        this.users = result.data
        await this.$socket.emit('USERS')
        this.pending = false
        //console.log(this.users)
      } catch (error) {
        this.pending = false
        console.log({ error })
      }
    },

    async removeUserAccount(id) {
      try {
        this.pending = true
        await this.$axios.delete(process.env.VUE_APP_API_URL + `/accounts/user/${id}`)
        this.pending = false
        this.modalWindow = false
        await this.getUsersAccounts()
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
    },

    userStatusDetails(roomName, workstationName) {
      return  '<div class="flex flex-col">' +
                '<div class="inline-flex">POMIESZCZENIE:<span class="ml-1">' + roomName + '</span></div>' +
                '<div class="inline-flex">KOMPUTER:<span class="ml-1">' + workstationName + '</span></div>' +
              '</div>'
    }
  }
}
</script>