import { generatePDF } from './src/generatePDF.mjs';
import { writeFile } from 'fs/promises';
import { printBuffer } from './src/printBuffer.mjs';
import labelTemplate from './templates/label.mjs';
import WebSocket from 'ws';

const ws = new WebSocket('wss://750ryrtfm5.execute-api.us-east-2.amazonaws.com/luke');

ws.on('open', () => {
	console.log('open');
});

ws.on('message', async (rawData) => {
	console.log('Received message: ', rawData.toString());
	const body = JSON.parse(rawData.toString());
	switch (body.type) {
		case 'order-created':
			return await handleOrderCreated(body.data);
    default: return;
	}
});

/** @param {any} data */
async function handleOrderCreated(data) {
	const content = labelTemplate(data.address);
	const pdf = await generatePDF(content);
	await printBuffer(pdf, 'Rollo');

  console.log("Printed, sending 'label-printed' message to server")

	await ws.send(JSON.stringify({
    action: 'labelprinted',
    data: {
      orderNumber: data.order_id
    }
  }));
}

ws.on('close', () => {
	console.log('close');
});

ws.on('order-created', async () => {
	console.log('order-created');

	const content = labelTemplate({
		name: 'John Doe',
		address1: '1234 Main St',
		address2: 'Apt 123',
		city: 'Anytown',
		state: 'CA',
		zip: '12345',
		country: 'USA',
	});

	const pdf = await generatePDF(content);

	await writeFile('./example.pdf', pdf);
});

//await printBuffer(pdf);
