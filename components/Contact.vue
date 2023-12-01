

<template>
    <div id ="contact" class ="w-full flex flex-col items-center text-white min-h-screen relative">
        <h1 class ="mt-8 text-2xl text-white mb-2 text-center">// contact</h1>
        <div class ="flex flex-col items-center justify-center w-full h-screen top-0 left-0 absolute">
            <h1 class ="mt-2 text-4xl text-white mb-1">ethan carollo</h1>
            <h1 class ="mt-2 text-lg text-white mb-1">etudiant en developpement web a l'ecole by cci campus gobelin</h1>
            <h1 class ="mt-1 text-base text-white mb-1">mail : ethancarollo@gmail.com</h1>
            <h1 class ="mt-1 text-base text-white mb-1">tel : 06.12.50.69.05</h1>
            <div class ="flex justify-center fill-white w-full p-2">
                <a target="_blank" v-thover="{ scale: 0.4 }"  href="https://www.linkedin.com/in/ethan-carollo-159332258/"  class="h-14 w-14 flex items-center fill-white">
                    <Icon icon="linkedin"></Icon>
                </a>
                <a target="_blank" v-thover="{ scale: 0.4 }" href="https://github.com/EthanCarollo" class="h-14 w-14 flex items-center fill-white p-2">
                    <Icon icon="github"></Icon>
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
#contact{
    font-family: "LiveMono";
}
</style>