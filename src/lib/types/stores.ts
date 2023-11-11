import type { ServerI, MessageI, HexColor } from 'discreetly-interfaces';
import type { RoomI } from './interfaces';
import type { Identity } from '@semaphore-protocol/identity';
import type { Writable } from 'svelte/store';

// Keyed by server URL
export interface serverStoreI {
	[key: string]: ServerI;
}

// Keyed by server URL
export interface selectedRoomStoreI {
	[key: string]: string;
}

// Keyed by roomId
export interface roomStoreI {
	[key: string]: RoomI;
}

// Keyed by roomId
export interface messageStoreI {
	[key: string]: MessageI[];
}

// Keyed by roomId
export interface pixelStoreI {
	[key: string]: HexColor[][];
}

export interface IdentityStoreI {
	_commitment: string;
	_trapdoor: string;
	_nullifier: string;
	_secret: string;
}

export interface rateLimitStoreI {
	[key: string]: {
		lastEpoch: number;
		messagesSent: number;
	};
}

export interface consoleMessageI {
	message: string;
	type: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error';
	response?: string;
}

export interface consoleStoreI {
	messages: consoleMessageI[];
	settings: {
		[key: string]: boolean;
	};
}

// keyed by the roomId, encrypted in localstorage
export interface roomPassStoreI {
	[key: string]: {
		password: string;
		hashedSaltedPassword: string;
	};
}

// keyed by the roomId, only in memory
export interface roomKeyStoreI {
	[key: string]: CryptoKey;
}

export type keyStoreI = CryptoKey | undefined | null;

export interface EncryptableT<Type> extends Writable<Type> {
	read: () => void;
}
