<template>
    <div
        ref="cursor"
        class="custom-cursor"
        :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
    }"
    />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const cursor = ref(null)
const position = ref({ x: 0, y: 0 })

const updatePosition = (e) => {
    position.value = {
        x: e.clientX,
        y: e.clientY
    }
}

onMounted(() => {
    // Cacher le curseur par défaut
    document.body.style.cursor = 'none'

    // Écouter les mouvements de souris
    window.addEventListener('mousemove', updatePosition)
})

onUnmounted(() => {
    // Restaurer le curseur par défaut
    document.body.style.cursor = 'auto'

    // Nettoyer l'écouteur
    window.removeEventListener('mousemove', updatePosition)
})
</script>

<style scoped>
.custom-cursor {
    position: fixed;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: rgba(59, 130, 246, 0.6);
    border: 2px solid rgba(59, 130, 246, 1);
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: transform 0.1s ease;
    z-index: 9999;
    mix-blend-mode: difference;
}

.custom-cursor:hover {
    transform: translate(-50%, -50%) scale(1.5);
}
</style>