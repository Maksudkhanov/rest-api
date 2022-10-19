import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { isEmail } from '../utils/isEmail';
import { IDatabase } from './../db/db';
dotenv.config();

export interface IAuthService {
	register(authDto: any): string;
	login(authDto: any): Promise<any>;
	refreshToken(authDto: any): Promise<any>;
	findById(id: string): [] | undefined;
}

export class AuthService implements IAuthService {
	constructor(private readonly db: IDatabase) {
		this.db = db;
	}

	register(authDto: any): string {
		const { id, password } = authDto;

		const salt = Number(process.env.SALT as string);
		const hash = bcrypt.hashSync(password, salt);

		return this.db.insertUser(id, hash);
	}

	findById(id: string): [] | undefined {
		return this.db.selectUser(id);
	}

	login(authDto: any): Promise<any> {
		throw new Error('Method not implemented.');
	}

	refreshToken(authDto: any): Promise<any> {
		throw new Error('Method not implemented.');
	}
}
