<template>
    <section class="py-20 px-4 font-mono" id="about">
        <div class="max-w-3xl mx-auto">
            <div class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60">$ cat about.txt</div>
                <div class="text-foreground/70 mt-2 space-y-2">
                    <p>
                        I'm Ethan Carollo, a polymorphic developer and a Master's student at Annecy Gobelins. 
                        I work with a variety of languages, including Kotlin for Android and Python for machine learning. 
                        I also love Nuxt and spend my free time developing games with Unity.
                    </p>
                    <p>
                        When I'm not coding, you'll find me working on my games at 
                        <a href="https://games.ethan-folio.fr" class="text-foreground underline hover:text-foreground/70">games.ethan-folio.fr</a> 
                        or exploring new technologies.
                    </p>
                </div>
            </div>

            <div class="space-y-1 text-sm">
                <div class="text-foreground/60">$ cat what_i_do.txt</div>
                <div class="text-foreground/70 mt-2 space-y-1">
                    <div v-for="(item, index) in items" :key="index">
                        - {{ item }}
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const items = [
    "Develop web applications",
    "Create mobile applications",
    "Design and build video games",
    "Implement continuous delivery cycles",
]
</script>

<style scoped>
/* Component styles */
</style>
