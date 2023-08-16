import type { RoomI } from '$lib/types';
import { identityStore, serverStore, roomsStore } from '$lib/stores';
import { get } from 'svelte/store';
import { getIdentityRoomIds, getRoomById } from '$lib/services/server';

// TODO! EVERYTHING IN THIS FILE SHOULD BE DEPRECATED AND MOVED TO PROPER LOCATIONS

export async function __setRooms(server: string, roomIds: string[] = []): Promise<string[]> {
	const rooms: RoomI[] = [];
	for (const roomId of roomIds) {
		const result = await getRoomById(server, roomId);
		rooms.push(result);
	}

	roomsStore.update(() => {
		const { roomsData } = get(roomsStore);
		for (const room of rooms) {
			roomsData[String(room.roomId)] = {
				...room,
				server
			};
		}
		return {
			selectedRoomId: rooms[0].roomId,
			roomsData
		};
	});
	// Todo: take this out of this function. Probably worth having a seperate
	// function to 'get the accepted rooms'.
	return rooms.map((r: RoomI) => r.name);
}

export async function __setSelectedRoomId(selectedRoomId: string): Promise<void> {
	roomsStore.update(() => {
		const roomsStoreData = get(roomsStore);
		return {
			...roomsStoreData,
			selectedRoomId
		};
	});
}

export async function __updateRooms(
	selectedServer: string,
	roomIds: string[] = []
): Promise<string[]> {
	let acceptedRoomNames: string[] = [];
	const rooms: RoomI[] = [];
	if (roomIds.length < 1) {
		const idc = get(identityStore).identity._commitment;
		console.log(idc);
		roomIds = await getIdentityRoomIds(selectedServer, idc);
	}
	console.log(roomIds);
	for (const roomId of roomIds) {
		const result = await getRoomById(selectedServer, roomId);
		rooms.push(result);
	}
	rooms.forEach((r: RoomI) => {
		acceptedRoomNames = [...acceptedRoomNames, r.name];
	});
	serverStore.update(() => {
		const serverData = get(serverStore);
		serverData[selectedServer] = {
			...serverData[selectedServer],
			rooms
		};
		return serverData;
	});
	return acceptedRoomNames;
}

export async function __updateSingleRoom(selectedServer: string, roomId: string) {
	const room = await getRoomById(selectedServer, roomId);
	serverStore.update(() => {
		const serverData = get(serverStore);
		serverData[selectedServer] = {
			...serverData[selectedServer],
			rooms: [room]
		};
		return serverData;
	});
}

export function __getServerForSelectedRoom(): any {
	const roomsStoreData = get(roomsStore);
	const selectedServer = roomsStoreData.roomsData[roomsStoreData.selectedRoomId]?.server;
	return selectedServer;
}

export function __getRoomsForServer(selectedServer: string): [] {
	const roomsStoreData = get(roomsStore);
	const rooms: any = Object.values(roomsStoreData.roomsData);
	return rooms.filter((room: any) => room.server === selectedServer);
}
