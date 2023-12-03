import { SSTConfig } from 'sst';
import { WSApi } from './stacks/Websockets';
import { HttpApi } from './stacks/Http';
import { Events } from './stacks/Events';
import { Table } from './stacks/Table';
import { Secrets } from './stacks/Secrets';
import { Cron } from './stacks/Cron';

export default {
	config() {
		return {
			name: 'big-cartel-printing',
			region: 'us-east-2',
		};
	},
	stacks(app) {
		app.stack(Table).stack(Secrets).stack(WSApi).stack(Events).stack(Cron).stack(HttpApi);
	},
} satisfies SSTConfig;
