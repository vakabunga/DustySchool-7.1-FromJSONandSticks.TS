import { readFile, access } from 'fs/promises';
import http from 'http';
import path from 'path';

type JsonData = {
	title: string;
	content: string;
};

async function readJsonFile(filePath: string): Promise<JsonData> {
	const jsonData = await readFile(filePath, 'utf-8');

	return JSON.parse(jsonData);
}

const server = http.createServer(async (req, res) => {
	const url = req.url;
	const homeUrls = 'dist/backend/pages';
	let filePath: string;

	res.writeHead(200, { 'Content-Type': 'text/html' });

	if (url === '/') {
		filePath = path.join(process.cwd(), `${homeUrls}${url}index.json`);
	} else {
		try {
			await access(path.join(process.cwd(), `${homeUrls}${url}.json`));
			filePath = path.join(process.cwd(), `${homeUrls}${url}.json`);
		} catch {
			filePath = path.join(process.cwd(), `${homeUrls}/404.json`);
		}
	}

	readJsonFile(filePath)
		.then((jsonData) => {
			res.write(jsonData);
		});

	res.end();
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
	console.log(`The server is listening on port ${port}`);
})
