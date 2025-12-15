export default defineEventHandler(async (event) => {
    // 1. Fetch data including 'stem' to identify locale
    const projects = await queryCollection(event, 'projects').select('slug', 'date', 'stem').all()
    const blogs = await queryCollection(event, 'blog').select('slug', 'date', 'stem').all()
    
    // 2. Helper to generate localized URLs
    const generateLocalizedUrls = (items, type) => {
        return items.map(item => {
            // Determine locale from stem (e.g., "projects/virusmania.en" -> "en")
            // Assuming stem format is "collection/slug.locale" or similar
            const isEnglish = item.stem.endsWith('.en')
            
            // Construct URL based on locale
            // Default locale (fr) uses root path, English uses /en prefix
            const urlPrefix = isEnglish ? `/en/${type}` : `/${type}`
            
            return {
                loc: `${urlPrefix}/${item.slug}`,
                // lastmod: item.date
            }
        })
    }

    const projectUrls = generateLocalizedUrls(projects, 'projects')
    const blogUrls = generateLocalizedUrls(blogs, 'blog')

    // 3. Return combined list
    return [...projectUrls, ...blogUrls]
})
