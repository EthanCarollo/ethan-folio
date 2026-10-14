<template>
    <header class="border-b border-border bg-background">
        <div class="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-x-5 px-4 py-2 sm:px-6">
            <NuxtLink :to="localePath('/')" class="order-1 shrink-0 text-base font-bold text-foreground no-underline">
                Ethan Carollo
            </NuxtLink>

            <nav aria-label="Main navigation" class="order-3 flex w-full gap-5 overflow-x-auto pb-1 text-sm text-foreground/80 md:order-2 md:w-auto md:pb-0">
                <NuxtLink :to="localePath('/#about')" class="hover:text-link">{{ $t('hero.about') }}</NuxtLink>
                <NuxtLink :to="localePath('/#projects')" class="hover:text-link">{{ $t('hero.projects') }}</NuxtLink>
                <NuxtLink :to="localePath('/#notes')" class="hover:text-link">{{ $t('hero.notes') }}</NuxtLink>
                <NuxtLink :to="localePath('/#contact')" class="hover:text-link">{{ $t('hero.contact') }}</NuxtLink>
            </nav>

            <div class="order-2 ml-auto flex shrink-0 items-center gap-3 md:order-3">
                <NuxtLink
                    :to="localePath('/chat')"
                    class="rounded border border-border px-3 py-2 text-sm font-medium text-link no-underline hover:bg-muted"
                >
                    /chat
                </NuxtLink>
                <LocaleChip :is-scrolled="true" />
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
