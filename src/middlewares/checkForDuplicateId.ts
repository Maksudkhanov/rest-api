import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../services/authService';

export function checkForDuplicateId(authService: IAuthService) {
	return async function (req: Request, res: Response, next: NextFunction) {
		const result = await authService.findById(req.body.id);

		console.log('++++++++++++++' + result);

		if (result) {
			return res.status(400).json({ error: 'User id is already in use' });
		}
		next();
	};
}
