import type { ConfigurationI } from './types';
import { IdentityStoreE } from './types';

export const defaultServers = {
	'server.discreetly.chat/': { name: 'Discreetly Server', url: 'server.discreetly.chat/' }
};

export const configDefaults: ConfigurationI = {
	signUpStatus: {
		inviteAccepted: false,
		identityBackedUp: false
	},
	identityStore: IdentityStoreE.NO_IDENTITY
};
