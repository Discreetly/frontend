import type { RoomI, ServerI } from 'discreetly-interfaces';
import { identityStore, serverDataStore, serverListStore, roomsStore } from './data/stores';
import { get } from 'svelte/store';
import { getIdentityRoomIds, getRoomById, getServerData } from './services/server';
import type { ServerListI } from './types';

const defaultServers = [
	{ name: 'Discreetly Server', url: 'https://server.discreetly.chat/' },
	{ name: 'Localhost', url: 'http://localhost:3001/api/' } as ServerListI
];

export async function updateServers(): Promise<{ [key: string]: ServerI }> {
	const serverList = get(serverListStore);

	// If the server list is empty or doesn't have the discreetly server, add the default servers
	if (
		serverList.length < 1 ||
		!serverList.find((s: ServerListI) => s.name === 'Discreetly Server')
	) {
		console.error('serverListStore is empty');
		serverListStore.set(defaultServers);
	}

	const newServerData: { [key: string]: ServerI } = {};

	await Promise.all(
		serverList.map(async (server: ServerListI) => {
			console.log(`Fetching server data from ${server.url}`);
			const data = await getServerData(server.url);
			console.log(`Setting server data for ${server.url}`);
			if (data) {
				newServerData[server.url] = { ...data };
			}
		})
	);

	serverDataStore.update((store: { [key: string]: ServerI } = {}) => ({
		...store,
		...newServerData
	}));

	return newServerData;
}

export async function setRooms(server: string, roomIds: string[] = []): Promise<string[]> {
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

export async function setSelectedRoomId(selectedRoomId: string): Promise<void> {
	roomsStore.update(() => {
		const roomsStoreData = get(roomsStore);
		return {
			...roomsStoreData,
			selectedRoomId
		};
	});
}

export async function updateRooms(
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
	serverDataStore.update(() => {
		const serverData = get(serverDataStore);
		serverData[selectedServer] = {
			...serverData[selectedServer],
			rooms
		};
		return serverData;
	});
	return acceptedRoomNames;
}

export async function updateSingleRoom(selectedServer: string, roomId: string) {
	const room = await getRoomById(selectedServer, roomId);
	serverDataStore.update(() => {
		const serverData = get(serverDataStore);
		serverData[selectedServer] = {
			...serverData[selectedServer],
			rooms: [room]
		};
		return serverData;
	});
}

export function getServerForSelectedRoom(): any {
	const roomsStoreData = get(roomsStore);
	const selectedServer = roomsStoreData.roomsData[roomsStoreData.selectedRoomId]?.server;
	return selectedServer;
}

export function getRoomsForServer(selectedServer: string): [] {
	const roomsStoreData = get(roomsStore);
	const rooms: any = Object.values(roomsStoreData.roomsData);
	return rooms.filter((room: any) => room.server === selectedServer);
}
