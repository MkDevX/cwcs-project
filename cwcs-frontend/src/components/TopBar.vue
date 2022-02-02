<template>
  <div class="draggable-region flex w-full h-8 items-center justify-between bg-gray-800">
    <div class="mx-1 text-gray-300 uppercase tracking-wider font-semibold">
      System kontroli stanowiska komputerowego
    </div>
    <div class="non-draggable-region flex h-full">
      <div v-if="this.$store.state.accessToken" @click="logout()" title="Wyloguj" class="h-full w-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 cursor-pointer">
        <svg class="w-6 h-6 text-gray-200 fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 3c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1zm5.14 2.86a.99.99 0 0 0-.01 1.39c1.13 1.2 1.83 2.8 1.87 4.57.09 3.83-3.08 7.13-6.91 7.17A6.981 6.981 0 0 1 5 12c0-1.84.71-3.51 1.87-4.76.37-.39.37-1-.01-1.38a.993.993 0 0 0-1.43.02A8.92 8.92 0 0 0 3 11.74c-.14 4.88 3.83 9.1 8.71 9.25 5.1.16 9.29-3.93 9.29-9 0-2.37-.92-4.51-2.42-6.11-.38-.41-1.04-.42-1.44-.02z"/></svg>
      </div>
      <div @click="minimize()" title="Zminimalizuj" class="h-full w-8 flex items-center justify-center bg-gray-600 hover:bg-gray-500 cursor-pointer">
        <svg class="w-6 h-6 text-gray-200 fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M18 13H6c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1s-.45 1-1 1z"/></svg>
      </div>
      <div @click="close()" title="Zamknij" class="h-full w-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 cursor-pointer">
        <svg class="w-6 h-6 text-gray-200 fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/></svg>
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
import path from 'path'

const {Tray, Menu} = remote

export default {
  name: 'TopBar',

  mounted() {
    if(this.$router.currentRoute.path === '/') {
      this.setFullScreen()
    }
  },

  methods: {
    close() {
      this.$store.dispatch('logout')
      remote.getCurrentWindow().close()
    },

    minimize() {
    let trayIcon = new Tray(path.join(__static, 'icon.png'))

    const trayMenuTemplate = [
        {
          label: 'Wyloguj',
          click: () => {
            this.logout()
            remote.getCurrentWindow().show()
            trayIcon.destroy()
          }
        }
      ]
    
      remote.getCurrentWindow().hide()
      let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
      if(this.$cookies.get('accessToken')) { trayIcon.setContextMenu(trayMenu) }
      trayIcon.setToolTip("System kontroli stanowiska komputerowego")
      trayIcon.displayBalloon({ title:'System kontroli stanowiska komputerowego', content:'Aplikacja została zminimalizowana'})

      trayIcon.on('click', () => {
        if(remote.getCurrentWindow().isVisible()) {
           remote.getCurrentWindow().hide() 
        } else { 
          remote.getCurrentWindow().show()
          trayIcon.destroy()
        }
      })
    },

    setFullScreen() {
      remote.getCurrentWindow().setResizable(true)
      remote.getCurrentWindow().setFullScreen(true)
      remote.getCurrentWindow().setResizable(false)
    },

    logout() {
      this.$store.dispatch('logout')
      this.setFullScreen()
    }
  }
}
</script>
