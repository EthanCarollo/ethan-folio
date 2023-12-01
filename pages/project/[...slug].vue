<script>
import projets from '~/src/data/projects.json';

export default{
  layout: 'default',
  data(){
    return{
      projects: projets.data
    }
  },
  computed:{
    project(){
      for (let i = 0; i < this.projects.length; i++) {
        if(this.projects[i].id == this.$route.params.slug){
          return this.projects[i]
        }
      }
    }
  }
}

</script>

<template>
  <div>
  <NuxtLink to="/" v-thover="{ scale: 0.5 }" class ="fixed left-8 top-10 w-12 fill-white z-20">
    <IconsLeftIcon></IconsLeftIcon>
  </NuxtLink>
  <div class="min-h-screen flex flex-col items-center" v-thover="{ scale: 1 }">
    <div class="w-full h-[50vh] bg-cover bg-center relative project_card_inner shadow-lg shadow-black/30 flex justify-center items-center"
         :class="[this.project.id + 'inner']" v-bind:style="{ backgroundImage: 'url('+this.project.image+')' }">
      <div class="w-full h-full absolute top-0 left-0 bg-black/50"></div>
      <h1 class="text-white text-6xl z-10 relative">{{this.project.title}}</h1>
      <div class ="absolute bottom-0 right-0 w-full flex justify-end p-3 gap-3">
        <h1 class="bg-white pl-4 pr-4 text-2xl p-1 ">{{ this.project.tag }}</h1>
      </div>
      <div class ="absolute bottom-0 left-0 w-full flex p-2 h-16 gap-3 fill-white">
        <Icon v-for="icon in project.icons" :icon="icon"></Icon>
      </div>
    </div>
    <div class="w-[60vw] text-white text-xl mt-8">
    {{ this.project.description }}
    </div>
    <div class = "flex gap-5 w-[90vw] mt-8 flex-wrap">
      <ProjectInformation v-for="info in project.projectinfos.slice(0,3)" :info="info"></ProjectInformation>
    </div>
    <div class = "flex flex-row-reverse gap-5 w-[90vw] mt-8 mb-8 flex-wrap">
      <ProjectInformation v-for="info in project.projectinfos.slice(3,6)" :info="info"></ProjectInformation>
    </div>
    <div class="w-[60vw] relative flex flex-col items-center z-30">
      <div class="w-full bg-amber-50 h-0.5 mb-8 mt-2"></div>
      <NuxtLink to="/"  class="text-white relative mb-8 text-white text-3xl">
        <h1 v-thover="{ scale: 0.4 }">retour a l'accueil</h1>
      </NuxtLink>
    </div>
  </div>
</div>

</template>

<style>

h1, div{
  font-family: "LiveMono";
}

</style>