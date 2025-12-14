<template>
    <main class="min-h-screen">
        <Hero />
        <About />
        <Projects />
        <Contact />
    </main>
</template>

<script setup lang="ts">
useHead({
    title: 'Ethan Carollo - Polymorphic Developer',
    meta: [
        { name: 'description', content: 'Ethan Carollo, a polymorphic developer skilled in web and mobile applications, video games, and continuous delivery cycles.' },
        { name: 'keywords', content: 'Ethan Carollo, developer, web applications, mobile applications, video games, continuous delivery, Kotlin, Python, Nuxt, Unity' },
        { name: 'author', content: 'Ethan Carollo' }
    ]
})
</script>