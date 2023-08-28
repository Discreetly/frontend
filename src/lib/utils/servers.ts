import { get, type Writable } from 'svelte/store';
import type { serverStoreI } from '../stores';
import { serverStore, roomsStore, selectedServer } from '../stores';
import { getServerData } from '$lib/services/server';
import type { RoomI } from '$lib/types';
import { defaultServers } from '$lib/defaults';

export function setDefaultServers(): void {
	serverStore.set(defaultServers);
	selectedServer.set(Object.keys(defaultServers)[0]);
}

export function getServerList(store: Writable<serverStoreI> = serverStore): string[] {
	return Object.keys(get(store)) as string[];
}

export function getServerRooms(url: string, store: Writable<serverStoreI> = serverStore): RoomI[] {
	let roomIds = get(store)[url].rooms;
	if (!roomIds) {
		roomIds = [];
	}
	return roomIds.map((roomId) => {
		return get(roomsStore)[roomId];
	}) as RoomI[];
}

export async function updateServer(
	url: string = get(selectedServer),
	store: Writable<serverStoreI> = serverStore
): Promise<void> {
	if (!url) {
		url = get(selectedServer);
	}
	if (!url) {
		url = Object.keys(get(serverStore))[0];
		selectedServer.set(url);
	}
	console.debug('Updating server', url);
	const oldServerStore = get(store);
	getServerData(url).then((newServerData) => {
		const newServerStore = {
			...oldServerStore,
			[url]: newServerData
		};
		store.set(newServerStore);
	});
}
