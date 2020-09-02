const autoCompleteConfig = {
	renderOption(movie) {
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
		return `
			<img src="${imgSrc}"/>
			<h1>${movie.Title}</h1>
		`;
	},
	inputValue(movie) {
		return movie.Title;
	},
	async fetchData(search) {
		const response = await axios.get('http://www.omdbapi.com/', {
			params: {
				apikey: 'ef2044cc',
				s: search
			}
		});

		if (response.data.Error) {
			return [];
		}

		return response.data.Search;
	}
};

createAutoComplete({
	...autoCompleteConfig,
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		fullMovie(movie, document.querySelector('#left-summary'), 'left');
	},
	root: document.querySelector('#left-autocomplete')
});
createAutoComplete({
	...autoCompleteConfig,
	onOptionSelect(movie) {
		document.querySelector('.tutorial').classList.add('is-hidden');
		fullMovie(movie, document.querySelector('#right-summary'), 'right');
	},
	root: document.querySelector('#right-autocomplete')
});

let leftMovie;
let rightMovie;
const fullMovie = async (movie, target, side) => {
	imdbID = movie.imdbID;
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: 'ef2044cc',
			i: imdbID
		}
	});
	const newData = response.data;
	target.innerHTML = movieTemplate(newData);

	if (side === 'left') {
		leftMovie = response.data;
	} else {
		rightMovie = response.data;
	}

	if (leftMovie && rightMovie) {
		runComparison();
	}
};

const runComparison = () => {
	const rightSideStats = document.querySelectorAll('#right-summary .notification');
	const leftSideStats = document.querySelectorAll('#left-summary .notification');

	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index];

		const leftSideValue = parseInt(leftStat.dataset.value);
		const rightSideValue = parseInt(rightStat.dataset.value);
		if (rightSideValue > leftSideValue) {
			leftStat.classList.remove('is-primary');
			leftStat.classList.add('is-warning');
		} else {
			rightStat.classList.remove('is-primary');
			rightStat.classList.add('is-warning');
		}
	});
};

const movieTemplate = (movieDetails) => {
	const dollars = parseInt(movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
	const score = parseInt(movieDetails.Metascore);
	const imdb = parseFloat(movieDetails.imdbRating);
	const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));

	const wins = movieDetails.Awards.split(' ').reduce((prev, word) => {
		const value = parseInt(word);
		if (isNaN(value)) {
			return prev;
		} else {
			return prev + value;
		}
	}, 0);

	return `
		<article class="media">
			<figure class="media-left">
				<p class="image">
					<image src="${movieDetails.Poster}"/>
				</p>
			</figure>
			<div class="media-content">
				<div class="content">
					<h1>${movieDetails.Title}</h1>
					<h4>${movieDetails.Genre}</h4>
					<p>${movieDetails.Plot}</p>
				</div>
			</div>
		</article>
		<article data-value=${wins} class="notification is-primary">
			<p class="tittle">${movieDetails.Awards}</p>
			<p class="subtitle">Awards</p>
		</article>
		<article data-value=${dollars} class="notification is-primary">
			<p class="tittle">${movieDetails.BoxOffice}</p>
			<p class="subtitle">Box Office</p>
		</article>
		<article data-value=${score} class="notification is-primary">
			<p class="tittle">${movieDetails.Metascore}</p>
			<p class="subtitle">Metascore</p>
		</article>
		<article data-value=${imdb} class="notification is-primary">
			<p class="tittle">${movieDetails.imdbRating}</p>
			<p class="subtitle">IMDB Rating</p>
		</article>
		<article data-value=${imdbVotes} class="notification is-primary">
			<p class="tittle">${movieDetails.imdbVotes}</p>
			<p class="subtitle">IMDB Votes</p>
		</article>
	`;
};
