// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Static site generation
  target: 'static',
  ssr: true,

  nitro: {
    static: true
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    "nuxt-lucide-icons",
    "nuxt-umami",
    '@nuxt/content'
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
  },

  css: ["~/assets/css/main.css"],

  app: {
    pageTransition: {
      name: 'terminal',
      mode: 'out-in'
    }
  }
})