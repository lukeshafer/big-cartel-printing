import { Table } from 'sst/node/table';
import { OrderSchema } from './big-cartel';
import { z } from 'zod';
import { AttributeValue, DynamoDB } from '@aws-sdk/client-dynamodb';
import { OrderEvent } from './events';
import { createEventBuilder } from 'sst/node/event-bus';

const OrdersTableName = Table.Orders.tableName;
const dynamoDb = new DynamoDB();

export const Order = {
  Events: {
    Created: createEventBuilder({
      bus: 'EventsBus',
    })('order.created', OrderEvent),
  },
  WebhookEvent: {
    Name: 'order.created',
    Schema: OrderSchema,
  },
  WebSocketEvent: {
    'order-created': z.object(OrderEvent),
    'label-printed': z.object({
      orderNumber: z.string(),
    }),
  },
};

export async function putOrderInDb(order_id: string, fields: Record<string, AttributeValue> = {}) {
  return dynamoDb.putItem({
    TableName: OrdersTableName,
    Item: {
      ordernumber: { S: order_id },
      ...fields,
    },
  });
}

export async function getUnprintedOrderFromDb(ordernumber: string) {
  return dynamoDb.query({
    TableName: Table.Orders.tableName,
    KeyConditionExpression: 'ordernumber = :ordernumber',
    FilterExpression: 'printed = :printed',
    ExpressionAttributeValues: {
      ':ordernumber': { S: ordernumber },
      ':printed': { BOOL: true },
    },
  });
}
