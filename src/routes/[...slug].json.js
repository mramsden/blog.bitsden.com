import { postsLookup } from './_posts.js';

// posts.forEach(post => {
// 	lookup.set(post.slug, JSON.stringify(post));
// });

export async function get(req, res, next) {
	// the `slug` parameter is available because
	// this file is called [slug].json.js
	const { slug } = req.params;
  const postPath = slug.join('/')

  const lookup = await postsLookup
	if (lookup.has(postPath)) {
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});

		res.end(lookup.get(postPath));
	} else {
		res.writeHead(404, {
			'Content-Type': 'application/json'
		});

		res.end(JSON.stringify({
			message: `Not found`
		}));
	}
}
