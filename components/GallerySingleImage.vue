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
    <div class ="max-w-[65vw] h-[50vh]">
      <div class ="gradient-border absolute right-0 top-0 w-full h-full"></div>
      <nuxt-img @mousedown.prevent :quality="20" :src="image" class="max-w-[65vw] h-[50vh] object-cover -translate-y-full"/>
    </div>
    <h1 class="text-3xl text-center w-[60vw] mt-8">{{ info.title }}</h1>
    <h1 class="text-xl text-center w-[60vw] mt-2">{{ info.description }}</h1>
  </div>
</template>

<style scoped>

.gradient-border {
  transition: all 1s;
  --border-width: 3px;
  font-family: Lato, sans-serif;
  font-size: 2.5rem;
  text-transform: uppercase;
  color: white;
  background: #222;
  border-radius: var(--border-width);
  transition: all 1s;
  opacity: 90%;
}

.gradient-border:after{
  position: absolute;
  content: "";
  top: calc(-1 * var(--border-width));
  left: calc(-1 * var(--border-width));
  z-index: -10;
  width: calc(100% + var(--border-width) * 2);
  height: calc(100% + var(--border-width) * 2);
  background: linear-gradient(
      60deg,
      rgb(216 180 254),
      rgb(88 28 135),
      rgb(216 180 254),
      rgb(88 28 135),
      rgb(88 28 135),
      rgb(216 180 254),
      rgb(88 28 135),
      rgb(88 28 135)
  );
  background-size: 300% 300%;
  background-position: 0 50%;
  border-radius: calc(2 * var(--border-width));
  animation: moveGradient 15s alternate infinite;
}

@keyframes moveGradient {
  50% {
    background-position: 100% 50%;
  }
}

</style>