const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const generate_load = () => {
	const filepath = path.join(__dirname ,'./test-image.tif');

	const stats = fs.statSync(filepath);
	const fileSizeInBytes = stats.size;


	let readStream = fs.createReadStream(filepath);

	fetch('https://api.reconocimientodelmedio.es/predictions/semantic', {
		method: 'POST',
		headers: {
			"Content-length": fileSizeInBytes
		},
		body: readStream 
	}).then((data) => {
		console.log(data);
	}).catch((e) => {
		console.error(e);
	}).finally(() => {
		console.log('Terminado');
	});

}



generate_load();