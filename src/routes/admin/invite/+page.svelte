<script lang="ts">
	import { createInvite } from '$lib/services/server';
	import { selectedServer, configStore, currentRoomsStore } from '$lib/stores';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import qrcode from 'qrcode';
	import { formatRelative } from 'date-fns';
	let numCodes = 1;
	let roomIds: string[] = [];
	let roomNames: string[] = [];
	let daysFromNow = 1;
	let usesLeft = 1;

	$: expiresAt = Date.now() + daysFromNow * 1000 * 60 * 60 * 24;

	function makeInviteQRCode(inviteCode: string) {
		const canvasContainer = document.getElementById('qr');
		const div = document.createElement('div');
		const canvas = document.createElement('canvas');
		div?.appendChild(canvas);
		const p = document.createElement('p');
		p.innerText = `https://app.discreetly.chat/signup/${inviteCode}`;
		div?.appendChild(p);
		canvasContainer?.appendChild(div);
		const url = `https://app.discreetly.chat/signup/${inviteCode}`;
		qrcode.toCanvas(canvas, url);
		canvas.style.height = '250px';
		canvas.style.width = '250px';
		div.className = 'flex flex-col place-items-center gap-2';
	}

	async function newCodes(numCodes: number) {
		console.log(`Requesting ${numCodes} codes`);
		const canvasContainer = document.getElementById('qr');
		canvasContainer?.replaceChildren();
		if (usesLeft == 0) {
			usesLeft = -1;
		}
		const resp = await createInvite(
			$selectedServer,
			$configStore.apiUsername as string,
			$configStore.apiPassword as string,
			numCodes,
			roomIds,
			expiresAt,
			usesLeft
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
		roomNames = $currentRoomsStore
			.filter((room) => roomIds.includes(String(room.roomId)))
			.map((room) => room.name);
	}
</script>

<div class="flex flex-col place-content-center max-w-sm m-auto pt-5">
	<div id="qr" class="flex flex-col gap-12 place-content-center">
		<div>
			<canvas class="variant-soft-secondary" width="250" height="250" />
			<p>no code generated yet</p>
		</div>
	</div>
	<div
		class="btn my-12 variant-soft-primary text-center items-center"
		on:click={() => {
			newCodes(numCodes);
		}}
	>
		{#if numCodes > 1}
			Generate New Codes
		{:else}
			Generate New Code
		{/if}
	</div>
	<div class="border-b border-spacing-3 pb-5 mb-5">
		<p>Rooms:</p>
		<ul class="ul">
			{#each roomNames as name}
				<li class="ms-2">- {name}</li>
			{/each}
		</ul>
	</div>
	<Accordion>
		<AccordionItem>
			<svelte:fragment slot="summary">Number of Codes</svelte:fragment>
			<svelte:fragment slot="content"
				><label class="label">
					<span># Codes: {numCodes}</span>
					<input type="range" min="1" max="5" bind:value={numCodes} />
				</label></svelte:fragment
			>
		</AccordionItem>
		<AccordionItem>
			<svelte:fragment slot="summary">Number of Uses Per Code</svelte:fragment>
			<svelte:fragment slot="content"
				><label class="label">
					<span># Uses: {usesLeft ? usesLeft : 'Unlimited'}</span>
					<input type="range" min="0" max="50" bind:value={usesLeft} />
				</label></svelte:fragment
			>
		</AccordionItem>
		<AccordionItem>
			<svelte:fragment slot="summary">Expiration</svelte:fragment>
			<svelte:fragment slot="content"
				><label class="label">
					<span>Expiration: {daysFromNow} day(s) ({formatRelative(expiresAt, new Date())})</span>
					<input type="range" min="1" max="14" bind:value={daysFromNow} />
				</label></svelte:fragment
			>
		</AccordionItem>
		<AccordionItem>
			<svelte:fragment slot="summary">Rooms</svelte:fragment>
			<svelte:fragment slot="content"
				><div>
					{#each $currentRoomsStore as room}
						<label class="label">
							<input
								type="checkbox"
								value={room.roomId}
								on:change={updateRoomList}
								checked={roomIds.includes(String(room.roomId))}
							/>
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
</style>
