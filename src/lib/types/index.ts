import type { RoomI as RI } from 'discreetly-interfaces';
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
