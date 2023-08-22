import type { ServerI } from 'discreetly-interfaces';
import type { RoomI } from '$lib/types';

import { get, post } from './api';

export async function getIdentityRoomIds(server: string, idCommitment: string): Promise<string[]> {
	return get([server, `api/rooms/${idCommitment}`]) as Promise<string[]>;
}

export async function getRoomById(server: string, roomId: string): Promise<RoomI> {
	return get([server, `api/room/${roomId}`]) as Promise<RoomI>;
}

export async function getServerData(serverUrl: string): Promise<ServerI> {
	return get([serverUrl]) as Promise<ServerI>;
}

export async function postInviteCode(serverUrl: string, data: { code: string; idc: string }) {
	return post([serverUrl, 'join'], data);
}
