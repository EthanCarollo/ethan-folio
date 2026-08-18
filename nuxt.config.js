// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },

    components: [
        { path: '~/components/sections', pathPrefix: false },
        { path: '~/components/ui', pathPrefix: false },
        { path: '~/components/content', pathPrefix: false },
        { path: '~/components/features', pathPrefix: false },
        '~/components'
    ],

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
        '@nuxtjs/i18n',
        '@nuxtjs/seo'
    ],

    mdc: {
        highlight: {
            theme: 'github-dark',
            langs: ['python', 'gleam', 'xml', 'bash', 'json', 'vue', 'md']
        }
    },

    site: {
        url: 'https://ethan-folio.fr',
        name: 'Ethan Carollo',
        description: 'Polymorphic Developer',
        defaultLocale: 'fr',
    },

    googleFonts: {
        families: {
            "Space Mono": [400, 700],
        },
    },

    sitemap: {
        sources: [
            '/api/sitemap'
        ]
    },

    umami: {
        id: process.env.NUXT_PUBLIC_UMAMI_ID || '',
        host: process.env.NUXT_PUBLIC_UMAMI_HOST || 'https://methil.analytics.ethan-folio.fr',
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
