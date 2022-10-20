import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Query } from 'mysql';
import { IDatabase } from './../db/db';
dotenv.config();

export interface IAuthService {
	register(authDto: any): Promise<string>;
	login(authDto: any): Promise<any>;
	refreshToken(authDto: any): Promise<any>;
	findById(id: string): Promise<Query>;
}

export class AuthService implements IAuthService {
	constructor(private readonly db: IDatabase) {
		this.db = db;
	}

	async register(authDto: any): Promise<string> {
		const { id, password } = authDto;

		const salt = Number(process.env.SALT as string);
		const hash = bcrypt.hashSync(password, salt);
		const result = await this.db.insertUser(id, hash);

		return result;
	}

	async findById(id: string): Promise<Query> {
		const result = await this.db.selectUser(id);
		return result;
	}

	login(authDto: any): Promise<any> {
		throw new Error('Method not implemented.');
	}

	refreshToken(authDto: any): Promise<any> {
		throw new Error('Method not implemented.');
	}
}
