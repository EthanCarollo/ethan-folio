/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./error.vue",
    ],
    theme: {
        extend: {
            colors: {
                background: '#000000',
                foreground: '#ffffff',
                border: '#333333',
                muted: '#1a1a1a',
                'muted-foreground': '#888888',
            },
            fontFamily: {
                mono: ["Space Mono", "monospace"],
                sans: ["Space Mono", "monospace"],
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1.5' }],
                'sm': ['0.875rem', { lineHeight: '1.5' }],
                'base': ['1rem', { lineHeight: '1.5' }],
                'lg': ['1.125rem', { lineHeight: '1.5' }],
                'xl': ['1.25rem', { lineHeight: '1.5' }],
                '2xl': ['1.5rem', { lineHeight: '1.5' }],
                '3xl': ['1.875rem', { lineHeight: '1.5' }],
            },
        },
    },
    plugins: [],
};
