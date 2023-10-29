import { event } from './events';
import { z } from 'zod';

export const Order = {
	Events: {
		Created: event('order.created', {
			address: z.object({
				name: z.string(),
				address1: z.string(),
				address2: z.string(),
				city: z.string(),
				state: z.string(),
				zip: z.string(),
				country: z.string().optional(),
			}),
		}),
	},
	WebhookEvent: {
		Name: 'order.created',
		Schema: z.object({
			id: z.string(),
			item_count: z.number(),
			item_total: z.number(),
			discount_total: z.number(),
			shipping_total: z.number(),
			tax_total: z.number(),
			total: z.number(),
			customer_first_name: z.string(),
			customer_last_name: z.string(),
			customer_email: z.string(),
			customer_phone_number: z.string(),
			customer_opted_in_to_marketing: z.boolean(),
			customer_note: z.string(),
			shipping_address_1: z.string(),
			shipping_address_2: z.string(),
			shipping_city: z.string(),
			shipping_state: z.string(),
			shipping_zip: z.string(),
			shipping_country: z.object({
				id: z.string(),
				name: z.string(),
			}),
			shipping_latitude: z.number(),
			shipping_longitude: z.number(),
			shipping_status: z.string(),
			payment_status: z.string(),
			created_at: z.string(),
			updated_at: z.string(),
			completed_at: z.string(),
			currency: z.object({
				id: z.string(),
				name: z.string(),
				sign: z.string(),
				locale: z.string(),
			}),
			events: z.array(
				z.object({
					id: z.number(),
					message: z.string(),
					created_at: z.string(),
				})
			),
			items: z.array(
				z.object({
					id: z.number(),
					product_name: z.string(),
					product_option_name: z.string(),
					quantity: z.number(),
					price: z.number(),
					total: z.number(),
					image_url: z.string(),
					product: z.object({
						id: z.number(),
					}),
					product_option: z.object({
						id: z.number(),
					}),
				})
			),
			transactions: z.array(
				z.object({
					id: z.number(),
					label: z.string(),
					amount: z.number(),
					processor: z.string(),
					processor_id: z.string(),
					processor_url: z.string(),
					currency: z.object({
						id: z.string(),
						name: z.string(),
						sign: z.string(),
						locale: z.string(),
					}),
				})
			),
			adjustments: z.array(
				z.object({
					id: z.number(),
					label: z.string(),
					amount: z.number(),
				})
			),
		}),
	},
};
