export default defineEventHandler(async (event) => {
    // 1. Fetch data including 'stem' to identify locale
    const projects = await queryCollection(event, 'projects').select('slug', 'date', 'stem').all()
    const notes = await queryCollection(event, 'notes').select('slug', 'date', 'stem').all()

    // 2. Convert stored dates to ISO (YYYY-MM-DD) for <lastmod>.
    // Notes use ISO dates directly, projects use DD-MM-YYYY.
    const toIsoDate = (value: unknown) => {
        if (!value) return undefined
        const s = String(value)
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
        const dmy = s.match(/^(\d{2})-(\d{2})-(\d{4})$/)
        if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`
        return undefined
    }

    // 3. Helper to generate localized URLs
    const generateLocalizedUrls = (items, type) => {
        return items.map(item => {
            // Determine locale from stem (e.g., "projects/virusmania.en" -> "en")
            const isEnglish = item.stem.endsWith('.en')

            // Default locale (fr) uses root path, English uses /en prefix
            const urlPrefix = isEnglish ? `/en/${type}` : `/${type}`

            const url = {
                loc: `${urlPrefix}/${item.slug}`,
            }
            const lastmod = toIsoDate(item.date)
            if (lastmod) url.lastmod = lastmod
            return url
        })
    }

    const projectUrls = generateLocalizedUrls(projects, 'projects')
    const noteUrls = generateLocalizedUrls(notes, 'notes')

    // 4. Return combined list (landing pages first, then content)
    return [
        { loc: '/' },
        { loc: '/notes' },
        { loc: '/en' },
        { loc: '/en/notes' },
        ...projectUrls,
        ...noteUrls
    ]
})
