<script>

export default {
  props:[
      "info"
  ],
  data(){
    return{
      showImage: false
    }
  }
}

</script>

<template>
<div @mouseup="$emit('activeGallery')" class="shadow-lg shadow-black/30 lg:w-[25vw] lg:h-[20vw] h-[30vh] bg-white lg:hover:grow transition-all duration-700 bg-cover bg-center information-project relative">
  <div class ="gradient-border absolute top-0 left-0 w-full h-full"></div>
  <nuxt-img class="absolute top-0 left-0 w-full h-full object-cover" :src="this.info.image"></nuxt-img>
  <div class="absolute top-0 left-0 w-full h-full bg-black/50 lg:opacity-0 hover-information-project flex flex-col justify-center items-center">
    <h1 class="text-base lg:text-3xl text-white lg:w-[20vw] w-full p-8 lg:p-0 text-center">{{info.title}}</h1>
  </div>
</div>
</template>

<style>
.hover-information-project{
  transition: all 1s;
}

.information-project:hover .hover-information-project{
  opacity: 100%;
  transition: all 1s;
}

.information-project{
  font-family: "LiveMono";
}

/**************/
/*******gradient border*******/
/**************/

.gradient-border {
  transition: all 1s;
  --border-width: 3px;

  position: relative;
  font-family: Lato, sans-serif;
  font-size: 2.5rem;
  text-transform: uppercase;
  color: white;
  background: #222;
  border-radius: var(--border-width);
}

.information-project .gradient-border{
  opacity: 0;
}

.information-project:hover .gradient-border{
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
  animation: moveGradient 4s alternate infinite;
}

@keyframes moveGradient {
  50% {
    background-position: 100% 50%;
  }
}
</style>