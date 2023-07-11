import { randomBigInt, genId } from 'discreetly-interfaces';
import type { ServerI, ServerListI } from 'discreetly-interfaces';
import { serverListStore, serverDataStore, selectedServer } from './stores';

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

function updateServers(
	serverListStore: [],
	serverDataStore: { [key: string]: ServerI }
): { [key: string]: ServerI } {
	serverListStore.forEach((server: ServerListI) => {
		console.log('fetching server data');
		fetchServer(server.url).then((data) => {
			console.log('setting server data');
			if (serverDataStore[server.url]) {
				Object.assign(serverDataStore[server.url], data as ServerI);
			} else {
				serverDataStore[server.url] = data as ServerI;
			}
		});
	});
	return serverDataStore;
}

export { randomBigInt, genId, fetchServer, updateServers };
