const fs = require('fs');



async function proccess() {
	const path = 'uploads/Screenshot from 2022-05-30 21-36-49.png';
	const data = await readFile(path);
	console.log(data);
}

proccess()
