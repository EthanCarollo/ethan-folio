<script>
import { RouterLink, RouterView } from 'vue-router'

export default{
  components:{
    RouterView
}
}
</script>

<template>
  <tetikus lerp="0.3" color="white" showDefaultCursor="false" borderWidth="0" size="28" invertColor="true" />
  <tetikus lerp="0.5" color="white" showDefaultCursor="false" borderWidth="0" size="18"/>


  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <div :key="route.name">  
        <component :is="Component"></component>
      </div>
    </transition>
  </router-view>

</template>

<style>

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
