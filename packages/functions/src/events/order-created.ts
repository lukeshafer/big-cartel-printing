import { EventHandler } from 'sst/node/event-bus';
import { Order, putOrderInDb } from '@big-cartel-printing/core/order';
import { postToConnection, getConnections } from '@big-cartel-printing/core/api';

export const handler = EventHandler(Order.Events.Created, async (evt) => {
	const messageData = JSON.stringify({
		type: 'order-created',
		data: evt.properties,
	});

	const put_item_promise = putOrderInDb(evt.properties.order_id);
	const connections = await getConnections();

	await Promise.all([
		put_item_promise,
		...connections.map(({ id }) => (id.S ? postToConnection(id.S, messageData) : null)),
	]);
});
