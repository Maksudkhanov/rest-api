import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { IAuthFields } from '../interfaces/authFields';
import { IAuthTokens } from '../interfaces/authTokens';
import { IDatabase } from './../db/db';
dotenv.config();

export interface IAuthService {
	signup(authFields: IAuthFields): Promise<IAuthTokens>;
	selectUserById(id: string): Promise<IAuthFields | undefined>;

	createorUpdateBearerToken(id: string): Promise<string>;
	selectBearerToken(
		bearerToken: string
	): Promise<string | undefined>;
	selectRefreshToken(refreshToken: string): Promise<string | undefined>;
}

export class AuthService implements IAuthService {
	constructor(private readonly db: IDatabase) {
		this.db = db;
	}

	async signup(authFields: IAuthFields): Promise<IAuthTokens> {
		const { id, password } = authFields;

		const salt = Number(process.env.SALT as string);
		const hash = bcrypt.hashSync(password, salt);
		await this.db.insertUser(id, hash);

		const bearerToken = generateBearerToken(id);
		const refreshToken = generateRefreshToken(id);

		await this.db.insertBearerToken(id, bearerToken);
		await this.db.insertRefreshToken(refreshToken);

		return { bearerToken, refreshToken };
	}

	async selectUserById(id: string): Promise<IAuthFields | undefined> {
		const result = await this.db.selectUser(id);
		return result;
	}

	async createorUpdateBearerToken(id: string): Promise<string> {
		const newBearerToken = generateBearerToken(id);
		await this.db.updateBearerToken(id, newBearerToken);
		return newBearerToken;
	}

	async selectBearerToken(
		bearerToken: string
	): Promise<string | undefined> {
		return await this.db.selectBearerToken(bearerToken);
	}

	async selectRefreshToken(refreshToken: string): Promise<string | undefined> {
		return await this.db.selectRefreshToken(refreshToken);
	}
}

function generateBearerToken(id: string): string {
	const token = jwt.sign({ id: id }, process.env.BEARER_SECRET as string, {
		expiresIn: process.env.BEARER_EXPIRES as string,
	});
	return token;
}

function generateRefreshToken(id: string): string {
	const token = jwt.sign({ id: id }, process.env.REFRESH_SECRET as string, {
		expiresIn: process.env.REFRESH_EXPIRES as string,
	});
	return token;
}
