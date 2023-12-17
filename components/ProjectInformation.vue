<script>

export default {
  props:[
      "info"
  ]
}

</script>

<template>
<div class="shadow-lg shadow-black/30 lg:w-[25vw] lg:h-[20vw] h-[30vh] bg-white lg:hover:grow transition-all duration-700 bg-cover bg-center information-project relative"  v-bind:style="{ backgroundImage: 'url('+this.info.image+')' }">
  <div class="absolute top-0 left-0 w-full h-full bg-black/50 lg:opacity-0 hover-information-project flex flex-col justify-center items-center">
    <h1 class="text-base lg:text-xl text-white lg:w-[20vw] w-full p-8 lg:p-0 text-center">{{info.description}}</h1>
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
</style>