import {isEmail, isMobilePhone, isString } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export async function validateAuthData(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { id, password } = req.body
	
	if (!id) {
		return res.status(400).json({error: 'Provide id'})
	}

	if (!password) {
		return res.status(400).json({ error: 'Provide password' });
	}

	if (!(isEmail(id) || isMobilePhone(id))) {
		return res.status(400).json({ error: 'Invalid value of id' });
	}

	next();
}
