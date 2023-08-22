import type { ConfigurationI, IdentityStoreI } from '$lib/types';
import type { MessageI, ServerI } from 'discreetly-interfaces';
import type { RoomI } from '$lib/types';
import { storable, sessionable } from './storeFactory';
import { writable, derived } from 'svelte/store';
import { configDefaults } from '$lib/defaults';

export interface serverStoreI {
	[key: string]: ServerI;
}

interface selectedRoomStoreI {
	[key: string]: string;
}

interface roomStoreI {
	[key: string]: RoomI;
}

interface messageStoreI {
	[key: string]: MessageI[];
}

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

/* ------------------ Misc State ------------------*/
/**
 * @description Configuration and misc state
 */
export const configStore = storable(configDefaults as ConfigurationI, 'configStore');

//TODO!  This needs to be encrypted
/**
 * @description Identity store, this is the user's identity
 */
export const identityStore = storable({} as IdentityStoreI, 'identity');

export const currentRoomMessages = derived(
	[currentSelectedRoom, messageStore],
	([$currentSelectedRoom, $messageStore]) => {
		return $messageStore[$currentSelectedRoom.roomId.toString()];
	}
);
