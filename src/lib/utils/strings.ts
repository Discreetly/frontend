export function stringToHash(str: string, modulo = 360): number {
	let hash = 0;
	if (str !== '') {
		for (let i = 0; i < str.length; i++) {
			hash += str.charCodeAt(i);
		}
	}
	return hash % modulo;
}
