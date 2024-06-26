import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		date: z.coerce.date(),
		heroImage: z.string().optional(),
		tags: z.array(z.string()),
	}),
});

export const collections = { articles };
