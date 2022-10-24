import { Request, Response, NextFunction } from 'express';
import { IFileService } from '../services/fileService';

export function checkForExistanceFile(fileService: IFileService) {
	return async function (req: Request, res: Response, next: NextFunction) {
		const id = Number(req.params.id);
		const result = await fileService.showFileInfo(id);
		
		if (!result) {
			return res.status(404).json({ error: 'No such file' });
		}

		req.fileInfo = result;
		next();
	};
}
