<template>
    <header class= "fixed flex-col gap-3 mt-6 ml-10 text-xl z-50 hidden lg:flex">
        <a v-thover="{ scale: 0.4 }" href="#home" class="text-white">01 - accueil</a>
        <a v-thover="{ scale: 0.4 }" href="#projets" class="text-white">02 - projets</a>
        <a v-thover="{ scale: 0.4 }" href="#techno" class="text-white">03 - technologies</a>
        <a v-thover="{ scale: 0.4 }" href="#contact" class="text-white">04 - contact</a>
    </header>
    <header class= "fixed bottom-12 right-0 w-[100vw] justify-center z-50 flex lg:hidden">
        <div class="bg-slate-800/50 flex shadow-lg p-2 gap-4 rounded-full pr-4 pl-4">
            <a href="#home" class="bg-white text-center align-middle rounded-full w-12 h-12 flex justify-center items-center">
              <IconsHomeIcon></IconsHomeIcon>
            </a>
            <a href="#projets" class="bg-white text-center align-middle rounded-full w-12 h-12 flex justify-center items-center">
              <IconsArchiveIcon></IconsArchiveIcon>
            </a>
            <a href="#techno" class="bg-white text-center align-middle rounded-full w-12 h-12 flex justify-center items-center">
              <IconsDevFileIcon></IconsDevFileIcon>
            </a>
            <a href="#contact" class="bg-white text-center align-middle rounded-full w-12 h-12 flex justify-center items-center">
              <IconsUserIcon></IconsUserIcon>
            </a>
        </div>
    </header>
</template>

<style setup>
    header{
        font-family: "LiveMono";
    }
</style>
<script setup lang="ts">
</script>