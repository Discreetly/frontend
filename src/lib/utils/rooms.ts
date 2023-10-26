import type { RoomI } from '$lib/types';
import {
	roomsStore,
	selectedRoom,
	selectedServer,
	serverStore,
	messageStore,
	currentSelectedRoom,
	alertQueue
} from '$lib/stores';
import { get } from 'svelte/store';
import {
	getIdentityRoomIds as getRoomIdsByIdentityCommitment,
	getRoomById,
	getMessages
} from '$lib/services/server';
import { getCommitment, getEpochFromTimestamp } from '.';
import type { MessageI } from 'discreetly-interfaces';

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
		if (!idc) {
			alertQueue.enqueue('No identity commitment found', 'warning');
			throw new Error('No identity commitment found');
		}
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

export function addMessageToRoom(roomId: string, data: MessageI) {
	messageStore.update((currentStore) => {
		if (!currentStore[roomId]) {
			console.debug('Creating room in message store', roomId);
			currentStore[roomId] = [] as MessageI[];
		}

		if (typeof data.proof === 'string') {
			data.proof = JSON.parse(data.proof as string);
		}

		if (!data.epoch) {
			data.epoch = getEpochFromTimestamp(
				get(currentSelectedRoom).rateLimit!,
				+data.timeStamp!
			).epoch;
		}

		// Add the new message
		currentStore[roomId] = [...currentStore[roomId], data];

		// Trim messages to the last 500
		if (currentStore[roomId].length > 500) {
			currentStore[roomId] = currentStore[roomId].slice(-500);
		}

		return { ...currentStore };
	});
}

export function clearMessageHistory(roomId: string) {
	messageStore.update((currentStore) => {
		currentStore[roomId] = [] as MessageI[];
		return { ...currentStore };
	});
}
