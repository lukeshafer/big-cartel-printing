import { StackContext, Table as SSTTable, WebSocketApi, use } from 'sst/constructs';
import { Table } from './Table';

export function WSApi({ stack }: StackContext) {
	const { ordersTable } = use(Table);

	const connectionsTable = new SSTTable(stack, 'Connections', {
		fields: {
			id: 'string',
		},
		primaryIndex: { partitionKey: 'id' },
	});

	const wsApi = new WebSocketApi(stack, 'WebSocketApi', {
		defaults: {
			function: {
				bind: [connectionsTable, ordersTable],
			},
		},
		routes: {
			$connect: 'packages/functions/src/ws/connect.handler',
			$disconnect: 'packages/functions/src/ws/disconnect.handler',
			labelprinted: 'packages/functions/src/ws/label-printed.handler',
		},
	});

	stack.addOutputs({
		WebsocketsEndpoint: wsApi.url,
	});

	return { wsApi, connectionsTable };
}
