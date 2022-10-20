import { Query } from 'mysql';
import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../services/authService';
import { IsNotEmptyArr } from '../utils/isNotEmptyArr';

export function checkForDuplicateId(authService: IAuthService) {
	return async function (req: Request, res: Response, next: NextFunction) {
		const result: Query = await authService.findById(req.body.id);
		
		if (IsNotEmptyArr(result)) {
			return res.status(400).json({ error: 'User id is already in use' });
		}
		
		next();
	};
}
