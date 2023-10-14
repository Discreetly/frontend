import type { ConfigurationI } from './types';
import { IdentityStoreE } from './types';

export const defaultServers = {
	'https://server.discreetly.chat/': {
		name: 'Discreetly Server',
		url: 'https://server.discreetly.chat/'
	}
};

export const configDefaults: ConfigurationI = {
	signUpStatus: {
		completedSignup: false,
		identityBackedUp: false
	},
	identityStore: IdentityStoreE.NO_IDENTITY,
	numMessagesToSave: 500,
	hashedPwd: undefined,
	beta: false
};
