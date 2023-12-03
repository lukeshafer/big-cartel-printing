import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { Table } from 'sst/node/table';
import { WebSocketApiHandler } from 'sst/node/websocket-api';

const dynamoDb = new DynamoDB();

export const handler = WebSocketApiHandler(async (event) => {
	if (!event.body) return { statusCode: 400, body: 'Missing body' };
	const messageData = JSON.parse(event.body).data;

	await dynamoDb.putItem({
		TableName: Table.Orders.tableName,
		Item: {
			ordernumber: { S: messageData.orderNumber },
			printed: { BOOL: true },
		},
	});

	return { statusCode: 200, body: 'OK' };
});
