<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between px-5 text-lg border-b border-gray-400">
      <div class="flex items-center rounded-lg py-1">
        <svg class="w-10 h-10 text-gray-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z"/></svg>
        <h1 class="text-lg text-gray-500 font-semibold uppercase">Szczegóły użytkownika - {{ firstName }} {{ lastName }}</h1>
      </div>
    </div>
    <div v-if="!pending && details.length" class="w-full px-5 py-5">
      <table class="text-left w-full border-collapse">
        <thead>
          <tr>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">L.P</th>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">Historia logowań</th>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-b border-gray-700">Zarządzanie</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(detail, index) in details" :key="index" class="hover:bg-gray-400">
            <td class="py-2 px-2 border-b border-gray-500">{{ index + 1 }}</td>
            <td class="py-2 px-2 border-b border-gray-500">{{ detail.loginDate }}</td>
            <td class="py-2 px-2 border-b border-gray-500">
              <div class="flex items-center justify-center">
                <button @click="showModalWindow(index)" title="Procesy" class="flex items-center justify-center text-white font-bold py-1 px-2 rounded text-xs bg-green-600 hover:bg-green-500">
                  <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><path id="a" d="M0 0h24v24H0z"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><path clip-path="url(#b)" d="M3 17h18v-2H3v2zm0 3h18v-1H3v1zm0-7h18v-3H3v3zm0-9v4h18V4H3z"/></svg>
                </button>
                <!-- MODAL WINDOW TO CONFIRM REMOVING ROOM -->
                <div class="hidden fixed w-full h-full top-0 left-0 flex items-center justify-center" :id="index">
                  <div @click.prevent="showModalWindow(index)" class="absolute w-full h-full bg-gray-900 opacity-50"></div>
                  <div class="bg-white w-11/12 md:max-w-xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
                    <div class="modal-content py-4 text-left px-6" id="modal">
                      <div class="flex justify-between mb-2">
                        <div class="flex flex-col">
                          <div class="text-gray-600 text-base font-bold mb-1">Lista procesów - {{ detail.loginDate }}</div>
                          <div class="text-gray-600 text-base font-bold">Liczba procesów - {{ detail.processes.length }}</div>
                        </div>
                        <div @click="showModalWindow(index)">
                          <svg class="cursor-pointer fill-current text-black w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path></svg>
                        </div>
                      </div>
                      <div class="flex flex-col overflow-x-auto overflow-y-scroll h-56 select-text">
                        <!-- {{ detail.processes.processes }} -->
                        <div class="" v-for="(process, index) in detail.processes" :key="index">{{ process }}</div>
                      </div>
                      <div class="flex justify-end mt-5">
                        <button @click="showModalWindow(index)" class="px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-500" type="button">Zamknij</button>
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
    <div v-if="!details.length && !pending" class="flex flex-col w-full items-center justify-center my-2">
      <svg class="w-16 h-16 text-gray-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
      <div class="uppercase font-semibold text-gray-400">Brak szczegółów</div>
    </div>
    <div v-if="pending" class="flex w-full items-center justify-center my-2">
      <svg class="w-10 h-10" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#4A5568"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserDetails',

  data() {
    return {
      id: '',
      details: [],
      firstName: '',
      lastName: '',
      error: false,
      errorMessage: '',
      pending: false
    }
  },

  async mounted() {
    await this.getUserDetails()
  },

  methods: {
    async getUserDetails() {
      try {
        this.pending = true
        this.id = this.$route.params.id
        const details = await this.$axios.get(process.env.VUE_APP_API_URL + `/accounts/user-details/${this.id}`)

        this.details = details.data.details
        this.firstName = details.data.firstName
        this.lastName = details.data.lastName
        this.pending = false
      } catch (error) {
        this.pending = false
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