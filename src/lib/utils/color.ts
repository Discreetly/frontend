function hashToDarkHSL(hash: number, offset = 6): string {
	const hue = (hash + offset) % 360; // Hue ranges from 0-359
	const saturation = 22; // Full saturation
	const lightness = 12; // Keeping lightness around 30% for darkness
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
function stringToHash(str: string): number {
	let hash = 0;
	if (str !== '') {
		for (let i = 0; i < str.length; i++) {
			hash += str.charCodeAt(i);
		}
	}
	return hash % 360;
}

export function colorFromSessionId(sessionId = ''): string {
	const hash = stringToHash(sessionId);
	return hashToDarkHSL(hash);
}

export function bubbleBgFromSessionId(sessionId = ''): string {
	const hash = stringToHash(sessionId);
	const color1 = hashToDarkHSL(hash, -10);
	const color2 = hashToDarkHSL(hash, 10);
	return `background-image: linear-gradient(to right, ${color1},${color2})`;
}
