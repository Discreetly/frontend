import { storable, sessionable, encryptable } from './storeFactory';
import { derived, get, writable, type Readable, type Writable } from 'svelte/store';
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
import { decryptData } from '$lib/crypto/crypto';

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
export const roomsStore = storable({} as roomStoreI, 'roomsStore');

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
export const roomKeyStore = encryptable({} as roomKeyStoreI, 'roomKeyStore');

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
export const rateLimitStore = sessionable({} as rateLimitStoreI, 'rateLimitStore');

/* ------------------ Configuration / Misc Stores ------------------*/

/**
 * @description The user's encryption/decryption key, stored only in memory, if the user refreshes the page, they need to re-enter their password. This is what all other encrypted stores use to encrypt/decrypt their data.
 * !WARN NEVER CHANGE THE STORE TYPE OR YOU RISK EXPOSING THE KEY
 */
export const keyStore = writable({} as keyStoreI);

/**
 * @description Configuration store, stores the user's settings
 */
export const configStore = storable(configDefaults as ConfigurationI, 'configStore');

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

export const keyExists = derived(keyStore, ($keyStore) => {
	if ($keyStore?.extractable) {
		console.debug('EncryptionKey exists');
		return true;
	} else {
		console.debug('EncryptionKey does not exist');
		return false;
	}
});

/**
 * @description Console store, primarily stores messages to be displayed in the console
 */
export const consoleStore = sessionable(
	{
		messages: [{ message: 'Welcome User', type: 'info' }],
		settings: {}
	} as consoleStoreI,
	'consoleStore'
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
export const identityKeyStore = encryptable('' as string, 'identity');

/**
 * @description Derived Store: The user's identity DECRYPTED in memory
 */
export const identityKeyStoreDecrypted: Readable<string | null | undefined> = derived(
	[identityKeyStore, keyStore, keyExists],
	([$identityKeyStore, $keyStore, $keyExists]) => {
		const key = $keyStore;
		if ($keyExists && key !== undefined && key !== null) {
			try {
				if (key !== undefined && key !== null) {
					try {
						decryptData($identityKeyStore as string, key).then((decrypted) => {
							if (decrypted !== null) {
								return JSON.parse(decrypted) as IdentityStoreI;
							}
						});
					} catch (e) {
						console.error(`Error decrypting identity: ${e}`);
						return null;
					}
				} else {
					return null;
				}
			} catch (e) {
				console.error(`Error decrypting identity: ${e}`);
				return null;
			}
		}
	}
);
