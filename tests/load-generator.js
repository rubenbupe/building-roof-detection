const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

const make_prediction = () => {
	const filepath = path.join(__dirname ,'./test-image.tif');

	const formData = new FormData();
	formData.append('image', fs.createReadStream(filepath));

	return fetch('https://api.reconocimientodelmedio.es/predictions/semantic', {
		method: 'POST',
		body: formData 
	})

}


const generate_load = async (i) => {
	return Promise.all([...Array(50).keys()].map(j => {
		console.log('Procesando imagen', i*50 + j + 1);
		return make_prediction().catch((e) => {
			console.error(e);
		}).finally(() => {
			console.log('Fin de procesamiento de imagen', i*50 + j + 1);
		});
	}));
}


const multi_load = async (cont) => {
	for (let i = 0; i < cont; i++) {
		await generate_load(i);
	}
}



multi_load(5);