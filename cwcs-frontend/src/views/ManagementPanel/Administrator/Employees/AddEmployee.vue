<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between px-5 text-lg border-b border-gray-400">
      <div class="flex items-center rounded-lg py-1">
        <svg class="w-10 h-10 text-gray-500 fill-current mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
        <h1 class="text-lg text-gray-500 font-semibold uppercase">Dodaj pracownika</h1>
      </div>
    </div>
    <div class="py-2 px-10 flex-grow">
      <div class="mt-4 w-full">
        <form>
          <div v-if="error" class="flex bg-red-500 text-white px-3 py-2 rounded relative mb-4" role="alert">
            <strong class="font-bold mr-1">Błąd!</strong>
            <span class="block">{{ errorMessage ? errorMessage: 'Pracownik nie został dodany.' }}</span>
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
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="password1">
              <span>Hasło</span>
              <p v-if="emptyPassword1" class="text-red-400 text-xs italic">To pole musi mieć od 8 do 15 znaków długości!</p>
            </label>
            <input v-model.trim="password1" class="appearance-none rounded border border-gray-400 w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="password1" type="password" placeholder="Podaj hasło" :class="{ 'opacity-50 cursor-not-allowed': pending }" :disabled="pending" />           
          </div>
          <div class="mb-4">
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="password2">
              <span>Powtórz hasło</span>
              <p v-if="emptyPassword2" class="text-red-400 text-xs italic">To pole musi mieć od 8 do 15 znaków długości!</p>
              <p v-if="passwordsComparsion" class="text-red-400 text-xs italic">Podane hasła różnią się od siebie!</p>
            </label>
            <input v-model.trim="password2" class="appearance-none rounded border border-gray-400 w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="password2" type="password" placeholder="Powtórz hasło" :class="{ 'opacity-50 cursor-not-allowed': pending }" :disabled="pending" />
          </div>
          <div class="mb-4">
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="firstName">
              <span>Imię</span>
              <p v-if="emptyFirstName" class="text-red-400 text-xs italic">To pole musi mieć od 1 do 20 znaków długości!</p>
            </label>
            <input v-model.trim="firstName" class="appearance-none rounded border border-gray-400 w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="firstName" type="text" placeholder="Podaj imię" :class="{ 'opacity-50 cursor-not-allowed': pending }" :disabled="pending" />
          </div>
          <div class="mb-4">
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="lastName">
              <span>Nazwisko</span>
              <p v-if="emptyLastName" class="text-red-400 text-xs italic">To pole musi mieć od 1 do 20 znaków długości!</p>
            </label>
            <input v-model.trim="lastName" class="appearance-none rounded border border-gray-400 w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="lastName" type="text" placeholder="Podaj nazwisko" :class="{ 'opacity-50 cursor-not-allowed': pending }" :disabled="pending" />
          </div>
          <div class="mb-4">
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="accessNotifications">
              <span>Dostęp do zarządzania zgłoszeniami</span>
            </label>
            <button @click="accessNotifications = true" title="Dostęp do zarządzania zgłoszeniami(dodawanie, edycja, usuwanie)." class="bg-gray-400 text-white py-2 px-4 cursor-pointer focus:outline-none rounded-l-lg" :class="{ 'bg-green-700' : accessNotifications }" type="button">
              Tak
            </button>
            <button @click="accessNotifications = false" title="Brak dostępu do zarządzania zgłoszeniami(dodawanie, edycja, usuwanie)." class="text-white py-2 px-4 cursor-pointer focus:outline-none rounded-r-lg" :class="{ 'bg-gray-400' : accessNotifications, 'bg-red-700' : !accessNotifications }" type="button">
              Nie
            </button>
          </div>
          <div class="mb-4">
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="accessUsersManagement">
              <span>Dostęp do zarządzania użytkownikami</span>
            </label>
            <button @click="accessUsersManagement = true" title="Dostęp do zarządzania użytkownikami(dodawanie, edycja, usuwanie)." class="bg-gray-400 text-white py-2 px-4 cursor-pointer focus:outline-none rounded-l-lg" :class="{ 'bg-green-700' : accessUsersManagement }" type="button">
              Tak
            </button>
            <button @click="accessUsersManagement = false" title="Brak dostępu do zarządzania użytkownikami(dodawanie, edycja, usuwanie)." class="text-white py-2 px-4 cursor-pointer focus:outline-none rounded-r-lg" :class="{ 'bg-gray-400' : accessUsersManagement, 'bg-red-700' : !accessUsersManagement }" type="button">
              Nie
            </button>
          </div>
          <div class="mb-4">
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="accessRoomsManagement">
              <span>Dostęp do zarządzania pomieszczeniami</span>
            </label>
            <button @click="accessRoomsManagement = true" title="Dostęp do zarządzania pomieszczeniami(dodawanie, edycja, usuwanie)." class="bg-gray-400 text-white py-2 px-4 cursor-pointer focus:outline-none rounded-l-lg" :class="{ 'bg-green-700' : accessRoomsManagement }" type="button">
              Tak
            </button>
            <button @click="accessRoomsManagement = false" title="Brak dostępu do zarządzania pomieszczeniami(dodawanie, edycja, usuwanie)." class="text-white py-2 px-4 cursor-pointer focus:outline-none rounded-r-lg" :class="{ 'bg-gray-400' : accessRoomsManagement, 'bg-red-700' : !accessRoomsManagement }" type="button">
              Nie
            </button>
          </div>
          <div class="mb-6">
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="accessRoomsManagement">
              <span>Dostęp do zarządzania stanowiskami komputerowymi</span>
            </label>
            <button @click="accessWorkstationsManagement = true" title="Dostęp do zarządzania stanowiskami komputerowymi(dodawanie, edycja, usuwanie)." class="bg-gray-400 text-white py-2 px-4 cursor-pointer focus:outline-none rounded-l-lg" :class="{ 'bg-green-700' : accessWorkstationsManagement }" type="button">
              Tak
            </button>
            <button @click="accessWorkstationsManagement = false" title="Brak dostępu do zarządzania stanowiskami komputerowymi(dodawanie, edycja, usuwanie)." class="text-white py-2 px-4 cursor-pointer focus:outline-none rounded-r-lg" :class="{ 'bg-gray-400' : accessWorkstationsManagement, 'bg-red-700' : !accessWorkstationsManagement }" type="button">
              Nie
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="p-2 bg-gray-400 flex items-center justify-end">
      <router-link to="/management-panel/administrator/employees" title="Anuluj" class="flex items-center justify-center bg-gray-600 hover:bg-gray-500 cursor-pointer text-white tracking-wide w-32 py-2 px-4 mr-2 rounded focus:outline-none" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-600': pending }" :disabled="pending">
        Anuluj
        <svg class="w-5 h-5 fill-current ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
      </router-link>
      <button @click="addEmployee()" class="flex items-center justify-center bg-gray-800 cursor-pointer text-white tracking-wide py-2 px-4 w-32 rounded focus:outline-none" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-800': !canSubmit || pending, 'hover:bg-gray-700': canSubmit && !pending }" :disabled="!canSubmit || pending" type="button">
        <div v-if="!pending" class="flex items-center">
          Dodaj
          <svg class="w-5 h-5 fill-current ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
        </div>
        <svg v-if="pending" class="w-6 h-6" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddEmployee',

  data() {
    return {
      username: '',
      password1: '',
      password2: '',
      firstName: '',
      lastName: '',
      accessNotifications: false,
      accessUsersManagement: false,
      accessRoomsManagement: false,
      accessWorkstationsManagement: false,
      error: false,
      errorMessage: '',
      pending: false
    }
  },

  watch: {
  	username() { this.username = this.username.replace(/\s+/g,"") },
    password1() { this.password1 = this.password1.replace(/\s+/g,"") },
    password2() { this.password2 = this.password2.replace(/\s+/g,"") },
    firstName() { this.firstName = this.firstName.replace(/\s+/g,"") },
    lastName() { this.lastName = this.lastName.replace(/\s+/g,"") }
  },

  computed: {
    emptyUsername() { return this.username.length < 8 || this.username.length > 15 },
    emptyPassword1() { return this.password1.length < 8 || this.password1.length > 15 },
    emptyPassword2() { return this.password2.length < 8 || this.password2.length > 15 },
    emptyFirstName() { return this.firstName.length < 1 || this.firstName.length > 20 },
    emptyLastName() { return this.lastName.length < 1 || this.lastName.length > 20 },
    passwordsComparsion() { return !this.emptyPassword1 && !this.emptyPassword2 && this.password1 !== this.password2 },
    canSubmit() { return !this.emptyUsername && !this.emptyPassword1 && !this.emptyPassword2 && !this.passwordsComparsion && !this.emptyFirstName && !this.emptyLastName }
  },

  methods: {
    async addEmployee() {
      try {
        this.pending = true
        await this.$axios.post(process.env.VUE_APP_API_URL + '/accounts', { username: this.username, password1: this.password1, password2: this.password2, role: 'employee', firstName: this.firstName, lastName: this.lastName, accessNotifications: this.accessNotifications, accessUsersManagement: this.accessUsersManagement, accessRoomsManagement: this.accessRoomsManagement, accessWorkstationsManagement: this.accessWorkstationsManagement })
        this.$router.push('/management-panel/administrator/employees')
      } catch(error) {
        this.error = true
        this.pending = false
        if(error.response.data.statusCode == 409) this.errorMessage = 'Podana nazwa użytkownika jest zajęta.'
        console.log({ error })
      }
    }
  }
}
</script>