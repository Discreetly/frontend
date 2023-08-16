import type { Identity } from '@semaphore-protocol/identity';
import type { RoomI as RI } from 'discreetly-interfaces';

export interface ButtonI {
	link: string;
	cls: string;
	text: string;
}

// For rooms where a user has a unique identity
export interface RoomIdentityI {
	[key: string]: Identity; // The key is the roomId (bigint) as a string
}

export interface IdentityStoreI {
	identity: Identity;
}

export interface ServerUrlI {
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

export interface RoomI extends RI {
	server?: string;
}
