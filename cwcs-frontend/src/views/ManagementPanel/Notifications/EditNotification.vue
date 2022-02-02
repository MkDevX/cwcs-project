<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between px-5 text-lg border-b border-gray-400">
      <div class="flex items-center rounded-lg py-1">
        <svg class="w-10 h-10 text-gray-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16z"/></svg>
        <h1 class="text-lg text-gray-500 font-semibold uppercase">Edytuj zgłoszenie</h1>
      </div>
    </div>
    <div class="py-2 px-10 flex-grow">
      <div class="mt-4 w-full">
        <form>
          <div v-if="error" class="flex bg-red-500 text-white px-3 py-2 rounded relative mb-4" role="alert">
            <strong class="font-bold mr-1">Błąd!</strong>
            <span class="block">{{ errorMessage ? errorMessage: 'Zgłoszenie nie zostało edytowane.' }}</span>
            <span @click="error = false" class="absolute top-0 bottom-0 right-0 px-3 py-2">
              <svg class="fill-current h-6 w-6 text-white" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Zamknij</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
          <div class="flex flex-row">
            <div class="w-1/2 text-gray-600">
              <div class="uppercase font-bold text-base mb-1">Szczegóły</div>
              <div>Imię: <span class="font-bold">{{ firstName }}</span></div>
              <div>Nazwisko: <span class="font-bold">{{ lastName }}</span></div>
              <div>Pomieszczenie: <span class="font-bold">{{ roomName }}</span></div>
              <div>Stanowisko: <span class="font-bold">{{ workstationName }}</span></div>
            </div>
            <div class="w-1/2">
              <div class="mb-4">
                <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="dateNotification">
                  <span>Data dodania zgłoszenia</span>
                </label>
                <input v-model.trim="dateNotification" class="appearance-none rounded border border-gray-400 w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300 opacity-50 cursor-not-allowed" id="dateNotification" type="text" :disabled="true" />
              </div>
              <div class="mb-4">
                <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="dateFaultNotice">
                  <span>Data zauważenia usterki</span>
                </label>
                <input v-model.trim="dateFaultNotice" class="appearance-none rounded border border-gray-400 w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300 opacity-50 cursor-not-allowed" id="dateFaultNotice" type="text" :disabled="true" />
              </div>
            </div>
          </div>
          <div class="mb-4">
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="notificationDescription">
              <span>Opis usterki</span>
              <p v-if="emptyNotificationDescription" class="text-red-500 text-xs italic">To pole musi mieć od 1 do 1000 znaków długości!</p>
            </label>
            <textarea v-model="notificationDescription" maxlength="1000" rows="5" class="appearance-none rounded border border-gray-400 w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="notificationDescription" placeholder="Podaj opis usterki" :class="{ 'opacity-50 cursor-not-allowed': pending }" :disabled="pending"></textarea>
          </div>
          <div class="mb-4 flex flex-row">
            <div class="w-1/2 mr-4">
              <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="accessNotifications">
                <span>Priorytet zgłoszenia</span>
              </label>
              <div class="inline-block relative w-full">
                <select v-model="notificationPriority" class="appearance-none rounded border border-gray-400 w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="notificationPriority" :class="{ 'opacity-50 cursor-not-allowed': pending }" :disabled="pending">
                  <option>NISKI</option>
                  <option>ŚREDNI</option>
                  <option>WYSOKI</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            <div class="w-1/2">
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
          </div>
          <div class="mb-4">
            <label class="block flex justify-between text-gray-600 tracking-wide text-sm mb-2" for="accessNotifications">
              <span>Status zgłoszenia</span>
            </label>
            <button @click="notificationStatus = true" class="bg-gray-400 text-white py-2 px-4 cursor-pointer focus:outline-none rounded-l-lg" :class="{ 'bg-red-700' : notificationStatus }" type="button">
              OTWARTE
            </button>
            <button @click="notificationStatus = false" class="bg-gray-400 text-white py-2 px-4 cursor-pointer focus:outline-none rounded-r-lg" :class="{ 'bg-green-700' : !notificationStatus }" type="button">
              ZAMKNIĘTE
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="p-2 bg-gray-400 flex items-center justify-end">
      <router-link to="/management-panel/notifications" title="Anuluj" class="flex items-center justify-center bg-gray-600 hover:bg-gray-500 cursor-pointer text-white tracking-wide w-32 py-2 px-4 mr-2 rounded focus:outline-none" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-600': pending }" :disabled="pending">
        Anuluj
        <svg class="w-5 h-5 fill-current ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
      </router-link>
      <button @click="editNotification()" class="flex items-center justify-center bg-gray-800 cursor-pointer text-white tracking-wide py-2 px-4 w-32 rounded focus:outline-none" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-800': !canSubmit || pending, 'hover:bg-gray-700': canSubmit && !pending }" :disabled="!canSubmit || pending" type="button">
        <div v-if="!pending" class="flex items-center">
          Edytuj
          <svg class="w-5 h-5 fill-current ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
        </div>
        <svg v-if="pending" class="w-6 h-6" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
      </button>
    </div>
    <!-- MODAL WINDOW TO CONFIRM REMOVING CATEGORY -->
    <div v-if="showModal" class="fixed w-full h-full top-0 left-0 flex items-center justify-center">
      <div @click.prevent="showModal = false" class="absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div class="bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div class="modal-content py-4 text-left px-6" id="modal">
          <div class="flex justify-between mb-5">
            <p class="text-base font-bold">Czy napewno chcesz usunąć tą kategorię?</p>
            <div @click="showModal = false" class="cursor-pointer z-50" :class="{ 'opacity-50 cursor-not-allowed': pending }">
              <svg class="fill-current text-black w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path></svg>
            </div>
          </div>
          <p>Nazwa kategorii: {{ categoryName }}</p>
          <div class="flex justify-end mt-5">
            <button @dblclick="deleteCategory()" class="px-4 py-2 bg-red-600 rounded hover:bg-red-500 text-white mr-2" :class="{ 'opacity-50 cursor-not-allowed hover:bg-red-600': pending }" :disabled="pending" type="button">
              <div v-if="!pending">Tak</div>
              <svg v-if="pending" class="w-6 h-6" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
            </button>
            <button @click="showModal = false" class="px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-500" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-600': pending }" :disabled="pending" type="button">Nie</button>
          </div>
        </div>
      </div>
    </div>
    <!-- END OF MODAL WINDOW TO CONFIRM REMOVING CATEGORY -->
  </div>
</template>

<script>
export default {
  name: 'EditNotification',

  data() {
    return {
      id: '',
      dateNotification: null,
      dateFaultNotice: null,
      notificationDescription: '',
      notificationStatus: false,
      notificationPriority: '',
      categories: [],
      categoryId: '',
      openAddCategoryForm: false,
      openEditCategoryForm: false,
      categoryName: '',
      firstName: '',
      lastName: '',
      roomName: '',
      workstationName: '',
      showModal: false,
      errorMessage: '',
      error: false,
      pending: false
    }
  },

  async mounted() {
    await this.getCategories()
    await this.getNotification()
  },

  computed: {
    emptyNotificationDescription() { return this.notificationDescription.length < 1 || this.notificationDescription.length > 1000 },
    canSubmit() { return !this.emptyNotificationDescription }
  },

  methods: {
    async getNotification() {
      try {
        this.id = this.$route.params.id
        const notification = await this.$axios.get(process.env.VUE_APP_API_URL + `/notifications/${this.id}`)

        //console.log(notification.data)

        let { dateNotification, dateFaultNotice, notificationDescription, notificationStatus, notificationPriority, categoryId, firstName, lastName, roomName, workstationName } = notification.data

        this.dateNotification = dateNotification
        this.dateFaultNotice = dateFaultNotice
        this.notificationDescription = notificationDescription
        this.notificationStatus = notificationStatus
        if(notificationPriority == 'low') {
          this.notificationPriority = 'NISKI'
        } else if(notificationPriority == 'medium') {
          this.notificationPriority = 'ŚREDNI'
        } else if(notificationPriority == 'high') {
          this.notificationPriority = 'WYSOKI'
        }
        this.categoryId = categoryId
        this.firstName = firstName
        this.lastName = lastName
        this.roomName = roomName
        this.workstationName = workstationName
      } catch (error) {
        console.log({ error })
      }
    },

    async editNotification() {
      try {
        this.pending = true

        let notificationPriority = ''
        if(this.notificationPriority == 'NISKI') {
          notificationPriority = 'low'
        } else if(this.notificationPriority == 'ŚREDNI') {
          notificationPriority = 'medium'
        } else if(this.notificationPriority == 'WYSOKI') {
          notificationPriority = 'high'
        }

        await this.$axios.put(process.env.VUE_APP_API_URL + `/notifications/${this.id}`, { notificationDescription: this.notificationDescription, notificationStatus: this.notificationStatus, notificationPriority: notificationPriority, categoryId: this.categoryId })
        this.$router.push('/management-panel/notifications')
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