<script lang="ts">
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { serverStore, selectedServer, selectedRoom, currentRoomsStore } from '$lib/stores';
	import { getServerList, updateServer } from '$lib/utils/';

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

<div id="sidebar" class="lg:grid grid-rows-[auto_1fr_auto] border-r border-surface-500/30">
	<!-- Header -->
	<header class="border-b border-surface-500/30 p-4 flex flex-row">
		<select class="select text-primary-500" bind:value={$selectedServer}>
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
		<select class="select text-primary-500" size="8" bind:value={$selectedRoom[$selectedServer]}>
			{#each $currentRoomsStore as room}
				{console.log(room)}
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
