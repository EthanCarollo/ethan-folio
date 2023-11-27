<script>
import projets from '../data/projets.json';
import Project from '../components/Project.vue';

export default{
    components:{
        Project
    },
    data(){
        return{
            myProjects: projets
        }
    },
    mounted(){
    console.log(this.myProjects.data);
    }
}
</script>

<template>
    <div class ="w-full flex flex-col items-center">
        <h1 class ="mt-8 text-2xl text-white mb-4">// mes projets</h1>
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