<script>
import projets from '~/public/data/projects.json';

export default{
    data(){
        return{
            myProjects: projets
        }
    }
}
</script>

<template>
    <div id = "projets" class ="w-full flex flex-col items-center min-h-screen z-20 relative">
        <h1 class ="mt-8 text-2xl text-white mb-4">// projets</h1>
        <div class="grid gap-8 grid-cols-4 w-[70vw] mt-4 mb-8">
            <Project v-for="_project in myProjects.data" :project="_project"></Project>
        </div>
    </div>
</template>

<style scoped>

h1{
    font-family: "LiveMono";
}

</style>