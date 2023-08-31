import type { MessageI, RoomI as RI, ServerI } from 'discreetly-interfaces';

export interface ButtonI {
	link: string;
	cls: string;
	text: string;
}

export interface IdentityStoreI {
	_commitment: string;
	_trapdoor: string;
	_nullifier: string;
	_secret: string;
}

export interface JoinResponseI {
	status: string;
	roomIds: string[];
}

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
export interface rateLimitStoreI {
	[key: string]: {
		lastEpoch: number;
		messagesSent: number;
	};
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
	inviteCode?: string;
}

export enum ActionRepresentationE {
	'AP',
	'Hearts',
	'Shields',
	'Battery'
}

export interface ConfigurationI {
	signUpStatus: SignUpStatusI;
	identityStore: IdentityStoreE;
	apiUsername?: string;
	apiPassword?: string;
	actionRepresentation?: ActionRepresentationE;
}

export interface RoomI extends RI {
	server?: string;
}

export interface InviteCode {
	claimcode: string;
}
export interface Invites {
	message?: string;
	codes: InviteCode[];
}
