import express, { Request, Response } from 'express';
import { authCheck } from '../middlewares/authCheck';
import { checkForDuplicateId } from '../middlewares/checkForDuplicateId';
import { checkForExistanceId } from '../middlewares/checkForExistanceId';
import { validateRefreshToken } from '../middlewares/validateRefreshToken';
import { validateSignUpDto } from '../middlewares/validateSignUpDto';
import { verifyRefreshToken } from '../middlewares/verifyRefreshToken';
import { IAuthService } from '../services/authService';

export function authController(authService: IAuthService) {
	const router = express.Router();

	router.get('/info', authCheck, async (req: Request, res: Response) => {
		const id = req.body.id;
		res.status(200).json({ id: id });
	});

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

	router.post(
		'/signin/new_token',
		validateRefreshToken,
		verifyRefreshToken(authService),
		async (req: Request, res: Response) => {
			try {
				const id = req.body.id;
				const bearerToken = authService.refreshToken(id);
				res.status(201).json({ bearerToken });
			} catch (error) {
				res.status(500).json({ error: error });
			}
		}
	);

	return router;
}
