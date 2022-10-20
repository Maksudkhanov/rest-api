import { Query } from 'mysql';

export function IsNotEmptyArr(arr: any[] | Query) {
	return Array.isArray(arr) && arr.length;
}