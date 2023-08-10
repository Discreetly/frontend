import type { RoomI, ServerI } from 'discreetly-interfaces';
import { identityStore, serverDataStore, serverListStore, roomsStore } from './stores';
import { get } from 'svelte/store';
import { getIdentityRoomIds, getRoomById, getServerData } from '../services/server';

const defaultServers = [
	{ name: 'Discreetly Server', url: 'https://server.discreetly.chat/' },
	{ name: 'Localhost', url: 'http://localhost:3001/api/' } as ServerListI
]

interface ServerListI {
	name: string;
	url: string;
}

export async function updateServers(): Promise<{ [key: string]: ServerI }> {
	const serverList = get(serverListStore);

	// If the server list is empty or doesn't have the discreetly server, add the default servers
	if (serverList.length < 1 || !serverList.find((s) => s.name === 'Discreetly Server')) {
		console.error('serverListStore is empty');
		serverListStore.set(defaultServers);
	}

	const newServerData: { [key: string]: ServerI } = {};
	// const oldServerData = get(serverDataStore);

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

export async function setRooms(
	server: string,
	roomIds: string[] = []
): Promise<string[]> {
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
	return rooms.map((r: RoomI) => r.name); //todo take this out of this funciton
}

// Todo: this function is never called now from my understanding.  There is still a use in
// page.svelte but I'm not sure it ever gets called. Maybe it should be removed?
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
