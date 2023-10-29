import { ApiHandler, useJsonBody } from 'sst/node/api';
import { Order } from '@big-cartel-printing/core/order';

export const handler = ApiHandler(async () => {
	//const json = useJsonBody();
	//const results = Order.WebhookEvent.Schema.safeParse(json);
	//if (!results.success) {
	//console.log('Invalid webhook event', { error: results.error, json });
	//return { statusCode: 400, body: 'Invalid webhook event' };
	//}
	//const body = results.data;

	//const body = {
		//customer_first_name: 'John',
		//customer_last_name: 'Doe',
		//shipping_address_1: '1234 Main St',
		//shipping_address_2: 'Apt 123',
		//shipping_city: 'Anytown',
		//shipping_state: 'CA',
		//shipping_zip: '12345',
		//shipping_country: {
			//name: 'USA',
		//},
	//};

	const body = {
		customer_first_name: 'Jane',
		customer_last_name: 'Doe',
		shipping_address_1: '5678 First St',
		shipping_address_2: 'Apt 456',
		shipping_city: 'Wheretown',
		shipping_state: 'NY',
		shipping_zip: '67890',
		shipping_country: {
			name: 'USA',
		},
	}

	const result = await Order.Events.Created.publish({
		address: {
			name: `${body.customer_first_name} ${body.customer_last_name}`,
			address1: body.shipping_address_1,
			address2: body.shipping_address_2,
			city: body.shipping_city,
			state: body.shipping_state,
			zip: body.shipping_zip,
			country: body.shipping_country.name,
		},
	});
	console.log('Order created', result);
});
