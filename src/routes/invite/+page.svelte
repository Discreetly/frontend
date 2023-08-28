<script lang="ts">
	import { createInvite } from '$lib/services/server';
	import { selectedServer, configStore, currentRoomsStore } from '$lib/stores';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import qrcode from 'qrcode';
	let numCodes = 1;
	let roomIds: string[] = [];

	function makeInviteQRCode(inviteCode: string) {
		const canvasContainer = document.getElementById('qr');
		const div = document.createElement('div');
		const canvas = document.createElement('canvas');
		div?.appendChild(canvas);
		const p = document.createElement('p');
		p.innerText = inviteCode;
		div?.appendChild(p);
		canvasContainer?.appendChild(div);
		const url = `${$selectedServer}/signup/${inviteCode}`;
		qrcode.toCanvas(canvas, url);
	}

	async function newCodes(numCodes: number) {
		console.log(`Requesting ${numCodes} codes`);
		const canvasContainer = document.getElementById('qr');
		canvasContainer?.replaceChildren();
		const resp = await createInvite(
			$selectedServer,
			numCodes,
			roomIds,
			$configStore.apiUsername as string,
			$configStore.apiPassword as string
		);
		console.log(resp);
		const codes = resp.codes;
		codes.forEach((code) => {
			makeInviteQRCode(code.claimcode);
		});
	}

	function updateRoomList(e: Event) {
		const target = e.target as HTMLInputElement;
		const roomId = target.value;
		if (target.checked) {
			roomIds.push(roomId);
		} else {
			roomIds = roomIds.filter((id) => id !== roomId);
		}
	}
</script>

<div class="flex flex-col place-content-center max-w-sm m-auto pt-5">
	<div id="qr" class="flex flex-col gap-12 place-content-center">
		<div>
			<canvas class="variant-ghost-success" />
			<p>no codes yet</p>
		</div>
	</div>
	<div
		class="btn my-12 variant-ghost-primary text-center items-center"
		on:click={() => {
			newCodes(numCodes);
		}}
	>
		New Codes
	</div>
	<Accordion>
		<AccordionItem>
			<svelte:fragment slot="summary">Number of Codes</svelte:fragment>
			<svelte:fragment slot="content"
				><label class="label">
					<span>Num Codes: {numCodes}</span>
					<input type="range" min="1" max="5" bind:value={numCodes} />
				</label></svelte:fragment
			>
		</AccordionItem>
		<AccordionItem>
			<svelte:fragment slot="summary">Rooms</svelte:fragment>
			<svelte:fragment slot="content"
				><div>
					{#each $currentRoomsStore as room}
						<label class="label">
							<input type="checkbox" value={room.roomId} on:change={updateRoomList} />
							<span title={String(room.roomId)}>{room.name}</span>
						</label>
					{/each}
				</div></svelte:fragment
			>
		</AccordionItem>
		<AccordionItem>
			<svelte:fragment slot="summary">API</svelte:fragment>
			<svelte:fragment slot="content"
				><label class="label">
					<span>Api Username</span>
					<input type="text" class="input" bind:value={$configStore.apiUsername} />
				</label>
				<label class="label">
					<span>Api Password</span>
					<input type="password" class="input" bind:value={$configStore.apiPassword} />
				</label></svelte:fragment
			>
		</AccordionItem>
	</Accordion>
</div>

<style>
	#qr > div > canvas {
		margin: 0 auto;
	}
	#qr > div > p {
		text-align: center;
	}
</style>
