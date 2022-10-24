import express, { Request, Response } from 'express';
import { authCheck } from '../middlewares/authCheck';
import { checkForDuplicateUserId } from '../middlewares/checkForDuplicateUserId';
import { checkForExistanceUserId } from '../middlewares/checkForExistanceUserId';
import { validateRefreshToken } from '../middlewares/validateRefreshToken';
import { validateAuthData } from '../middlewares/validateAuthData';
import { verifyRefreshToken } from '../middlewares/verifyRefreshToken';
import { IAuthService } from '../services/authService';

export function authController(authService: IAuthService) {
	const router = express.Router();

	router.get('/info', authCheck, async (req: Request, res: Response) => {
		try {
			const id = req.body.id;
			res.status(200).json({ id: id });
		} catch (error) {
			res.status(500).json({ error: error });
		}
	});

	router.get('/logout', authCheck, async (req: Request, res: Response) => {
		try {
			const id = req.body.id;
			const newBearerToken = await authService.updateBearerToken(id);
			res.status(200).json({ bearerToken: newBearerToken });
		} catch (error) {
			res.status(500).json({ error: error });
		}
	});

	router.post(
		'/signup',
		validateAuthData,
		checkForDuplicateUserId(authService),
		async (req: Request, res: Response) => {
			try {
				const result = await authService.signup(req.body);
				res.status(201).json(result);
			} catch (error) {
				console.log(error);
				res.status(500).json({ error: error });
			}
		}
	);

	router.post(
		'/signin',
		validateAuthData,
		checkForExistanceUserId(authService),
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
				const bearerToken = authService.updateBearerToken(id);
				res.status(201).json({ bearerToken });
			} catch (error) {
				res.status(500).json({ error: error });
			}
		}
	);

	return router;
}
