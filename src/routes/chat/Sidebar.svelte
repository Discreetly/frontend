<script lang="ts">
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import type { RoomI } from 'discreetly-interfaces';
	import { serverStore, selectedServer, selectedRoom } from '$lib/stores';

	import { __getRoomsForServer, __getServerForSelectedRoom, __setSelectedRoomId } from '$lib/utils';
	import { getServerList, getServerRooms, updateServer } from '$lib/stores/servers';

	const setRoom = (roomId: string) => {
		if (roomId) {
			__setSelectedRoomId(roomId);
		}
	};

	const selectedRoomsServer = __getServerForSelectedRoom();
	let serverSelection = selectedRoomsServer;

	$: roomListForServer = getServerRooms($selectedServer) as RoomI[];

	const addServerModal: ModalSettings = {
		type: 'prompt',
		// Data
		title: 'Enter Server Address',
		body: 'Provide the server address.',
		// Populates the input value and attributes
		value: 'http://discreetly.chat/',
		valueAttr: { type: 'url', required: true },
		// Returns the updated response value
		response: (r: string) => {
			console.log('response:', r);
			if (getServerList().includes(r)) {
				console.warn('Server already exists');
				return;
			}
			updateServer(r);
		}
	};
</script>

<div id="sidebar" class="hidden lg:grid grid-rows-[auto_1fr_auto] border-r border-surface-500/30">
	<!-- Header -->
	<header class="border-b border-surface-500/30 p-4 flex flex-row">
		<select
			class="select text-primary-500"
			bind:value={serverSelection}
			on:change={(event) => {
				console.log('Setting server to: ', event.target?.value);
				serverSelection = event.target?.value;
			}}
		>
			{#each Object.entries($serverStore) as [key, s]}
				<option value={key}>{s.name}</option>
			{/each}
		</select>
		<button
			type="button"
			class="btn btn-sm variant-ghost-primary ms-2"
			on:click={() => {
				modalStore.trigger(addServerModal);
			}}>+</button
		>
	</header>
	<!-- List -->
	<div class="p-4 space-y-4 overflow-y-auto">
		<select
			class="select text-primary-500"
			size="8"
			on:change={(event) => {
				setRoom(event.target?.value);
			}}
		>
			{#each roomListForServer as room}
				{#if room.roomId == $selectedRoom[$selectedServer]}
					<option value={room.roomId} title={room.roomId ? room.roomId.toString() : ''} selected
						>{room.name}</option
					>
				{:else}
					<option value={room.roomId}>{room.name}</option>
				{/if}
			{/each}
		</select>
	</div>
	<!-- Footer -->
	<!-- <footer class="border-t border-surface-500/30 p-4">(footer)</footer> -->
</div>

<style>
	#sidebar {
		grid-area: sidebar;
	}
</style>
