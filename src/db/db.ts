import { isEmail } from 'class-validator';
import mysql, { Query } from 'mysql';
import dotenv from 'dotenv';
import util from 'util';
import { InitQueries } from './queries/InitQueries';
import { authQueries } from './queries/authQueries';

dotenv.config();

export interface IDatabase {
	connect(host: string, user: string, password: string, database: string): void;
	insertUser(id: string, hash: string): Promise<string>;
	selectUser(id: string): Promise<Query>;
}

export class Database implements IDatabase {
	private db: mysql.Connection;
	private query: any;

	async connect(
		host: string,
		user: string,
		password: string,
		database: string
	): Promise<void> {
		this.db = mysql.createConnection({
			host: host,
			user: user,
			password: password,
			database: database,
		});

		this.query = util.promisify(this.db.query).bind(this.db);

		await this.query(InitQueries.dropTableUsers);
		await this.query(InitQueries.createTableUsers);
	}

	async insertUser(id: string, hash: string): Promise<string> {
		if (isEmail(id)) {
			await this.query(authQueries.insertUserByEmail, [id, hash]);
		} else {
			await this.query(authQueries.insertUserByPhoneNumber, [id, hash]);
		}
		return 'User Created';
	}

	async selectUser(id: string): Promise<Query> {
		if (isEmail(id)) {
			return await this.query(authQueries.selectUserByEmail, id);
		}
		return await this.query(authQueries.selectUserByPhoneNumber, id);
	}
}
