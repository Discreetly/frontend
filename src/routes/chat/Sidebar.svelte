<script lang="ts">
	import SelectServer from '$lib/components/SelectServer.svelte';
	import { selectedServer, selectedRoom, currentRoomsStore } from '$lib/stores';
</script>

<div id="sidebar" class="lg:grid grid-rows-[auto_1fr_auto] border-r border-surface-500/30">
	<!-- Header -->
	<header class="border-b border-surface-500/30 p-4">
		<SelectServer />
	</header>
	<!-- List -->
	<div class="p-4 space-y-4 overflow-y-auto">
		<select class="select text-primary-500" size="8" bind:value={$selectedRoom[$selectedServer]}>
			{#each $currentRoomsStore as room}
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
