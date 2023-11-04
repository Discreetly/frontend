import type { IdentityStoreE, ActionRepresentationE, Experiences } from '.';
import type { RoomI as RI } from 'discreetly-interfaces';

export interface ConfigurationI {
	signUpStatus: SignUpStatusI;
	identityStore: IdentityStoreE;
	apiUsername?: string;
	apiPassword?: string;
	actionRepresentation?: ActionRepresentationE;
	experience?: Experiences;
	beta?: boolean;
	numMessagesToSave: number;
	hashedPwd: string | null | undefined;
	anxietyBar: boolean;
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
	roomIds?: string[];
	message?: string;
}

export type GatewayResultI = string[] | null;

export interface SignUpStatusI {
	completedSignup: boolean;
	identityBackedUp: boolean;
	inviteCode?: string;
}

export interface RoomFormData {
	roomName: string;
	membershipType: string;
	rateLimit: number;
	messageLimit: number;
	claimCodes: number;
	roomType: string;
	bandadaAddress: string | undefined;
	bandadaGroupId: string | undefined;
	bandadaApiKey: string | undefined;
}

export interface SNARKProof {
	proof: object;
	publicSignals: string[];
}
