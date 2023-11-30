<template>
    <header class= "fixed flex-col flex gap-3 mt-6 ml-10 text-base z-50">
        <a v-thover="{ scale: 0.4 }" href="#home" class="text-white">01 - accueil</a>
        <a v-thover="{ scale: 0.4 }" href="#projets" class="text-white">02 - projets</a>
        <a v-thover="{ scale: 0.4 }" href="#techno" class="text-white">03 - technologies</a>
        <a v-thover="{ scale: 0.4 }" href="#contact" class="text-white">04 - contact</a>
    </header>
</template>

<style setup>
    header{
        font-family: "LiveMono";
    }
</style>