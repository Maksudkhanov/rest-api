import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import { IDatabase, IFile } from '../db/db';

export interface IFileService {
	insertFile(file: UploadedFile | UploadedFile[]): Promise<string>;
	showFileInfo(id: number): Promise<IFile>;
	deleteById(id: number, fileInfo: IFile): Promise<string>;
}

export class FileService implements IFileService {
	constructor(private readonly db: IDatabase) {
		this.db = db;
	}

	async insertFile(file: UploadedFile): Promise<string> {
		await file.mv('./uploads/' + file.name);

		const dataname = file.name.split('.');

		const fileData = {
			name: dataname[0],
			ext: dataname[1],
			sizeMb: Number((file.size / (1000 * 1000)).toFixed(2)),
			mimeType: file.mimetype,
			date: new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' }),
		};

		const result = await this.db.insertFile(fileData);
		return result;
	}

	async showFileInfo(id: number): Promise<IFile> {
		const file = await this.db.selectFileById(id);
		return file;
	}

	async deleteById(id: number, fileInfo: IFile): Promise<string> {
		const deleted = fs.rm(
			`./uploads/${fileInfo.name}.${fileInfo.ext}`,
			(err: NodeJS.ErrnoException | null) => {
				if (err) {
					console.log(err);
				}
			}
		);
		const result = await this.db.deleteFileById(id);
		return result;
	}
}
