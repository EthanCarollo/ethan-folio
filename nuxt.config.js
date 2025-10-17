// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    "nuxt-lucide-icons",
  ],

    googleFonts: {
        families: {
            "Space Grotesk": [400, 700, 900],
            "Space Mono": [400, 700],
        },
    },

    css: ["~/assets/css/main.css"],
})