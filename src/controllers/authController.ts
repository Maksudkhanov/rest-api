import express, { Request, Response } from 'express';
import { authCheck } from '../middlewares/authCheck';
import { checkForDuplicateUserId } from '../middlewares/checkForDuplicateUserId';
import { checkForExistanceUserId } from '../middlewares/checkForExistanceUserId';
import { validateAuthData } from '../middlewares/validateAuthData';
import { verifyRefreshToken } from '../middlewares/verifyRefreshToken';
import { IAuthService } from '../services/authService';
import bcrypt from 'bcrypt';

export function authController(authService: IAuthService) {
	const router = express.Router();

	router.get('/info', authCheck(authService), async (req: Request, res: Response) => {
		try {
			const id = req.userId;
			res.status(200).json({ id: id });
		} catch (error) {
			res.status(500).json({ error: error });
		}
	});

	router.get('/logout', authCheck(authService), async (req: Request, res: Response) => {
		try {
			
			const id = req.userId;
			const newBearerToken = await authService.createorUpdateBearerToken(id);
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
				const { id, password } = req.body;

				const validPassword = bcrypt.compareSync(
					password,
					req.userData?.password!
				);
				if (!validPassword) {
					res.status(400).json({ msg: 'Incorrect password' });
					return;
				}

				const result = await authService.createorUpdateBearerToken(id);

				res.status(200).json({ bearerToken: result });
			} catch (error) {
				res.status(500).json({ error: error });
			}
		}
	);

	router.post(
		'/signin/new_token',
		verifyRefreshToken(authService),
		async (req: Request, res: Response) => {
			try {
				const id = req.userId;
				const bearerToken = await authService.createorUpdateBearerToken(id);
				res.status(201).json({ bearerToken: bearerToken });
			} catch (error) {
				res.status(500).json({ error: error });
			}
		}
	);

	return router;
}
