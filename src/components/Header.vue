<script>
import { RouterLink } from 'vue-router';

export default{
    components:{
        RouterLink
    }
}

</script>

<template>
    <header class= "fixed flex-col flex gap-3 mt-6 ml-10 text-base z-50">
        <RouterLink v-thover="{ scale: 0.4 }" to="/" class="text-white">01 - accueil</RouterLink>
        <RouterLink v-thover="{ scale: 0.4 }" to="/" class="text-white">02 - projets</RouterLink>
        <RouterLink v-thover="{ scale: 0.4 }" to="/" class="text-white">03 - technologies</RouterLink>
        <RouterLink v-thover="{ scale: 0.4 }" to="/" class="text-white">04 - contact</RouterLink>
    </header>
</template>

<style setup>
    header{
        font-family: "LiveMono";
    }


</style>