<script>
import projets from '~/src/data/projects.json';

export default{
    data(){
        return{
            myProjects: projets
        }
    }
}
</script>

<template>
  <div class ="w-full flex flex-col items-center z-20 relative">

    <div class="w-[60vw] bg-amber-50 h-0.5 mb-4 mt-4 mt-2"></div>
  </div>
    <div id = "projets" class ="w-full flex flex-col items-center min-h-screen z-20 relative">
        <h1 class ="mt-8 text-2xl text-white mb-4">// projets</h1>
        <div class="grid gap-8 lg:grid-cols-4 grid-cols-1 lg:w-[70vw] w-[90vw] mt-4 mb-8">
            <Project v-for="_project in myProjects.data" :project="_project"></Project>
        </div>
      <div class="w-[60vw] bg-amber-50 h-0.5 mb-4 mt-4 mt-2"></div>
    </div>
</template>

<style scoped>

h1{
    font-family: "LiveMono";
}

</style>