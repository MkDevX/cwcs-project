<template>
  <div class="bg-gray-700">
    <div class="h-full flex flex-col tracking-wider pt-4 px-2">
      <div v-if="role !== 'user'" class="h-full">
        <router-link to="/management-panel/notifications" class="no-underline flex items-center cursor-pointer text-white hover:bg-gray-600 rounded p-1 mb-2" active-class="bg-gray-800 hover:bg-gray-800">
          <svg class="w-5 h-5 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16z"/></svg>
          Zgłoszenia
        </router-link>
        <div class="text-gray-500 text-xs my-4">
          KONTA
        </div>
        <div>
          <router-link v-if="role === 'admin'" to="/management-panel/administrator/employees" class="no-underline flex items-center cursor-pointer text-white hover:bg-gray-600 rounded p-1 mb-2" active-class="bg-gray-800 hover:bg-gray-800">
            <svg class="w-5 h-5 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
            Pracownicy
          </router-link>
          <router-link to="/management-panel/users" class="no-underline flex items-center cursor-pointer text-white hover:bg-gray-600 rounded p-1 mb-2" active-class="bg-gray-800 hover:bg-gray-800">
            <svg class="w-5 h-5 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z"/></svg>
            Użytkownicy
          </router-link>
        </div>
        <div class="text-gray-500 text-xs my-4">
          ZARZĄDZANIE
        </div>
        <div class="flex-grow">
          <router-link to="/management-panel/rooms" class="no-underline flex items-center cursor-pointer text-white hover:bg-gray-600 rounded p-1 mb-2" active-class="bg-gray-800 hover:bg-gray-800">
            <svg class="w-5 h-5 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z" /></svg>
            Pomieszczenia
          </router-link>
        </div>
      </div>
      <div v-if="role === 'user'" class="flex-grow">
        <router-link to="/user-panel/user-notifications" class="no-underline flex items-center cursor-pointer text-white hover:bg-gray-600 rounded p-1 mb-2" active-class="bg-gray-800 hover:bg-gray-800">
          <svg class="w-5 h-5 fill-current mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16z"/></svg>
          Zgłoszenia
        </router-link>
      </div>
      <router-link to="/settings" class="flex items-center bg-gray-600 hover:bg-gray-500 rounded p-1 mb-2 cursor-pointer" active-class="bg-gray-800 hover:bg-gray-800">
        <svg class="w-8 h-8 text-white fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2a7.2 7.2 0 0 1-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 0 1-6 3.22z"/></svg>
        <div class="text-white text-sm ml-2">
          <div>
            {{ firstName }}
          </div>
          <div>
            {{ lastName }}
          </div>
        </div>
      </router-link>
      <p class="my-2 text-center text-gray-500 text-xs">&copy;{{ new Date().getFullYear() }} Michał Kaczmarek. All rights reserved.</p>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
import psList from 'ps-list'

export default {
  name: 'SideBar',

  data() {
    return {
      processes: [],
      interval: null,
    }
  },

  async mounted() {
    const windowSize = remote.getCurrentWindow().getSize()
    if(windowSize[0] !== 853 || windowSize[1] !== 643) {
      this.configWindow()
    }

    if(this.role === 'user') {
      this.interval = setInterval(async () => { 
        let newProcesses = await this.getProcesses()
        this.processes = [
          ...this.processes,
          ...newProcesses
        ]
        this.processes = [...new Set(this.processes)]
        console.log('Ilość uruchomionych procesów: ' + this.processes.length)
        await this.$axios.put(process.env.VUE_APP_API_URL + `/accounts/user-processes/${this.$store.state.payload.id}`, this.processes)
      }, 5000)
    }
  },

  beforeDestroy() {
    clearInterval(this.interval)
  },

  computed: {
    role() {
      return this.$store.state.payload.role
    },
    
    firstName() {
      return this.$store.state.payload.firstName
    },
    lastName() {
      return this.$store.state.payload.lastName
    }
  },

  methods: {
     async getProcesses() {
      let newProcesses = await psList()
    
      newProcesses = newProcesses.map(process => {
        return process.name
      })

      newProcesses = [...new Set(newProcesses)]
      return newProcesses
    },

    configWindow() {
      remote.getCurrentWindow().setResizable(true)
      remote.getCurrentWindow().setFullScreen(false)
      remote.getCurrentWindow().setSize(853, 643)
      remote.getCurrentWindow().center()
      remote.getCurrentWindow().setResizable(false)
    }
  }
}
</script>