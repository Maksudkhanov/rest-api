import dotenv from 'dotenv';
import { Database } from './db/db';
import server from './server';
import { authController } from './controllers/authController';
import { AuthService } from './services/authService';

dotenv.config();

const PORT = process.env.PORT as string;
const db_host = process.env.DB_HOST as string;
const db_user = process.env.DB_USER as string;
const db_password = process.env.DB_PASSWORD as string;
const db_name = process.env.DB_NAME as string;

const start = async () => {
	try {
		const db = new Database();
		db.connect(db_host, db_user, db_password, db_name);
		
		const authService = new AuthService(db);
		// const fileService = new FileService(db)

		const auth = authController(authService);
		// const file = fileController(fileService)

		server.use('/auth', auth);
		// server.use('/file', fileRouter);

		server.listen(PORT, () => console.log('Running on server', PORT));
	} catch (error) {
		console.log(error);
	}
};

start();
