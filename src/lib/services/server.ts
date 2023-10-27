import type { MessageI, ServerI } from 'discreetly-interfaces';
import type { IdentityStoreI, Invites, JoinResponseI, RoomI } from '$lib/types';
import { Prover } from 'idc-nullifier';
import type { Identity } from '@semaphore-protocol/identity';
import { get, post, postAuth } from './api';
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
	if (id) {
		const timestamp = BigInt(Date.now());
		id.trapdoor = id._trapdoor;
		id.nullifier = id._nullifier;
		id.secret = id._secret;
		id.commitment = id._commitment;

		// Proves you know the identity secret with a timestamp so this proof can't be replayed
		prover
			.generateProof({
				identity: id as unknown as Identity,
				externalNullifier: timestamp
			})
			.then((proof) => {
				return post([server, `identity/${id._commitment}`], proof) as Promise<string[]>;
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
	const response = post([serverUrl, 'gateway/theword/join'], data) as unknown as JoinResponseI;
	if (!response.status || !response.roomIds) {
		throw new Error('Response does not match JoinResponseI interface');
	}
	return response;
}

export async function getMessages(serverUrl: string, roomId: string) {
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
		data['all'] = true;
	}
	return postAuth([serverUrl, `admin/addcode`], data, username, password) as Promise<Invites>;
}
