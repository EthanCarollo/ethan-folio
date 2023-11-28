<script>
import technologies from '../data/technologies.json';
import Icon from '../components/Icon.vue';

export default{
    components:{
        Icon
    },
    data(){
        return{
            myTech: technologies
        }
    }
}
</script>

<template>
    <div id = "techno" class ="w-full flex flex-col items-center min-h-screen">
        <h1 class ="mt-8 text-2xl text-white mb-4">// technologies</h1>
        <div class="flex w-[70vw] mt-4 mb-8 gap-6 flex-wrap justify-center">
            <div class="w-[8vw] h-[8vw] p-5 bg-black/30 rounded-lg fill-white shadow-lg shadow-black/30" v-for="tech in myTech.tech" >
                <Icon :icon="tech"></Icon>
            </div>
            
        </div>
        <h1 class ="mt-8 text-2xl text-white mb-4">// logiciels</h1>
        <div class="flex w-[70vw] mt-4 mb-8 gap-6 flex-wrap justify-center">
            <div class="w-[8vw] h-[8vw] p-5 bg-black/30 rounded-lg fill-white shadow-lg shadow-black/30" v-for="soft in myTech.soft" >
                <Icon :icon="soft"></Icon>
            </div>
            
        </div>
    </div>
</template>

<style scoped>

h1{
    font-family: "LiveMono";
}

</style>