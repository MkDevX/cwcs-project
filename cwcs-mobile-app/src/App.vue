<template>
  <div id="app" class="bg-gray-100 h-screen antialiased select-none">
    <ion-app>
      <ion-header no-border>
        <TopBar />
      </ion-header>
      <ion-content>
        <ion-vue-router />
        <!-- <router-view /> -->
      </ion-content>
    </ion-app>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar'

export default {
  components: {
    TopBar
  }  
} 
</script>
