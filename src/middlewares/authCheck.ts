import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export function authCheck(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (req.method === 'OPTIONS') {
		next();
	}

	try {
		const token = req.headers?.authorization?.split(' ')[1];
		if (!token) {
			res.status(403).json({ err: 'Provide token' });
			return;
		}

		const decodedData = jwt.verify(token, process.env.BEARER_SECRET as string);
		req.body = decodedData;

		next();
	} catch (error) {
		res.status(403).json({ err: 'User not authorized' });
	}
}
