<script>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Cursor from './components/Cursor.vue';

export default{
  components:{
    RouterView,
    Header,
    Cursor
}
}
</script>

<template>
  <Header></Header>

  <RouterView />

  <Cursor
  class ="mix-blend-exclusion"
      :targets="['img', 'a', 'button']"
      :circleColor="'#fff'"
      :circleColorHover="'#fff'"
      :dotColor="'#fff'"
      :dotColorHover="'lightgray'"
      :hoverSize="1.8">
  </Cursor>
</template>

<style scoped>
</style>
