import type { RoomI, ServerI } from 'discreetly-interfaces';
import { identityStore, serverDataStore, serverListStore } from './stores';
import { get } from 'svelte/store';
import { getIdentityRoomIds, getRoomById, getServerData } from '../services/server';

interface ServerListI {
	name: string;
	url: string;
}

export async function updateServers(): Promise<{ [key: string]: ServerI }> {
	const serverList = get(serverListStore);

	// If the server list is empty or doesn't have the discreetly server, add the default servers
	if (serverList.length < 1 || !serverList.find((s) => s.name === 'Discreetly Server')) {
		console.error('serverListStore is empty');
		serverListStore.set([
			{ name: 'Discreetly Server', url: 'https://server.discreetly.chat/' },
			{ name: 'Localhost', url: 'http://localhost:3001/api/' } as ServerListI
		]);
	}

	const newServerData: { [key: string]: ServerI } = {};
	const oldServerData = get(serverDataStore);

	await Promise.all(
		serverList.map(async (server: ServerListI) => {
			console.log(`Fetching server data from ${server.url}`);
			const data = await getServerData(server.url);
			console.log(`Setting server data for ${server.url}`);
			if (data) {
				newServerData[server.url] = { ...data };
				newServerData[server.url].rooms = newServerData[server.url].rooms || [];

				if (oldServerData[server.url]?.selectedRoom !== undefined) {
					newServerData[server.url].selectedRoom = oldServerData[server.url].selectedRoom;
				} else if (newServerData[server.url].rooms?.length) {
					newServerData[server.url].selectedRoom = String(
						newServerData[server.url].rooms[0].roomId
					);
				} else {
					newServerData[server.url].selectedRoom = undefined;
				}
			}
		})
	);

	serverDataStore.update((store: { [key: string]: ServerI } = {}) => ({
		...store,
		...newServerData
	}));

	return newServerData;
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
