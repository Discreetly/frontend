import { storable, sessionable, encryptable, queueable } from './storeFactory';
import { derived, writable } from 'svelte/store';
import { configDefaults } from '$lib/defaults';
import type {
	ConfigurationI,
	IdentityStoreI,
	consoleStoreI,
	messageStoreI,
	pixelStoreI,
	rateLimitStoreI,
	roomStoreI,
	selectedRoomStoreI,
	serverStoreI,
	roomKeyStoreI,
	keyStoreI
} from '$lib/types';

/* ------------------ Server State ------------------*/
/**
 * @description Server Metadata keyed by the server's URL
 */
export const serverStore = storable({} as serverStoreI, 'serverData');

/**
 * @description The URL of the currently selected server
 */
export const selectedServer = storable('' as string, 'selectedServer');

/* ------------------ Room State ------------------*/
/**
 * @description Room information keyed by the roomId
 */
export const roomsStore = storable({} as roomStoreI, 'rooms');

export const currentRoomsStore = derived(
	[selectedServer, roomsStore],
	([$selectedServer, $roomsStore]) => {
		return Object.values($roomsStore).filter((r) => r.server === $selectedServer);
	}
);

/**
 * @description The room ID of the currently selected room keyed by the server's URL
 */
export const selectedRoom = storable({} as selectedRoomStoreI, 'selectedRoom');

/**
 * @description Derived Store: The room object of the currently selected room
 */
export const currentSelectedRoom = derived(
	[selectedRoom, selectedServer, roomsStore],
	([$selectedRoom, $selectedServer, $roomsStore]) => {
		return $roomsStore[$selectedRoom[$selectedServer]];
	}
);

/**
 * @description Session store (removed after the session is cleared) of the last 500 messages or so of each room the user participates in; rooms they don't have selected will not be updated
 */
export const messageStore = sessionable({} as messageStoreI, 'messages');

export const pixelStore = sessionable({} as pixelStoreI, 'pixelmaps');

/**
 * @description Stores the encrypted key for each room keyed by the roomId
 */
export const roomKeyStore = encryptable({} as roomKeyStoreI, 'roomKey');

/**
 * @description Derived Store: The messages of the currently selected room
 */
export const currentRoomMessages = derived(
	[currentSelectedRoom, messageStore],
	([$currentSelectedRoom, $messageStore]) => {
		return $messageStore[$currentSelectedRoom.roomId.toString()];
	}
);

/**
 * @description Stores the rate limit information for each room keyed by the roomId; this is to track the number of messages sent in a given epoch to make sure the user doesn't break the rate limit. Modifying how his store works, or how the store is written to/read from, may allow the user to break the rate limit and be banned from the room.
 */
export const rateLimitStore = storable({} as rateLimitStoreI, 'rateLimit');

/* ------------------ Configuration / Misc Stores ------------------*/

/**
 * @description The user's encryption/decryption key, stored only in memory,
 * if the user refreshes the page, they need to re-enter their password.
 * This is what all other encrypted stores use to encrypt/decrypt their data.
 * !WARN NEVER CHANGE THE STORE TYPE OR YOU RISK EXPOSING THE KEY
 */
export const keyStore = writable({} as keyStoreI);

export const alertQueue = queueable([]);

/**
 * @description Configuration store, stores the user's settings
 */
export const configStore = storable(configDefaults as ConfigurationI, 'config');

export const passwordSet = derived(configStore, ($configStore) => {
	if (!$configStore.hashedPwd) {
		return false;
	} else if ($configStore.hashedPwd === '') {
		return false;
	} else if ($configStore.hashedPwd === undefined) {
		return false;
	} else if ($configStore.hashedPwd.length > 1) {
		return true;
	}
});

/**
 * @description Console store, primarily stores messages to be displayed in the console
 */
export const consoleStore = storable(
	{
		messages: [{ message: 'Welcome User', type: 'tertiary' }],
		settings: {}
	} as consoleStoreI,
	'console'
);

/* ------------------ Identity Stores ------------------*/
/**
 * @description Identity store, this is the user's identity UNENCRYPTED
 * @deprecated Use identityKeyStore when you can, alert user to set password first
 */
export const identityStore = storable({} as IdentityStoreI, 'identity');

/**
 * @description Identity store, this is the user's identity ENCRYPTED
 */
export const identityKeyStore = encryptable({} as IdentityStoreI, 'identityencrypted');

export const lockStateStore = derived(
	[keyStore, passwordSet],
	([$keyStore, $passwordSet]): 'unlocked' | 'locked' | null => {
		if ($passwordSet) {
			if ($keyStore instanceof CryptoKey) {
				return 'unlocked';
			} else {
				return 'locked';
			}
		} else {
			return null;
		}
	}
);

export const identityExists = derived(
	[identityStore, identityKeyStore, lockStateStore],
	([$identityStore, $identityKeyStore, $lockStateStore]):
		| 'safe'
		| 'unsafe'
		| 'encrypted'
		| null => {
		const id = $identityKeyStore;
		const id_ = $identityStore;
		if ($lockStateStore == null) {
			if (id_._commitment?.length > 0) {
				return 'unsafe';
			} else {
				return null;
			}
		} else if ($lockStateStore === 'unlocked') {
			if (id._commitment) {
				return 'safe';
			} else {
				return null;
			}
		} else if ($lockStateStore === 'locked') {
			if (typeof id === 'object') {
				return 'encrypted';
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
);
