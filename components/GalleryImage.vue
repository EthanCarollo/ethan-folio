<script setup>
import anime from 'animejs/lib/anime.es.js';
import GallerySingleImage from "~/components/GallerySingleImage.vue";

const props = defineProps([
    "projectInformations",
    "selectedImage"
])

const emit = defineEmits(['quitGallery'])
onMounted(()=>{

})
const quitGallery = () => {
  let animationEndDuration = 500;
  anime({
    targets: "#gallery_of_images",
    opacity:0,
    duration:animationEndDuration,
    easing: "easeInOutQuad",
    loopComplete:()=>{
      emit('quitGallery');
    }
  })
}
props
const onSwiper = (swiper) => {
  swiper.activeIndex = props.selectedImage
};
</script>

<template>

  <div v-thover="{ scale: 0.5 }" @click="quitGallery" class ="fixed left-8 top-10 w-12 fill-white z-[90]">
    <IconsLeftIcon></IconsLeftIcon>
  </div>
<div id="gallery_of_images" class="fixed top-0 left-0 pr-[2vw] pl-[2vw] text-white w-[100vw] h-[100vh] bg-black/50 z-[80] flex justify-center items-center backdrop-blur-lg">
<Swiper
    :modules="[SwiperNavigation, SwiperEffectCreative, SwiperPagination]"
    :navigation="{
      enabled: true,
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }"
    @swiper="onSwiper"
    :pagination= "{
      enabled:true,
      el: '.swiper-pagination-slider',
      bulletClass: 'slider-pagination',
      bulletActiveClass: 'actual-slider-pagination'
     }"
    :effect="'creative'"
    :slides-per-view="1"
    :creative-effect="{
      prev: {
        shadow: false,
        opacity:0,
        scale: 0,
        translate: ['-20%', 0, -1],
      },
      next: {
        shadow: false,
        translate: ['100%', 0, 0],
      },
    }"
>
  <SwiperSlide v-for="info in projectInformations" :lazy="true">
    <gallery-single-image :info="info"></gallery-single-image>
  </SwiperSlide>
  <div class="swiper-pagination-slider fixed bottom-[6%] w-full flex justify-center gap-1"></div>
  <div v-thover="{ scale: 0.5 }" class="swiper-button-prev" style="color:white;"></div>
  <div v-thover="{ scale: 0.5 }" class="swiper-button-next" style="color:white;"></div>
</Swiper>
</div>
</template>

<style scoped>

#gallery_of_images{
  opacity: 100%;
  animation: gallery_of_image 0.5s;
}

@keyframes gallery_of_image {
  from{
    opacity: 0;
  }to{
    opacity: 100%;
     }
}

</style>