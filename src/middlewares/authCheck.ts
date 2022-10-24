import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import { IAuthService } from '../services/authService';

dotenv.config();

export function authCheck(authService: IAuthService) {
	return async function (req: Request, res: Response, next: NextFunction) {
		if (req.method === 'OPTIONS') {
			next();
		}

		try {
			const token = req.headers?.authorization?.split(' ')[1];
			if (!token) {
				res.status(403).json({ err: 'Provide token' });
				return;
			}

			const result = await authService.selectBearerToken(token);
			if (!result) {
				return res.status(400).json({ err: 'Invalid token' });
			}

			const decodedData: any = jwt.verify(
				token,
				process.env.BEARER_SECRET as string
			);

			req.userId = decodedData.id;

			next();
		} catch (error) {

			res.status(403).json({ err: 'User not authorized' });
		}
	};
}
