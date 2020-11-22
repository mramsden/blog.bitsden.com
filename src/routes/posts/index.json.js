import posts from './_posts'

export async function get(_req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

	res.end(JSON.stringify(await posts));
}
