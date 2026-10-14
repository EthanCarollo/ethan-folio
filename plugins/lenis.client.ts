import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  // Désactiver Lenis sur mobile : conflit avec le scroll natif, rubber-banding, pull-to-refresh
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0))

  const lenis = new Lenis({
    autoRaf: true,
    lerp: isMobile ? 0 : 0.15,
    duration: isMobile ? 0 : undefined,
  })

  nuxtApp.vueApp.provide('lenis', lenis)

  nuxtApp.$router.afterEach((to: any, from: any) => {
    if (to.path !== from.path) {
      requestAnimationFrame(() => {
        lenis.scrollTo(0, { immediate: true })
      })
    }
  })

  nuxtApp.hook('page:transition:finish', () => {
    // Force a resize calculation when the new page is completely mounted and visible
    lenis.resize()
  })

  // Handle anchor link clicks globally
  // @ts-expect-error import.meta.client is injected by Nuxt/Vite
  if (import.meta.client) {
    document.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('a')
      if (target && target.hash) {
        // Prevent default only if it's an anchor link on the current page
        const url = new URL(target.href)
        if (url.pathname === window.location.pathname) {
          e.preventDefault()
          lenis.scrollTo(target.hash)

          // Still push to router to update URL without jumping
          window.history.pushState(null, '', target.hash)
        }
      }
    })
  }
})
