import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { Table } from 'sst/node/table';
import { WebSocketApiHandler, useConnectionId } from 'sst/node/websocket-api';

const dynamoDb = new DynamoDB();

export const handler = WebSocketApiHandler(async () => {
	const connectionId = useConnectionId();

	const params = {
		TableName: Table.Connections.tableName,
		Item: {
			id: { S: connectionId },
		},
	};

	await dynamoDb.putItem(params);

	return { statusCode: 200, body: 'Connected' };
});
