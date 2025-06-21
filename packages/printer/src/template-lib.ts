import { readFileSync } from 'fs';

export function loadImage(path: string, format = 'png') {
	const file = readFileSync(path);
	const base64 = file.toString('base64');
	return `data:image/${format};base64,${base64}`;
}
