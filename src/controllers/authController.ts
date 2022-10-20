import express, { Request, Response } from 'express';
import { checkForDuplicateId } from '../middlewares/checkForDuplicateId';
import { checkForExistanceId } from '../middlewares/checkForExistanceId';
import { validateSignUpDto } from '../middlewares/validateSignUpDto';
import { IAuthService } from '../services/authService';

export function authController(authService: IAuthService) {
	const router = express.Router();

	router.post(
		'/signup',
		validateSignUpDto,
		checkForDuplicateId(authService),
		async (req: Request, res: Response) => {
			try {
				const result = await authService.signup(req.body);
				res.status(201).json({ msg: result });
			} catch (error) {
				console.log(error);
				res.status(500).json({ error: error });
			}
		}
	);

	router.post(
		'/signin',
		validateSignUpDto,
		checkForExistanceId(authService),
		async (req: Request, res: Response) => {
			try {
				const result = await authService.signin(req.body);
				res.status(200).json(result);
			} catch (error) {
				res.status(500).json({ error: error });
			}
		}
	);

	return router;
}
