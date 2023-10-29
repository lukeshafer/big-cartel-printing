import { EventHandler } from 'sst/node/event-bus';
import { ApiGatewayManagementApi } from '@aws-sdk/client-apigatewaymanagementapi';
import { WebSocketApi } from 'sst/node/websocket-api';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { Table } from 'sst/node/table';
import { Order } from '@big-cartel-printing/core/order';

const TableName = Table.Connections.tableName;
const dynamoDb = new DynamoDB();

export const handler = EventHandler(Order.Events.Created, async (evt) => {
	const messageData = JSON.stringify({
		type: 'order-created',
		data: evt.properties,
	});

	const connections = await dynamoDb.scan({ TableName, ProjectionExpression: 'id' });

	const apiG = new ApiGatewayManagementApi({
		endpoint: WebSocketApi.WebSocketApi.httpsUrl,
	});

	const postToConnection = async (connectionId: string) => {
		try {
			console.log('Sending message to connection', connectionId);
			await apiG.postToConnection({ ConnectionId: connectionId, Data: messageData });
		} catch (e) {
			console.log('Failed to send message to connection', connectionId, e);
			// @ts-expect-error - e is unknown but this is fine
			if (e?.statusCode === 410) {
				// Remove stale connections
				await dynamoDb.deleteItem({ TableName, Key: { id: { S: connectionId } } });
			}
		}
	};

	await Promise.all(
		connections.Items?.map((item) => (item.id.S ? postToConnection(item.id.S) : null)) || []
	);
});
