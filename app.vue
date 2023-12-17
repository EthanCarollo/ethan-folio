<script setup>

useHead({
  htmlAttrs: {
    lang: 'fr'
  }
})

</script>

<template>
  <NuxtLayout>
  <div class="bg-slate-800">

    <tetikus :lerp="0.2" color="white" :showDefaultCursor = false :borderWidth="0" :size="28" :invertColor=true />
    <tetikus :lerp="0.4 " color="white" :showDefaultCursor = false :borderWidth="0" :size="18"/>
    
    <nuxt-page-transition>
      <nuxt-page />
    </nuxt-page-transition>
    <NuxtLoadingIndicator></NuxtLoadingIndicator>
  </div>
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.8s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>