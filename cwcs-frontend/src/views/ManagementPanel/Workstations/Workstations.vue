<template>
  <div>
    <div class="flex items-center justify-between px-5 text-lg border-b border-gray-400">
    <div class="flex items-center rounded-lg py-1">
      <svg class="w-10 h-10 mr-1 text-gray-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>
      <h1 class="text-lg text-gray-500 font-semibold uppercase">Stanowiska komputerowe - {{ this.roomName }}</h1>
    </div>
    <button @click="showAddWorkstationFrom()" title="Dodaj stanowisko komputerowe" class="flex items-center justify-center bg-green-600 hover:bg-green-500 cursor-pointer text-sm text-white tracking-wide py-2 px-2 rounded focus:outline-none">
      <svg class="w-5 h-5 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
    </button>
    </div>
    <div v-if="workstationForm" class="flex w-full px-5 pt-5">
      <input v-model.trim="workstationName" maxlength="20" class="mr-2 appearance-none rounded border border-gray-400 text-sm w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="workstationName" type="text" placeholder="Podaj nazwę stanowiska komputerowego" :class="{ 'opacity-50 cursor-not-allowed': adding }" :disabled="adding" />
      <input v-model.trim="addressMac" maxlength="17" class="mr-2 appearance-none rounded border border-gray-400 text-sm w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="addressMac" type="text" placeholder="Podaj adres mac komputera" :class="{ 'opacity-50 cursor-not-allowed': adding }" :disabled="adding" />
      <button @click="addWorkstation()" class="flex items-center justify-center bg-gray-800 cursor-pointer text-sm text-white tracking-wide py-2 px-2 rounded focus:outline-none" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-800': adding || workstationName.length === 0 || addressMac.length !== 17 || !isCorrectAddressMac, 'hover:bg-gray-700': !adding || workstationName.length !== 0 && addressMac.length === 17 && isCorrectAddressMac }" :disabled="adding || workstationName.length === 0 || addressMac.length !== 17 || !isCorrectAddressMac" type="button">
        <div v-if="!adding" class="flex items-center">
          <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
        </div>
        <svg v-if="adding" class="w-5 h-5" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
      </button>
    </div>
    <div v-if="!pending" class="w-full px-5 py-5">
      <div v-if="error" class="flex bg-red-500 text-white px-3 py-2 rounded relative mb-4" role="alert">
        <strong class="font-bold mr-1">Błąd!</strong>
        <span class="block">{{ errorMessage ? errorMessage: 'Stanowisko komputerowe nie zostało dodane.' }}</span>
        <span @click="error = false" class="absolute top-0 bottom-0 right-0 px-3 py-2">
          <svg class="fill-current h-6 w-6 text-white" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Zamknij</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
        </span>
      </div>
      <table class="text-left w-full border-collapse">
        <thead>
          <tr>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">Nazwa stanowiska</th>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">Adres Mac</th>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">Status</th>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-b border-gray-700">Zarządzanie</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(workstation, index) in workstations" :key="index" class="hover:bg-gray-400">
            <td :id="'workstationNameColumn_' + index" class="py-2 px-2 border-b border-gray-500">{{ workstation.workstationName }}</td>
            <td :id="'addressMacColumn_' + index" class="py-2 px-2 border-b border-gray-500">{{ workstation.addressMac }}</td>
            <!-- EDIT WORKSTATION FORM -->
            <td :id="'editWorkstationNameColumn_' + index" class="hidden py-2 px-2 border-b border-gray-500">
              <input :id="'workstationNameInputText_' + index" :value="workstation.workstationName" maxlength="20" @keyup="editFormValidate(index)" class="appearance-none rounded border border-gray-500 text-sm w-full py-1 px-2 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300"  type="text" placeholder="Podaj nazwę stanowiska komputerowego" :class="{ 'opacity-50 cursor-not-allowed': editing }" :disabled="editing" />
            </td>
            <td :id="'editAddressMacColumn_' + index" class="hidden py-2 px-2 border-b border-gray-500">
              <div class="flex">
                <input :id="'addressMacInputText_' + index" :value="workstation.addressMac" maxlength="17" @keyup="editFormValidate(index)" class="appearance-none rounded border border-gray-500 text-sm w-full py-1 px-2 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300"  type="text" placeholder="Podaj adres mac komputera" :class="{ 'opacity-50 cursor-not-allowed': editing }" :disabled="editing" />
                <button :id="'cancelEditWorkstationButton_' + index" @click="showEditWorkstationForm(index)" class="flex items-center justify-center text-white mx-1 p-1 rounded-lg bg-red-600 hover:bg-red-500" :class="{ 'opacity-50 cursor-not-allowed': editing }" :disabled="editing">
                    <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                </button>
                <button :id="'editWorkstationButton_' + index" @click="editWorkstation(index, workstation._id)" class="flex items-center justify-center text-white p-1 rounded-lg bg-green-600 hover:bg-green-500" :class="{ 'opacity-50 cursor-not-allowed': editing }" :disabled="editing">
                  <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
                </button>
              </div>
            </td>
            <!-- END OF EDIT WORKSTATION FORM -->
            <td class="py-2 px-2 border-b border-gray-500">
              <div v-if="workstation.activeAddressMac === workstation.addressMac" class="flex items-center justify-center cursor-pointer py-2 px-2" v-tooltip.bottom="{ content: workstationStatusDetails(workstation.firstName, workstation.lastName), classes: 'max-w-sm text-white text-sm bg-gray-600 border-2 border-gray-700 rounded-lg shadow-2xl py-1 px-1 my-3' }">
                <svg class="fill-current text-green-600 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
              </div>
              <div v-if="workstation.activeAddressMac !== workstation.addressMac" title="OFFLINE" class="flex items-center justify-center cursor-pointer py-2 px-2">
                <svg class="fill-current text-red-600 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
              </div>
            </td>
            <td class="py-2 px-2 border-b border-gray-500">
              <div class="flex items-center justify-center">
                <button @click="showEditWorkstationForm(index)" title="Edytuj" class="flex items-center justify-center text-white font-bold mr-1 py-1 px-2 rounded bg-gray-600 hover:bg-gray-500" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-600': accessWorkstationsManagement }" :disabled="accessWorkstationsManagement">
                  <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                </button>
                <button @click="showModalWindow(index)" title="Usuń" class="flex items-center justify-center text-white font-bold py-1 px-2 rounded bg-red-600 hover:bg-red-500" :class="{ 'opacity-50 cursor-not-allowed hover:bg-red-600': accessWorkstationsManagement }" :disabled="accessWorkstationsManagement">
                  <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                </button>
                <!-- MODAL WINDOW TO CONFIRM REMOVING WORKSTATION -->
                <div class="hidden fixed w-full h-full top-0 left-0 flex items-center justify-center" :id="index">
                  <div @click.prevent="showModalWindow(index)" class="absolute w-full h-full bg-gray-900 opacity-50"></div>
                  <div class="bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                    <div class="modal-content py-4 text-left px-6" id="modal">
                      <div class="flex justify-between mb-5">
                        <p class="text-base font-bold">Czy napewno chcesz usunąć wybrane stanowisko komputerowe z tego pomieszczenia a w konsekwencji zgłoszenia do niego dodane?</p>
                        <div @click="showModalWindow(index)" class="cursor-pointer z-50" :class="{ 'opacity-50 cursor-not-allowed': pending }">
                          <svg class="fill-current text-black w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path></svg>
                        </div>
                      </div>
                      <p>Nazwa pomieszczenia: <b>{{ roomName }}</b></p>
                      <p>Nazwa stanowiska komputerowego: <b>{{ workstation.workstationName }}</b></p>
                      <div class="flex justify-end mt-5">
                        <button @dblclick="removeWorkstation(workstation._id)" class="px-4 py-2 bg-red-600 rounded hover:bg-red-500 text-white mr-2" :class="{ 'opacity-50 cursor-not-allowed hover:bg-red-600': pending }" :disabled="pending" type="button">
                          <div v-if="!pending">Tak</div>
                          <svg v-if="pending" class="w-6 h-6" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
                        </button>
                        <button @click="showModalWindow(index)" class="px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-500" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-600': pending }" :disabled="pending" type="button">Nie</button>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- END OF MODAL WINDOW TO CONFIRM REMOVING WORKSTATION -->
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!workstations.length && !pending" class="flex flex-col w-full items-center justify-center my-2">
        <svg class="w-16 h-16 text-gray-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
        <div class="uppercase font-semibold text-gray-400">Brak stanowisk komputerowych</div>
      </div>
    </div>
    <div v-if="pending" class="flex w-full items-center justify-center my-2">
      <svg class="w-10 h-10" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#4A5568"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Workstations',

  data() {
    return {
      roomId: this.$route.params.roomId,
      roomName: this.$route.params.roomName,
      workstations: [],
      workstationName: '',
      addressMac: '',
      workstationForm: false,
      errorMessage: '',
      error: false,
      pending: false,
      adding: false,
      editing: false
    }
  },

  async mounted() {
    await this.getWorkstations()

    await this.sockets.subscribe('WORKSTATIONS', (activeWorkstations) => {      
      this.workstations = this.workstations.map(workstation => { 
        const activeWorkstation = activeWorkstations.find(o => o.addressMac === workstation.addressMac);
        return {
          ...workstation,
          firstName: activeWorkstation ? activeWorkstation.firstName: '',
          lastName: activeWorkstation ? activeWorkstation.lastName: '',
          activeAddressMac: activeWorkstation ? activeWorkstation.addressMac : '',
        }
      })
    })
  },

  async destroyed() {
    await this.sockets.unsubscribe('WORKSTATIONS')
  },

  watch: {
    workstationName() { this.workstationName = this.workstationName.replace(/\s+/g,"") },
    addressMac() { this.addressMac = this.addressMac.replace('-',':').toUpperCase() }
  },
  
  computed: {
    accessWorkstationsManagement() { return this.$store.state.payload.role === 'admin' ? false : !this.$store.state.payload.accessWorkstationsManagement },
    isCorrectAddressMac() { 
     return this.validateAddressMac(this.addressMac)
    }
  },

  methods: {
    async getWorkstations() {
      try {
        this.pending = true
        const result = await this.$axios.get(process.env.VUE_APP_API_URL + `/workstations/${this.$route.params.roomId}`)
        this.workstations = result.data
        await this.$socket.emit('WORKSTATIONS', { roomName: this.roomName })
        this.pending = false
        //console.log(this.workstations)
      } catch (error) {
        this.pending = false
        console.log({ error })
      }
    },

    async addWorkstation() {
      try {
        this.adding = true
        await this.$axios.post(process.env.VUE_APP_API_URL + '/workstations', { roomId: this.roomId, workstationName: this.workstationName, addressMac: this.addressMac })
        this.showAddWorkstationFrom()
        this.error = false
        this.errorMessage = ''
        this.adding = false
        await this.getWorkstations()
      } catch(error) {
        this.error = true
        this.adding = false
        if(error.response.data.message == 'This workstation name is already in use!') { this.errorMessage = 'Podana nazwa stanowiska komputerowego jest zajęta.' }
        if(error.response.data.message == 'This mac address is already in use!') { this.errorMessage = 'Podany adres MAC komputera jest zajęty.' }
        if(error.response.data.message == 'This mac address is invalid!') { this.errorMessage = 'Podany adres MAC jest niepoprawny.' }
        console.log({ error })
      }
    },

    showAddWorkstationFrom() {
      this.workstationName = ''
      this.addressMac = ''
      this.workstationForm =! this.workstationForm
    },

    async editWorkstation(index, id) {
      try {
        this.editing = true
        const NewWorkstationNameValue = document.getElementById('workstationNameInputText_' + index).value
        const NewAddressMacValue = document.getElementById('addressMacInputText_' + index).value
        await this.$axios.put(process.env.VUE_APP_API_URL + '/workstations', { id: id, roomId: this.roomId, workstationName: NewWorkstationNameValue, addressMac: NewAddressMacValue })
        this.editing = false
        this.error = false
        this.errorMessage = ''
        await this.workstations.filter(key => { if(key._id == id) { key.workstationName = NewWorkstationNameValue; key.addressMac = NewAddressMacValue } })
        await this.showEditWorkstationForm(index)
      } catch(error) {
        this.error = true
        this.editing = false
        if(error.response.data.message == 'This workstation name is already in use!') { this.errorMessage = 'Podana nazwa stanowiska komputerowego jest zajęta.' }
        if(error.response.data.message == 'This mac address is already in use!') { this.errorMessage = 'Podany adres MAC komputera jest zajęty.' }
        if(error.response.data.message == 'This mac address is invalid!') { this.errorMessage = 'Podany adres MAC jest niepoprawny.' }
        console.log({ error })
      }
    },

    validateAddressMac(addressMac) {
      let regex = /^([0-9A-F]{2}[:]){5}([0-9A-F]{2})$/
      if(regex.test(addressMac)) return true
      return false
    },

    async showEditWorkstationForm(index) {
      if(!document.getElementById('workstationNameColumn_' + index).className.includes('hidden')) {
        document.getElementById('workstationNameColumn_' + index).classList.add('hidden')
        document.getElementById('addressMacColumn_' + index).classList.add('hidden')
        document.getElementById('editWorkstationNameColumn_' + index).classList.remove('hidden')
        document.getElementById('editAddressMacColumn_' + index).classList.remove('hidden')
      } else if(document.getElementById('workstationNameColumn_' + index).className.includes('hidden')) {
        document.getElementById('workstationNameColumn_' + index).classList.remove('hidden')
        document.getElementById('addressMacColumn_' + index).classList.remove('hidden')
        document.getElementById('editWorkstationNameColumn_' + index).classList.add('hidden')
        document.getElementById('editAddressMacColumn_' + index).classList.add('hidden')
      }
    },

    editFormValidate(index) {
      document.getElementById('workstationNameInputText_' + index).value = document.getElementById('workstationNameInputText_' + index).value.replace(/\s+/g,'')
      document.getElementById('addressMacInputText_' + index).value = document.getElementById('addressMacInputText_' + index).value.replace(/\s+/g,'').replace('-', ':').toUpperCase()

      document.getElementById('editWorkstationButton_' + index).disabled = false
      document.getElementById('editWorkstationButton_' + index).className = document.getElementById('editWorkstationButton_' + index).className.replace('opacity-50 cursor-not-allowed', '')

      const workstationNameValue = document.getElementById('workstationNameInputText_' + index).value
      const addressMacValue = document.getElementById('addressMacInputText_' + index).value
 
      if(workstationNameValue.length > 0 && workstationNameValue.length <= 20 && addressMacValue.length == 17 && this.validateAddressMac(addressMacValue)) {
        document.getElementById('editWorkstationButton_' + index).disabled = false
        document.getElementById('editWorkstationButton_' + index).className = document.getElementById('editWorkstationButton_' + index).className.replace('opacity-50 cursor-not-allowed', '')
      } else {
        document.getElementById('editWorkstationButton_' + index).disabled = true
        document.getElementById('editWorkstationButton_' + index).className += ' opacity-50 cursor-not-allowed' 
      }
    },

    async removeWorkstation(id) {
      try {
        this.pending = true
        await this.$axios.delete(process.env.VUE_APP_API_URL + `/workstations/${id}`)
        this.pending = false
        this.modalWindow = false
        await this.getWorkstations()
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

    workstationStatusDetails(firstName, lastName) {
      return  '<div class="flex flex-col">' +
                '<div class="inline-flex">IMIĘ:<span class="ml-1">' + firstName + '</span></div>' +
                '<div class="inline-flex">NAZWISKO:<span class="ml-1">' + lastName + '</span></div>' +
              '</div>'
    }
  }
}
</script>