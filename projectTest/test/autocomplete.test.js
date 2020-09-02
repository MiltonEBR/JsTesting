const waitFor = (item) => {
	return new Promise((resolve, reject) => {
		const interval = setInterval(() => {
			if (document.querySelector(item)) {
				clearInterval(interval);
				clearTimeout(timeout);
				resolve();
			}
		}, 30);
		const timeout = setTimeout(() => {
			clearInterval(interval);
			reject();
		}, 2000);
	});
};

beforeEach(() => {
	document.querySelector('#target').innerHTML = '';
	createAutoComplete({
		root: document.querySelector('#target'),
		fetchData() {
			return [ { Title: 'Avengers' }, { Title: 'Mad max' }, { Title: 'Green lantern' } ];
		},
		renderOption(movie) {
			return movie.Title;
		}
	});
});

it('Autocomplete starts closed', () => {
	const dropdown = document.querySelector('.dropdown');

	expect(dropdown.className).not.to.include('is-active');
});

it('After searching, dropdown opens up', async () => {
	const input = document.querySelector('input');
	input.value = 'avengers';
	input.dispatchEvent(new Event('input'));

	await waitFor('.dropdown-item');

	const dropdown = document.querySelector('.dropdown');
	expect(dropdown.className).to.include('is-active');
});

it('After searching, displays some results', async () => {
	const input = document.querySelector('input');
	input.value = 'avengers';
	input.dispatchEvent(new Event('input'));

	await waitFor('.dropdown-item');

	const items = document.querySelectorAll('.dropdown-item');

	expect(items.length).to.equal(3);
});
