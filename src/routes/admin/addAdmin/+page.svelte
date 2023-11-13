<script lang="ts">
	import { addAdmin } from '$lib/services/server';
	import { selectedServer, configStore, currentRoomsStore } from '$lib/stores';
	import { getCommitment } from '$lib/utils';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	let selectedRoomId: string;
	let idc: string;
	let ownIdc: boolean = true;
	let result: object;

	function updateRoom(e: Event) {
		const target = e.target as HTMLInputElement;
		selectedRoomId = target.value;
	}

	async function addAdminToRoom() {
		const _idc = ownIdc ? getCommitment() : idc;
		if (_idc == null) {
			return;
		}
		const resp = await addAdmin(
			$selectedServer,
			$configStore.apiUsername as string,
			$configStore.apiPassword as string,
			selectedRoomId,
			_idc
		);
		result = resp;
	}
</script>

<div class="flex flex-col place-content-center max-w-sm m-auto pt-5">
	<div class="border-b border-spacing-3 pb-5 mb-5">
		<h4 class="h4 my-5">Select Room</h4>
		<select
			class="select"
			on:change={updateRoom}>
			{#each $currentRoomsStore as room}
				<option value={room.roomId}>{room.name}</option>
			{/each}
		</select>
	</div>
	<div class="border-b border-spacing-3 pb-5 mb-5">
		<h4 class="h4 my-5">Enter someone elses IDC or use your own</h4>
		<input
			type="text"
			class="input"
			bind:value={idc}
			disabled={ownIdc} />
		<label class="my-2 flex flex-row items-center space-x-2"
			><span>Use your own Identity:</span><input
				class="checkbox"
				type="checkbox"
				title="Use Your Identity"
				bind:value={ownIdc} /></label>
	</div>
	<div
		class="btn variant-ghost-primary"
		on:click={addAdminToRoom}>
		Add Admin to Room
	</div>
	<div>{JSON.stringify(result)}</div>
	<Accordion>
		<AccordionItem>
			<svelte:fragment slot="summary">API</svelte:fragment>
			<svelte:fragment slot="content">
				<label class="label">
					<span>Api Username</span>
					<input
						type="text"
						class="input"
						bind:value={$configStore.apiUsername} />
				</label>
				<label class="label">
					<span>Api Password</span>
					<input
						type="password"
						class="input"
						bind:value={$configStore.apiPassword} />
				</label></svelte:fragment>
		</AccordionItem>
	</Accordion>
</div>

<style>
	#qr > div > canvas {
		margin: 0 auto;
		height: 250px;
		width: 250px;
	}
	#qr > div > p {
		text-align: center;
	}
</style>
