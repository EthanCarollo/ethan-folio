<template>
    <div ref="appContainer" class="mouse-parallax-container">
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const appContainer = ref(null);
const mousePos = ref({ x: 0, y: 0 });
const targetOffset = ref({ x: 0, y: 0 });
const currentOffset = ref({ x: 0, y: 0 });
let animationFrameId = null;

const handleMouseMove = (e) => {
    if (typeof window === 'undefined') return;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Calculate offset from center (-1 to 1 range)
    const offsetX = (e.clientX - centerX) / centerX;
    const offsetY = (e.clientY - centerY) / centerY;
    
    // Set target with max movement
    targetOffset.value = {
        x: offsetX * 15, // Max 15px movement
        y: offsetY * 15
    };
    
    mousePos.value = { x: e.clientX, y: e.clientY };
};

const animate = () => {
    // Spring physics for smooth following
    const spring = 0.1;
    const damping = 0.9;
    
    const dx = targetOffset.value.x - currentOffset.value.x;
    const dy = targetOffset.value.y - currentOffset.value.y;
    
    currentOffset.value.x += dx * spring;
    currentOffset.value.y += dy * spring;
    
    // Apply damping
    currentOffset.value.x *= damping;
    currentOffset.value.y *= damping;
    
    if (appContainer.value) {
        appContainer.value.style.transform = `translate(${currentOffset.value.x}px, ${currentOffset.value.y}px)`;
    }
    
    animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
    if (typeof window !== 'undefined') {
        window.addEventListener('mousemove', handleMouseMove);
        animate();
    }
});

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', handleMouseMove);
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    }
});

useHead({
    title: 'Ethan Carollo - Polymorphic Developer',
    meta: [
        { name: 'description', content: 'Ethan Carollo, a polymorphic developer skilled in web and mobile applications, video games, and continuous delivery cycles.' },
        { name: 'keywords', content: 'Ethan Carollo, developer, web applications, mobile applications, video games, continuous delivery, Kotlin, Python, Nuxt, Unity' },
        { name: 'author', content: 'Ethan Carollo' }
    ]
})
</script>

<style>
.mouse-parallax-container {
    transition: transform 0.1s ease-out;
    will-change: transform;
}
</style>
