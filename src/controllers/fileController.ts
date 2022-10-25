import express, { Request, Response } from 'express';
import { isEmpty } from 'class-validator';
import { UploadedFile } from 'express-fileupload';
import { checkForExistanceFile } from '../middlewares/checkForExistanceFile';
import { validateFile } from '../middlewares/validateFile';
import { IFileService } from '../services/fileService';
import { paginateItems } from '../utils/paginateItems';

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

	router.delete(
		'/delete/:id',
		checkForExistanceFile(fileService),
		async (req: Request, res: Response) => {
			try {
				const id = Number(req.params.id);
				const fileInfo = req.fileInfo!;
				const result = await fileService.deleteFileById(id, fileInfo);

				res.status(200).json({ msg: result });
			} catch (error) {
				res.status(500).send(error);
			}
		}
	);

	router.put(
		'/update/:id',
		checkForExistanceFile(fileService),
		async (req: Request, res: Response) => {
			try {
				const id = Number(req.params.id);
				const oldFile = req.fileInfo!;
				const avatar: UploadedFile | UploadedFile[] = req.files!.avatar;

				const result = await fileService.updateFileById(id, avatar, oldFile);
				res.status(200).json({ msg: result });
			} catch (error) {
				res.status(500).send(error);
			}
		}
	);

	router.get('/list', async (req: Request, res: Response) => {
		try {
			const page = Number(req.query.page ?? 1);
			const limit = Number(req.query.limit ?? 10);
			const files = await fileService.selectAllFiles();

			if (files.length === 0) {
				res.status(404).json({ msg: 'No files' });
				return;
			}

			const paginatedFiles = paginateItems(files)(page, limit);
			res.status(200).json(paginatedFiles);
		} catch (error) {
			res.status(500).json(error);
		}
	});

	router.get('/:id', async (req: Request, res: Response) => {
		try {
			const id = Number(req.params.id);
			const result = await fileService.showFileInfo(id);

			if (!result) {
				return res.status(404).json({ error: 'No such file' });
			}

			res.status(200).json(result);
		} catch (err) {
			res.status(500).send(err);
		}
	});

	router.get('/dowload/:id', async (req: Request, res: Response) => {
		try {
			const id = Number(req.params.id);
			const fileInfo = await fileService.showFileInfo(id);

			if (isEmpty(fileInfo)) {
				return res.status(404).json({ error: 'No such file' });
			}

			const pathToFile = `./uploads/${fileInfo!.name}.${fileInfo!.ext}`;
			res.status(200).download(pathToFile);
		} catch (error) {
			res.status(500).send(error);
		}
	});

	return router;
}
