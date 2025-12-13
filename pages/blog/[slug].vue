<template>
    <div class="min-h-screen flex">
        <!-- Added TableOfContents component fixed on the left -->
        <ContentTableOfContents />

        <!-- Adjusted main content with left margin to account for TOC -->
        <div class="flex-1 px-4 py-8 md:py-12 ml-64">
            <div v-if="blogPost" class="max-w-4xl mx-auto">

                <!-- Blog Post Info -->
                <div class="space-y-6 mb-8">
                    <div class="text-sm">
                        <div class="text-foreground/60 mb-1">Blog Post</div>
                        <div class="text-foreground/70 mt-2 space-y-2">
                            <div>
                                <span class="text-foreground/60"># </span>
                                <span class="text-foreground text-xl">{{ blogPost.title }}</span>
                            </div>
                            <div v-if="blogPost.date">
                                <span class="text-foreground/60">{{ $t('blog.date') }}: </span>
                                <span class="text-foreground">{{ blogPost.date }}</span>
                            </div>
                            <div v-if="blogPost.author">
                                <span class="text-foreground/60">{{ $t('blog.author') }}: </span>
                                <span class="text-foreground">{{ blogPost.author }}</span>
                            </div>
                            <div v-if="blogPost.category">
                                <span class="text-foreground/60">{{ $t('blog.category') }}: </span>
                                <span class="text-foreground">{{ blogPost.category }}</span>
                            </div>
                        </div>
                        <div v-if="blogPost.image" class="mb-8 mt-6 border-2 border-foreground/20 overflow-hidden">
                            <img
                                :src="blogPost.image"
                                :alt="`${blogPost.title} preview`"
                                class="w-full h-auto object-cover"
                                loading="eager"
                            />
                        </div>
                    </div>
                </div>

                <ContentRenderer
                    :value="blogPost"
                    class="prose prose-invert max-w-none" />
            </div>
            <div v-else class="space-y-1 text-sm">
                <div class="text-foreground/60">Blog Post Not Found</div>
                <div class="text-foreground/70 mt-2">
                    <div class="text-foreground/60">This blog post doesn't exist</div>
                    <div class="mt-4">
                        <NuxtLink
                            to="/blog"
                            class="text-foreground/60 hover:text-foreground transition-colors"
                        >
                            ← Back to Blog
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ContentTableOfContents from "../../components/ContentTableOfContents.vue";

const route = useRoute()
const { locale } = useI18n()

// Force reload when language changes
const { data: blogPost, refresh } = await useAsyncData(
    `blog-${route.params.slug}-${locale.value}`,
    () => {
        return queryCollection('blog').path(`/blog/${route.params.slug}.${locale.value}`).first()
    },
    {
        watch: [locale], // Reload when locale changes
        immediate: true
    }
)

// Force refresh when language changes
watch(locale, async (newLocale, oldLocale) => {
    if (newLocale !== oldLocale) {
        console.log(`Language change detected: ${oldLocale} → ${newLocale}`)
        await refresh()
    }
})
</script>

<style>
.image-modal-enter-active,
.image-modal-leave-active {
    transition: opacity 0.2s ease;
}

.image-modal-enter-from,
.image-modal-leave-to {
    opacity: 0;
}
</style>