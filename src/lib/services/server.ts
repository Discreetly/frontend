import type { MessageI, ServerI } from 'discreetly-interfaces';
import type { Invites, RoomI } from '$lib/types';

import { get, post, postAuth } from './api';

export async function getIdentityRoomIds(server: string, idCommitment: string): Promise<string[]> {
	return get([server, `api/rooms/${idCommitment}`]) as Promise<string[]>;
}

export async function getRoomById(server: string, roomId: string): Promise<RoomI> {
	return get([server, `api/room/${roomId}`]) as Promise<RoomI>;
}

export async function getServerData(serverUrl: string): Promise<ServerI> {
	return get([serverUrl]) as Promise<ServerI>;
}

export async function getEthAddressRoomNames(
	server: string,
	ethAddress: string
): Promise<string[]> {
	return get([server, `api/eth/group/${ethAddress}`]) as Promise<string[]>;
}

export async function postInviteCode(serverUrl: string, data: { code: string; idc: string }) {
	return post([serverUrl, 'join'], data);
}

export async function getMessages(serverUrl: string, roomId: string) {
	return get([serverUrl, `api/room/${roomId}/messages`]) as Promise<MessageI[]>;
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
	return postAuth([serverUrl, `api/addcode`], data, username, password) as Promise<Invites>;
}
