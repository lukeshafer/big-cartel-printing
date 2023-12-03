import { EventHandler } from 'sst/node/event-bus';
import { ApiGatewayManagementApi } from '@aws-sdk/client-apigatewaymanagementapi';
import { WebSocketApi } from 'sst/node/websocket-api';
import { AttributeValue, DynamoDB } from '@aws-sdk/client-dynamodb';
import { Table } from 'sst/node/table';
import { Order } from './order';

const ConnectionsTableName = Table.Connections.tableName;
const dynamoDb = new DynamoDB();
const apiG = new ApiGatewayManagementApi({
  endpoint: WebSocketApi.WebSocketApi.httpsUrl,
});

export async function getConnections() {
  const connections = await dynamoDb.scan({
    TableName: ConnectionsTableName,
    ProjectionExpression: 'id',
  });

  return connections.Items ?? []
}

export async function postToConnection(connectionId: string, messageData: string) {
  try {
    console.log('Sending message to connection', connectionId);
    await apiG.postToConnection({ ConnectionId: connectionId, Data: messageData });
  } catch (e) {
    console.log('Failed to send message to connection', connectionId, e);
    // @ts-expect-error - e is unknown but this is fine
    if (e?.$metadata?.httpStatusCode === 410) {
      console.log('deleting stale connection');
      // Remove stale connections
      await dynamoDb.deleteItem({
        TableName: ConnectionsTableName,
        Key: { id: { S: connectionId } },
      });
    }
  }
}
