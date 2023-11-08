<script lang="ts">
	import { getAllRooms, createInvite } from '$lib/services/server';
	import { inviteCode } from '$lib/gateways/inviteCode';
	import { selectedServer, configStore, currentRoomsStore } from '$lib/stores';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { formatRelative } from 'date-fns';
	import type { RoomI } from '$lib/types';

	let rooms: RoomI[] = [];
	let selectedRoomIds: string[] = [];
	$: username = $configStore.apiUsername;
	$: password = $configStore.apiPassword;

	async function getRooms() {
		if (username && password) {
			console.log('getting rooms');
			rooms = await getAllRooms($selectedServer, username, password);
		}
	}

	async function joinRooms() {
		const resp = await createInvite(
			$selectedServer,
			$configStore.apiUsername as string,
			$configStore.apiPassword as string,
			1,
			selectedRoomIds
		);
		const codes = resp.codes;
		codes.forEach((code) => {
			inviteCode(code.claimcode);
		});
	}

	function updateRoomList(e: Event) {
		const target = e.target as HTMLInputElement;
		const roomId = target.value;
		if (target.checked) {
			selectedRoomIds.push(roomId);
		} else {
			selectedRoomIds = selectedRoomIds.filter((id) => id !== roomId);
		}
		console.log(selectedRoomIds);
	}
</script>

<div class="flex flex-col place-content-center max-w-sm m-auto pt-5">
	<div class="border-b border-spacing-3 pb-5 mb-5">
		<button
			on:click={getRooms}
			class="btn variant-outline-primary">Get Rooms</button
		>
		<button
			on:click={joinRooms}
			class="btn variant-outline-primary"
			disabled={selectedRoomIds.length == 1}>Join Rooms</button
		>

		<h4 class="h4 my-5">Rooms:</h4>
		{#each rooms as room}
			<label class="label">
				<input
					type="checkbox"
					value={room.roomId}
					on:change={updateRoomList}
					checked={selectedRoomIds.includes(String(room.roomId))}
				/>
				<span title={String(room.roomId)}>{room.name}</span>
			</label>
		{/each}
	</div>
	<Accordion>
		<AccordionItem>
			<svelte:fragment slot="summary">API</svelte:fragment>
			<svelte:fragment slot="content"
				><label class="label">
					<span>Api Username</span>
					<input
						type="text"
						class="input"
						bind:value={$configStore.apiUsername}
					/>
				</label>
				<label class="label">
					<span>Api Password</span>
					<input
						type="password"
						class="input"
						bind:value={$configStore.apiPassword}
					/>
				</label></svelte:fragment
			>
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
