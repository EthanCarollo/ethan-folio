<template>
    <section class="py-20 px-4 bg-muted" id="about">
        <div class="max-w-5xl mx-auto">
            <div class="inline-block mb-12 px-6 py-3 bg-accent border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-1 hover:-rotate-1 transition-transform">
                <h2 class="text-4xl md:text-5xl font-black text-foreground">ABOUT ME</h2>
            </div>

            <div class="grid md:grid-cols-2 gap-8">
                <div class="bg-card border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
                    <h3 class="text-2xl font-black mb-4 text-foreground">Who I Am</h3>
                    <p class="text-foreground/80 leading-relaxed mb-4">
                        I'm Ethan Carollo, a polymorphic developer and a Master's student at Annecy Gobelins. I work with a variety of languages, including Kotlin for Android and Python for machine learning. I also love Nuxt and spend my free time developing games with Unity.
                    </p>
                    <p class="text-foreground/80 leading-relaxed">
                        When I'm not coding, you'll find me working on my games at <a href="https://games.ethan-folio.fr" class="text-primary underline">games.ethan-folio.fr</a> or exploring new technologies.
                    </p>
                </div>

                <div class="bg-card border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
                    <h3 class="text-2xl font-black mb-4 text-foreground">What I Do</h3>
                    <ul class="space-y-3">
                        <li v-for="(item, index) in items" :key="index" class="flex items-center gap-3">
                            <span class="inline-block w-6 h-6 bg-primary border-2 border-foreground flex-shrink-0 mt-1" />
                            <span class="text-foreground/80 leading-relaxed mt-[2px]">{{ item }}</span>
                        </li>
                    </ul>
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
