const path = require('path');
const jsdom = require('jsdom');
const { resolve } = require('path');
const { JSDOM } = jsdom;

const render = async (filename) => {
	const filePath = path.join(process.cwd(), filename);

	const dom = await JSDOM.fromFile(filePath, {
		runScripts: 'dangerously',
		resources: 'usable'
	});

	return new Promise((res, rej) => {
		dom.window.document.addEventListener('DOMContentLoaded', () => {
			res(dom);
		});
	});
};
module.exports = render;
