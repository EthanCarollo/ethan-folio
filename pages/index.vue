<script setup lang="ts">
useSeoMeta({
  title: 'Ethan Carollo - Portfolio',
  ogTitle: 'Ethan Carollo - Portfolio',
  description: 'Étudiant en développement web avec un interet pour les jeux vidéos et les nouvelles technologies.',
  ogDescription: 'Étudiant en développement web avec un interet pour les jeux vidéos et les nouvelles technologies.',
  ogImage: "/image/ethan-carollo-open-graph.png"
})
</script>

<template>
    <div>
    <Header></Header>
    <SplashScreen></SplashScreen>
    <div id = "home" class ="w-screen h-screen relative z-0 pointer-events-none">
    </div>
    <ProjectsList></ProjectsList>
    <Technologies></Technologies>
    <Contact></Contact>
</div>
</template>