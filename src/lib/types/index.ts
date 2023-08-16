import type { Identity } from '@semaphore-protocol/identity';

export interface ButtonI {
	link: string;
	cls: string;
	text: string;
}

// For rooms where a user has a unique identity
export interface RoomIdentityI {
	[key: string]: Identity; // The key is the room id (bigint) as a string
}

export interface IdentityStoreI {
	identity: Identity;
}

export interface ServerListI {
	name: string;
	url: string;
}

export interface JoinResponseI {
	status: string;
	roomIds: string[];
}

export enum IdentityStoreE {
	'NO_IDENTITY',
	'localStorage',
	'cryptKeeper',
	'PCDPass'
}

export interface SignUpStatusI {
	inviteAccepted: boolean;
	identityBackedUp: boolean;
}

export interface ConfigurationI {
	signUpStatus: SignUpStatusI;
	identityStore: IdentityStoreE;
}
