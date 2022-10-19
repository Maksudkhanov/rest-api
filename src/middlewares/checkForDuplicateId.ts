import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../services/authService';

export function checkForDuplicateId(authService: IAuthService) {
	return function (req: Request, res: Response, next: NextFunction) {
		const result = authService.findById(req.body.id);

		console.log('++++++++++++++' + result);

		if (result) {
			return res.status(400).json({ error: 'user id is already in use' });
		}
		next();
	};
}
