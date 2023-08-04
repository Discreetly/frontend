import type { RoomI, ServerI } from 'discreetly-interfaces';
import { identityStore, serverDataStore, serverListStore } from './stores';
import { get } from 'svelte/store';

interface ServerListI {
	name: string;
	url: string;
}

async function fetchServer(server_url: string): Promise<ServerI | void> {
	console.debug(`Fetching server ${server_url}`);
	return fetch(server_url, {
		method: 'GET',
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	})
		.then(async (response): Promise<ServerI> => {
			const serverData: ServerI = await response.json();
			return serverData;
		})
		.catch((err) => {
			console.error(err);
		});
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
			const data = await fetchServer(server.url);
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
		fetch(selectedServer + 'api/rooms/' + idc).then((response) => {
			console.log(response);
			response.json().then((data) => {
				console.log(data);
				roomIds = data;
			});
		});
	}
	roomIds.forEach((roomId: string) => {
		const roomUrl = selectedServer + 'api/room/' + roomId;
		console.log('Fetching room: ', roomUrl);
		fetch(roomUrl)
			.then(async (response) => {
				console.log(response);
				const result = await response.json();
				rooms.push(result);
			})
			.catch((err) => {
				console.error(err);
			});
	});
	rooms.forEach((r: RoomI) => {
		acceptedRoomNames = [...acceptedRoomNames, r.name];
	});
	serverDataStore.update(() => {
		const serverData = get(serverDataStore);
		serverData[selectedServer].rooms = rooms;
		return serverData;
	});
	return acceptedRoomNames;
}
