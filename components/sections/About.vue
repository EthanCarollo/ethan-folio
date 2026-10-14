<template>
    <section id="about" class="border-b border-border px-4 py-14 sm:px-6 sm:py-16">
        <div class="mx-auto grid max-w-6xl items-start gap-10 md:grid-cols-[minmax(0,1fr)_240px] md:gap-16">
            <div>
                <h2 class="section-title">{{ $t('about.title') }}</h2>
                <p class="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
                    {{ $t('about.backgroundText') }}
                </p>

                <div class="mt-8">
                    <h3 class="text-lg font-semibold text-foreground">{{ $t('about.interestsTitle') }}</h3>
                    <ul class="mt-3 list-inside list-disc space-y-2 text-muted-foreground">
                        <li v-for="item in items" :key="item">{{ item }}</li>
                    </ul>
                </div>

                <a
                    href="https://github.com/EthanCarollo"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="mt-6 inline-block font-medium text-link underline underline-offset-2 hover:text-link/80"
                >
                    GitHub
                </a>
            </div>

            <img
                src="/images/photome.webp"
                alt="Ethan Carollo"
                width="825"
                height="1024"
                loading="lazy"
                decoding="async"
                class="w-full max-w-xs rounded border border-border object-cover"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
const { tm, rt } = useI18n()

const items = computed(() => Object.values(tm('about.interests')).map(item => {
    return typeof item === 'string' ? item : rt(item)
}))
</script>
