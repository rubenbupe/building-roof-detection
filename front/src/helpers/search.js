export const registerSearch = (base_uri, latitude, longitude, query) => {

	fetch(base_uri + 'search',
		{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "POST",
			body: JSON.stringify({ latitude, longitude, query })
		})
		.then(function (res) { console.log('Saved search', res) })
		.catch(function (err) { console.error('Error saving search', err) })
}

export const search = (base_uri, query, cb) => {
	const params = new URLSearchParams({query}).toString();
	fetch(base_uri + 'search?' + params)
		.then(response => response.json())
		.then(data => {

			console.log(data)
			const lat = data.latitude;
			const lon = data.longitude;

			if(lat == null || lon == null){
				return Promise.reject();
			}

			cb(lat, lon);

		}).catch(err => {
			console.log(err)
			console.error('No matching address');
		});
}