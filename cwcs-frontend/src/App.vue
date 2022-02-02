<template>
  <div id="app" class="bg-gray-100 h-screen pb-8 antialiased select-none">
    <component :is="layout" class="h-full">
      <router-view />
    </component>
  </div>
</template>

<script>
export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || 'default') + '-layout'
    }
  }
}
</script>