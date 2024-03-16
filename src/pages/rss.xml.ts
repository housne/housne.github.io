import rss from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { type APIContext } from 'astro'
import { getArticles } from '../helpers/article'

export async function GET(context: APIContext) {
	const articles = await getArticles();
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site || '',
		items: articles.map((article) => ({
			...article.data,
			pubDate: new Date(article.data.date),
			link: `/articles/${article.slug}/`,
		})),
	});
}
