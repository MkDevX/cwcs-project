<template>
  <div class="w-full max-w-md container mx-auto mt-24">
    <h1 class="text-center text-4xl text-gray-400 font-bold">LOGOWANIE</h1>
    <form class="mt-4 bg-gray-700 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
      <div v-if="error" class="flex bg-red-500 text-white px-3 py-2 rounded relative mb-4" role="alert">
        <strong class="font-bold mr-1">Błąd!</strong>
        <span class="block">{{ errorMessage ? errorMessage: 'Podano niepoprawne dane.' }}</span>
        <span @click="error = false" class="absolute top-0 bottom-0 right-0 px-3 py-2">
          <svg class="fill-current h-6 w-6 text-white" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Zamknij</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
        </span>
      </div>
      <div class="mb-4">
        <label class="block text-white tracking-wide text-sm mb-2" for="username">Użytkownik:</label>
        <input v-model.trim="username" class="shadow appearance-none rounded w-full py-2 px-3 text-white placeholder-gray-700 bg-gray-600 leading-tight focus:outline-none focus:bg-gray-500" id="username" type="text" placeholder="Podaj nazwę użytkownika" :class="{ 'opacity-50 cursor-not-allowed': pending }" :disabled="pending" />
      </div>
      <div class="mb-6">
        <label class="block text-white tracking-wide text-sm mb-2" for="password">Hasło:</label>
        <input v-model.trim="password" class="shadow appearance-none rounded w-full py-2 px-3 text-white placeholder-gray-700 bg-gray-600 leading-tight focus:outline-none focus:bg-gray-500" id="password" type="password" placeholder="Podaj hasło" :class="{ 'opacity-50 cursor-not-allowed': pending }" :disabled="pending" />
      </div>
      <div class="flex items-center justify-center">
        <button @click="login()" class="flex items-center justify-center bg-gray-600 cursor-pointer text-white tracking-wide py-2 px-4 w-32 rounded focus:outline-none" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-600': pending, 'hover:bg-gray-500': !pending }" :disabled="pending" type="button">
          <div v-if="!pending">Zaloguj się</div>
          <svg v-if="pending" class="w-6 h-6" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
        </button>
      </div>
    </form>
    <p class="text-center text-gray-500 text-xs">&copy;{{ new Date().getFullYear() }} Michał Kaczmarek. All rights reserved.</p>
  </div>
</template>

<script>

export default {
  name: 'Login',

  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      error: false,
      pending: false
    }
  },

  async mounted() {
    await this.isAdminAccountExist()
    this.onEnterKeyEvent()
    this.$cookies.remove('accessToken')
    this.$cookies.remove('io')
  },

  methods: {
    async login() {
      try {
        this.error = false
        this.pending = true

        const addressMac = await this.$macaddress.one(function (err, mac) { return mac })

        const result = await this.$axios.post(process.env.VUE_APP_API_URL + '/accounts/login', { username: this.username, password: this.password, addressMac: addressMac.replace('-', ':').toUpperCase() })
        const accessToken = result.data.accessToken
        const payload = JSON.parse(await this.$store.dispatch('b64DecodeUnicode', { 'accessToken': accessToken.split('.')[1] }))

        await this.$socket.emit('LOGIN', { accountId: payload.id, role: payload.role, firstName: payload.firstName, lastName: payload.lastName, roomName: payload.roomName, workstationName: payload.workstationName, addressMac: payload.addressMac })

        await this.sockets.subscribe('LOGIN', async (result) => {  
          await this.sockets.unsubscribe('LOGIN')
          if(result == 'ERROR') {
            this.error = true
            this.errorMessage = 'Ten komputer lub konto jest obecnie używane!'
            this.pending = false
            this.$store.dispatch('logout')
          } else if(result == 'SUCCESS') {
            await this.$cookies.set('accessToken', accessToken, payload.exp)

            await this.$store.commit('setAccessToken', accessToken)
            await this.$store.commit('setPayload', payload)
            this.$axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
            
            switch(payload.role) {
              case 'admin':
                this.$router.push('/management-panel/notifications')
                break
              case 'employee':
                this.$router.push('/management-panel/notifications')
                break
              case 'user':
                this.$router.push('/user-panel/user-notifications')
                break
            }
          }
        })
      } catch(error) {
        console.log({ error })
        if(error.response.data.message == 'There is no such computer with this MAC address!') { this.errorMessage = 'Nie ma takiego komputera o tym adresie MAC.' }
        if(error.response.data.message == 'The MAC address of this computer is invalid!') { this.errorMessage = 'Adres MAC tego komputera jest niepoprawny.' }
        this.error = true
        this.pending = false
        this.$store.dispatch('logout')
      }
    },

    async isAdminAccountExist() {
      try {
        const isAdminAccountExist = await this.$axios.get(process.env.VUE_APP_API_URL + '/accounts/is-admin-account-exist')
        if(!isAdminAccountExist.data) this.$router.push('/management-panel/administrator/registration')
      } catch(error) {
        console.log({ error })
      }
    },

    onEnterKeyEvent() {
      const onEnterKey = async e => {
        if(e.keyCode === 13) {
          await this.login()
        }
      }

      document.addEventListener('keydown', onEnterKey)

      this.$on('hook:destroyed', () => {
        document.removeEventListener('keydown', onEnterKey)
      })
    }
  }
}
</script>
