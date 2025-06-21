import { z } from 'zod';

export const OrderEvent = {
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
};

export const OrderWSEvent = z.object(OrderEvent);

export const LabelPrintedEvent = z.object({
  orderNumber: z.string(),
});

export function createStringWithSchema<Schema extends z.ZodSchema>(input: z.infer<Schema>) {
  return JSON.stringify(input);
}
