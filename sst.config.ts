import { SSTConfig } from 'sst';
import { WSApi } from './stacks/Websockets';
import { HttpApi } from './stacks/Http';
import { Events } from './stacks/Events';

export default {
	config() {
		return {
			name: 'big-cartel-printing',
			region: 'us-east-2',
		};
	},
	stacks(app) {
		app.stack(WSApi).stack(Events).stack(HttpApi);
	},
} satisfies SSTConfig;
