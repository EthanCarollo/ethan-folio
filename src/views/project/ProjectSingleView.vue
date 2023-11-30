<script>
import projets from '../../data/projets.json';
import leftIcon from '../../components/icons/leftIcon.vue'
import { RouterLink, RouterView } from 'vue-router';
import Icon from '../../components/Icon.vue';

export default{
    components:{
    leftIcon,
    RouterView,
    RouterLink,
    Icon
},
    data(){
        return{
            projects: projets.data
        }
    },
    computed:{
        project(){
            for (let i = 0; i < this.projects.length; i++) {
                if(this.projects[i].id == this.$route.params.project){
                    return this.projects[i]
                }
            }
        }
    }
}

</script>

<template>
        <RouterLink to="/" v-thover="{ scale: 0.4 }" class ="absolute left-8 top-10 w-12 fill-white z-20">
            <leftIcon></leftIcon>
        </RouterLink>
    <div class="min-h-screen" v-thover="{ scale: 1 }">
        <div class="w-full h-[50vh] bg-cover bg-center relative project_card_inner shadow-lg shadow-black/30 flex justify-center items-center" 
        :class="[this.project.id + 'inner']" v-bind:style="{ backgroundImage: 'url('+this.project.image+')' }">
        <div class="w-full h-full absolute top-0 left-0 bg-black/50"></div>
            <h1 class="text-white text-6xl z-10 relative">{{this.project.title}}</h1>
            <div class ="absolute bottom-0 right-0 w-full flex justify-end p-2 h-16 gap-3 fill-white stroke-white">
                <h1 class="bg-white pl-4 pr-4 text-2xl p-1">{{ this.project.tag }}</h1>
            </div>
            <div class ="absolute bottom-0 left-0 w-full flex p-2 h-16 gap-3 fill-white">
                <Icon v-for="icon in project.icons" :icon="icon"></Icon>
            </div>
        </div>
    </div>
</template>

<style>

h1{
    font-family: "LiveMono";
}

</style>