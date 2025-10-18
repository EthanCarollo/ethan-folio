<template>
    <section
        class="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden bg-white"
        @mousemove="handleMouseMove"
        :class="{ 'opacity-0': !isLoaded }"
        style="transition: opacity 1s ease-out"
    >
        <!-- Animated Decorative elements - subtle parallax movement -->
        <div
            ref="shape1"
            class="absolute top-20 right-20 w-32 h-32 bg-yellow-400 border-4 border-black rotate-12 cursor-pointer  hover:scale-110 animate-float"
            @click="triggerShapeAnimation($event, 0)"
            :style="{
                transform: `translate(${mouseVelocity.x * 15}px, ${mouseVelocity.y * 15}px) rotate(${12 + shapeRotations[0]}deg)`,
                transition: 'transform 0.3s ease-out'
            }"
        />
        <div
            ref="shape2"
            class="absolute bottom-40 left-10 w-24 h-24 bg-pink-400 border-4 border-black -rotate-6 cursor-pointer hover:scale-110 animate-float-delayed"
            @click="triggerShapeAnimation($event, 1)"
            :style="{
                transform: `translate(${mouseVelocity.x * -20}px, ${mouseVelocity.y * -20}px) rotate(${-6 + shapeRotations[1]}deg)`,
                transition: 'transform 0.3s ease-out'
            }"
        />
        <div
            ref="shape3"
            class="absolute top-1/2 right-[10%] w-16 h-16 bg-cyan-400 border-4 border-black rotate-45 cursor-pointer hover:scale-110 animate-float-slow"
            @click="triggerShapeAnimation($event, 2)"
            :style="{
                transform: `translate(${mouseVelocity.x * 12}px, ${mouseVelocity.y * 12}px) rotate(${45 + shapeRotations[2]}deg)`,
                transition: 'transform 0.3s ease-out'
            }"
        />

        <!-- Additional floating shapes -->
        <div
            class="absolute top-10 left-10 w-20 h-20 bg-yellow-400/50 border-4 border-black -rotate-12 animate-float-delayed pointer-events-none"
            :style="{
                transform: `translate(${mouseVelocity.x * -8}px, ${mouseVelocity.y * -8}px) rotate(-12deg)`,
                transition: 'transform 0.3s ease-out'
            }"
        />
        <div
            class="absolute bottom-10 right-10 w-12 h-12 bg-pink-400/50 border-4 border-black rotate-[30deg] animate-float pointer-events-none"
            :style="{
                transform: `translate(${mouseVelocity.x * 10}px, ${mouseVelocity.y * 10}px) rotate(30deg)`,
                transition: 'transform 0.3s ease-out'
            }"
        />

        <div class="max-w-5xl mx-auto text-center relative z-10">
            <div
                class="inline-block mb-6 px-6 py-2 bg-yellow-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-1 transition-all duration-300 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:rotate-2 cursor-pointer animate-bounce-subtle"
                @mouseenter="tagHovered = true"
                @mouseleave="tagHovered = false"
            >
                <p class="font-mono text-sm font-bold text-black">
                    {{ tagHovered ? "< CLICK_ME />" : "< DEVELOPER />" }}
                </p>
            </div>

            <h1
                class="text-6xl md:text-8xl font-black mb-6 leading-none text-balance transition-all duration-500"
            >
                <span
                    v-for="(char, index) in name"
                    :key="index"
                    class="inline-block transition-all duration-300 hover:-rotate-12 hover:text-yellow-400 cursor-default"
                    :style="{
                        animationDelay: `${index * 0.05}s`,
                        opacity: isLoaded ? 1 : 0
                    }"
                    @mouseenter="bounceChar(index)"
                >
                    {{ char === ' ' ? '\u00A0' : char }}
                </span>
            </h1>

            <div
                class="inline-block mb-8 px-8 py-4 bg-pink-400 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] -rotate-1 transition-all duration-300 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 cursor-pointer"
                @click="cycleTitle"
            >
                <p class="text-xl md:text-2xl cursor-pointer font-bold text-black transition-all duration-300">
                    {{ currentTitle }}
                </p>
            </div>

            <p class="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed text-black/80">
                I build diverse applications using Kotlin, Python, and Nuxt. Passionate about game development, machine learning, and creating innovative solutions.
            </p>

            <div class="flex flex-wrap gap-4 justify-center mb-12">
                <a href="#projects"
                    class="px-6 py-3 bg-black text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-lg inline-flex items-center gap-2"
                >
                    View My Work
                    <ArrowRightIcon class="w-5 h-5" />
                </a>
                <button
                    class="px-6 py-3 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all font-bold text-lg"
                >
                    Get In Touch
                </button>
            </div>

            <div class="flex gap-4 justify-center">
                <a
                    href="https://github.com/EthanCarollo"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="p-3 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                    <GithubIcon class="w-6 h-6" />
                    <span class="sr-only">GitHub</span>
                </a>
                <a
                    href="mailto:alex@example.com"
                    class="p-3 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                    <LucideMail class="w-6 h-6" />
                    <span class="sr-only">Email</span>
                </a>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { GithubIcon, LucideMail, ArrowRightIcon } from 'lucide-vue-next';

const name = 'ETHAN CAROLLO';
const tagHovered = ref(false);
const currentTitleIndex = ref(0);
const shapeRotations = ref([0, 0, 0]);
const mouseVelocity = ref({ x: 0, y: 0 });
const lastMousePos = ref({ x: 0, y: 0 });
const isLoaded = ref(false);

const titles = [
    "Polymorphic Developer & Master's Student",
    'Game Dev Enthusiast & ML Explorer',
    'Code Craftsman & Problem Solver',
    'Kotlin • Python • Nuxt Developer'
];

const currentTitle = ref(titles[0]);

const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    const deltaX = clientX - lastMousePos.value.x;
    const deltaY = clientY - lastMousePos.value.y;

    mouseVelocity.value = {
        x: mouseVelocity.value.x * 0.8 + deltaX * 0.2,
        y: mouseVelocity.value.y * 0.8 + deltaY * 0.2
    };

    lastMousePos.value = { x: clientX, y: clientY };
};

const cycleTitle = () => {
    currentTitleIndex.value = (currentTitleIndex.value + 1) % titles.length;
    currentTitle.value = titles[currentTitleIndex.value];
};

const triggerShapeAnimation = (e: MouseEvent, index: number) => {
    shapeRotations.value[index] += 180;
    setTimeout(() => {
        shapeRotations.value[index] = 0;
    }, 300);
    createParticles(e.clientX, e.clientY);
};

const createParticles = (x: number, y: number) => {
    const colors = ['bg-yellow-400', 'bg-pink-400', 'bg-cyan-400'];
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = `absolute w-3 h-3 border-2 border-black ${colors[Math.floor(Math.random() * colors.length)]} pointer-events-none`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.transform = `translate(-50%, -50%)`;
        document.body.appendChild(particle);

        const angle = (Math.PI * 2 * i) / 6;
        const velocity = 100 + Math.random() * 50;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.animate(
            [
                { transform: 'translate(-50%, -50%) scale(1) rotate(0deg)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ],
            { duration: 600, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
        ).onfinish = () => particle.remove();
    }
};

let titleInterval: ReturnType<typeof setInterval>;
onMounted(() => {
    setTimeout(() => (isLoaded.value = true), 100);

});

onUnmounted(() => clearInterval(titleInterval));
</script>

<style scoped>
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
}

@keyframes float-delayed {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
}

@keyframes float-slow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

@keyframes bounce-subtle {
    0%, 100% { transform: translateY(0px) rotate(1deg); }
    50% { transform: translateY(-5px) rotate(1deg); }
}

.animate-float {
    animation: float 3s ease-in-out infinite;
}

.animate-float-delayed {
    animation: float-delayed 4s ease-in-out infinite;
}

.animate-float-slow {
    animation: float-slow 5s ease-in-out infinite;
}

.animate-bounce-subtle {
    animation: bounce-subtle 2s ease-in-out infinite;
}
</style>
