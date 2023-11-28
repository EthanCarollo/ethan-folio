<script>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'

export default{
  components:{
    RouterView,
    Header
}
}
</script>

<template>
  <tetikus lerp="0.3" color="white" showDefaultCursor="false" borderWidth="0" size="26" invertColor="true" />

  <Header></Header>

  <RouterView />
</template>

<style scoped>
</style>
