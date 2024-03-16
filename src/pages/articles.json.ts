import { getArticles } from '../helpers/article'

export async function GET() {
	const allArticles = await getArticles()
	return new Response(JSON.stringify(allArticles), {
		headers: {
			'content-type': 'application/json'
		}
	})
}
