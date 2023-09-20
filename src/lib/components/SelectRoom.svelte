<script lang="ts">
	import { goto } from '$app/navigation';
	import { selectedServer, selectedRoom, currentRoomsStore } from '$lib/stores';
	import { updateMessages } from '$lib/utils';
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();

	function setRoom(roomId: string) {
		$selectedRoom[$selectedServer] = roomId;
		updateMessages($selectedServer, roomId);
		drawerStore.close();
		goto('/chat');
	}
</script>

<dl class="m-2 sm:md-3 md:my-3 md:mx-2">
	{#each $currentRoomsStore as room}
		<div
			class="border my-1 md:my-2 py-1 px-2 md:py-3 md:px-4 rounded-token border-surface-400-500-token"
			class:bg-secondary-600-300-token={room.roomId == $selectedRoom[$selectedServer]}
			class:text-secondary-50-900-token={room.roomId == $selectedRoom[$selectedServer]}
			on:click={() => {
				setRoom(room.roomId.toString());
			}}
			title={`id: ${room.roomId},
epoch length(s): ${(room.rateLimit ? room.rateLimit : 1) / 1000},
'message limit': ${room.userMessageLimit}`}
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
