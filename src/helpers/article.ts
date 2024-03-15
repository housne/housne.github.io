import { getCollection } from 'astro:content';

export const getArticles = async () => {
  const articles = await getCollection('articles');
  return articles.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}