<template>
    <div class="scene" @click="rotateBar">
        <div class="floater">
            <div class="bar" :class="{ 'is-rotating': isRotating }" :style="barStyle">
                <div class="face front">
                    <div class="content">{{ getFaceText(0) }}</div>
                </div>
                <div class="face bottom">
                    <div class="content">{{ getFaceText(1) }}</div>
                </div>
                <div class="face back">
                    <div class="content">{{ getFaceText(2) }}</div>
                </div>
                <div class="face top">
                    <div class="content">{{ getFaceText(3) }}</div>
                </div>
                <div class="face left"></div>
                <div class="face right"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type PropType } from 'vue';

const { t } = useI18n();

const props = defineProps({
    texts: {
        type: Array as PropType<string[]>,
        default: () => []
    }
});

const rotIndex = ref(0);
const isRotating = ref(false);

const getFaceText = (offset: number) => {
    // Sequence when rotating X+90 is: Front -> Bottom -> Back -> Top
    // 0: Front
    // 1: Bottom
    // 2: Back
    // 3: Top
    if (!props.texts.length) return '';
    return props.texts[offset % props.texts.length];
};

const rotationX = ref(25);
const rotationY = ref(-15);
const rotationZ = ref(-5);
const mouseSkewX = ref(0);
const mouseSkewY = ref(0);
const scrollOffsetY = ref(0);
const scrollOffsetZ = ref(0);

const handleMouseMove = (e: MouseEvent) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX - innerWidth / 2) / innerWidth;
    const y = (e.clientY - innerHeight / 2) / innerHeight;

    // Parallax effect: tilt the bar slightly based on mouse position
    mouseSkewY.value = x * 10; // Rotate Y based on Mouse X
    mouseSkewX.value = -y * 10; // Rotate X based on Mouse Y
};

const handleScroll = () => {
    const scrollY = window.scrollY;
    // Descent in 3 dimensions effect
    // Move down (Y) and back (Z) as user scrolls
    scrollOffsetY.value = scrollY * 0.5;
    scrollOffsetZ.value = -scrollY * 0.5; // Move back into screen
};

let autoRotateInterval: ReturnType<typeof setInterval>;

onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Auto swap every 10 seconds
    autoRotateInterval = setInterval(() => {
        rotateBar();
    }, 10000);
});

onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('scroll', handleScroll);
    if (autoRotateInterval) clearInterval(autoRotateInterval);
});

const barStyle = computed(() => {
    return {
        // Compose transforms: translate for position/scroll, then rotate
        // Note: Translation needs to be applied before or after rotation depending on desired effect.
        // For "descending", it's usually world space, so applied first or on wrapper.
        // Here we apply directly. TranslateY moves it down screen. TranslateZ moves it deeper.
        transform: `translateY(${scrollOffsetY.value}px) translateZ(${scrollOffsetZ.value}px) rotateX(${rotationX.value + mouseSkewX.value}deg) rotateY(${rotationY.value + mouseSkewY.value}deg) rotateZ(${rotationZ.value}deg)`
    };
});

const rotateBar = () => {
    rotationX.value += 90;
    rotIndex.value++;
};

</script>

<style scoped>
.scene {
    width: 300px;
    /* Mobile width */
    height: 90px;
    perspective: 1200px;
    cursor: pointer;
    margin: 20px auto;
}

@media (min-width: 640px) {
    .scene {
        width: 600px;
        /* Increased width */
        height: 120px;
        /* Increased height */
    }
}

.floater {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation: float 6s ease-in-out infinite;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px) rotateZ(0deg);
    }

    50% {
        transform: translateY(-5px) rotateZ(1deg);
    }
}

.bar {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.face {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-family: monospace;
    font-size: 1.5rem;
    /* Larger font */
    backface-visibility: hidden;
    /* Default border and colors removed from general class, handled by specific face classes below */
}

/* Dimensions */
/* Setup for a rectangular prism: Width=W, Height=H, Depth=D */
/* Here, H = D = 90px (or 120px). W = 100% */
/* We need to define depth explicitly for CSS transforms */

/* Faces Colors */
.face.front,
.face.back {
    width: 100%;
    height: 100%;
}

/* Alternating themes */
/* Front (0): Inverted (White bg, Black text) */
.face.front {
    background: theme('colors.foreground');
    color: theme('colors.background');
    /* Removed border */
    font-size: 2.5rem;
    /* Larger font for the name */
    letter-spacing: -0.05em;
}

/* Bottom (1): Default (Black bg, White text) */
.face.bottom {
    background: theme('colors.background');
    color: theme('colors.foreground');
    border: 2px solid theme('colors.background');
}

.face.front {
    background: theme('colors.foreground');
    color: theme('colors.background');
    border: 2px solid theme('colors.background');
}

/* Back (2): Inverted */
.face.back {
    background: theme('colors.foreground');
    color: theme('colors.background');
    border: 2px solid theme('colors.background');
}

/* Top (3): Default */
.face.top {
    background: theme('colors.background');
    color: theme('colors.foreground');
    border: 2px solid theme('colors.background');
}

.face.front,
.face.back {
    width: 100%;
    height: 100%;
}

.face.top,
.face.bottom {
    width: 100%;
    height: var(--depth);
}


.face.left,
.face.right {
    width: 60px;
    /* Depth */
    height: 100%;
}

@media (min-width: 640px) {

    .face.left,
    .face.right {
        width: 70px;
    }
}

/* Transforms */
/* Assuming depth = height (square profile) */
/* Translate Z should be half of depth */
/* Depth is dynamic with media query, so we might need CSS vars */

.scene {
    --depth: 90px;
}

@media (min-width: 640px) {
    .scene {
        --depth: 120px;
    }
}

.face.front {
    transform: translateZ(calc(var(--depth) / 2));
}

.face.back {
    transform: rotateX(180deg) translateZ(calc(var(--depth) / 2));
}

.face.right {
    right: 0;
    transform: rotateY(90deg) translateZ(calc(var(--depth) / 2));
    /* Right face needs to be shifted by (width - depth)/2? No, standard box mapping */
    /* Wait, for non-cube, right face is at right edge. */
    right: calc((var(--depth) - 100%) / 2);
    /* Actually center it then push? */
    /* Easier way: transform-origin center. */
    /* The side faces are tricky with variable width. */
    /* Let's stick to standard box model: right face is at X = Width/2, rotated 90degY. */
    transform: rotateY(90deg) translateZ(calc(150px));
    /* This depends on Width! */
    /* CSS Cuboid with percentages is hard. */
}

/* Alternative: Use specific pixel widths in component? Or rely on calculated properties? */
/* Let's try CSS variables for width too OR use a fixed width container centered via flex */

/* Better Layout for faces */
.face.front {
    transform: rotateY(0deg) translateZ(calc(var(--depth) / 2));
}

.face.back {
    transform: rotateX(180deg) translateZ(calc(var(--depth) / 2));
}

/* Top and Bottom need rotation around X */
.face.top {
    transform: rotateX(90deg) translateZ(calc(var(--depth) / 2));
}

.face.bottom {
    transform: rotateX(-90deg) translateZ(calc(var(--depth) / 2));
}

/* Sides are hard with variable width.
   Let's just hide left/right faces for now or make them black. 
   Usually "sticks" viewable from front don't show sides much.
   The user image shows a long bar. The ends might be negligible.
*/

.face.left,
.face.right {
    display: none;
    /* Simplify for now to avoid sizing issues */
}
</style>
