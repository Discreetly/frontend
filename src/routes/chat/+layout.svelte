<script lang="ts">
	import Chat from './Chat.svelte';
	import type { RoomI } from 'discreetly-interfaces';
	import { serverDataStore, selectedServer } from '$lib/stores';
	import { onMount, tick } from 'svelte';

	let loaded: Boolean = false;

	function setRoom(id: string) {
		let room: RoomI;
		const rooms = $serverDataStore[$selectedServer].rooms;
		const temp_room = rooms.find((room: RoomI) => room.id === id);

		if (temp_room) {
			console.debug('Setting Room to', temp_room.name);
			room = temp_room;
		} else if ($serverDataStore[$selectedServer].rooms[0]) {
			console.debug('Setting Room to Default');
			room = $serverDataStore[$selectedServer].rooms[0];
		} else {
			console.debug('Loading Rooms Still');
			room = {
				id: '0',
				name: 'Rooms Not Loaded',
				membership: { identityCommitments: [0n] }
			};
		}
		$serverDataStore[$selectedServer].selectedRoom = room.id;
	}

	onMount(async () => {
		while (!$serverDataStore[$selectedServer]) {
			await tick();
		}
		setRoom($serverDataStore[$selectedServer].selectedRoom);
		loaded = true;
	});
</script>

{#if loaded}
	<Chat {setRoom} />
{:else}
	<slot />
{/if}
