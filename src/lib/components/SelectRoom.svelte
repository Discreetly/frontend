<script lang="ts">
	import { selectedServer, selectedRoom, currentRoomsStore } from '$lib/stores';
	import { updateMessages } from '$lib/utils';

	function setRoom(roomId: string) {
		$selectedRoom[$selectedServer] = roomId;
		updateMessages($selectedServer, roomId);
	}
</script>

<!-- <select class="select text-primary-500" bind:value={$selectedRoom[$selectedServer]}>
	{#each $currentRoomsStore as room}
		{#if room.roomId == $selectedRoom[$selectedServer]}
			<option value={room.roomId} title={room.roomId ? room.roomId.toString() : ''} selected
				>{room.name}</option
			>
		{:else}
			<option value={room.roomId}>{room.name}</option>
		{/if}
	{/each}
</select> -->

<dl class="m-2 md:my-3 md:mx-2">
	{#each $currentRoomsStore as room}
		<div
			class="border my-1 md:my-2 py-1 px-2 md:py-3 md:px-4 rounded-token border-surface-400-500-token"
			class:bg-primary-active-token={room.roomId == $selectedRoom[$selectedServer]}
			on:click={() => {
				setRoom(room.roomId.toString());
			}}
		>
			<span class="flex-auto">
				<dt>{room.name}</dt>
				<dd class="hidden sm:block"><small>Members: ~{room.identities?.length ?? '?'}</small></dd>
			</span>
		</div>
	{/each}
</dl>

<style>
	dl div {
		display: flex;
		align-items: center;
		white-space: nowrap;
	}
</style>
