import { StackContext, EventBus, use } from 'sst/constructs';
import { WSApi } from './Websockets';

export function Events({ stack }: StackContext) {
	const { wsApi, connectionsTable } = use(WSApi);

	const bus = new EventBus(stack, 'EventsBus', {
		defaults: {
			retries: 10,
		},
	});

	bus.subscribe('order.created', {
		bind: [wsApi, connectionsTable],
		handler: 'packages/functions/src/events/order-created.handler',
	});

	return { bus };
}
