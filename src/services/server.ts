import type { ServerI } from 'discreetly-interfaces';
import { get, post } from "./api";

export async function getIdentityRoomIds(server: string, idCommitment: string) {
    return get(server, `api/rooms/${idCommitment}`);
}

export async function getRoomById(server: string, roomId: string) {
    return get(server, `api/room/${roomId}`);
}

export async function getServerData(serverUrl: string): Promise<ServerI> {
    return get(serverUrl, '');
}

export async function postAddCode(serverUrl: string, data: { code: string, idc: string }) {
    return post(serverUrl, 'join', data);
}