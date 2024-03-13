/** @type {import('tailwindcss').Config} */
export default {
  
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./src/**/*.json",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {},
    fontFamily: {
      'sans': ['Roboto', 'Roboto fallback', ...fontFamily.sans],
      'medium': ['medium-unique'],
    }
  },
  plugins: [],
}

