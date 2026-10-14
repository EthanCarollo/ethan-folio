<script setup lang="ts">
const appConfig = useAppConfig()
const contactEmail = appConfig.contactEmail
</script>

<template>
    <section id="contact" class="px-4 py-14 sm:px-6 sm:py-16">
        <div class="mx-auto max-w-6xl">
            <h2 class="section-title">{{ $t('hero.contact') }}</h2>
            <p class="mt-2 max-w-2xl text-muted-foreground">{{ $t('contactSection.description') }}</p>

            <div class="mt-7 flex flex-col gap-6 sm:flex-row sm:gap-16">
                <div>
                    <h3 class="text-sm font-semibold text-foreground">{{ $t('contactSection.email') }}</h3>
                    <a :href="`mailto:${contactEmail}`" class="mt-1 inline-block text-link underline underline-offset-2">
                        {{ contactEmail }}
                    </a>
                </div>
                <div>
                    <h3 class="text-sm font-semibold text-foreground">{{ $t('contactSection.location') }}</h3>
                    <p class="mt-1 text-muted-foreground">{{ $t('contactSection.city') }}</p>
                </div>
            </div>
        </div>
    </section>
</template>
