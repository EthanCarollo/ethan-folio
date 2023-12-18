<script setup>
import projets from '~/src/data/projects.json';
const route = useRoute()

const project = projets.data.find((element) => element.id === route.params.slug[0]);


if(project === undefined){
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
    fatal:true
  })
}

  useSeoMeta({
    title: 'Ethan Carollo - ' + project.title,
    ogTitle: 'Ethan Carollo - ' + project.title,
    description: project.description,
    ogDescription: project.description,
    ogImage: project.ogimage
  })



definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div v-if="project !== undefined">
  <NuxtLink to="/" v-thover="{ scale: 0.5 }" class ="fixed left-8 top-10 w-12 fill-white z-20">
    <IconsLeftIcon></IconsLeftIcon>
  </NuxtLink>
  <div class="min-h-screen flex flex-col items-center" v-thover="{ scale: 1 }">
    <div class="w-full h-[50vh] bg-cover bg-center relative project_card_inner shadow-lg shadow-black/30 flex justify-center items-center"
         :class="[project.id + 'inner']" v-bind:style="{ backgroundImage: 'url('+project.image+')' }">
      <div class="w-full h-full absolute top-0 left-0 bg-black/50"></div>
      <h1 class="text-white text-4xl text-center lg:text-6xl z-10 relative">{{project.title}}</h1>
      <div class ="absolute bottom-0 right-0 w-full flex justify-end p-3 gap-3">
        <h1 class="bg-white pl-4 pr-4 text-2xl p-1 ">{{ project.tag }}</h1>
      </div>
      <div class ="absolute bottom-0 left-0 w-full flex p-2 h-16 gap-3 fill-white">
        <Icon v-for="icon in project.icons" :icon="icon"></Icon>
      </div>
    </div>
    <div class="lg:w-[60vw] w-[90vw] text-white text-base text-center lg:text-left lg:text-xl mt-8">
    {{ project.description }}
    </div>
    <div class = "flex lg:flex-row flex-col gap-5 w-[90vw] mt-8 flex-wrap">
      <ProjectInformation v-for="info in project.projectinfos.slice(0,3)" :info="info"></ProjectInformation>
    </div>
    <div class = "flex lg:flex-row-reverse flex-col  gap-5 w-[90vw] mt-8 mb-8 flex-wrap">
      <ProjectInformation v-for="info in project.projectinfos.slice(3,6)" :info="info"></ProjectInformation>
    </div>
    <div v-if="project.ps">
      <h1 class="lg:w-[60vw] w-[90vw] text-base lg:text-lg lg:text-left text-center text-white mt-2 mb-5">{{ project.ps }}</h1>
    </div>
    <div class="w-[60vw] relative flex flex-col items-center z-30">
      <div class="w-full bg-amber-50 h-0.5 mb-8 mt-2"></div>
      <NuxtLink to="/"  class="text-white relative mb-8 text-white text-3xl select-none">
        <h1 v-thover="{ scale: 0.4 }" class= "select-none lg:text-left text-center">retour a l'accueil</h1>
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