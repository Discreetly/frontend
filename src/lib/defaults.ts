import type { ConfigurationI, serverStoreI } from './types';
import { IdentityStoreE } from './types';
import { dev } from '$app/environment';

let defaultServers: serverStoreI;

if (dev) {
	defaultServers = {
		'https://server.discreetly.chat/': {
			name: 'Discreetly Server',
			url: 'https://server.discreetly.chat/'
		},
		'https://localhost:3000/': {
			name: 'Localhost',
			url: 'https://localhost:3000/'
		}
	};
} else {
	defaultServers = {
		'https://server.discreetly.chat/': {
			name: 'Discreetly Server',
			url: 'https://server.discreetly.chat/'
		}
	};
}
const configDefaults: ConfigurationI = {
	signUpStatus: {
		completedSignup: false,
		identityBackedUp: false
	},
	identityStore: IdentityStoreE.NO_IDENTITY,
	numMessagesToSave: 500,
	hashedPwd: undefined,
	beta: false
};

export { defaultServers, configDefaults };
