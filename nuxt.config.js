// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    "nuxt-lucide-icons",
    "nuxt-umami",
  ],

    googleFonts: {
        families: {
            "Space Mono": [400, 700],
        },
    },


    umami: {
        id: '4f9b3a39-88e1-40c5-98d7-974fbe95d5ea',
        host: 'https://methil.analytics.ethan-folio.fr',
        autoTrack: true,
        // proxy: 'cloak',
        // useDirective: true,
        // ignoreLocalhost: true,
        // excludeQueryParams: false,
        // domains: ['cool-site.app', 'my-space.site'],
        // customEndpoint: '/my-custom-endpoint',
        // enabled: false,
        // logErrors: true,
    },

    css: ["~/assets/css/main.css"],
    
    app: {
        pageTransition: {
            name: 'terminal',
            mode: 'out-in'
        }
    }
})