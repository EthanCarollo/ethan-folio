<template>
    <div>
        <Cursor />
        <slot />
    </div>
</template>

<script setup lang="ts">
import Cursor from "../components/Cursor.vue";
</script>