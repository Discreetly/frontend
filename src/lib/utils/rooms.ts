import type { RoomI } from '$lib/types';
import { roomsStore, selectedRoom, selectedServer, serverStore, messageStore } from '$lib/stores';
import { get } from 'svelte/store';
import {
	getIdentityRoomIds as getRoomIdsByIdentityCommitment,
	getRoomById,
	getMessages
} from '$lib/services/server';
import { getCommitment } from '.';

export function roomListForServer(server: string = get(selectedServer)): RoomI[] {
	const roomIds = get(serverStore)[server]?.rooms ?? [];
	return roomIds.map((roomId) => get(roomsStore)[roomId]);
}

function updateRoomStore(rooms: RoomI[], serverURL: string = get(selectedServer)) {
	// Update the roomStore directly
	roomsStore.update((store) => {
		rooms.forEach((room) => {
			const roomId = String(room.roomId);
			store[roomId] = { ...room, server: serverURL };
		});
		return store;
	});
	// Update the serverStore
	serverStore.update((store) => {
		rooms.forEach((room) => {
			const roomId = String(room.roomId);
			store[serverURL].rooms?.push(roomId);
		});
		return store;
	});
}

async function getRoomIdsIfEmpty(server: string, roomIds: string[]): Promise<string[]> {
	if (roomIds.length < 1) {
		const idc = getCommitment();
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

	updateRoomStore(rooms, server);
	if (get(selectedRoom)[server] === undefined) {
		selectedRoom.update((store) => {
			store[server] = roomIds[0];
			return store;
		});
	}
	return acceptedRoomNames;
}

export function updateMessages(server: string, roomId: string) {
	getMessages(server, roomId).then((messages) => {
		messageStore.update((store) => {
			store[roomId] = messages;
			return store;
		});
	});
}

