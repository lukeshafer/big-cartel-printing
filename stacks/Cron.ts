import { Cron as SSTCron, type StackContext, use } from 'sst/constructs';
import { Table } from './Table';
import { Events } from './Events';
import { Secrets } from './Secrets';

export function Cron({ stack }: StackContext) {
	const { ordersTable } = use(Table);
	const { bus } = use(Events);
	const { BIGCARTEL_ACCOUNT_ID, BIGCARTEL_PASSWORD, BIGCARTEL_USERNAME } = use(Secrets);

	const cron = new SSTCron(stack, 'Cron', {
		job: {
			function: {
				handler: 'packages/functions/src/cron/check-for-orders.handler',
				bind: [
					ordersTable,
					bus,
					BIGCARTEL_ACCOUNT_ID,
					BIGCARTEL_USERNAME,
					BIGCARTEL_PASSWORD,
				],
			},
		},
		schedule: 'cron(0 * * * ? *)',
	});

	return { cron };
}
