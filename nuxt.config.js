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

    i18n: {
        defaultLocale: 'fr',
        locales: [
            { code: 'fr', name: 'Français', file: 'fr.json' },
            { code: 'en', name: 'English', file: 'en.json' }
        ],
        lazy: true,
        langDir: 'locales',
        strategy: 'prefix_and_default', // Changement de stratégie
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            alwaysRedirect: true, // Toujours rediriger vers la langue détectée
            fallbackLocale: 'fr'
        }
    },

    modules: [
        '@nuxtjs/tailwindcss',
        '@nuxtjs/google-fonts',
        "nuxt-lucide-icons",
        "nuxt-umami",
        '@nuxt/content',
        '@nuxtjs/i18n'
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
