<template>
    <section class="py-20 px-4" id="contact">
        <div class="max-w-5xl mx-auto">
            <!-- Header with dynamic rotation -->
            <div class="inline-block mb-12 px-6 py-3 bg-accent border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-1 hover:rotate-1 transition-transform">
                <h2 class="text-4xl md:text-5xl font-black text-foreground">LET'S CONNECT</h2>
            </div>

            <div class="bg-card border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 relative overflow-hidden">
                <!-- Decorative corner accent -->
                <div class="absolute top-0 right-0 w-24 h-24 flex justify-center items-center bg-accent border-l-4 border-b-4 border-foreground">
                    <BadgeInfoIcon class="text-black w-16 h-16" />
                </div>

                <p class="text-xl text-foreground/80 leading-relaxed mb-12 max-w-2xl">
                    Open to new opportunities and collaborations. Let's build something amazing together!
                </p>

                <!-- Contact cards with staggered arrangement -->
                <div class="grid md:grid-cols-3 gap-8 mb-12">
                    <!-- Email Card -->
                    <div class="group relative">
                        <div class="absolute inset-0 bg-primary border-4 border-foreground translate-x-2 translate-y-2"></div>
                        <div class="relative flex flex-col items-start gap-4 p-6 bg-background border-4 border-foreground transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
                            <div class="p-3 bg-primary border-[3px] border-foreground">
                                <LucideMail class="w-7 h-7 text-foreground" />
                            </div>
                            <div class="w-full">
                                <span class="block font-black text-lg text-foreground mb-2">EMAIL</span>
                                <span class="block text-base text-foreground/90 font-mono break-all">etcarollo@gmail.com</span>
                            </div>
                        </div>
                    </div>

                    <!-- Phone Card -->
                    <div class="group relative md:mt-8">
                        <div class="absolute inset-0 bg-secondary border-4 border-foreground translate-x-2 translate-y-2"></div>
                        <div class="relative flex flex-col items-start gap-4 p-6 bg-background border-4 border-foreground transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
                            <div class="p-3 bg-secondary border-[3px] border-foreground">
                                <Phone class="w-7 h-7 text-foreground" />
                            </div>
                            <div class="w-full">
                                <span class="block font-black text-lg text-foreground mb-2">PHONE</span>
                                <span class="block text-base text-foreground/90 font-mono">+33 6 12 50 69 05</span>
                            </div>
                        </div>
                    </div>

                    <!-- Location Card -->
                    <div class="group relative">
                        <div class="absolute inset-0 bg-accent border-4 border-foreground translate-x-2 translate-y-2"></div>
                        <div class="relative flex flex-col items-start gap-4 p-6 bg-background border-4 border-foreground transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1">
                            <div class="p-3 bg-accent border-[3px] border-foreground">
                                <MapPinIcon class="w-7 h-7 text-foreground" />
                            </div>
                            <div class="w-full">
                                <span class="block font-black text-lg text-foreground mb-2">LOCATION</span>
                                <span class="block text-base text-foreground/90 font-mono">Annecy, France</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- CTA Button with enhanced effect -->
                <div class="text-center relative z-10">
                    <a
                        href="mailto:etcarollo@gmail.com"
                        class="inline-block px-12 py-4 bg-black text-background border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1.5 hover:-translate-y-1.5 transition-all font-black text-xl active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1"
                    >
                        SEND MESSAGE →
                    </a>
                </div>
            </div>

            <!-- Footer -->
            <footer class="mt-16 text-center">
                <div class="inline-block px-6 py-3 bg-foreground border-4 border-foreground rotate-1">
                    <p class="font-mono font-bold text-background">© 2025 Ethan Carollo · Built with Nuxt & Tailwind CSS</p>
                </div>
            </footer>
        </div>
    </section>
</template>

<script setup>
import { Phone, LucideMail, MapPinIcon, BadgeInfoIcon } from 'lucide-vue-next';
</script>