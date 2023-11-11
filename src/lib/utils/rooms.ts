import type { RoomI } from '$lib/types';
import {
	roomsStore,
	selectedRoom,
	selectedServer,
	serverStore,
	messageStore,
	currentSelectedRoom
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
		const newStore = { ...store };
		const filteredRooms = rooms.filter((room) => String(room.roomId) !== '0071');
		filteredRooms.forEach((room) => {
			let roomId = String(room.roomId);
			if (roomId === '0071') {
				roomId = '7001';
				room.roomId = '7001';
			}
			if (newStore['0071']) {
				delete newStore['0071'];
			}
			newStore[roomId] = { ...room, server: serverURL };
		});
		return newStore;
	});
	// Update the serverStore
	serverStore.update((store) => {
		rooms.forEach((room) => {
			let roomId = String(room.roomId);
			if (roomId === '0071') {
				roomId = '7001';
				room.roomId = '7001';
				store[serverURL].rooms?.filter((id) => id !== '0071');
			}
			store[serverURL].rooms?.push(roomId);
		});
		return store;
	});
}

async function getRoomIdsByIdentity(server: string): Promise<string[]> {
	const idc = getCommitment();
	if (idc) {
		return await getRoomIdsByIdentityCommitment(server);
	} else {
		return [];
	}
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
	if (roomIds.length == 0) {
		console.debug('Updating all rooms');
		roomIds = await getRoomIdsByIdentity(server);
	}
	if (roomIds.length > 0) {
		if (roomIds.includes('0071')) {
			console.warn('DETECTED 0071');
			//remove 0071 from roomIds
			roomIds = roomIds.filter((id) => id !== '0071');
			roomIds.push('7001');
		}
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
	} else {
		return [];
	}
}

export function updateMessages(server: string, roomId: string) {
	try {
		const rooms = get(roomsStore);
		const name = rooms[roomId].name;
		console.debug('Updating messages for', name);
	} catch (e) {
		console.debug('RoomsStore not ready yet');
	}
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
		const result = { ...currentStore };
		return result;
	});
}

export function clearMessageHistory(roomId: string) {
	messageStore.update((currentStore) => {
		currentStore[roomId] = [] as MessageI[];
		return { ...currentStore };
	});
}
