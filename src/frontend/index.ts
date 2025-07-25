const page = document.querySelector<HTMLBodyElement>('.page');
const pageTitle: HTMLHeadingElement = document.createElement('h1');
const pageContent: HTMLDivElement = document.createElement('div');

const serverUrl: string = 'http://localhost:3000/';

type PageData = {
	title: string;
	content: string;
};

if (!page) {
	throw new Error('content not found');
}

page.appendChild(pageTitle);
page.appendChild(pageContent);

pageContent.addEventListener('click', (event: MouseEvent) => {
	event.preventDefault();
	const target = event.target as HTMLAnchorElement;

	if (target.classList.contains('link')) {
		const link = target.href;
		const pageName = link.substring(serverUrl.length);

		pageDataRequest(pageName)
			.then((data) => renderPage(data))
			.catch((error) => renderPage(error));
	}
});

function pageDataRequest(pageName: string) {
	return fetch(serverUrl + pageName)
		.then((response) => response.json());
}

function renderPage(data: PageData): void {
	pageTitle.textContent = data.title;
	pageContent.innerHTML = data.content;
}

pageDataRequest('')
	.then((data) => {
		renderPage(data);
	});
