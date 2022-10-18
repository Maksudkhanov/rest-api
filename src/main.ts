import { Request, Response } from 'express';
import db from './db/db';
import server from './server';

const start = async () => {
	try {
		db.connect();

		server.post('/', async (req: Request, res: Response) => {
			const { username, password } = req.body;
			const result = db.query(
				`INSERT INTO users (username, password) VALUES ('${username}', '${password}');`
			);
			// console.log(result);
			
			res.end("sdc");
		});
		server.listen(4000, () => console.log('Running on server'));
	} catch (error) {
		console.log(error);
	}
};

start();
