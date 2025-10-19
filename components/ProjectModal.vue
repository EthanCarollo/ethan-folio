<script setup lang="ts">
import { Github, ExternalLink } from 'lucide-vue-next';

defineProps<{
    project: any
}>();

defineEmits<{
    close: []
}>();
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div
                v-if="project"
                @click="$emit('close')"
                class="fixed inset-0 bg-foreground/80 flex items-center justify-center p-4 z-50 cursor-pointer"
            >
                <div
                    @click.stop
                    class="bg-card border-4 border-foreground shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] max-w-4xl w-full max-h-[90vh] overflow-y-auto cursor-pointer relative"
                >
                    <!-- Close Button -->
                    <button
                        @click="$emit('close')"
                        class="absolute top-4 right-4 w-10 h-10 cursor-pointer bg-foreground text-background border-4 border-foreground hover:bg-destructive hover:border-destructive transition-colors font-black text-xl z-10"
                    >
                        ✕
                    </button>

                    <div class="grid md:grid-cols-5 gap-0">
                        <!-- Project Image -->
                        <div class="md:col-span-2 relative overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-foreground">
                            <div :class="`${project.color} absolute inset-0 opacity-20`"></div>
                            <div
                                class="relative h-64 md:h-full flex items-center justify-center p-8 bg-center bg-cover"
                                :style="'background-image: url('+ project.image + ')'"
                            >
                            </div>
                        </div>

                        <!-- Project Content -->
                        <div class="md:col-span-3 p-6 md:p-8">
                            <div class="flex items-start justify-between mb-4">
                                <h3 class="text-3xl md:text-4xl font-black text-foreground pr-12">{{ project.title }}</h3>
                                <div
                                    v-if="project.year"
                                    :class="`${project.color} border-2 border-foreground px-3 py-1 rotate-2 hidden md:block`"
                                >
                                    <span class="font-black text-xs">{{ project.year }}</span>
                                </div>
                            </div>

                            <p class="text-foreground/80 leading-relaxed mb-6 text-lg">{{ project.description }}</p>

                            <div class="mb-6">
                                <div class="inline-block px-3 py-1 bg-muted border-2 border-foreground mb-3">
                                    <span class="font-black text-xs">TECH STACK</span>
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    <span
                                        v-for="(tag, tagIndex) in project.tags"
                                        :key="tagIndex"
                                        class="px-4 py-2 bg-background border-2 border-foreground font-mono text-sm font-bold text-foreground hover:translate-x-1 hover:translate-y-1 transition-transform"
                                    >
                                        {{ tag }}
                                    </span>
                                </div>
                            </div>

                            <div class="flex flex-wrap gap-3">
                                <a
                                    :href="project.github"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="px-6 py-3 bg-foreground text-background border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all font-black inline-flex items-center gap-2"
                                >
                                    <Github class="w-5 h-5" />
                                    VIEW CODE
                                </a>
                                <a
                                    v-if="project.link"
                                    :href="project.link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    :class="`px-6 py-3 ${project.color} text-foreground border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all font-black inline-flex items-center gap-2`"
                                >
                                    <ExternalLink class="w-5 h-5" />
                                    LINK
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
    transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
    transform: scale(0.9);
}
</style>