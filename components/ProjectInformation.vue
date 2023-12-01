<script>

export default {
  props:[
      "info"
  ]
}

</script>

<template>
<div class="shadow-lg shadow-black/30 w-[25vw] h-[20vw] bg-white hover:grow transition-all duration-700 bg-cover bg-center information-project relative"  v-bind:style="{ backgroundImage: 'url('+this.info.image+')' }">
  <div class="absolute top-0 left-0 w-full h-full bg-black/50 hover-information-project flex flex-col justify-center items-center">
    <h1 class="text-xl text-white w-[60%] text-center">{{info.description}}</h1>
  </div>
</div>
</template>

<style>
.hover-information-project{
  opacity: 0;
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