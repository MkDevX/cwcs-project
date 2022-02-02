<template>
  <div class="flex flex-col h-full">
      <h1 class="px-5 py-2 text-lg text-gray-500 font-semibold uppercase border-b border-gray-400">Ustawienia konta</h1>
    <div class="py-2 px-10 flex-grow">
      <div class="mt-4 w-full">
        <form>
          <div v-if="success" class="flex bg-green-600 text-white px-3 py-2 rounded relative mb-4" role="alert">
            <strong class="font-bold mr-1">Sukces!</strong>
            <span class="block">Dane konta zostały zmienione poprawnie.</span>
            <span @click="success = false" class="absolute top-0 bottom-0 right-0 px-3 py-2">
              <svg class="fill-current h-6 w-6 text-white" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Zamknij</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
          <div v-if="error" class="flex bg-red-500 text-white px-3 py-2 rounded relative mb-4" role="alert">
            <strong class="font-bold mr-1">Błąd!</strong>
            <span class="block">{{ errorMessage ? errorMessage: 'Ustawienia nie zostały zapisane.' }}</span>
            <span @click="error = false" class="absolute top-0 bottom-0 right-0 px-3 py-2">
              <svg class="fill-current h-6 w-6 text-white" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Zamknij</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
          <div class="mb-4">
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="username">
              <span>Użytkownik</span>
              <p v-if="emptyUsername" class="text-red-500 text-xs italic">To pole musi mieć od 8 do 15 znaków długości!</p>
            </label>
            <input v-model.trim="username" class="appearance-none rounded border border-gray-400 w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="username" type="text" placeholder="Podaj nazwę użytkownika" :class="{ 'opacity-50 cursor-not-allowed': pending }" :disabled="pending" />
          </div>
          <div class="mb-4">
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="currentPassword">
              <span>Obecne hasło</span>
              <p v-if="emptyCurrentPassword" class="text-red-400 text-xs italic">To pole musi mieć od 8 do 15 znaków długości!</p>
            </label>
            <input v-model.trim="currentPassword" class="appearance-none rounded border border-gray-400 w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="currentPassword" type="password" placeholder="Podaj obecne hasło" :class="{ 'opacity-50 cursor-not-allowed': pending }" :disabled="pending" />           
          </div>
          <div class="mb-4">
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="password1">
              <span>Hasło</span>
              <p v-if="emptyPassword1" class="text-red-400 text-xs italic">To pole musi mieć od 8 do 15 znaków długości!</p>
            </label>
            <input v-model.trim="password1" class="appearance-none rounded border border-gray-400 w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="password1" type="password" placeholder="Podaj hasło" :class="{ 'opacity-50 cursor-not-allowed': !currentPassword.length || pending }" :disabled="!currentPassword.length || pending" />           
          </div>
          <div class="mb-4">
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="password2">
              <span>Powtórz hasło</span>
              <p v-if="emptyPassword2" class="text-red-400 text-xs italic">To pole musi mieć od 8 do 15 znaków długości!</p>
              <p v-if="passwordsComparsion" class="text-red-400 text-xs italic">Podane hasła różnią się od siebie!</p>
            </label>
            <input v-model.trim="password2" class="appearance-none rounded border border-gray-400 w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="password2" type="password" placeholder="Powtórz hasło" :class="{ 'opacity-50 cursor-not-allowed': !currentPassword.length || pending }" :disabled="!currentPassword.length || pending" />
          </div>
          <div class="mb-4">
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="firstName">
              <span>Imię</span>
              <p v-if="emptyFirstName" class="text-red-400 text-xs italic">To pole musi mieć od 1 do 20 znaków długości!</p>
            </label>
            <input v-model.trim="firstName" class="appearance-none rounded border border-gray-400 w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="firstName" type="text" placeholder="Podaj imię" :class="{ 'opacity-50 cursor-not-allowed': pending }" :disabled="pending" />
          </div>
          <div class="mb-6">
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="lastName">
              <span>Nazwisko</span>
              <p v-if="emptyLastName" class="text-red-400 text-xs italic">To pole musi mieć od 1 do 20 znaków długości!</p>
            </label>
            <input v-model.trim="lastName" class="appearance-none rounded border border-gray-400 w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="lastName" type="text" placeholder="Podaj nazwisko" :class="{ 'opacity-50 cursor-not-allowed': pending }" :disabled="pending" />
          </div>
        </form>
      </div>
    </div>
    <div class="p-2 bg-gray-400  flex items-center justify-end">
      <button @click="changeAccountSettings()" class="flex items-center justify-center bg-gray-800 cursor-pointer text-white tracking-wide py-2 px-4 w-32 rounded focus:outline-none" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-800': !canSubmit || pending, 'hover:bg-gray-700': canSubmit && !pending }" :disabled="!canSubmit || pending" type="button">
        <div v-if="!pending">Zapisz</div>
        <svg v-if="pending" class="w-6 h-6" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',

  data() {
    return {
      username: '',
      currentPassword: '',
      password1: '',
      password2: '',
      firstName: '',
      lastName: '',
      success: false,
      error: false,
      errorMessage: '',
      pending: false
    }
  },

  async mounted() {
    await this.getAccountSettings()
  },

  watch: {
  	username() { this.username = this.username.replace(/\s+/g,"") },
    currentPassword() { if(!this.currentPassword.length) { this.password1 = ''; this.password2 = '' } this.currentPassword = this.currentPassword.replace(/\s+/g,"") },
    password1() { this.password1 = this.password1.replace(/\s+/g,"") },
    password2() { this.password2 = this.password2.replace(/\s+/g,"") },
    firstName() { this.firstName = this.firstName.replace(/\s+/g,"") },
    lastName() { this.lastName = this.lastName.replace(/\s+/g,"") }
  },

  computed: {
    emptyUsername() { return this.username.length < 8 || this.username.length > 15 },
    emptyCurrentPassword() { return this.currentPassword.length > 0 && this.currentPassword.length < 8 || this.currentPassword.length > 15 },
    emptyPassword1() { return this.currentPassword.length > 0 && this.password1.length < 8 || this.password1.length > 15 },
    emptyPassword2() { return this.currentPassword.length > 0 && this.password2.length < 8 || this.password2.length > 15 },
    emptyFirstName() { return this.firstName.length < 1 || this.firstName.length > 20 },
    emptyLastName() { return this.lastName.length < 1 || this.lastName.length > 20 },
    passwordsComparsion() { return this.currentPassword.length > 0 && (this.password1.length >= 8 && this.password1.length <= 15) && (this.password2.length >= 8 && this.password2.length <= 15) && this.password1 !== this.password2 },
    canSubmit() { return !this.emptyUsername && !this.emptyPassword1 && !this.emptyPassword2 && !this.passwordsComparsion && !this.emptyFirstName && !this.emptyLastName }
  },

  methods: {
    async changeAccountSettings() {
      try {
        this.pending = true

        var accountSettings = {
          username: this.username,
          firstName: this.firstName,
          lastName: this.lastName
        }

        if(this.currentPassword.length > 0) {
          accountSettings = { currentPassword: this.currentPassword, password1: this.password1, password2: this.password2, ...accountSettings }
        }

        await this.$axios.put(process.env.VUE_APP_API_URL + `/accounts/${this.$store.state.payload.id}`, accountSettings)

        this.$store.commit('setPayloadFirstName', accountSettings.firstName)
        this.$store.commit('setPayloadLastName', accountSettings.lastName)

        this.currentPassword = ''

        this.error = false
        this.success = true
        this.pending = false
      } catch(error) {
        this.error = true
        this.success = false
        this.pending = false
        if(error.response.data.message == 'Invalid current password!') { this.errorMessage = 'Obecne hasło jest niepoprawne.' }
        if(error.response.data.message == 'This username is already in use!') { this.errorMessage = 'Podana nazwa użytkownika jest zajęta.' }
        console.log({ error })
      }
    },

    async getAccountSettings() {
      try {
        this.pending = true
        const account = await this.$axios.get(process.env.VUE_APP_API_URL + `/accounts/${this.$store.state.payload.id}`)

        let { username, firstName, lastName } = account.data

        this.username = username
        this.firstName = firstName
        this.lastName = lastName
        this.pending = false
      } catch (error) {
        this.pending = false
        console.log({ error })
      }
    }

  }
}
</script>