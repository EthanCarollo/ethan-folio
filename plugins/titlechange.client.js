
// This plugin change the SEO title when user isn't on the page
export default defineNuxtPlugin(nuxtApp => {
    var title;
    document.onvisibilitychange = () => {
        if (document.hidden) {
            title = document.getElementsByTagName("title")[0].innerHTML;
            useSeoMeta({
                title: '🙋Tu es toujours là ?'
            })
        } else {
            useSeoMeta({
                title: title
            })
        }
    }
})