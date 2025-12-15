export default defineEventHandler(async (event) => {
    // 1. Fetch data
    const projects = await queryCollection(event, 'projects').select('slug', 'date').all()
    const blogs = await queryCollection(event, 'blog').select('slug', 'date').all()
    
    // 2. Helper to deduplicate items by slug (handling en/fr duplicates)
    // Using a generic function since logic is identical
    const getUniqueItems = (items) => {
        const unique = new Map()
        items.forEach(item => {
            if (!unique.has(item.slug)) {
                unique.set(item.slug, item)
            }
        })
        return Array.from(unique.values())
    }

    const uniqueProjects = getUniqueItems(projects)
    const uniqueBlogs = getUniqueItems(blogs)

    // 3. Build URLs
    const projectUrls = uniqueProjects.map(p => ({ loc: `/projects/${p.slug}` }))
    const blogUrls = uniqueBlogs.map(b => ({ loc: `/blog/${b.slug}` }))

    // 4. Return combined list
    return [...projectUrls, ...blogUrls]
})
