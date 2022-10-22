import { Request, Response, NextFunction } from 'express';
import { IFileService } from '../services/fileService';
import { IFile } from '../db/db';
import { isEmpty } from 'class-validator';

export function checkForExistanceFile(fileService: IFileService) {
	return async function (req: Request, res: Response, next: NextFunction) {
		const id = Number(req.params.id);
		const result: IFile = await fileService.showFileInfo(id);

		if (isEmpty(result)) {
			return res.status(404).json({ error: 'No such file' });
		}

		req.body.fileInfo = result;
		next();
	};
}
