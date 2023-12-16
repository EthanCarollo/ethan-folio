<template>
    <header class= "fixed flex-col gap-3 mt-6 ml-10 text-base z-50 hidden lg:flex">
        <a v-thover="{ scale: 0.4 }" href="#home" class="text-white">01 - accueil</a>
        <a v-thover="{ scale: 0.4 }" href="#projets" class="text-white">02 - projets</a>
        <a v-thover="{ scale: 0.4 }" href="#techno" class="text-white">03 - technologies</a>
        <a v-thover="{ scale: 0.4 }" href="#contact" class="text-white">04 - contact</a>
    </header>
    <header class= "fixed bottom-8 left-0 w-[100vw] justify-center z-50 flex lg:hidden">
        <div class="bg-slate-800 flex p-2 gap-4 rounded-full pr-4 pl-4">
            <a href="#home" class="bg-white text-center align-middle rounded-full w-12 h-12"></a>
            <a href="#projets" class="bg-white text-center align-middle rounded-full w-12 h-12"></a>
            <a href="#techno" class="bg-white text-center align-middle rounded-full w-12 h-12"></a>
            <a href="#contact" class="bg-white text-center align-middle rounded-full w-12 h-12"></a>
        </div>
    </header>
</template>

<style setup>
    header{
        font-family: "LiveMono";
    }
</style>