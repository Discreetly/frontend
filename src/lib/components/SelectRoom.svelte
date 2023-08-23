<script lang="ts">
	import { selectedServer, selectedRoom, currentRoomsStore } from '$lib/stores';
</script>

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
