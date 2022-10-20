import { isString } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export function validateRefreshToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const refreshToken = req.body.refreshToken;
	if (!refreshToken) {
		return res.status(400).json({ err: 'Provide refreshToken' });
	}

	if (!isString(refreshToken)) {
		return res.status(400).json({ err: 'Invalid type of refreshToken' });
	}
	next();
}
