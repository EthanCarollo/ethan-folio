// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Static generation configuration
  ssr: true,
  target: 'static',

  nitro: {
    preset: 'static'
  },

  // Prerender routes for static generation
  routeRules: {
    '/': { prerender: true },
    '/projects/**': { prerender: true }
  },

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
  },

  css: ["~/assets/css/main.css"],

  app: {
    pageTransition: {
      name: 'terminal',
      mode: 'out-in'
    }
  },

  // Static optimization
  experimental: {
    payloadExtraction: false
  },

  // Disable SPA fallback for static hosting
  spa: false,

  // Build optimizations for static
  build: {
    extractCSS: true,
    optimizeCSS: true,
    splitChunks: {
      layouts: true,
      pages: true,
      commons: true
    }
  }
})