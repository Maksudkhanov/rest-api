import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import { IDatabase, IFile } from '../db/db';

export interface IFileService {
	insertFile(file: UploadedFile | UploadedFile[]): Promise<string>;
	showFileInfo(id: number): Promise<IFile>;
	deleteById(id: number, fileInfo: IFile): Promise<string>;
	updateById(
		id: number,
		newFile: UploadedFile | UploadedFile[],
		oldFile: IFile
	): Promise<string>;
	selectAll(): Promise<FileAndInfo[] | []>;
}

export interface FileAndInfo {
	fileInfo: IFile;
	file: Error | Buffer;
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

	async showFileInfo(id: number): Promise<IFile> {
		const file = await this.db.selectFileById(id);
		return file;
	}

	async deleteById(id: number, fileInfo: IFile): Promise<string> {
		deleteFile(fileInfo);
		const result = await this.db.deleteFileById(id);
		return result;
	}

	async updateById(
		id: number,
		newFile: UploadedFile,
		oldFile: IFile
	): Promise<string> {
		deleteFile(oldFile);
		await uploadFile(newFile);

		const newFileInfo = getFileInfo(newFile);
		const result = await this.db.updateFileById(id, newFileInfo);

		return result;
	}

	async selectAll(): Promise<FileAndInfo[] | []> {
		const filesInfo = await this.db.selectAll();
		return await Promise.all(
			filesInfo.map(async (file) => ({
				fileInfo: file,
				file: await readFile(`./uploads/${file.name}.${file.ext}`),
			}))
		);
	}
}

const readFile = (filePath: string): Promise<Error | Buffer> => {
	return new Promise((resolve, reject) => {
		fs.readFile(
			filePath,
			(error: NodeJS.ErrnoException | null, fileContent: Buffer) => {
				if (error !== null) {
					reject(error);
					return;
				}

				resolve(fileContent);
			}
		);
	});
};

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

function deleteFile(oldFile: IFile) {
	fs.rm(
		`./uploads/${oldFile.name}.${oldFile.ext}`,
		(err: NodeJS.ErrnoException | null) => {
			if (err) {
				console.log(err);
			}
		}
	);
	return;
}
