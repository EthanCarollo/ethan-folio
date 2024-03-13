<script setup>
import anime from 'animejs/lib/anime.es.js';

var showHideSpinner = ref(true);

onMounted(() => {
  console.log(document.readyState)
  setTimeout(() => {
    anime({
      targets: '#loading_spinner',
      opacity: 0,
      delay:1000,
      easing: 'easeInOutCubic',
      duration: 1000,
      loopComplete: () => {
        showHideSpinner.value = false;
      }
    })
  }, 400)
})

</script>

<template>
    <div>
      <LoadSpinner id="loading_spinner" v-if="showHideSpinner" />
        <slot />
    </div>
  </template>