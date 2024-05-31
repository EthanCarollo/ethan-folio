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
        <div class="flex lg:w-[70vw] w-[90vw] mt-4 mb-8 lg:gap-6 gap-3 flex-wrap justify-center items-start">
            <div class="lg:w-[8vw] lg:h-[8vw] lg:hover:w-[12.5vw] hover:pb-14 flex justify-center duration-700 transition-all w-[20vw] h-[20vw] lg:p-5 p-3 bg-black/30 rounded-lg fill-white shadow-lg shadow-black/30 relative" v-for="tech in myTech.tech" >
                <div class = "absolute transition-all bg-black/70 p-3 duration-1000 opacity-0 hover:opacity-100 rounded-lg top-0 left-0 w-full h-full flex justify-center items-end shadow-black/30">
                    <p class = "text-white lg:text-xl text-lg text-wrap text-center">
                        {{  tech  }}
                    </p>
                </div>
                <div class="h-full aspect-square">
                    <Icon :icon="tech"></Icon>
                </div>
            </div>
            
        </div>
        <h1 class ="mt-8 text-2xl text-white mb-4">// logiciels</h1>
        <div class="flex lg:w-[70vw] w-[90vw] mt-4 mb-8 lg:gap-6 gap-3 flex-wrap justify-center items-start">
            <div class="lg:w-[8vw] lg:hover:w-[12.5vw] hover:pb-14 flex justify-center transition-all lg:h-[8vw] duration-700 w-[20vw] relative h-[20vw] lg:p-5 p-3 bg-black/30 rounded-lg fill-white shadow-lg shadow-black/30" v-for="soft in myTech.soft" >
                <div class = "absolute transition-all bg-black/70 p-3 duration-1000 opacity-0 hover:opacity-100 rounded-lg top-0 left-0 w-full h-full flex justify-center items-end shadow-black/30">
                    <p class = "text-white lg:text-xl text-lg text-wrap text-center">
                        {{  soft  }}
                    </p>
                </div>
                <div class="h-full aspect-square">
                    <Icon :icon="soft"></Icon>
                </div>
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