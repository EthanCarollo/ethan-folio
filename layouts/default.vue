<script>
import anime from 'animejs/lib/anime.es.js';

export default {
  beforeCreate() {
    this.showHideSpinner = true;
  },
  mounted() {
    anime({
        targets: '#loading_spinner',
        opacity: 0,
        delay:1000,
        easing: 'easeInOutCubic',
        duration: 1000,
        loopComplete: () => {
            this.showHideSpinner = false;
        }
    })
  },
  data() {
    return {
      showHideSpinner: true
    };
  }
};
</script>

<template>
    <div>
      <LoadSpinner id="loading_spinner" v-if="showHideSpinner" />
        <slot />
    </div>
  </template>