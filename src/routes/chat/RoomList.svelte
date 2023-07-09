<script lang="ts">
	import type { RoomGroupI, RoomI } from 'discreetly-interfaces';
	import { selectedServer, serverDataStore } from '$lib/stores';

	$: roomGroups = $serverDataStore[$selectedServer].roomGroups;

	export let selectRoom: (roomId: RoomI['id']) => any;

	function getMembers(room: RoomI): string {
		let total = 0;
		total = room.membership?.identityCommitments?.length || 0;
		if (!(total > 0)) {
			return 'Cooming soon...';
		}
		return String(total.toString() + ' members');
	}
</script>

<div class="col-3">
	<section id="roomList">
		{#each roomGroups as group}
			<h4 class="mb-2 pb-2 border-bottom">{group.name}</h4>
			<ul class="list-group my-2">
				{#each group.rooms as room, index}
					<div class="mb-2">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<div class="d-flex justify-content-between align-items-center">
							<h5 class="flex-grow-1">{room.name}</h5>
							<div class="px-3">{getMembers(room)}</div>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<div
								on:click={selectRoom(room.id)}
								class="btn btn-sm btn-primary d-flex align-items-center"
							>
								💬
							</div>
						</div>
					</div>
				{/each}
			</ul>
		{/each}
	</section>
</div>

<style>
	.btn-sm {
		text-align: center !important;
	}
</style>
