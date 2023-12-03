import { z } from 'zod';
import { Config } from 'sst/node/config';

const stringOrNumber = () => z.union([z.string(), z.number(), z.undefined()]);

export async function getOrders(
  options: {
    params?: [key: string, value: string][];
  } = {}
) {
  const url = new URL(
    `https://api.bigcartel.com/v1/accounts/${Config.BIGCARTEL_ACCOUNT_ID}/orders`
  );
  options.params?.forEach((entry) => url.searchParams.set(...entry));

  return fetch(url.toString(), {
    headers: {
      Accept: 'application/vnd.api+json',
      'User-Agent': 'hello@lukeshafer.com',
      Authorization: getAuthorization(),
    },
  })
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((res) => OrderResponseSchema.passthrough().parse(res))
    .catch((err) => {
      if (err instanceof Response) {
        err.text().then(console.log);
      }
      console.error(err);
      throw err;
    });
}

export function getStampShippingFromIncluded<T extends z.ZodSchema[]>(
  included: z.infer<ReturnType<typeof IncludedSchema<T>>>
) {
  const stamp_shipping = included.find(
    (i) => i.type === 'order_adjustments/base' && i.attributes?.label.match(/stamps only/i)
  );

  return stamp_shipping as z.infer<typeof OrderAdjustmentsBaseSchema> | undefined;
}

export function checkOrderHasStampShipping(
  order: z.infer<typeof OrderSchema>,
  stamp_shipping_id: string
) {
  return order.relationships.adjustments.data.some((adj) => adj.id === stamp_shipping_id);
}

function getAuthorization() {
  const { BIGCARTEL_USERNAME, BIGCARTEL_PASSWORD } = Config;
  const AuthBuffer = Buffer.from(`${BIGCARTEL_USERNAME}:${BIGCARTEL_PASSWORD}`).toString(
    'base64'
  );

  return `Basic ${AuthBuffer}`;
}

export const ItemsSchema = z.object(
  {
    id: stringOrNumber(),
    type: z.literal('order_line_items'),
    attributes: z.object(
      {
        product_name: z.string(),
        product_option_name: z.string(),
        quantity: stringOrNumber(),
        price: stringOrNumber(),
        total: stringOrNumber().optional().nullable(),
        quantity_shipped: stringOrNumber().optional().nullable(),
        quantity_unshipped: stringOrNumber().optional().nullable(),
        image_url: z.string().optional().nullable(),
      },
      { invalid_type_error: 'Invalid item attributes' }
    ),
    relationships: z.object({
      product: z.object({
        data: z.object({
          type: z.literal('products'),
          id: z.string(),
        }),
      }),
      product_option: z.object({
        data: z.object({
          type: z.literal('product_options'),
          id: z.string(),
        }),
      }),
    }),
  },
  { description: 'Items schema' }
);

export const OrderAdjustmentsBaseSchema = z.object({
  id: z.string(),
  type: z.literal('order_adjustments/base'),
  attributes: z.object({
    amount: z.string().transform((s) => parseFloat(s)),
    label: z.string(),
  }),
});

export const OrderSchema = z.object(
  {
    id: z.string(),
    type: z.literal('orders'),
    attributes: z.object(
      {
        item_count: stringOrNumber().optional().nullable(),
        item_total: stringOrNumber().optional().nullable(),
        discount_total: stringOrNumber().optional().nullable(),
        shipping_total: stringOrNumber().optional().nullable(),
        tax_total: stringOrNumber().optional().nullable(),
        total: stringOrNumber().optional().nullable(),
        customer_first_name: z.string().optional().nullable(),
        customer_last_name: z.string().optional().nullable(),
        customer_email: z.string().optional().nullable(),
        customer_phone_number: z.string().optional().nullable(),
        customer_opted_in_to_marketing: z.boolean().optional().nullable(),
        customer_note: z.string().optional().nullable(),
        shipping_address_1: z.string().optional().nullable(),
        shipping_address_2: z.string().optional().nullable(),
        shipping_country_id: z.string().optional().nullable(),
        shipping_city: z.string().optional().nullable(),
        shipping_state: z.string().optional().nullable(),
        shipping_zip: z.string().optional().nullable(),
        shipping_status: z.string().optional().nullable(),
        payment_status: z.string().optional().nullable(),
        created_at: z.string().optional().nullable(),
        updated_at: z.string().optional().nullable(),
        completed_at: z.string().optional().nullable(),
      },
      { invalid_type_error: 'Invalid order attributes' }
    ),
    links: z.object({
      self: z.string(),
    }),
    relationships: z.object({
      adjustments: z.object({
        data: z.array(
          z.object({
            type: z.enum(['order_adjustments/base', 'order_adjustments/tax']),
            id: z.string(),
          })
        ),
      }),
      items: z.object({
        data: z.array(
          z.object({
            type: z.literal('order_line_items'),
            id: z.string(),
          })
        ),
      }),
    }),
  },
  { description: 'Order schema' }
);

const IncludedSchema = <T extends z.ZodSchema[]>(...schemas: T) =>
  z
    .array(z.object({ type: z.string() }).passthrough())
    .transform((arr) =>
      arr
        .filter((item) => schemas.some((schema) => schema.safeParse(item).success))
        .map((item) => item as z.infer<T[number]>)
    )
    .describe('Included schema');

const CategorySchema = z.object(
  {
    id: z.string(),
    type: z.literal('categories'),
    attributes: z.object({
      name: z.string(),
    }),
  },
  { description: 'Category schema' }
);

export const ProductResponseSchema = z.object(
  {
    data: z.object({
      id: z.string(),
      type: z.literal('products'),
      attributes: z.object({}),
      relationships: z.object({
        categories: z.object({
          data: z.array(
            z.object({
              id: z.string(),
              type: z.literal('categories'),
            })
          ),
        }),
      }),
    }),
    included: IncludedSchema(CategorySchema),
  },
  { description: 'Product response schema' }
);

export const OrderResponseSchema = z.object(
  {
    data: z.array(OrderSchema),
    meta: z.object({
      count: stringOrNumber().optional().nullable(),
    }),
    included: IncludedSchema(ItemsSchema, OrderAdjustmentsBaseSchema),
  },
  { description: 'Order response schema' }
);
