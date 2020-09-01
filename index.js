module.exports = {
	forEach(arr, fn) {
		for (let i = 0; i < arr.length; i++) {
			const value = arr[i];
			fn(value, i);
		}
	},

	map(arr, func) {
		let newArr = [];
		for (let index in arr) {
			newArr.push(func(arr[index], index));
		}
		return newArr;
	}
};
