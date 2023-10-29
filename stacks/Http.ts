import { StackContext, Api, use } from 'sst/constructs';
import { Events } from './Events';

export function HttpApi({ stack }: StackContext) {
	const { bus } = use(Events);

	const webhooksApi = new Api(stack, 'WebhooksApi', {
		defaults: {
			function: {
				bind: [bus],
			},
		},
		routes: {
			'ANY /': 'packages/functions/src/webhooks.handler',
		},
	});

	stack.addOutputs({
		ApiEndpoint: webhooksApi.url,
	});

	return { webhooksApi };
}
