import type { ConfigurationI, IdentityStoreI } from '../types/';
import { IdentityStoreE } from '../types/';
import type { ServerI } from 'discreetly-interfaces';
import { storable, sessionable } from './storeFactory';

/**
 * @description List of server URLs, this is mainly for bootstraping the app
 */
export const serverListStore = storable([] as string[], 'servers');

interface serverDataStoreI {
	[key: string]: ServerI;
}

/**
 * @description Server Metadata keyed by the server's URL
 */
export const serverDataStore = storable({} as serverDataStoreI, 'serverData');

/**
 * @description The URL of the currently selected server
 */
export const selectedServer = storable('', 'selectedServer');

/**
 * @description The room ID of the currently selected room
 */
export const selectedRoom = storable('', 'selectedRoom');

export const roomsStore = storable(
	{
		selectedRoomId: undefined,
		roomsData: {}
	},
	'roomsStore'
);

export const configStore = storable(
	{
		signUpStatus: {
			inviteAccepted: false,
			identityBackedUp: false
		},
		identityStore: IdentityStoreE.NO_IDENTITY
	} as ConfigurationI,
	'signupStatus'
);

// Session store (removed after the session is cleared) of the last 500 messages or so of each room the user participates in; rooms they don't have selected will not be updated
export const messageStore = sessionable({}, 'messages');

// Stores the user's identity // TODO THIS NEEDS TO BE AN ENCRYPTED SEMAPHORE IDENTITY IN THE FUTURE
export const identityStore = storable({} as IdentityStoreI, 'identity');
serverListStore;
