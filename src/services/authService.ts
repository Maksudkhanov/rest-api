import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Query } from 'mysql';
import { AuthDto } from '../dto/auth.dto';
import { IAuthTokensDto } from '../dto/auth.tokens.dto';
import { IDatabase } from './../db/db';
dotenv.config();

export interface IAuthService {
	signup(authDto: AuthDto): Promise<string>;
	signin(authDto: AuthDto): Promise<IAuthTokensDto>;
	refreshToken(refreshToken: string): string;
	findById(id: string): Promise<Query>;
	findRefreshToken(refreshToken: string): Promise<Query>;
}

export class AuthService implements IAuthService {
	constructor(private readonly db: IDatabase) {
		this.db = db;
	}

	async signup(authDto: AuthDto): Promise<string> {
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

	async signin(authDto: AuthDto): Promise<IAuthTokensDto> {
		const id = authDto.id;

		const bearerToken = generateBearerToken(id);
		const refreshToken = generateRefreshToken(id);

		await this.db.insertRefreshToken(refreshToken);

		return { bearerToken, refreshToken };
	}

	refreshToken(id: string): string {
		return generateBearerToken(id);
	}

	async findRefreshToken(refreshToken: string): Promise<Query> {
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
