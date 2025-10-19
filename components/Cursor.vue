<template>
    <div
        ref="cursor"
        class="custom-cursor"
        :class="{ 'is-pointer': isPointer }"
        :style="{
            left: `${position.x}px`,
            top: `${position.y}px`
        }"
    >
        <img
            :src="currentCursor"
            alt=""
            draggable="false"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const normalCursor = '/cursors/normal.png'
const pointerCursor = '/cursors/pointer.png'

const cursor = ref(null)
const position = ref({ x: 0, y: 0 })
const isPointer = ref(false)
const currentCursor = ref(normalCursor)

const updatePosition = (e) => {
    position.value = {
        x: e.clientX,
        y: e.clientY
    }

    // Check if hovering over a clickable element
    const target = e.target
    const isClickable = target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.onclick !== null ||
        target.style.cursor === 'pointer' ||
        target.className.includes('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'

    isPointer.value = isClickable
    currentCursor.value = isClickable ? pointerCursor : normalCursor
}

onMounted(() => {
    document.body.style.cursor = 'none'

    const style = document.createElement('style')
    style.innerHTML = '* { cursor: none !important; }'
    document.head.appendChild(style)

    window.addEventListener('mousemove', updatePosition)
})

onUnmounted(() => {
    document.body.style.cursor = 'auto'
    window.removeEventListener('mousemove', updatePosition)
})
</script>

<style scoped>
.custom-cursor {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
}

.custom-cursor img {
    display: block;
    width: 48px;
    height: auto; /* Maintains aspect ratio */
    pointer-events: none;
    user-select: none;
}
</style>