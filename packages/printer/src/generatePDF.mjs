import puppeteer from 'puppeteer';

/**
 * Generate a PDF from HTML content.
 * @param {string} htmlContent - HTML content to generate PDF from.
 */
export async function generatePDF(htmlContent) {
	const browser = await puppeteer.launch({
		headless: 'new',
	});
	const page = await browser.newPage();

	await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
	await page.emulateMediaType('screen');

	const pdf = await page.pdf({
		format: 'A6',
		landscape: true,
	});

	await browser.close();

	return pdf;
}
