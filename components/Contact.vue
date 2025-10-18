<template>
    <section class="py-20 px-4">
        <div class="max-w-5xl mx-auto">
            <div class="inline-block mb-12 px-6 py-3 bg-accent border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-1">
                <h2 class="text-4xl md:text-5xl font-black text-foreground">GET IN TOUCH</h2>
            </div>

            <div class="bg-card border-4 border-foreground shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
                <p class="text-xl text-foreground/80 leading-relaxed mb-8 text-center">
                    I'm always open to new opportunities and collaborations. Let's build something amazing together!
                </p>

                <div class="grid md:grid-cols-3 gap-6 mb-8">
                    <div class="flex flex-col items-center gap-3 p-6 bg-muted border-2 border-foreground">
                        <div class="p-3 bg-primary border-2 border-foreground">
                            <LucideMail name="lucide:mail" class="w-6 h-6 text-foreground" />
                        </div>
                        <span class="font-bold text-foreground">Email</span>
                        <span class="text-sm text-foreground/80">ethan@example.com</span>
                    </div>

                    <div class="flex flex-col items-center gap-3 p-6 bg-muted border-2 border-foreground">
                        <div class="p-3 bg-secondary border-2 border-foreground">
                            <Phone name="lucide:phone" class="w-6 h-6 text-foreground" />
                        </div>
                        <span class="font-bold text-foreground">Phone</span>
                        <span class="text-sm text-foreground/80">+33 6 12 34 56 78</span>
                    </div>

                    <div class="flex flex-col items-center gap-3 p-6 bg-muted border-2 border-foreground">
                        <div class="p-3 bg-accent border-2 border-foreground">
                            <MapPinIcon name="lucide:map-pin" class="w-6 h-6 text-foreground" />
                        </div>
                        <span class="font-bold text-foreground">Location</span>
                        <span class="text-sm text-foreground/80">Annecy, France</span>
                    </div>
                </div>

                <div class="text-center">
                    <a
                        href="mailto:ethan@example.com"
                        class="inline-block px-12 py-3 bg-foreground text-background border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all font-black text-xl"
                    >
                        SEND MESSAGE
                    </a>
                </div>
            </div>

            <footer class="mt-16 text-center">
                <div class="inline-block px-6 py-3 bg-foreground border-4 border-foreground">
                    <p class="font-mono font-bold text-background">© 2025 Ethan Carollo. Built with Nuxt & Tailwind CSS</p>
                </div>
            </footer>
        </div>
    </section>
</template>

<script setup>
import { Phone, LucideMail, MapPinIcon } from 'lucide-vue-next';
</script>
