import type { MessageI, ServerI } from 'discreetly-interfaces';
import type { IdentityStoreI, Invites, JoinResponseI, JubmojiProofI, RoomI } from '$lib/types';
import { Prover } from 'idc-nullifier';
import type { Identity } from '@semaphore-protocol/identity';
import { get, getAuth, post, postAuth } from './api';
import { getIdentity } from '$lib/utils';
import { alertQueue } from '$lib/stores';

interface IdentityData extends IdentityStoreI {
	trapdoor: string;
	nullifier: string;
	secret: string;
	commitment: string;
}

export async function getIdentityRoomIds(server: string): Promise<string[]> {
	const prover = new Prover('idcNullifier/circuit.wasm', 'idcNullifier/final.zkey');
	const id = getIdentity() as IdentityData;
	const idForProof: Partial<IdentityData> = {};
	if (id) {
		const timestamp = BigInt(Date.now());
		idForProof.trapdoor = id._trapdoor;
		idForProof.nullifier = id._nullifier;
		idForProof.secret = id._secret;
		idForProof.commitment = id._commitment;

		// Proves you know the identity secret with a timestamp so this proof can't be replayed
		prover
			.generateProof({
				identity: idForProof as unknown as Identity,
				externalNullifier: timestamp
			})
			.then(async (proof) => {
				return (await post([server, `identity/${id._commitment}`], proof)) as Promise<string[]>;
			});
	} else {
		alertQueue.enqueue('No identity found when fetching rooms', 'error');
		return [];
	}
	return [];
}

export async function getRoomById(server: string, roomId: string): Promise<RoomI> {
	return get([server, `room/${roomId}`]) as Promise<RoomI>;
}

export async function getServerData(serverUrl: string): Promise<ServerI> {
	return get([serverUrl]) as Promise<ServerI>;
}

export async function getEthAddressRoomNames(
	server: string,
	ethAddress: string
): Promise<{ name: string }[]> {
	return get([server, `gateway/eth/group/${ethAddress}`]) as Promise<{ name: string }[]>;
}

export async function postInviteCode(
	serverUrl: string,
	data: { code: string; idc: string }
): Promise<JoinResponseI> {
	const response = (await post([serverUrl, 'gateway/code/join'], data)) as unknown as JoinResponseI;
	if (!response.status || !response.roomIds) {
		throw new Error('Response does not match JoinResponseI interface');
	}
	return response;
}

export async function postEthereumSignature(
	serverUrl: string,
	data: { message: string; signature: string }
): Promise<JoinResponseI> {
	const response = post([serverUrl, 'gateway/eth/join'], data) as unknown as JoinResponseI;
	if (!response.status || !response.roomIds) {
		throw new Error('Response does not match JoinResponseI interface');
	}
	return response;
}

export async function postTheWord(
	serverUrl: string,
	data: { proof: object; idc: string }
): Promise<JoinResponseI> {
	return (await post([serverUrl, 'gateway/theword/join'], data)) as Promise<JoinResponseI>;
}

export async function postJubmojis(
	serverUrl: string,
	data: { proof: JubmojiProofI; idc: string }
): Promise<JoinResponseI> {
	return (await post([serverUrl, 'gateway/jubmojis/join'], data)) as Promise<JoinResponseI>;
}

export async function getMessages(serverUrl: string, roomId: string) {
	console.debug('Fetching messages for', roomId);
	return get([serverUrl, `room/${roomId}/messages`]) as Promise<MessageI[]>;
}

export async function createRoom(
	serverUrl: string,
	roomName: string,
	username: string,
	password: string,
	rateLimit: number,
	userMessageLimit: number,
	numClaimCodes: number,
	adminIdentities: string[],
	membershipType: string,
	type: string,
	contractAddress?: string,
	bandadaAddress?: string,
	bandadaGroupId?: string,
	bandadaApiKey?: string,
	roomId?: string
) {
	const data = {
		roomName,
		rateLimit,
		userMessageLimit,
		numClaimCodes,
		adminIdentities,
		membershipType,
		type,
		contractAddress,
		bandadaAddress,
		bandadaGroupId,
		bandadaApiKey,
		roomId
	};
	return postAuth([serverUrl, `room/add`], data, username, password) as Promise<RoomI>;
}

interface CreateInviteData {
	numCodes: number;
	expiresAt?: number;
	usesLeft?: number;
	roomIds?: string[];
	all?: boolean;
}

export async function createInvite(
	serverUrl: string,
	username: string,
	password: string,
	numCodes: number,
	roomIds: string[],
	expiresAt?: number,
	usesLeft?: number
) {
	const data: CreateInviteData = { numCodes, expiresAt, usesLeft };
	if (roomIds.length > 0) {
		data['roomIds'] = roomIds;
	} else {
		data['all'] = false;
	}
	return postAuth([serverUrl, `admin/addcode`], data, username, password) as Promise<Invites>;
}

interface AddAdminData {
	idc: string;
}

export async function addAdmin(
	serverUrl: string,
	username: string,
	password: string,
	roomId: string,
	adminIdc: string
) {
	const data: AddAdminData = { idc: adminIdc };

	return postAuth([serverUrl, `admin/${roomId}/addAdmin`], data, username, password);
}

export async function getAllRooms(serverUrl: string, username: string, password: string) {
	return getAuth([serverUrl, `admin/rooms`], username, password) as Promise<RoomI[]>;
}

interface CheckResponse {
	success: boolean;
	message?: string;
	// include other properties as needed
}

export async function postCheckRoomPassword(
	serverUrl: string,
	roomId: string,
	passwordHash: string
): Promise<boolean> {
	const response = (await post([serverUrl, `room/checkpasswordhash/${roomId}`], {
		passwordHash
	})) as CheckResponse;
	return Boolean(response.success);
}

export async function postSetRoomPassword(
	serverUrl: string,
	roomId: string,
	passwordHash: string
): Promise<boolean> {
	const prover = new Prover('idcNullifier/circuit.wasm', 'idcNullifier/final.zkey');
	const id = getIdentity() as IdentityData;
	const idForProof: Partial<IdentityData> = {};
	if (id) {
		const timestamp = BigInt(Date.now());
		idForProof.trapdoor = id._trapdoor;
		idForProof.nullifier = id._nullifier;
		idForProof.secret = id._secret;
		idForProof.commitment = id._commitment;

		// Proves you know the identity secret with a timestamp so this proof can't be replayed
		prover
			.generateProof({
				identity: idForProof as unknown as Identity,
				externalNullifier: timestamp
			})
			.then(async (proof) => {
				const response = (await post([serverUrl, `room/setpassword/${roomId}`], {
					passwordHash,
					proof
				})) as CheckResponse;
				return response.success;
			});
	} else {
		alertQueue.enqueue('No identity found when fetching rooms', 'error');
		return false;
	}
	return false;
}
