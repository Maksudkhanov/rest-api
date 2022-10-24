import { isEmail } from 'class-validator';
import mysql from 'mysql';
import dotenv from 'dotenv';
import util from 'util';
import { InitQueries } from './queries/InitQueries';
import { authQueries } from './queries/authQueries';
import { fileQueries } from './queries/fileQueries';
import { IFileInfo } from '../interfaces/fileInfo';

dotenv.config();

export interface IDatabase {
	connect(host: string, user: string, password: string, database: string): void;

	insertUser(id: string, hash: string): Promise<string>;
	selectUser(id: string): Promise<string | undefined>;

	insertBearerToken(id: string, bearerToken: string): Promise<void>;
	selectBearerToken(bearerToken: string): Promise<string | undefined>;
	updateBearerToken(bearerToken: string): Promise<void>;

	insertRefreshToken(id: string, refreshToken: string): Promise<void>;
	selectRefreshToken(refreshToken: string): Promise<string | undefined>;

	insertFile(fileInfo: IFileInfo): Promise<string>;
	selectFileById(id: number): Promise<IFileInfo | undefined>;
	deleteFileById(id: number): Promise<string>;
	updateFileById(id: number, fileInfo: IFileInfo): Promise<string>;
	selectAllFiles(): Promise<IFileInfo[] | []>;
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

		await this.query(InitQueries.dropTableBearerTokens);
		await this.query(InitQueries.createTableBearerTokens);

		await this.query(InitQueries.dropTableRefreshTokens);
		await this.query(InitQueries.createTableRefreshTokens);

		await this.query(InitQueries.dropTableFiles);
		await this.query(InitQueries.createTableFiles);

		// await this.query(InitQueries.insertUser);
	}

	async insertUser(id: string, hash: string): Promise<string> {
		if (isEmail(id)) {
			return await this.query(authQueries.insertUserByEmail, [id, hash]);
		}
		return await this.query(authQueries.insertUserByPhoneNumber, [id, hash]);
	}

	async selectUser(id: string): Promise<string | undefined> {
		if (isEmail(id)) {
			return await this.query(authQueries.selectUserByEmail, id)[0];
		}
		return await this.query(authQueries.selectUserByPhoneNumber, id)[0];
	}

	async insertFile(fileInfo: IFileInfo): Promise<string> {
		await this.query(fileQueries.insertFile, [
			fileInfo.name,
			fileInfo.ext,
			fileInfo.mimeType,
			fileInfo.sizeMb,
			fileInfo.date,
		]);
		return 'File is uploaded';
	}

	async selectFileById(id: number): Promise<IFileInfo> {
		const file = await this.query(fileQueries.selectFileById, id);
		return file[0];
	}

	async deleteFileById(id: number): Promise<string> {
		await this.query(fileQueries.deleteFileById, id);
		return `File with id ${id} deleted`;
	}

	async updateFileById(id: number, fileInfo: IFileInfo): Promise<string> {
		await this.query(fileQueries.updateFileById, [
			fileInfo.name,
			fileInfo.ext,
			fileInfo.mimeType,
			fileInfo.sizeMb,
			fileInfo.date,
			id,
		]);
		return 'File is updated';
	}

	async selectAllFiles(): Promise<IFileInfo[] | []> {
		const result = await this.query(fileQueries.selectAll);
		return result;
	}

	async insertRefreshToken(id: string, refreshToken: string): Promise<void> {
		await this.query(authQueries.insertRefreshToken, [id, refreshToken]);
	}

	async selectRefreshToken(refreshToken: string): Promise<string | undefined> {
		const result = await this.query(
			authQueries.selectRefreshToken,
			refreshToken
		);
		return result[0];
	}

	async insertBearerToken(id: string, bearerToken: string): Promise<void> {
		await this.query(authQueries.insertBearerToken, [id, bearerToken]);
	}

	async updateBearerToken(bearerToken: string): Promise<void> {
		await this.query(authQueries.updateBearerToken, bearerToken);
	}

	async selectBearerToken(bearerToken: string): Promise<string | undefined> {
		const result = await this.query(authQueries.selectBearerToken, bearerToken);
		return result[0];
	}
}
