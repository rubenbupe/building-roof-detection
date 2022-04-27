export const registerLocation = (base_uri, latitude, longitude) => {

	fetch(base_uri + 'location',
		{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: "POST",
			body: JSON.stringify({ latitude, longitude })
		})
		.then(function (res) { console.log('Saved location', res) })
		.catch(function (err) { console.error('Error saving location', err) })
}