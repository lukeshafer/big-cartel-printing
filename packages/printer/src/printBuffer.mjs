import { print } from 'unix-print';
import { writeFile, unlink } from 'fs/promises';

/**
 * Prints a buffer to a printer
 * @param {Buffer} buffer - Buffer to print.
 * @param {string} [printer=process.env.PRINTER_NAME || 'PDF'] - Printer to print to.
 * If not specified, the printer name will be read from the PRINTER_NAME environment variable.
 * @returns {Promise<void>} - Promise that resolves when the buffer has been sent to the printer.
 */
export async function printBuffer(buffer, printer = process.env.PRINTER_NAME || 'PDF') {
	const tmpFilePath = `./${Math.random().toString(36).substr(7)}.pdf`;

	await writeFile(tmpFilePath, buffer, 'binary');
	const result = await print(tmpFilePath, printer).finally(() => unlink(tmpFilePath));
	console.log(result);
}
