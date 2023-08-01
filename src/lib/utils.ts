import type { ServerI } from 'discreetly-interfaces';
import { serverDataStore, serverListStore } from './stores';
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
			'Access-Control-Allow-Origin': 'http://localhost:*'
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

	if (serverList.length < 1) {
		console.error('serverListStore is empty');
		serverListStore.set([{ name: 'Localhost', url: 'http://localhost:3001/api/' } as ServerListI]);
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
