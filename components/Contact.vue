

<template>
    <div id ="contact" class ="w-full flex flex-col items-center text-white min-h-screen relative">
        <h1 class ="mt-8 text-2xl text-white mb-2">// contact</h1>
        <h1 class ="mt-2 text-lg text-white mb-2">Hello ! Je m'appelle Ethan et je suis passionné par le developpement</h1>
        <div class ="flex justify-center fill-white w-full p-2">
            <a target="_blank" v-thover="{ scale: 0.4 }" href="https://github.com/JackyTuneur" class="h-14 w-14 flex items-center fill-white">
                <Icon icon="linkedin"></Icon>
            </a>
            <a target="_blank" v-thover="{ scale: 0.4 }" href="https://www.linkedin.com/in/ethan-carollo-159332258/" class="h-14 w-14 flex items-center fill-white p-2">
                <Icon icon="github"></Icon>
            </a>
        </div>
    </div>
</template>

<style scoped>
#contact{
    font-family: "LiveMono";
}
</style>