import { randomBigInt, genId } from 'discreetly-interfaces';
import type { ServerI, ServerListI } from 'discreetly-interfaces';
import { serverDataStore, serverListStore } from './stores';
import { get } from 'svelte/store';

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

function updateServers(): { [key: string]: ServerI } {
	if (get(serverListStore).length < 1) {
		console.error('serverListStore is empty');
		serverListStore.set([{ name: 'Localhost', url: 'http://localhost:3001/api/' } as ServerListI]);
	}
	get(serverListStore).forEach((server: ServerListI) => {
		console.log('fetching server data');
		fetchServer(server.url).then((data) => {
			console.log('setting server data');
			const temp = get(serverDataStore);
			if (temp[server.url]) {
				Object.assign(temp[server.url], data as ServerI);
			} else {
				temp[server.url] = data as ServerI;
			}
			temp[server.url].selectedRoom = temp[server.url].rooms[0]
				? temp[server.url].rooms[0].roomId
				: '';
			serverDataStore.set(temp);
		});
	});
	return serverDataStore;
}

export { randomBigInt, genId, fetchServer, updateServers };
