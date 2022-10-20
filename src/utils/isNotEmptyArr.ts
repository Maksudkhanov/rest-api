import { Query } from 'mysql';

export function isNotEmptyArr(arr: any[] | Query) {
	return Array.isArray(arr) && arr.length;
}