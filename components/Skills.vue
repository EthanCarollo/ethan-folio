<template>
    <section class="py-20 px-4 font-mono">
        <div class="max-w-3xl mx-auto">
            <div class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60">$ cd skills</div>
                <div class="text-foreground/60">$ ls</div>
                <div class="text-foreground/70 mt-2 space-y-1">
                    <div>languages.txt  tools.txt</div>
                </div>
            </div>

            <div class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60">$ cat languages.txt</div>
                <div class="text-foreground/70 mt-2">
                    <div class="space-y-1">
                        <div v-for="(skill, index) in skills" :key="index" class="pl-4">
                            - {{ skill }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-1 text-sm">
                <div class="text-foreground/60">$ cat tools.txt</div>
                <div class="text-foreground/70 mt-2">
                    <div class="space-y-1">
                        <div v-for="(tool, index) in tools" :key="index" class="pl-4">
                            - {{ tool }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const skills = [
    "Vue", "Nuxt", "TypeScript", "Kotlin", "Python", "Three.js", 
    "Swift", "P5.js", "Node.js", "Express", "PostgreSQL", "PHP", 
    "Gleam", "Ruby", "Strapi", "WordPress"
];

const tools = [
    "Git", "GitHub Actions", "Docker", "Coolify", "Unity", "Ubuntu"
];
</script>

<style scoped>
/* Component styles */
</style>
