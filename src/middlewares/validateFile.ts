import express, { NextFunction, Request, Response } from 'express';

export function validateFile(req: Request, res: Response, next: NextFunction) {
	if (!req.files) {
		return res.status(400).json({ err: 'No file uploaded' });
	}

	const keys = Object.keys(req.files);
	if (keys.length !== 1) {
		return res.status(400).json({ err: 'Only one file can be uploaded' });
	}

	next();
}
