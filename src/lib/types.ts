import type { Identity } from '@semaphore-protocol/identity';

interface ButtonI {
	link: string;
	cls: string;
	text: string;
}

// For rooms where a user has a unique identity
interface RoomIdentityI {
	[key: string]: Identity; // The key is the room id (bigint) as a string
}

interface IdentityStoreI {
	identity: Identity | null;
	rooms: RoomIdentityI;
}

interface ServerListI {
	name: string;
	url: string;
}

export type { ButtonI, IdentityStoreI, ServerListI };
