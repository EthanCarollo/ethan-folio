<template>
    <div>
        <MouseTrail />
        <slot />
    </div>
</template>

<script setup lang="ts">
import MouseTrail from "../components/MouseTrail.vue";
</script>