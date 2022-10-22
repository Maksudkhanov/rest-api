import express, { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { validateFile } from '../middlewares/validateFile';
import { IFileService } from '../services/fileService';

export function fileController(fileService: IFileService) {
	const router = express.Router();

	router.post('/upload', validateFile, async (req: Request, res: Response) => {
		try {
			
			if (Array.isArray(req.files?.avatar)) {
				return res.status(400).json({ err: 'Only one file can be uploaded' });
			}

			let avatar: UploadedFile = req.files!.avatar;

			const result = await fileService.insertFile(avatar);
			res.status(201).json({ msg: result });
		} catch (err) {
			res.status(500).send(err);
		}
	});

	return router;
}

interface IAvatar {
	name: string;
	data: Buffer;
	size: number;
	encoding: string;
	tempFilePath: string;
	truncated: boolean;
	mimetype: string;
	md5: string;
	mv: Function;
}
