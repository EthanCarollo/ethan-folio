<template>
    <section class="py-12 sm:py-16 md:py-20 px-4 font-mono" id="contact">
        <div class="max-w-4xl mx-auto">
            <div class="space-y-1 text-sm mb-8">
                <div class="text-foreground/60 mb-2">{{ $t('hero.contact') }}</div>
                <div class="text-foreground/70 mt-2">
                    Open to new opportunities and collaborations. Let's build something amazing together!
                </div>
            </div>

            <div class="space-y-6 mb-12">
                <div class="border-l-2 border-foreground/20 pl-4">
                    <div class="text-sm text-foreground/60 mb-1 uppercase tracking-wider">Email</div>
                    <a href="mailto:etcarollo@gmail.com"
                        class="text-foreground hover:text-foreground/70 transition-colors">
                        etcarollo@gmail.com
                    </a>
                </div>

                <!-- Phone number removed -->

                <div class="border-l-2 border-foreground/20 pl-4">
                    <div class="text-sm text-foreground/60 mb-1 uppercase tracking-wider">Location</div>
                    <span class="text-foreground/70">Annecy, France</span>
                </div>
            </div>

            <div class="text-center">
                <a href="mailto:etcarollo@gmail.com"
                    class="inline-block px-8 py-3 border border-foreground hover:bg-foreground hover:text-background transition-all text-sm">
                    Send Message
                </a>
            </div>

            <!-- Footer removed -->
        </div>
    </section>
</template>

<style scoped>
/* Component styles */
</style>
