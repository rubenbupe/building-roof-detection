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