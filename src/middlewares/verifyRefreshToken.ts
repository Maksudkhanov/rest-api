import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthService } from '../services/authService';
import { isNotEmptyArr } from '../utils/isNotEmptyArr';

export function verifyRefreshToken(authService: IAuthService) {
	return async function (req: Request, res: Response, next: NextFunction) {
		try {
			const refreshToken = req.body.refreshToken;

			const result = await authService.findRefreshToken(refreshToken);
			
			
			if (!isNotEmptyArr(result)) {
				return res.status(400).json({ err: 'Invalid refreshToken' });
			}
			

			const decodedData = jwt.verify(
				refreshToken,
				process.env.REFRESH_SECRET as string
			);
			req.body = decodedData;

			next();
		} catch (error) {			
			res.status(400).json({ err: 'Invalid refreshToken' });
		}
	};
}
