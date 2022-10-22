import express, { NextFunction, Request, Response } from 'express';

export function validateFile(req: Request, res: Response, next: NextFunction) {
	if (!req.files) {
		return res.status(400).json({ err: 'No file uploaded' });
	}

	next();
}
