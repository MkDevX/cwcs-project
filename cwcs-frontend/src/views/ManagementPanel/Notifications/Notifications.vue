<template>
  <div>
    <div class="flex items-center justify-between px-5 border-b border-gray-400">
      <div class="flex items-center rounded-lg py-1 mr-5 text-lg">
        <svg class="w-10 h-10 text-gray-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16z"/></svg>
        <h1 class="text-lg text-gray-500 font-semibold uppercase">Zgłoszenia</h1>
      </div>
      <div class="w-full">
        <div v-if="!openAddCategoryForm && !openEditCategoryForm" class="w-full inline-flex">
          <div class="inline-block relative w-full">
            <select v-model="categoryId" @change="onSelectCategory()" title="Lista kategorii" class="appearance-none h-full rounded-l border border-gray-400 w-full cursor-pointer py-1 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="categories" :class="{ 'opacity-50 cursor-not-allowed': pendingCategory || categories.length <= 0 || accessNotifications }" :disabled="pendingCategory || categories.length <= 0 || accessNotifications">
              <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.categoryName }}</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg class="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          <button @click="onSelectCategory(), openEditCategoryForm = true" title="Edytuj" class="flex items-center justify-center text-white font-bold py-1 px-2 text-xs bg-gray-600 hover:bg-gray-500" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-600': pendingCategory || !categoryId || accessNotifications}" :disabled="pendingCategory || !categoryId || accessNotifications">
            <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
          </button>
          <button @click="showModal = true" title="Usuń" class="flex items-center justify-center text-white font-bold py-1 px-2 text-xs bg-red-600 hover:bg-red-500" :class="{ 'opacity-50 cursor-not-allowed hover:bg-red-600': pendingCategory || !categoryId || accessNotifications }" :disabled="pendingCategory || !categoryId || accessNotifications">
            <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
          </button>
          <button @click="openAddCategoryForm = !openAddCategoryForm, categoryName = ''" title="Dodaj nową kategorię" class="flex items-center justify-center bg-green-600 hover:bg-green-500 cursor-pointer text-sm text-white tracking-wide py-2 px-2 rounded-r focus:outline-none" :class="{ 'opacity-50 cursor-not-allowed hover:bg-green-600': pendingCategory || accessNotifications }" :disabled="pendingCategory || accessNotifications">
            <svg class="w-4 h-4 fill-current text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
          </button>
        </div>
        <div v-if="openAddCategoryForm" class="flex">
          <input v-model="categoryName" maxlength="20" class="appearance-none rounded-l border border-gray-400 w-full py-1 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300"  type="text" placeholder="Podaj nazwę kategorii" :class="{ 'opacity-50 cursor-not-allowed': pendingCategory || accessNotifications }" :disabled="pendingCategory || accessNotifications" />
          <button @click="openAddCategoryForm = false" title="Anuluj" class="flex items-center justify-center text-white py-1 px-2 bg-red-600 hover:bg-red-500" :class="{ 'opacity-50 cursor-not-allowed': pendingCategory || accessNotifications }" :disabled="pendingCategory || accessNotifications">
            <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
          </button>
          <button @click="addCategory()" title="Dodaj" class="flex items-center justify-center text-white py-1 px-2 rounded-r bg-green-600 hover:bg-green-500" :class="{ 'opacity-50 cursor-not-allowed': pendingCategory || categoryName.length <= 0 }" :disabled="pendingCategory || categoryName.length <= 0">
            <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
          </button>
        </div>
        <div v-if="openEditCategoryForm" class="flex">
          <input v-model="categoryName" maxlength="20" class="appearance-none rounded-l border border-gray-400 w-full py-1 px-3 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300"  type="text" placeholder="Podaj nazwę kategorii" :class="{ 'opacity-50 cursor-not-allowed': pendingCategory || accessNotifications }" :disabled="pendingCategory || accessNotifications" />
          <button @click="openEditCategoryForm = false" title="Anuluj" class="flex items-center justify-center text-white py-1 px-2 bg-red-600 hover:bg-red-500" :class="{ 'opacity-50 cursor-not-allowed': pendingCategory || accessNotifications }" :disabled="pendingCategory || accessNotifications">
            <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
          </button>
          <button @click="editCategory()" title="Edytuj" class="flex items-center justify-center text-white py-1 px-2 rounded-r bg-green-600 hover:bg-green-500" :class="{ 'opacity-50 cursor-not-allowed': pendingCategory || categoryName.length <= 0 || accessNotifications }" :disabled="pendingCategory || categoryName.length <= 0 || accessNotifications">
            <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
          </button>
        </div>
      </div>
    </div>
    <div v-if="error" class="flex bg-red-500 text-white px-3 py-2 rounded relative mx-4 mt-5" role="alert">
      <strong class="font-bold mr-1">Błąd!</strong>
      <span class="block">{{ errorMessage ? errorMessage: 'Wystąpił błąd.' }}</span>
      <span @click="error = false" class="absolute top-0 bottom-0 right-0 px-3 py-2">
        <svg class="fill-current h-6 w-6 text-white" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Zamknij</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
      </span>
    </div>
    <div v-if="!pending && notifications.length" class="w-full px-4 py-5">
    
    <table class="text-left w-full border-collapse">
      <thead>
        <tr>
          <td class="m-0 p-0">
            <button @click="dateNotificationFilter='', categoryNameFilter='', notificationPriorityFilter='', notificationStatusFilter='', filterNotifications()" title="Resetuj filtry" class="flex w-full py-1 px-1 items-center justify-center text-white font-bold text-xs bg-blue-600 hover:bg-blue-500 focus:outline-none" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-600': pending }" :disabled="pending">
              <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6a5.87 5.87 0 01-2.8-.7l-1.46 1.46A7.93 7.93 0 0012 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46A7.93 7.93 0 0012 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
            </button>
          </td>
          <td class="w-40">
            <input v-model.trim="dateNotificationFilter" @keyup="filterNotifications()" class="appearance-none border border-gray-400 w-full px-2 py-1 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="dateNotificationFilter" type="text" placeholder="DATA ZGŁOSZENIA" :class="{ 'opacity-50 cursor-not-allowed': pending }" :disabled="pending" />
          </td>
          <td>
            <input v-model.trim="categoryNameFilter" @keyup="filterNotifications()" class="appearance-none border border-gray-400 w-full px-2 py-1 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="categoryNameFilter" type="text" placeholder="KATEGORIA" :class="{ 'opacity-50 cursor-not-allowed': pending }" :disabled="pending" />
          </td>
          <td class="w-32">
            <div class="inline-block relative w-full">
              <select v-model="notificationPriorityFilter" title="PRIORYTET" @change="filterNotifications()" class="appearance-none cursor-pointer border border-gray-400 w-full py-1 px-2 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="notificationPriorityFilter" :class="{ 'opacity-50 cursor-not-allowed': pending }" :disabled="pending">
                <option :value="''">PRIORYTET</option>
                <option value="low">NISKI</option>
                <option value="medium">ŚREDNI</option>
                <option value="high">WYSOKI</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pl-2 pr-1 text-gray-700">
                <svg class="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </td>
          <td class="w-32">
            <div class="inline-block relative w-full">
              <select v-model="notificationStatusFilter" title="STATUS" @change="filterNotifications()" class="appearance-none cursor-pointer border border-gray-400 w-full py-1 px-2 text-gray-900 placeholder-gray-500 bg-gray-400 leading-tight focus:outline-none focus:bg-gray-300" id="notificationStatusFilter" :class="{ 'opacity-50 cursor-not-allowed': pending }" :disabled="pending">
                <option :value="''">STATUS</option>
                <option value="true">OTWARTE</option>
                <option value="false">ZAMKNIĘTE</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pl-2 pr-1 text-gray-700">
                <svg class="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </td>
          <td>
          </td>
        </tr>
        <tr>
          <th class="py-2 px-1 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">L.P</th>
          <th class="py-2 px-1 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700 truncate">Data zgłoszenia</th>
          <th class="py-2 px-1 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700 truncate">Kategoria</th>
          <th class="py-2 px-1 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700 truncate">Priorytet</th>
          <th class="py-2 px-1 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-r border-b border-gray-700">Status</th>
          <th class="py-2 px-1 bg-gray-800 uppercase tracking-widest font-semibold text-xs text-white border-b border-gray-700">Zarządzanie</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(notification, index) in filteredNotifications" :key="index" class="hover:bg-gray-400" v-tooltip.bottom="{ content: notificationDetails(notification.firstName, notification.lastName, notification.roomName, notification.workstationName), classes: 'max-w-sm text-white text-sm bg-gray-600 border-2 border-gray-700 rounded-lg shadow-2xl py-1 px-1 my-1' }">
          <td class="py-2 px-2 border-b border-gray-500">
            {{ index + 1 }}
          </td>
          <td class="py-2 px-2 border-b border-gray-500 whitespace-no-wrap">{{ notification.dateNotification }}</td>
          <td class="py-2 px-2 border-b border-gray-500">
            {{ notification.categoryName }}
          </td>
          <td class="py-2 px-2 border-b border-gray-500">
            <span v-if="notification.notificationPriority == 'low'" class="text-blue-700 font-bold">NISKI</span>
            <span v-if="notification.notificationPriority == 'medium'" class="text-yellow-700 font-bold">ŚREDNI</span>
            <span v-if="notification.notificationPriority == 'high'" class="text-red-500 font-bold">WYSOKI</span>
          </td>
          <td class="py-2 px-2 border-b border-gray-500">
            <span v-if="notification.notificationStatus" class="text-red-700 font-bold">OTWARTE</span>
            <span v-if="!notification.notificationStatus" class="text-green-700 font-bold">ZAMKNIĘTE</span>
          </td>
          <td class="py-2 px-2 border-b border-gray-500">
            <div class="flex items-center justify-center">
              <router-link :to="'/management-panel/edit-notification/' + notification._id" title="Edytuj" class="flex items-center justify-center text-white font-bold mr-1 py-1 px-2 rounded text-xs bg-gray-600 hover:bg-gray-500" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-600': accessNotifications }" :event="accessNotifications ? '' : 'click'">
                <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
              </router-link>
              <button @click="showModalWindow(index)" title="Usuń" class="flex items-center justify-center text-white font-bold py-1 px-2 rounded text-xs bg-red-600 hover:bg-red-500 focus:outline-none" :class="{ 'opacity-50 cursor-not-allowed hover:bg-red-600': accessNotifications }" :disabled="accessNotifications">
                <svg class="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
              </button>
              <!-- MODAL WINDOW TO CONFIRM REMOVING ROOM -->
              <div class="hidden fixed w-full h-full top-0 left-0 flex items-center justify-center" :id="index">
                <div @click.prevent="showModalWindow(index)" class="absolute w-full h-full bg-gray-900 opacity-50"></div>
                <div class="bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                  <div class="modal-content py-4 text-left px-6" id="modal">
                    <div class="flex justify-between mb-5">
                      <p class="text-base font-bold">Czy napewno chcesz usunąć to zgłoszenie?</p>
                      <div @click="showModalWindow(index)" class="cursor-pointer z-50" :class="{ 'opacity-50 cursor-not-allowed': pending }">
                        <svg class="fill-current text-black w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path></svg>
                      </div>
                    </div>
                    <p>Data dodania zgłoszenia: <b>{{ notification.dateNotification }}</b></p>
                    <p>Status: <span v-if="notification.notificationStatus" class="text-red-700 font-bold">OTWARTE</span><span v-if="!notification.notificationStatus" class="text-green-700 font-bold">ZAMKNIĘTE</span></p>
                    <p>Imię: <b>{{ notification.firstName }}</b></p>
                    <p>Nazwisko: <b>{{ notification.lastName }}</b></p>
                    <p>Pomieszczenie: <b>{{ notification.roomName }}</b></p>
                    <p>Stanowisko: <b>{{ notification.workstationName }}</b></p>
                    <div class="flex justify-end mt-5">
                      <button @dblclick="removeNotification(notification._id)" class="px-4 py-2 bg-red-600 rounded hover:bg-red-500 text-white mr-2" :class="{ 'opacity-50 cursor-not-allowed hover:bg-red-600': pending }" :disabled="pending" type="button">
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
  <!-- MODAL WINDOW TO CONFIRM REMOVING CATEGORY -->
    <div v-if="showModal" class="fixed w-full h-full top-0 left-0 flex items-center justify-center">
      <div @click.prevent="showModal = false" class="absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div class="bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div class="modal-content py-4 text-left px-6" id="modal">
          <div class="flex justify-between mb-5">
            <p class="text-base font-bold">Czy napewno chcesz usunąć tą kategorię?</p>
            <div @click="showModal = false" class="cursor-pointer z-50" :class="{ 'opacity-50 cursor-not-allowed': pendingCategory }">
              <svg class="fill-current text-black w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path></svg>
            </div>
          </div>
          <p>Nazwa kategorii: {{ categoryName }}</p>
          <div class="flex justify-end mt-5">
            <button @dblclick="deleteCategory()" class="px-4 py-2 bg-red-600 rounded hover:bg-red-500 text-white mr-2" :class="{ 'opacity-50 cursor-not-allowed hover:bg-red-600': pendingCategory }" :disabled="pendingCategory" type="button">
              <div v-if="!pendingCategory">Tak</div>
              <svg v-if="pendingCategory" class="w-6 h-6" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
            </button>
            <button @click="showModal = false" class="px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-500" :class="{ 'opacity-50 cursor-not-allowed hover:bg-gray-600': pendingCategory }" :disabled="pendingCategory" type="button">Nie</button>
          </div>
        </div>
      </div>
    </div>
    <!-- END OF MODAL WINDOW TO CONFIRM REMOVING CATEGORY -->
  <div v-if="!notifications.length && !pending" class="flex flex-col w-full items-center justify-center my-2">
    <svg class="w-16 h-16 text-gray-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
    <div class="uppercase font-semibold text-gray-400">Brak zgłoszeń</div>
  </div>
  <div v-if="pending" class="flex w-full items-center justify-center my-2">
    <svg class="w-10 h-10" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#4A5568"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity="0.5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>
  </div>
  </div>
</template>

<script>
export default {
  name: 'Notifications',

  data() {
    return {
      notifications: [],
      categories: [],
      categoryId: '',
      openAddCategoryForm: false,
      openEditCategoryForm: false,
      categoryName: '',
      showModal: false,
      errorMessage: '',
      error: false,
      pending: false,
      pendingCategory: false,
      filteredNotifications: [],
      categoryNameFilter: '',
      notificationPriorityFilter: '',
      notificationStatusFilter: '',
      dateNotificationFilter: ''
    }
  },

  async mounted() {
    await this.getNotifications()
    await this.getCategories()
  },

  computed: {
    accessNotifications() { return this.$store.state.payload.role === 'admin' ? false : !this.$store.state.payload.accessNotifications }
  },

  methods: {
    async getNotifications() {
      try {
        this.pending = true
        const result = await this.$axios.get(process.env.VUE_APP_API_URL + '/notifications')
        this.notifications = result.data.filter(notification => {
          notification.categoryName = notification.categoryName.toString()
          if(notification.categoryName.length <= 0) {
            notification.categoryName = 'BRAK'
          }
          return notification
        })
        this.filteredNotifications = this.notifications
        this.pending = false
        //console.log(this.notifications)
      } catch (error) {
        this.pending = false
        console.log({ error })
      }
    },
    async removeNotification(id) {
      try {
        this.pending = true
        await this.$axios.delete(process.env.VUE_APP_API_URL + `/notifications/${id}`)
        this.pending = false
        this.modalWindow = false
        await this.getNotifications()
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

    notificationDetails(firstName, lastName, roomName, workstationName) {
      return  '<div class="flex flex-col">' +
                '<div class="inline-flex">IMIĘ:<span class="ml-1">' + firstName + '</span></div>' +
                '<div class="inline-flex">NAZWISKO:<span class="ml-1">' + lastName + '</span></div>' +
                '<div class="inline-flex">POMIESZCZENIE:<span class="ml-1">' + roomName + '</span></div>' +
                '<div class="inline-flex">KOMPUTER:<span class="ml-1">' + workstationName + '</span></div>' +
              '</div>'
    },

    async getCategories() {
        try {
        this.pendingCategory = true

        const result = await this.$axios.get(process.env.VUE_APP_API_URL + `/categories`)   
        this.categories = result.data
        
        if(this.categories.length > 0) {
          this.categoryId = result.data[0]._id
          this.categoryName = result.data[0].categoryName
        } else {
          this.categoryId = ''
          this.categoryName = ''
        }
  
        this.pendingCategory = false
      } catch(error) {
        this.error = true
        this.pendingCategory = false
        console.log({ error })
      }
    },

    async addCategory() {
        try {
        this.pendingCategory = true
        this.error = false
        this.errorMessage = ''

        await this.$axios.post(process.env.VUE_APP_API_URL + `/categories`, { categoryName: this.categoryName })

        this.categoryName = ''
        this.openAddCategoryForm = false
        await this.getCategories()
        this.pendingCategory = false
      } catch(error) {
        if(error.response.data.message == 'This category name already exists!') { this.errorMessage = 'Podana nazwa kategorii jest już zajęta.' }
        this.error = true
        this.pendingCategory = false
        console.log({ error })
      }
    },

    async editCategory() {
        try {
        this.pendingCategory = true
        this.error = false
        this.errorMessage = ''

        await this.$axios.put(process.env.VUE_APP_API_URL + `/categories`, { id: this.categoryId, categoryName: this.categoryName })

        this.categoryName = ''
        this.openEditCategoryForm = false
        await this.getCategories()
        this.pendingCategory = false
        await this.getNotifications()
      } catch(error) {
        if(error.response.data.message == 'This category name already exists!') { this.errorMessage = 'Podana nazwa kategorii jest już zajęta.' }
        this.error = true
        this.pendingCategory = false
        console.log({ error })
      }
    },

    async deleteCategory() {
        try {
        this.pendingCategory = true
        this.error = false
        this.errorMessage = ''

        await this.$axios.delete(process.env.VUE_APP_API_URL + `/categories/${this.categoryId}`)

        await this.getCategories()
        this.pendingCategory = false
        this.showModal = false
        await this.getNotifications()
      } catch(error) {
        this.showModal = false
        this.errorMessage = 'Wybrana kategoria nie została usunięta.'
        this.error = true
        this.pendingCategory = false
        console.log({ error })
      }
    },

    onSelectCategory() {
      this.categories.filter(category => {
        if(category._id == this.categoryId) {
          this.categoryName = category.categoryName
        }
      })
    },

    filterNotifications() {
      this.filteredNotifications = this.notifications.filter(notification => {
        if(notification.dateNotification.toString().includes(this.dateNotificationFilter) && notification.categoryName.toLowerCase().includes(this.categoryNameFilter.toLowerCase()) && notification.notificationPriority.includes(this.notificationPriorityFilter) && notification.notificationStatus.toString().includes(this.notificationStatusFilter)) {
          return notification
        }
      })
    }
  }
}
</script>