<template>
    <section class="py-20 px-4 font-mono" id="blog">
        <div class="max-w-3xl mx-auto">
            <div class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60 mb-2">Blog</div>
                <div class="text-foreground/70 pt-6 space-y-2">
                    <NuxtLink
                        v-for="(post, index) in allBlogPosts"
                        :key="index"
                        :to="'/blog/' + post.slug"
                        class="block hover:text-foreground transition-colors"
                    >
                        <div class="flex items-start gap-4">
                            <div class="flex-1 text-foreground/80 hover:text-foreground">
                                <div class="flex items-center">
                                    <div class="">{{ post.title }}&nbsp;</div>
                                    <div class="text-foreground/50 text-xs ">
                                        [ {{ post.tags.slice(0, 3).join(', ') }} ]
                                    </div>
                                </div>
                                <div class="mt-1 flex items-end">
                                    <div class="text-sm">{{ post.category }}</div>
                                    <div class="text-foreground/50 text-xs ml-2">by {{ post.author }}</div>
                                </div>
                            </div>
                        </div>
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