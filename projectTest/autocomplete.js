const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
	root.innerHTML = `
    <label><b>Search</b></label>
    <input class="input" />
    <div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
    </div>
    </div>
    `;

	const input = root.querySelector('input');
	const dropdown = root.querySelector('.dropdown');
	const resultContainer = root.querySelector('.results');

	const onInput = debounce(async (event) => {
		const objectList = await fetchData(event.target.value);

		if (!objectList.length) {
			dropdown.classList.remove('is-active');
			return;
		}
		resultContainer.innerHTML = '';
		dropdown.classList.add('is-active');
		for (let object of objectList) {
			const newAnchor = document.createElement('a');

			newAnchor.classList.add('dropdown-item');
			newAnchor.innerHTML = renderOption(object);
			newAnchor.addEventListener('click', (event) => {
				dropdown.classList.remove('is-active');
				input.value = inputValue(object);
				onOptionSelect(object);
			});
			resultContainer.appendChild(newAnchor);
		}
	}, 500);
	input.addEventListener('input', onInput);

	document.addEventListener('click', (event) => {
		if (!root.contains(event.target)) {
			dropdown.classList.remove('is-active');
		}
	});
};
