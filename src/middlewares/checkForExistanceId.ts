import { IAuthService } from './../services/authService';
import { Request, Response, NextFunction } from 'express';
import { Query } from 'mysql';
import { isNotEmptyArr } from '../utils/isNotEmptyArr';

export function checkForExistanceId(authService: IAuthService) {
	return async function (req: Request, res: Response, next: NextFunction) {
		const result: Query = await authService.findById(req.body.id);

		if (!isNotEmptyArr(result)) {
			return res.status(400).json({ error: 'No such id' });
		}
		next();
	};
}
