<template>
    <section class="py-12 sm:py-16 md:py-20 px-4 font-mono" id="blog">
        <div class="max-w-3xl mx-auto">
            <div class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60 mb-2">Blog</div>
                <div class="text-foreground/70 pt-6 space-y-4 grid grid-cols-1 gap-4">
                    <NuxtLink
                        v-for="(post, index) in allBlogPosts"
                        :key="index"
                        :to="'/blog/' + post.slug"
                        class="block hover:text-foreground transition-colors"
                    >
                        <article class="border border-foreground/20 rounded-lg p-3 md:p-4 hover:border-foreground/40 hover:bg-foreground/5 transition-all duration-200">
                            <div class="flex flex-col gap-2">
                                <h3 class="text-lg font-semibold text-foreground">{{ post.title }}</h3>
                                <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-foreground/70">
                                    <span>{{ post.category }}</span>
                                    <span>•</span>
                                    <span>by {{ post.author }}</span>
                                </div>
                                <div class="flex flex-wrap gap-2 mt-2">
                                    <span
                                        v-for="tag in post.tags.slice(0, 3)"
                                        :key="tag"
                                        class="text-xs bg-foreground/10 text-foreground/80 px-2 py-1 rounded"
                                    >
                                        {{ tag }}
                                    </span>
                                </div>
                            </div>
                        </article>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
const { locale } = useI18n()

// Force re-render when locale changes
const allBlogPosts = ref([]);

const loadBlogPosts = async () => {
    allBlogPosts.value = await queryCollection('blog')
        .order('date', 'DESC')
        .where('stem', 'LIKE', '%.' + locale.value)
        .all();
};

// Load blog posts on mount and when locale changes
watch(locale, () => {
    loadBlogPosts();
}, { immediate: true });
</script>

<style scoped>
/* Component styles */
</style>