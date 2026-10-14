<template>
    <section id="home" class="border-b border-border bg-muted/50">
        <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div class="max-w-3xl">
                <p class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {{ $t('hero.role1') }}
                </p>
                <h1 class="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    {{ $t('hero.name') }}
                </h1>
                <p class="mt-4 text-lg leading-8 text-muted-foreground">
                    {{ $t('hero.role2') }}
                </p>
                <div class="mt-8 flex flex-wrap gap-3">
                    <NuxtLink
                        :to="localePath('/#projects')"
                        class="rounded bg-link px-4 py-2.5 text-sm font-semibold text-white no-underline hover:bg-link/90"
                    >
                        {{ $t('hero.projects') }}
                    </NuxtLink>
                    <NuxtLink
                        :to="localePath('/#contact')"
                        class="rounded border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground no-underline hover:bg-muted"
                    >
                        {{ $t('hero.contact') }}
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
