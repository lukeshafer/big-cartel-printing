import { Table } from 'sst/node/table';
import { OrderSchema } from './big-cartel';
import { event } from './events';
import { z } from 'zod';
import { AttributeValue, DynamoDB } from '@aws-sdk/client-dynamodb';

const OrdersTableName = Table.Orders.tableName;
const dynamoDb = new DynamoDB();

export const Order = {
  Events: {
    Created: event('order.created', {
      order_id: z.string(),
      address: z.object({
        name: z.string(),
        address1: z.string().optional(),
        address2: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        country: z.string().optional(),
      }),
    }),
  },
  WebhookEvent: {
    Name: 'order.created',
    Schema: OrderSchema,
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
