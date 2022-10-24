import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../services/authService';

export function checkForExistanceUserId(authService: IAuthService) {
	return async function (req: Request, res: Response, next: NextFunction) {
		const result = await authService.selectUserById(req.body.id);
		
		if (!result) {
			return res.status(404).json({ error: 'No such id' });
		}

		req.userData = result
		next();
	};
}
