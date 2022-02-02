<template>
  <div>
    <TopBar />
    <slot />
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