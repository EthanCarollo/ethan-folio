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
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ["Space Grotesk", "sans-serif"],
                mono: ["Space Mono", "monospace"],
            },
            boxShadow: {
                neo: "4px 4px 0 rgba(0,0,0,1)",
                "neo-lg": "8px 8px 0 rgba(0,0,0,1)",
                "neo-xl": "12px 12px 0 rgba(0,0,0,1)",
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{vue,js}',
    './pages/**/*.{vue,js}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(250, 250, 250)',
        foreground: 'rgb(38, 38, 38)',
        card: 'rgb(255, 255, 255)',
        'card-foreground': 'rgb(38, 38, 38)',
        primary: 'rgb(0, 255, 128)',
        'primary-foreground': 'rgb(38, 38, 38)',
        secondary: 'rgb(255, 255, 0)',
        'secondary-foreground': 'rgb(38, 38, 38)',
        accent: 'rgb(200, 0, 255)',
        'accent-foreground': 'rgb(38, 38, 38)',
        destructive: 'rgb(255, 51, 51)',
        'destructive-foreground': 'rgb(255, 0, 0)',
        muted: 'rgb(242, 242, 242)',
        'muted-foreground': 'rgb(115, 115, 115)',
        border: 'rgb(38, 38, 38)',
        input: 'rgb(242, 242, 242)',
        ring: 'rgb(38, 38, 38)',
        popover: 'rgb(255, 255, 255)',
        'popover-foreground': 'rgb(38, 38, 38)',
      },
    },
  },
  plugins: [],
}
