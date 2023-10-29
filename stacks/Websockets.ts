import { StackContext, Table, WebSocketApi } from 'sst/constructs';

export function WSApi({ stack }: StackContext) {
	const connectionsTable = new Table(stack, 'Connections', {
		fields: {
			id: 'string',
		},
		primaryIndex: { partitionKey: 'id' },
	});

	const wsApi = new WebSocketApi(stack, 'WebSocketApi', {
		defaults: {
			function: {
				bind: [connectionsTable],
			},
		},
		routes: {
			$connect: 'packages/functions/src/ws/connect.handler',
			$disconnect: 'packages/functions/src/ws/disconnect.handler',
		},
	});

	stack.addOutputs({
		WebsocketsEndpoint: wsApi.url,
	});

	return { wsApi, connectionsTable };
}
