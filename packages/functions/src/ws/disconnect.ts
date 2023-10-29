import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { Table } from 'sst/node/table';
import { WebSocketApiHandler, useConnectionId } from 'sst/node/websocket-api';

const dynamoDb = new DynamoDB();

export const handler = WebSocketApiHandler(async () => {
	const connectionId = useConnectionId();

	const params = {
		TableName: Table.Connections.tableName,
		Key: {
			id: { S: connectionId },
		},
	};

	await dynamoDb.deleteItem(params);

	return { statusCode: 200, body: 'Connected' };
});
