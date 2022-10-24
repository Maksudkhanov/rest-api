import { Query } from 'mysql';
import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../services/authService';
import { isNotEmptyArr } from '../utils/isNotEmptyArr';

export function checkForDuplicateUserId(authService: IAuthService) {
	return async function (req: Request, res: Response, next: NextFunction) {
		const result = await authService.selectUserById(req.body.id);
		
		if (result) {
			return res.status(400).json({ error: 'User id is already in use' });
		}
		
		next();
	};
}
