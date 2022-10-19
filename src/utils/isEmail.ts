export function isEmail(arg: string) {
	return /\S+@\S+\.\S+/.test(arg);
}
