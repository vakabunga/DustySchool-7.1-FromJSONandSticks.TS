import { readFile } from 'fs/promises';
import http from 'http';
import path from 'path';

type JsonData = {
	title: string;
	content: string;
};

const server = http.createServer(async (req, res) => {
	const url = req.url || '/';

	const homeUrls = 'dist/pages/';

	const data404: JsonData = {
		title: '404. Page not found',
		content: 'Return to a <a href="/">Home page</a>',
	};

	function pageHtml(data: JsonData): string {
		return `
			<h1>${data.title}</h1>
			<div>${data.content}</div>`;
	}

	const pageName = url === '/' ? 'index' : url.slice(1);

	const filePath = path.join(process.cwd(), `${homeUrls}${pageName}.json`);

	try {
		const jsonData = await readFile(filePath, 'utf-8');

		res.writeHead(200, {
			'Content-Type': 'text/html',
		});

		res.write(pageHtml(JSON.parse(jsonData)));
		res.end();
	} catch {

		res.writeHead(404, {
			'Content-Type': 'text/html',
		});
		
		res.end(pageHtml(data404));
	}
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
	console.log(`The server is listening on port ${port}`);
});
