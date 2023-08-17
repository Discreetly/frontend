import { get, type Writable } from 'svelte/store';
import type { serverStoreI } from '.';
import { serverStore, roomsStore } from '.';
import { getServerData } from '$lib/services/server';
import type { RoomI } from '$lib/types';

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
	url: string,
	store: Writable<serverStoreI> = serverStore
): Promise<void> {
	console.log('updating server', url);
	const oldServerStore = get(store);
	getServerData(url).then((newServerData) => {
		const newServerStore = {
			...oldServerStore,
			[url]: newServerData
		};
		store.set(newServerStore);
	});
}
