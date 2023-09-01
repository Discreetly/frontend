import type { IdentityStoreE, ActionRepresentationE, Experiences } from '.';
import type { RoomI as RI } from 'discreetly-interfaces';

export interface ConfigurationI {
	signUpStatus: SignUpStatusI;
	identityStore: IdentityStoreE;
	apiUsername?: string;
	apiPassword?: string;
	actionRepresentation?: ActionRepresentationE;
	experience?: Experiences;
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

export interface ButtonI {
	link: string;
	cls: string;
	text: string;
}

export interface JoinResponseI {
	status: string;
	roomIds: string[];
}

// Keyed by roomId

export interface SignUpStatusI {
	inviteAccepted: boolean;
	identityBackedUp: boolean;
	inviteCode?: string;
}
