<script setup>

const props = defineProps([
    "info"
])

const image = ref(props.info.image);
const playButton = ref("https://icons.veryicon.com/png/o/miscellaneous/winsion/play-button-6.png")

const launchGif = () => {
  if(image.value.endsWith('.gif')){
    playButton.value = "https://icons.veryicon.com/png/o/miscellaneous/winsion/play-button-6.png"
    image.value = props.info.image
    return;
  }
  playButton.value = "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-pause-512.png"
  image.value = props.info.gifImage
}

</script>

<template>
  <div class="w-full h-[100vh] swiper-no-swiping flex flex-col justify-center items-center">
    <nuxt-img v-thover="{ scale: 0.5 }"  v-if="info.gifImage" @click="launchGif" :src = "playButton" class ="transition-all absolute right-8 top-10 w-12 h-12 fill-white z-[90] invert"></nuxt-img>
    <nuxt-img @mousedown.prevent :quality="20" :src="image" class="w-[65vw] h-[40vw] object-cover"/>
    <h1 class="text-2xl text-center w-[60vw] mt-8">{{ info.description }}</h1>
  </div>
</template>

<style scoped>

</style>