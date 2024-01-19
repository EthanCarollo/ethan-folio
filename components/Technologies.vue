<script>
import technologies from '~/src/data/technologies.json';

export default{
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
        <div class="flex lg:w-[70vw] w-[90vw] mt-4 mb-8 lg:gap-6 gap-3 flex-wrap justify-center">
            <div class="lg:w-[8vw] lg:h-[8vw] w-[20vw] h-[20vw] lg:p-5 p-3 bg-black/30 rounded-lg fill-white shadow-lg shadow-black/30" v-for="tech in myTech.tech" >
                <Icon :icon="tech"></Icon>
            </div>
            
        </div>
        <h1 class ="mt-8 text-2xl text-white mb-4">// logiciels</h1>
        <div class="flex lg:w-[70vw] w-[90vw] mt-4 mb-8 lg:gap-6 gap-3 flex-wrap justify-center">
            <div class="lg:w-[8vw] lg:h-[8vw] w-[20vw] h-[20vw] lg:p-5 p-3 bg-black/30 rounded-lg fill-white shadow-lg shadow-black/30" v-for="soft in myTech.soft" >
                <Icon :icon="soft"></Icon>
            </div>
            
        </div>
    </div>
  <div class="w-full flex flex-col items-center">
    <div class="w-[60vw] bg-amber-50 h-0.5 mb-4 mt-2"></div>
  </div>
</template>

<style scoped>

h1{
    font-family: "LiveMono";
}

</style>