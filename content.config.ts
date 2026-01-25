import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
    collections: {
        blog: defineCollection({
            type: 'page',
            source: 'blog/*.md',
            schema: z.object({
                title: z.string(),
                date: z.string(),
                image: z.string(),
                author: z.string(),
                category: z.string(),
                tags: z.array(z.string()),
                slug: z.string(),
            })
        }),
        projects: defineCollection({
            type: 'page',
            source: 'projects/*.md',
            schema: z.object({
                title: z.string(),
                date: z.string(),
                image: z.string(),
                role: z.string(),
                category: z.string(),
                tags: z.array(z.string()),
                slug: z.string(),
                repo: z.string(),
            })
        }),
        notes: defineCollection({
            type: 'page',
            source: 'notes/*.md',
            schema: z.object({
                title: z.string(),
                date: z.string(),
                description: z.string(),
                tags: z.array(z.string()),
                slug: z.string(),
            })
        })
    }
})
