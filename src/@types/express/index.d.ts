import { IAuthFields } from '../../interfaces/authFields';
import { IFileInfo } from '../../interfaces/fileInfo';
import { Language, User } from '../custom';

export {};

declare global {
	namespace Express {
		export interface Request {
			fileInfo?: IFileInfo;
			userData?: IAuthFields;
			userId: string
		}
	}
}
