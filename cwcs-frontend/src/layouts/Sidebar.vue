<template>
  <div>
    <TopBar />
    <div class="h-full">
      <div class="flex h-full">
        <SideBar class="w-1/5"/>
        <div class="flex-1 overflow-y-auto">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/TopBar'
import SideBar from '@/components/SideBar'

export default {
  components: {
    TopBar,
    SideBar
  }  
} 
</script>