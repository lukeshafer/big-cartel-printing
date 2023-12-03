import { StackContext, Config } from 'sst/constructs';

export function Secrets({ stack }: StackContext) {
	const BIGCARTEL_ACCOUNT_ID = new Config.Secret(stack, 'BIGCARTEL_ACCOUNT_ID');
	const BIGCARTEL_USERNAME = new Config.Secret(stack, 'BIGCARTEL_USERNAME');
	const BIGCARTEL_PASSWORD = new Config.Secret(stack, 'BIGCARTEL_PASSWORD');

	return { BIGCARTEL_ACCOUNT_ID, BIGCARTEL_USERNAME, BIGCARTEL_PASSWORD };
}
