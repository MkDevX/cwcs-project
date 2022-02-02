<template>
  <div>
    <div class="flex items-center justify-between px-5 text-lg border-b border-gray-400">
    <div class="flex items-center rounded-lg py-1">
      <svg class="w-10 h-10 text-gray-500 fill-current mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
      <h1 class="text-lg text-gray-500 font-semibold uppercase">Pracownicy</h1>
    </div>
    <router-link to="/management-panel/administrator/add-employee" title="Dodaj pracownika" class="flex items-center justify-center bg-green-600 hover:bg-green-500 cursor-pointer text-sm text-white tracking-wide py-2 px-2 rounded focus:outline-none">
      <svg class="w-5 h-5 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
    </router-link>
    </div>
    <div v-if="!pending" class="w-full px-5 py-5">
      <table class="text-left w-full border-collapse">
        <thead>
          <tr>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">Użytkownik</th>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">Imię i Nazwisko</th>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">Uprawnienia</th>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">Status</th>
            <th class="py-2 px-2 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-b border-gray-700">Zarządzanie</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(employee, index) in employees" :key="index" class="hover:bg-gray-400">
            <td class="py-2 px-2 border-b border-gray-500">{{ employee.username }}</td>
            <td class="py-2 px-2 border-b border-gray-500">{{ employee.firstName }} {{ employee.lastName }}</td>
            <td class="py-2 px-2 border-b border-gray-500">
              <div class="flex items-center justify-center">
                <div :title="employee.accessNotifications ? 'Dostęp do zarządzania zgłoszeniami(edycja, usuwanie).' : 'Brak dostępu do zarządzania zgłoszeniami(edycja, usuwanie).'">
                  <svg class="w-6 h-6 fill-current text-red-700 cursor-pointer" :class="{ 'text-green-700' : employee.accessNotifications }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16z"/></svg>
                </div>
                <div :title="employee.accessUsersManagement ? 'Dostęp do zarządzania użytkownikami(dodawanie, edycja, usuwanie).' : 'Brak dostępu do zarządzania użytkownikami(dodawanie, edycja, usuwanie).'">
                  <svg class="w-6 h-6 fill-current text-red-700 cursor-pointer" :class="{ 'text-green-700' : employee.accessUsersManagement }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                </div>
                <div :title="employee.accessRoomsManagement ? 'Dostęp do zarządzania pomieszczeniami(dodawanie, edycja, usuwanie).' : 'Brak dostępu do zarządzania pomieszczeniami(dodawanie, edycja, usuwanie).'">
                  <svg class="w-6 h-6 fill-current text-red-700 cursor-pointer" :class="{ 'text-green-700' : employee.accessRoomsManagement }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z" /><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z" /></svg>
                </div>
                <div :title="employee.accessWorkstationsManagement ? 'Dostęp do zarządzania stanowiskami komputerowymi(dodawanie, edycja, usuwanie).' : 'Brak dostępu do zarządzania stanowiskami komputerowymi(dodawanie, edycja, usuwanie).'">
                  <svg class="ml-1 w-6 h-6 fill-current text-red-700 cursor-pointer" :class="{ 'text-green-700' : employee.accessWorkstationsManagement }" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>
                </div>
              </div>
            </td>
            <td class="border-b border-gray-500">
              <div v-if="employee.status" class="flex items-center justify-center cursor-pointer py-2 px-2" v-tooltip.bottom="{ content: employeeStatusDetails(employee.roomName, employee.workstationName), classes: 'max-w-sm text-white text-sm bg-gray-600 border-2 border-gray-700 rounded-lg shadow-2xl py-1 px-1 my-2' }">
                <svg class="fill-current text-green-600 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
              </div>
              <div v-if="!employee.status" title="OFFLINE" class="flex items-center justify-center cursor-pointer py-2 px-2">
                <svg class="fill-current text-red-600 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
              </div>
            </td>
            <td class="py-2 px-2 border-b border-gray-500">
              <div class="flex items-center justify-center">
                <router-link :to="'/management-panel/administrator/edit-employee/' + employee._id" class="flex items-center justify-center text-white font-bold mr-1 py-1 px-2 rounded text-xs bg-gray-600 hover:bg-gray-500">
                  <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                </router-link>
                <button @click="showModalWindow(index)" class="flex items-center justify-center text-white font-bold py-1 px-2 rounded text-xs bg-red-600 hover:bg-red-500">
                  <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
                </button>
                <!-- MODAL WINDOW TO CONFIRM REMOVING EMPLOYEE -->
                <div class="hidden fixed w-full h-full top-0 left-0 flex items-center justify-center" :id="index">
                  <div @click.prevent="showModalWindow(index)" class="absolute w-full h-full bg-gray-900 opacity-50"></div>
                  <div class="bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                    <div class="modal-content py-4 text-left px-6" id="modal">
                      <div class="flex justify-between mb-5">
                        <p class="text-base font-bold">Czy napewno chcesz usunąć tego pracownika?</p>
                        <div @click="showModalWindow(index)" class="cursor-pointer z-50" :class="{ 'opacity-50 cursor-not-allowed': pending }">
                          <svg class="fill-current text-black w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path></svg>
                        </div>
                      </div>
                      <p>Nazwa użytkownika: <b>{{ employee.username }}</b></p>
                      <p>Imię i nazwisko: <b>{{ employee.firstName }} {{ employee.lastName }}</b></p>
                      <div class="flex justify-end mt-5">
                        <button @dblclick="removeEmployeeAccount(employee._id)" class="px-4 py-2 bg-red-600 rounded hover:bg-red-500 text-white mr-2" :class="{ 'opacity-50 cursor-not-allowed hover:bg-red-600': pending }" :disabled="pending" type="button">
                          <div v-if="!pending">Tak</div>
                          <svg v-if="pending" class="w-6 h-6" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
                        </button>
                        <button @click="showModalWindow(index)" class="px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-500" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-600': pending }" :disabled="pending" type="button">Nie</button>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- END OF MODAL WINDOW TO CONFIRM REMOVING EMPLOYEE -->
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!employees.length && !pending" class="flex flex-col w-full items-center justify-center my-2">
        <svg class="w-16 h-16 text-gray-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
        <div class="uppercase font-semibold text-gray-400">Brak pracowników</div>
      </div>
    </div>
    <div v-if="pending" class="flex w-full items-center justify-center my-2">
      <svg class="w-10 h-10" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#4A5568"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Employees',

  data() {
    return {
      employees: [],
      pending: false
    }
  },

  async mounted() {
    await this.getEmployeesAccounts()

    await this.sockets.subscribe('EMPLOYEES', (activeEmployees) => {      
      this.employees = this.employees.map(employee => { 
        const activeEmployee = activeEmployees.find(o => o.accountId === employee._id);
        return {
          ...employee,
          status: activeEmployee ? true : false,
          addressMac: activeEmployee ? activeEmployee.addressMac : '',
          roomName: activeEmployee ? activeEmployee.roomName : '',
          workstationName: activeEmployee ? activeEmployee.workstationName : ''
        }
      })
    })
  },

  methods: {
    async getEmployeesAccounts() {
      try {
        this.pending = true
        const result = await this.$axios.get(process.env.VUE_APP_API_URL + '/accounts/employees')
        this.employees = result.data
        await this.$socket.emit('EMPLOYEES')
        this.pending = false
        //console.log(this.employees)
      } catch (error) {
        this.pending = false
        console.log({ error })
      }
    },

    async removeEmployeeAccount(id) {
      try {
        this.pending = true
        await this.$axios.delete(process.env.VUE_APP_API_URL + `/accounts/employee/${id}`)
        this.pending = false
        this.modalWindow = false
        await this.getEmployeesAccounts()
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

    employeeStatusDetails(roomName, workstationName) {
      return  '<div class="flex flex-col">' +
                '<div class="inline-flex">POMIESZCZENIE:<span class="ml-1">' + roomName + '</span></div>' +
                '<div class="inline-flex">KOMPUTER:<span class="ml-1">' + workstationName + '</span></div>' +
              '</div>'
    }
  }
}
</script>