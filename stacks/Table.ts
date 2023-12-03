import { StackContext, Table as SSTTable } from 'sst/constructs';

export function Table({ stack }: StackContext) {
	const ordersTable = new SSTTable(stack, 'Orders', {
		fields: {
			ordernumber: 'string',
		},
		primaryIndex: { partitionKey: 'ordernumber' },
	});

	return { ordersTable };
}
