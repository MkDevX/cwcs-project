<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between px-5 text-lg border-b border-gray-400">
      <div class="flex items-center rounded-lg py-1">
        <svg class="w-10 h-10 text-gray-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16z"/></svg>
        <h1 class="text-lg text-gray-500 font-semibold uppercase">Dodaj zgłoszenie</h1>
      </div>
    </div>
    <div class="py-2 px-10 flex-grow">
      <div class="mt-4 w-full">
        <form>
          <div v-if="error" class="flex bg-red-500 text-white px-3 py-2 rounded relative mb-4" role="alert">
            <strong class="font-bold mr-1">Błąd!</strong>
            <span class="block">{{ errorMessage ? errorMessage: 'Zgłoszenie nie zostało dodane.' }}</span>
            <span @click="error = false" class="absolute top-0 bottom-0 right-0 px-3 py-2">
              <svg class="fill-current h-6 w-6 text-white" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Zamknij</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
          <div class="mb-4">
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="dateFaultNotice">
              <span>Data zauważenia usterki</span>
              <p v-if="emptyDateFaultNotice" class="text-red-500 text-xs italic">To pole musi być wypełnione!</p>
            </label>
            <date-picker v-model="dateFaultNotice" :masks="{ input: ['YYYY-MM-DD'] }" :max-date='new Date()' id="dateFaultNotice" :input-props='{
                class: "cursor-pointer appearance-none rounded border border-gray-400 w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300",
                placeholder: "Wybierz date zauważenia usterki",
                readonly: true
              }' 
            />
          </div>
          <div class="mb-4">
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="notificationDescription">
              <span>Opis usterki</span>
              <p v-if="emptyNotificationDescription" class="text-red-500 text-xs italic">To pole musi mieć od 1 do 1000 znaków długości!</p>
            </label>
            <textarea v-model="notificationDescription" maxlength="1000" rows="5" class="appearance-none rounded border border-gray-400 w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="notificationDescription" placeholder="Podaj opis usterki" :class="{ 'opacity-50 cursor-not-allowed': pending }" :disabled="pending"></textarea>
          </div>
          <div class="mb-4">
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="categories">
              <span>Kategoria zgłoszenia</span>
            </label>
            <div class="inline-block relative w-full">
              <select v-model="categoryId" class="appearance-none rounded-l border border-gray-400 w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="categories" :class="{ 'opacity-50 cursor-not-allowed': pending || categories.length <= 0 }" :disabled="pending || categories.length <= 0">
                <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.categoryName }}</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="p-2 bg-gray-400 flex items-center justify-end">
      <router-link to="/user-panel/user-notifications" title="Anuluj" class="flex items-center justify-center bg-gray-600 hover:bg-gray-500 cursor-pointer text-white tracking-wide w-32 py-2 px-4 mr-2 rounded focus:outline-none" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-600': pending }" :disabled="pending">
        Anuluj
        <svg class="w-5 h-5 fill-current ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
      </router-link>
      <button @click="addNotification()" class="flex items-center justify-center bg-gray-800 cursor-pointer text-white tracking-wide py-2 px-4 w-32 rounded focus:outline-none" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-800': !canSubmit || pending, 'hover:bg-gray-700': canSubmit && !pending }" :disabled="!canSubmit || pending" type="button">
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
import DatePicker from 'v-calendar/lib/components/date-picker.umd'

export default {
  name: 'AddUserNotification',

  components: {
    DatePicker
  },

  data() {
    return {
      dateFaultNotice: new Date(),
      notificationDescription: '',
      categories: [],
      categoryId: '',
      error: false,
      errorMessage: '',
      pending: false
    }
  },

  async mounted() {
    await this.getCategories()
  },

  computed: {
    emptyDateFaultNotice() { return !this.dateFaultNotice },
    emptyNotificationDescription() { return this.notificationDescription.length < 1 || this.notificationDescription.length > 1000 },
    emptyCategory() { return this.categoryId.length < 1 },
    canSubmit() { return !this.emptyDateFaultNotice && !this.emptyNotificationDescription && !this.emptyCategory }
  },

  methods: {
    async addNotification() {
      try {
        this.pending = true
        await this.$axios.post(process.env.VUE_APP_API_URL + '/notifications', { userId: this.$store.state.payload.id, roomId: this.$store.state.payload.roomId, workstationId: this.$store.state.payload.workstationId, dateNotification: new Date(), dateFaultNotice: this.dateFaultNotice, notificationDescription: this.notificationDescription, categoryId: this.categoryId })
        await this.$socket.emit('NOTIFICATIONS')
        this.$router.push('/user-panel/user-notifications')
      } catch(error) {
        this.error = true
        this.pending = false
        console.log({ error })
      }
    },

    async getCategories() {
        try {
        this.pending = true

        const result = await this.$axios.get(process.env.VUE_APP_API_URL + `/categories`)   
        this.categories = result.data  
  
        this.pending = false
      } catch(error) {
        this.error = true
        this.pending = false
        console.log({ error })
      }
    }

  }
}
</script>