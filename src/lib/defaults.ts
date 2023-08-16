import type { ConfigurationI } from './types';
import { IdentityStoreE } from './types';

const discreetlyURL = 'https://server.discreetly.chat/';

export const defaultServers = { discreetlyURL: { name: 'Discreetly Server', url: discreetlyURL } };

export const configDefaults: ConfigurationI = {
	signUpStatus: {
		inviteAccepted: false,
		identityBackedUp: false
	},
	identityStore: IdentityStoreE.NO_IDENTITY
};
