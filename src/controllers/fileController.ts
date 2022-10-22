import { isEmpty } from 'class-validator';
import express, { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { checkForExistanceFile } from '../middlewares/checkForExistanceFile';
import { validateFile } from '../middlewares/validateFile';
import { IFileService } from '../services/fileService';

export function fileController(fileService: IFileService) {
	const router = express.Router();

	router.post('/upload', validateFile, async (req: Request, res: Response) => {
		try {
			const avatar: UploadedFile | UploadedFile[] = req.files!.avatar;
			const result = await fileService.insertFile(avatar);

			res.status(201).json({ msg: result });
		} catch (err) {
			res.status(500).send(err);
		}
	});

	router.get('/:id', async (req: Request, res: Response) => {
		try {
			const id = Number(req.params.id);
			const result = await fileService.showFileInfo(id);

			if (isEmpty(result)) {
				return res.status(404).json({ error: 'No such file' });
			}

			res.status(200).json(result);
		} catch (err) {
			res.status(500).send(err);
		}
	});

	router.delete(
		'/delete/:id',
		checkForExistanceFile(fileService),
		async (req: Request, res: Response) => {
			try {
				const id = Number(req.params.id);
				const fileInfo = req.body.fileInfo;
				const result = await fileService.deleteById(id, fileInfo);
				res.status(200).json({ msg: result})
			} catch (error) {
				res.status(500).send(error);
			}
		}
	);

	return router;
}
