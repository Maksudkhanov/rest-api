import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { IDatabase } from '../db/db';
import { IFileInfo } from '../interfaces/fileInfo';

export interface IFileService {
	insertFile(file: UploadedFile | UploadedFile[]): Promise<string>;
	showFileInfo(id: number): Promise<IFileInfo | undefined>;
	deleteFileById(id: number, fileInfo: IFileInfo): Promise<string>;
	updateFileById(
		id: number,
		newFile: UploadedFile | UploadedFile[],
		oldFile: IFileInfo
	): Promise<string>;
	selectAllFiles(): Promise<IFileInfo[] | []>;
}

export class FileService implements IFileService {
	constructor(private readonly db: IDatabase) {
		this.db = db;
	}

	async insertFile(file: UploadedFile): Promise<string> {
		await uploadFile(file);

		const fileInfo = getFileInfo(file);
		const result = await this.db.insertFile(fileInfo);

		return result;
	}

	async showFileInfo(id: number): Promise<IFileInfo | undefined> {
		const file = await this.db.selectFileById(id);
		return file;
	}

	async deleteFileById(id: number, fileInfo: IFileInfo): Promise<string> {
		deleteFile(fileInfo);
		const result = await this.db.deleteFileById(id);
		return result;
	}

	async updateFileById(
		id: number,
		newFile: UploadedFile,
		oldFileInfo: IFileInfo
	): Promise<string> {
		deleteFile(oldFileInfo);
		await uploadFile(newFile);

		const newFileInfo = getFileInfo(newFile);
		const result = await this.db.updateFileById(id, newFileInfo);

		return result;
	}

	async selectAllFiles(): Promise<IFileInfo[] | []> {
		const filesInfo = await this.db.selectAllFiles();
		return filesInfo;
	}
}

async function uploadFile(file: UploadedFile) {
	return await file.mv('./uploads/' + file.name);
}

function getFileInfo(file: UploadedFile) {
	const dataname = file.name.split('.');
	return {
		name: dataname[0],
		ext: dataname[1],
		sizeMb: Number((file.size / (1000 * 1000)).toFixed(2)),
		mimeType: file.mimetype,
		date: new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' }),
	};
}

function deleteFile(oldFileInfo: IFileInfo) {
	fs.rm(
		`./uploads/${oldFileInfo.name}.${oldFileInfo.ext}`,
		(err: NodeJS.ErrnoException | null) => {
			if (err) {
				console.log(err);
			}
		}
	);
	return;
}
