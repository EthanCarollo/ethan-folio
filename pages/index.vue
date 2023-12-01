<script setup lang="ts">
useHead({
  title: 'Ethan Carollo - Portfolio',
  meta: [
    { name: 'Portofolio développeur web', content: 'Étudiant en développement web avec un interet pour les jeux vidéos et les nouvelles technologies.' }
  ]
})
</script>

<template>
    <div>
    <Header></Header>
    <SplashScreen></SplashScreen>
    <div id = "home" class ="w-screen h-screen relative z-0">
    </div>
    <ProjectsList></ProjectsList>
    <Technologies></Technologies>
    <Contact></Contact>
</div>
</template>