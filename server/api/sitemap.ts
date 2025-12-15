export default defineEventHandler(async (event) => {
    const projects = await queryCollection(event, 'projects').select('slug', 'date').all()
    
    // Deduplicate by slug (since we have en/fr files)
    const uniqueProjects = new Map()
    projects.forEach(p => {
        if (!uniqueProjects.has(p.slug)) {
            uniqueProjects.set(p.slug, p)
        }
    })

    return Array.from(uniqueProjects.values()).map(project => {
        return {
            loc: `/projects/${project.slug}`,
            // lastmod: project.date // Optional: format if needed
        }
    })
})
