<template>
<div class="ion-page">
  <ion-content class="ion-padding">
    <div class="w-full max-w-md container mx-auto">
      <h1 class="text-center text-4xl text-gray-400 font-bold">LOGOWANIE</h1>
      <form class="my-4 p-6 bg-gray-700 shadow-md rounded-lg">
        <div v-if="error" class="flex bg-red-500 text-white px-3 py-2 rounded relative mb-4" role="alert">
          <strong class="font-bold mr-1">Błąd!</strong>
          <span class="block mr-3">{{ errorMessage ? errorMessage: 'Podano niepoprawne dane.' }}</span>
          <span @click="error = false" class="absolute top-0 bottom-0 right-0 pr-3 py-2 ">
            <svg class="fill-current h-6 w-6 text-white" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Zamknij</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </span>
        </div>
        <div class="mb-4 pr-5">
          <label class="block text-white tracking-wide text-sm mb-2" for="username">Użytkownik:</label>
          <input v-model.trim="username" class="shadow appearance-none rounded w-full py-2 px-3 text-white placeholder-gray-700 bg-gray-600 leading-tight focus:outline-none focus:bg-gray-500" id="username" type="text" placeholder="Podaj nazwę użytkownika" :class="{ 'opacity-50 cursor-not-allowed': pending }" :disabled="pending" />
        </div>
        <div class="mb-6 pr-5">
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
      <p class="text-center text-gray-500 text-xs pb-4">&copy;{{ new Date().getFullYear() }} Michał Kaczmarek. All rights reserved.</p>
    </div>
  </ion-content>
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
    await this.$plugins.PushNotificationsPlugin.stop()
  },

  methods: {
    async login() {
      try {
        this.errorMessage = ''
        this.error = false
        this.pending = true

        const result = await this.$axios.post(process.env.VUE_APP_API_URL + '/accounts/login', { username: this.username, password: this.password })
        const accessToken = result.data.accessToken
        const payload = JSON.parse(await this.$store.dispatch('b64DecodeUnicode', { 'accessToken': accessToken.split('.')[1] }))

        await this.$plugins.Storage.set({
          key: 'session',
          value: JSON.stringify({
            accessToken: accessToken
          })
        })

        this.$store.commit('setAccessToken', accessToken)
        this.$store.commit('setPayload', payload)
        this.$axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        this.$router.push('/notifications')
      } catch(error) {
        console.log({ error })
        if(error.response.data.message == 'The MAC address of this computer is invalid!') { this.errorMessage = 'Nie posiadasz uprawnień do tych zasobów.' }
        this.error = true
        this.pending = false
        await this.$store.dispatch('logout')
      }
    }

  }
}
</script>
