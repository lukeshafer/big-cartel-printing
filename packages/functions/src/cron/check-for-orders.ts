import {
	checkOrderHasStampShipping,
	getOrders,
	getStampShippingFromIncluded,
} from '@big-cartel-printing/core/big-cartel';
import { Order, getUnprintedOrderFromDb } from '@big-cartel-printing/core/order';

export async function handler() {
	const { data, included } = await getOrders({
		params: [
			//['filter[shipping_status]', 'unshipped'],
			['search', 'Emily'],
		],
	});

	const stamp_shipping = getStampShippingFromIncluded(included);
	if (!stamp_shipping) return;

	const orders_with_stamp_shipping = data.filter((order) =>
		checkOrderHasStampShipping(order, stamp_shipping.id)
	);

	for (const order of orders_with_stamp_shipping) {
		const result = await getUnprintedOrderFromDb(order.id);
		if (result.Count) continue;

    // Publish Order Created Event
		await Order.Events.Created.publish({
			order_id: order.id,
			address: {
				name: `${order.attributes.customer_first_name} ${order.attributes.customer_last_name}`,
				address1: order.attributes.shipping_address_1 || undefined,
				address2: order.attributes.shipping_address_2 || undefined,
				city: order.attributes.shipping_city || undefined,
				state: order.attributes.shipping_state || undefined,
				zip: order.attributes.shipping_zip || undefined,
				country: order.attributes.shipping_country_id || undefined,
			},
		});
	}
}
