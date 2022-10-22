import { isEmail } from 'class-validator';
import mysql, { Query } from 'mysql';
import dotenv from 'dotenv';
import util from 'util';
import { InitQueries } from './queries/InitQueries';
import { authQueries } from './queries/authQueries';
import { fileQueries } from './queries/fileQueries';

dotenv.config();

export interface IDatabase {
	connect(host: string, user: string, password: string, database: string): void;
	insertUser(id: string, hash: string): Promise<string>;
	selectUser(id: string): Promise<Query>;
	insertRefreshToken(id: string, refreshToken: string): Promise<void>;
	selectRefreshToken(refreshToken: string): Promise<Query>;
	updateRefreshToken(id: string, refreshToken: string): Promise<void>;
	insertFile(file: IFile): Promise<string>;
}

export interface IFile {
	name: string;
	ext: string;
	sizeMb: number;
	mimeType: string;
	date: string;
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
		await this.query(InitQueries.dropTableRefreshTokens);
		await this.query(InitQueries.createTableUsers);
		await this.query(InitQueries.createTableRefreshTokens);
		await this.query(InitQueries.dropTableFiles);
		await this.query(InitQueries.createTableFiles);

		await this.query(InitQueries.insertUser);
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

	async insertRefreshToken(id: string, refreshToken: string): Promise<void> {
		await this.query(authQueries.insertRefreshToken, [id, refreshToken]);
	}

	async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
		await this.query(authQueries.updateRefreshToken, [refreshToken, id]);
	}

	async selectRefreshToken(refreshToken: string): Promise<Query> {
		return await this.query(authQueries.selectRefreshToken, refreshToken);
	}

	async insertFile(file: IFile): Promise<string> {
		await this.query(fileQueries.insertFile, [
			file.name,
			file.ext,
			file.mimeType,
			file.sizeMb,
			file.date,
		]);
		return 'File is uploaded';
	}
}
