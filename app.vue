<script setup>

useHead({
  htmlAttrs: {
    lang: 'fr'
  }
})

</script>

<template>
  <div class="bg-gradient-to-tr from-slate-800 via-slate-700 via-50% to-purple-300 h-[100vh] w-full fixed top-0 left-0"></div>
  <NuxtLayout>
  <div>

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