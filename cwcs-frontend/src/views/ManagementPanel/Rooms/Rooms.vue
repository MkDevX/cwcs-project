<template>
  <div>
    <div class="flex items-center justify-between px-5 text-lg border-b border-gray-400">
    <div class="flex items-center rounded-lg py-1">
      <svg class="w-10 h-10 text-gray-500 fill-current mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z" /></svg>
      <h1 class="text-lg text-gray-500 font-semibold uppercase">Pomieszczenia</h1>
    </div>
    <div class="flex w-full">
      <input v-model.trim="roomName" maxlength="20" class="ml-20 mr-2 appearance-none rounded border border-gray-400 text-sm w-full py-2 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="roomName" type="text" placeholder="Podaj nazwę pomieszczenia" :class="{ 'opacity-50 cursor-not-allowed': pending || accessRoomsManagement }" :disabled="pending || accessRoomsManagement" />
      <button @click="addRoom()" class="flex items-center justify-center bg-green-600 cursor-pointer text-sm text-white tracking-wide py-2 px-2 rounded focus:outline-none" :class="{ 'opacity-50 cursor-not-allowed hover:bg-green-600': pending || roomName.length === 0 || accessRoomsManagement, 'hover:bg-green-500': !pending || roomName.length !== 0 || accessRoomsManagement }" :disabled="pending || roomName.length === 0 || accessRoomsManagement" type="button">
        <div v-if="!pending" class="flex items-center">
          <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
        </div>
        <svg v-if="pending" class="w-5 h-5" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
      </button>
    </div>
    </div>
    <div v-if="!pending && rooms.length" class="w-full px-5 py-5">
      <div v-if="error" class="flex bg-red-500 text-white px-3 py-2 rounded relative mb-4" role="alert">
        <strong class="font-bold mr-1">Błąd!</strong>
        <span class="block">{{ errorMessage ? errorMessage: 'Nazwa pomieszczenia nie została edytowana.' }}</span>
        <span @click="error = false" class="absolute top-0 bottom-0 right-0 px-3 py-2">
          <svg class="fill-current h-6 w-6 text-white" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Zamknij</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
        </span>
      </div>
      <table class="text-left w-full border-collapse">
        <thead>
          <tr>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">Nazwa pomieszczenia</th>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">Status</th>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-b border-gray-700">Zarządzanie</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(room, index) in rooms" :key="index" class="hover:bg-gray-400">
            <td :id="'roomNameColumn_' + index" class="py-2 px-2 border-b border-gray-500">{{ room.roomName }}</td>
            <td :id="'editRoomNameColumn_' + index" class="hidden py-2 px-2 border-b border-gray-500">
              <div class="flex">
                <input :id="'roomNameInputText_' + index" :value="room.roomName" maxlength="20" @keyup="editFormValidate(index)" class="appearance-none rounded border border-gray-500 text-sm w-full py-1 px-2 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300"  type="text" placeholder="Podaj nazwę pomieszczenia" :class="{ 'opacity-50 cursor-not-allowed': editing }" :disabled="editing" />
                <button :id="'cancelEditRoomButton_' + index" @click="showEditRoomForm(index)" class="flex items-center justify-center text-white mx-1 p-1 rounded-lg bg-red-600 hover:bg-red-500" :class="{ 'opacity-50 cursor-not-allowed': editing }" :disabled="editing">
                  <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                </button>
                <button :id="'editRoomButton_' + index" @click="editRoom(index, room._id)" class="flex items-center justify-center text-white p-1 rounded-lg bg-green-600 hover:bg-green-500" :class="{ 'opacity-50 cursor-not-allowed': editing }" :disabled="editing">
                  <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
                </button>
              </div>
            </td>
            <td class="border-b border-gray-500">
              <div v-if="room.numberOfActiveWorkstationsInRoom > 0" class="flex items-center justify-center cursor-pointer py-2 px-2" v-tooltip.bottom="{ content: roomStatusDetails(room.numberOfActiveWorkstationsInRoom, room.quantityWorkstations), classes: 'max-w-sm text-white text-sm bg-gray-600 border-2 border-gray-700 rounded-lg shadow-2xl py-1 px-1 my-2' }">
                <svg class="fill-current text-green-600 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
              </div>
              <div v-if="room.numberOfActiveWorkstationsInRoom <= 0" title="OFFLINE" class="flex items-center justify-center cursor-pointer py-2 px-2">
                <svg class="fill-current text-red-600 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
              </div>
            </td>
            <td class="py-2 px-2 border-b border-gray-500">
              <div class="flex items-center justify-center">
                <router-link :to="'/management-panel/workstations/' + room._id + '/' + room.roomName" title="Stanowiska komputerowe" class="flex items-center justify-center text-white font-bold mr-1 py-1 px-2 rounded text-xs bg-gray-700 hover:bg-gray-600">
                  <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>
                </router-link>
                <button @click="showEditRoomForm(index)" title="Edytuj" class="flex items-center justify-center text-white font-bold mr-1 py-1 px-2 rounded text-xs bg-gray-600 hover:bg-gray-500" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-600': accessRoomsManagement }" :disabled="accessRoomsManagement">
                  <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                </button>
                <button @click="showModalWindow(index)" title="Usuń" class="flex items-center justify-center text-white font-bold py-1 px-2 rounded text-xs bg-red-600 hover:bg-red-500" :class="{ 'opacity-50 cursor-not-allowed hover:bg-red-600': accessRoomsManagement }" :disabled="accessRoomsManagement">
                  <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                </button>
                <!-- MODAL WINDOW TO CONFIRM REMOVING ROOM -->
                <div class="hidden fixed w-full h-full top-0 left-0 flex items-center justify-center" :id="index">
                  <div @click.prevent="showModalWindow(index)" class="absolute w-full h-full bg-gray-900 opacity-50"></div>
                  <div class="bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                    <div class="modal-content py-4 text-left px-6" id="modal">
                      <div class="flex justify-between mb-5">
                        <p class="text-base font-bold">Czy napewno chcesz usunąć to pomieszczenie a w konsekwencji wszystkie komputery do niego dodane?</p>
                        <div @click="showModalWindow(index)" class="cursor-pointer z-50" :class="{ 'opacity-50 cursor-not-allowed': pending }">
                          <svg class="fill-current text-black w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path></svg>
                        </div>
                      </div>
                      <p>Nazwa pomieszczenia: <b>{{ room.roomName }}</b></p>
                      <div class="flex justify-end mt-5">
                        <button @dblclick="removeRoom(room._id)" class="px-4 py-2 bg-red-600 rounded hover:bg-red-500 text-white mr-2" :class="{ 'opacity-50 cursor-not-allowed hover:bg-red-600': pending }" :disabled="pending" type="button">
                          <div v-if="!pending">Tak</div>
                          <svg v-if="pending" class="w-6 h-6" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
                        </button>
                        <button @click="showModalWindow(index)" class="px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-500" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-600': pending }" :disabled="pending" type="button">Nie</button>
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
    <div v-if="!rooms.length && !pending" class="flex flex-col w-full items-center justify-center my-2">
      <svg class="w-16 h-16 text-gray-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
      <div class="uppercase font-semibold text-gray-400">Brak pomieszczeń</div>
    </div>
    <div v-if="pending" class="flex w-full items-center justify-center my-2">
      <svg class="w-10 h-10" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#4A5568"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Rooms',

  data() {
    return {
      rooms: [],
      roomName: '',
      errorMessage: '',
      error: false,
      pending: false,
      editing: false,
    }
  },

  async mounted() {
    await this.getRooms()

    await this.sockets.subscribe('ROOMS', (activeRooms) => {    
      this.rooms = this.rooms.map(room => { 
        const activeRoom = activeRooms.find(o => o.roomName === room.roomName)
        return {
          ...room,
          numberOfActiveWorkstationsInRoom: activeRoom ? activeRoom.quantity : 0
        }
      })
    })
  },

  async destroyed() {
    await this.sockets.unsubscribe('ROOMS')
  },

  watch: {
  	roomName() { this.roomName = this.roomName.replace(/\s+/g,"") }
  },

  computed: {
    emptyRoomName() { return this.roomName.length < 1 || this.roomName.length > 20 },
    accessRoomsManagement() { return this.$store.state.payload.role === 'admin' ? false : !this.$store.state.payload.accessRoomsManagement }
  },

  methods: {
    async getRooms() {
      try {
        this.pending = true
        const result = await this.$axios.get(process.env.VUE_APP_API_URL + `/rooms`)
        this.rooms = result.data
        await this.$socket.emit('ROOMS')
        this.pending = false
        //console.log(this.rooms)
      } catch (error) {
        this.pending = false
        console.log({ error })
      }
    },

    async addRoom() {
      try {
        this.pending = true
        await this.$axios.post(process.env.VUE_APP_API_URL + '/rooms', { roomName: this.roomName })
        this.roomName = ''
        await this.getRooms()
      } catch(error) {
        this.error = true
        this.pending = false
        if(error.response.data.statusCode == 409) this.errorMessage = 'Podana nazwa pomieszczenia jest zajęta.'
        console.log({ error })
      }
    },

    async editRoom(index, id) {
      try {
        this.editing = true
        const NewRoomNameValue = document.getElementById('roomNameInputText_' + index).value
        await this.$axios.put(process.env.VUE_APP_API_URL + '/rooms', { id: id, roomName: NewRoomNameValue })
        this.editing = false
        this.error = false
        this.errorMessage = ''
        await this.showEditRoomForm(index)
        await this.rooms.filter(key => key._id == id ? key.roomName = NewRoomNameValue : null)
      } catch(error) {
        this.error = true
        this.editing = false
        if(error.response.data.message == 'This room name is already in use!') { this.errorMessage = 'Podana nazwa pomieszczenia jest zajęta.' }
        console.log({ error })
      }
    },

    async showEditRoomForm(index) {
      if(!document.getElementById('roomNameColumn_' + index).className.includes('hidden')) {
        document.getElementById('roomNameColumn_' + index).classList.add('hidden')
        document.getElementById('editRoomNameColumn_' + index).classList.remove('hidden')
      } else if(document.getElementById('roomNameColumn_' + index).className.includes('hidden')) {
        document.getElementById('roomNameColumn_' + index).classList.remove('hidden')
        document.getElementById('editRoomNameColumn_' + index).classList.add('hidden')
      }
    },

    editFormValidate(index) {
      document.getElementById('roomNameInputText_' + index).value = document.getElementById('roomNameInputText_' + index).value.replace(/\s+/g,"")

      const roomNameValue = document.getElementById('roomNameInputText_' + index).value
      if(roomNameValue.length > 0 && roomNameValue.length <= 20) {
        document.getElementById('editRoomButton_' + index).disabled = false
        document.getElementById('editRoomButton_' + index).className = document.getElementById('editRoomButton_' + index).className.replace('opacity-50 cursor-not-allowed', '')
      } else {
        document.getElementById('editRoomButton_' + index).disabled = true
        document.getElementById('editRoomButton_' + index).className += ' opacity-50 cursor-not-allowed' 
      }
    },

    async removeRoom(id) {
      try {
        this.pending = true
        await this.$axios.delete(process.env.VUE_APP_API_URL + `/rooms/${id}`)
        this.pending = false
        this.modalWindow = false
        await this.getRooms()
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

    roomStatusDetails(numberOfActiveWorkstationsInRoom, quantityWorkstations) {
      return  '<div class="flex flex-col">' +
                '<div class="inline-flex text-xs truncate">AKTYWNE STANOWISKA KOMPUTEROWE</div>' + 
                '<div class="inline-flex w-full justify-center">' + numberOfActiveWorkstationsInRoom + ' / ' + quantityWorkstations + '</div>' +
              '</div>'
    }
  }
}
</script>