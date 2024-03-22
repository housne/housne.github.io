import { defineDb, defineTable, column } from 'astro:db';

const Comment = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    articleSlug: column.text(),
    published: column.date(),
    authorName: column.text(),
    authorEmail: column.text(),
    authorUrl: column.text(),
    content: column.text(),
    spam: column.boolean()
  }
})

// https://astro.build/db/config
export default defineDb({
  tables: { Comment }
});
