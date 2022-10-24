import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthService } from '../services/authService';

export function verifyRefreshToken(authService: IAuthService) {
	return async function (req: Request, res: Response, next: NextFunction) {
		try {
			const refreshToken = req.headers?.authorization?.split(' ')[1];
			if (!refreshToken) {
				res.status(403).json({ err: 'Provide token' });
				return;
			}

			const result = await authService.selectRefreshToken(refreshToken)
			console.log(result);
			
			if (!result) {
				return res.status(400).json({ err: 'Invalid refreshToken' });
			}

			const decodedData: any = jwt.verify(
				refreshToken,
				process.env.REFRESH_SECRET as string
			);

			req.userId = decodedData.id as string;

			next();
		} catch (error) {			
			res.status(400).json({ err: 'Invalid refreshToken' });
		}
	};
}
