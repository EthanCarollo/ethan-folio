export default defineEventHandler(async (event) => {
    // Collect all data for context retrieval
    const projects = await queryCollection(event, 'projects').all()
    const notes = await queryCollection(event, 'notes').all()

    const formattedProjects = projects.map((p: any) => ({
        type: 'project',
        title: p.title,
        category: p.category,
        role: p.role,
        tags: p.tags,
        date: p.date,
        slug: p.slug,
        repo: p.repo,
        link: p.link,
        url: `/projects/${p.slug}`,
        lang: p.stem?.endsWith('.en') ? 'en' : 'fr',
        raw: p.raw || ''
    }))

    const formattedNotes = notes.map((n: any) => ({
        type: 'note',
        title: n.title,
        description: n.description,
        tags: n.tags,
        date: n.date,
        slug: n.slug,
        url: `/notes/${n.slug}`,
        lang: n.stem?.endsWith('.en') ? 'en' : 'fr',
        raw: n.raw || ''
    }))

    return {
        profile: {
            name: "Ethan Carollo",
            title: "Développeur Polymorphe & Étudiant en Master Développement Interactif",
            school: "Gobelins Annecy",
            location: "Annecy, France",
            email: "etcarollo@gmail.com",
            github: "https://github.com/EthanCarollo",
            roles: ["Développeur Polymorphe", "Étudiant Master Dev. Interactif", "Passionné de Game Dev"],
            skills: [
                "Unity & C# (Game design, architecture, gameplay)",
                "Python (Machine Learning, PyTorch, CNN, LLM fine-tuning avec Unsloth)",
                "Kotlin (Développement Android)",
                "TouchDesigner & MadMapper (Art interactif, capture Kinect, modules .tox)",
                "Vue 3 / Nuxt 4 / TypeScript / Tailwind CSS",
                "Gleam / Rust (Systèmes, curiosités linguistiques)",
                "CI/CD, Git, Docker"
            ]
        },
        projects: formattedProjects,
        notes: formattedNotes
    }
})
