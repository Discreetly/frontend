import type { ServerI, MessageI, HexColor } from 'discreetly-interfaces';
import type { RoomI } from './interfaces';

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
