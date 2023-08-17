import type { RoomI } from '$lib/types';
import { identityStore, roomsStore, selectedServer, serverStore } from '$lib/stores';
import { get } from 'svelte/store';
import {
	getIdentityRoomIds as getRoomIdsByIdentityCommitment,
	getRoomById
} from '$lib/services/server';

export function roomListForServer(server: string = get(selectedServer)): RoomI[] {
	const roomIds = get(serverStore)[server]?.rooms ?? [];
	return roomIds.map((roomId) => get(roomsStore)[roomId]);
}

function updateRoomStore(rooms: RoomI[]) {
	const tempRoomStore = get(roomsStore);
	rooms.forEach((room) => {
		tempRoomStore[String(room.roomId)] = room;
	});
	roomsStore.set(tempRoomStore);
}

async function getRoomIdsIfEmpty(server: string, roomIds: string[]): Promise<string[]> {
	if (roomIds.length < 1) {
		const idc = get(identityStore).identity._commitment;
		return await getRoomIdsByIdentityCommitment(server, idc);
	}
	return roomIds;
}

async function fetchRoomsByIds(server: string, roomIds: string[]): Promise<RoomI[]> {
	const rooms: RoomI[] = [];
	for (const roomId of roomIds) {
		const result = await getRoomById(server, roomId);
		rooms.push(result);
	}
	return rooms;
}

function extractRoomNames(rooms: RoomI[]): string[] {
	return rooms.map((r) => r.name);
}

export async function updateRooms(
	server: string = get(selectedServer),
	roomIds: string[] = []
): Promise<string[]> {
	roomIds = await getRoomIdsIfEmpty(server, roomIds);
	const rooms = await fetchRoomsByIds(server, roomIds);
	const acceptedRoomNames = extractRoomNames(rooms);
	updateRoomStore(rooms);
	return acceptedRoomNames;
}
