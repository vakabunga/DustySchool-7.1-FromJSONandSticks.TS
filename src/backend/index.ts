import { readFile } from 'fs/promises';
import http from 'http';
import path from 'path';

async function readJsonFile(filePath: string): Promise<string> {
	return await readFile(filePath, 'utf-8');
}

const server = http.createServer(async (req, res) => {
	const url = req.url || '/';

	const homeUrls = 'dist/backend/pages/';
	const data404 = JSON.stringify({title: '404. Page not found', content: 'Return to a <a class="main link" href="/">Home page</a>'});

	const pageName = url === '/' ? 'index' : url.slice(1);

	const filePath = path.join(process.cwd(), `${homeUrls}${pageName}.json`);

	try {
		const jsonData = await readFile(filePath, 'utf-8');

		res.writeHead(200, {
			'Content-Type': 'application/json',
			'Access-control-allow-origin': '*',
		});

		res.write(jsonData);
		res.end();
	} catch {

		res.writeHead(404, {
			'Content-Type': 'application/json',
			'Access-control-allow-origin': '*',
		});

		res.end(data404);
	}
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
	console.log(`The server is listening on port ${port}`);
});
