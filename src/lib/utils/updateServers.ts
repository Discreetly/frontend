import { defaultServers } from '$lib/defaults';
import { getServerData } from '$lib/services/server';
import { serverStore } from '$lib/stores';
import type { ServerUrlI } from '$lib/types';
import type { ServerI } from 'discreetly-interfaces';
import { get } from 'svelte/store';

// Function to update a single server
export async function updateServer(server: ServerUrlI): Promise<ServerI | null> {
	console.log(`Fetching server data from ${server.url}`);
	const data = await getServerData(server.url);
	console.log(`Setting server data for ${server.url}`);
	if (data) {
		serverStore.update((store: { [key: string]: ServerI } = {}) => ({
			...store,
			[server.url]: data
		}));
		return data;
	}
	return null;
}

// Function to update all servers
export async function updateAllServers(): Promise<{ [key: string]: ServerI }> {
	const serverList = Object.keys(get(serverStore));

	// If the server list is empty or doesn't have the discreetly server, add the default servers
	if (serverList.length < 1) {
		console.error('serverStore is empty, populating with');
		serverStore.set(defaultServers);
	}

	const newServerData: { [key: string]: ServerI } = {};

	await Promise.all(
		serverList.map(async (server: ServerUrlI) => {
			const data = await updateServer(server);
			if (data) {
				newServerData[server.url] = data;
			}
		})
	);

	return newServerData;
}
