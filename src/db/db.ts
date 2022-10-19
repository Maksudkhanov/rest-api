import mysql from 'mysql';
import dotenv from 'dotenv';
import { InitQueries } from './queries/InitQueries';
import { authQueries } from './queries/authQueries';
import { isEmail } from 'class-validator';

dotenv.config();

export interface IDatabase {
	connect(host: string, user: string, password: string, database: string): void;
	insertUser(id: string, hash: string): Promise<string>;
	selectUser(id: string): Promise<[] | undefined>;
}

export class Database implements IDatabase {
	private db: mysql.Connection;

	connect(
		host: string,
		user: string,
		password: string,
		database: string
	): void {
		this.db = mysql.createConnection({
			host: host,
			user: user,
			password: password,
			database: database,
		});

		this.db.query(InitQueries.dropTableUsers);
		this.db.query(InitQueries.createTableUsers);
	}

	async insertUser(id: string, hash: string): Promise<string> {
		if (isEmail(id)) {
			this.db.query(authQueries.insertUserByEmail, [id, hash]);
		} else {
			this.db.query(authQueries.insertUserByPhoneNumber, [id, hash]);
		}
		return 'User Created';
	}

	async selectUser(id: string): Promise<[] | undefined> {
		let results: any;

		if (isEmail(id)) {
			await this.db.query(
				authQueries.selectUserByEmail,
				id,
				(err: mysql.MysqlError | null, result: any) => {
					console.log(result);
					results = result;
				}
			);

			return results;
		}
		// return this.db.query(authQueries.selectUserByPhoneNumber, [id]);
	}
}
