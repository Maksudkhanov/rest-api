import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Query } from 'mysql';
import { IAuthFields } from '../interfaces/authFields';
import { IAuthTokens} from '../interfaces/authTokens';
import { IDatabase } from './../db/db';
dotenv.config();

export interface IAuthService {
	signup(authFields: IAuthFields): Promise<IAuthTokens>;
	signin(authFields: IAuthFields): Promise<IAuthTokens>;

	updateBearerToken(id: string): Promise<string>;

	selectUserById(id: string): Promise<string | undefined>;
	selectBearerToken(refreshToken: string): Promise<string | undefined>;
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
		await this.db.insertRefreshToken(id, refreshToken);

		return { bearerToken, refreshToken };
	}

	async selectUserById(id: string): Promise<string | undefined> {
		const result = await this.db.selectUser(id);
		return result;
	}

	async signin(authFields: IAuthFields): Promise<any> {
		// const id = authDto.id;
		// return { bearerToken, refreshToken };
	}

	async updateBearerToken(id: string): Promise<string> {
		// const newBearerToken = generateBearerToken(id)
		// await this.db.updateBearerToken(id, newBearerToken);
		// return newBearerToken;
		return 'as';
	}

	async selectBearerToken(refreshToken: string): Promise<string | undefined> {
		return undefined;
	}

	async findRefreshToken(bearerToken: string): Promise<string | undefined> {
		return await this.db.selectBearerToken(bearerToken);
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
