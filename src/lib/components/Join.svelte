<script lang="ts">
	import { selectedServer, configStore } from '$lib/stores';
	import SelectServer from '$lib/components/SelectServer.svelte';
	import { postInviteCode } from '$lib/services/server';
	import type { JoinResponseI } from '$lib/types';
	import { getCommitment, updateRooms } from '$lib/utils/';
	import Loading from './loading.svelte';
	import Button from './button.svelte';

	export let code = '';
	let acceptedRoomNames: string[] = [];
	let loading = false;
	let msg: string | undefined;

	async function addCode(newCode: string) {
		try {
			const idc = getCommitment();
			loading = true;
			const result = (await postInviteCode($selectedServer, {
				code: newCode.toLowerCase(),
				idc
			})) as JoinResponseI;
			console.debug('INVITE CODE RESPONSE: ', result);
			if (result.status == 'valid' || result.status == 'already-added') {
				console.debug('Updating new rooms');
				acceptedRoomNames = await updateRooms($selectedServer, result.roomIds);
				code = '';
				console.log(`Added to rooms: ${acceptedRoomNames}`);
				$configStore.signUpStatus.inviteAccepted = true;
				$configStore.signUpStatus.inviteCode = '';
			} else {
				alert('Invalid invite code');
				msg = 'Invalid invite code.';
			}
			loading = false;
		} catch (e: unknown) {
			msg = String(e.message);
		}
	}
	function inviteCodeKeyPress(event: KeyboardEvent) {
		const input = event.target as HTMLInputElement | null;

		// Check if the target is not an instance of HTMLInputElement or is null.
		if (!input || !(input instanceof HTMLInputElement)) return;

		const forbiddenKeys = [
			'`',
			'=',
			'+',
			'[',
			']',
			'\\',
			';',
			"'",
			',',
			'.',
			'/',
			'?',
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
			'0'
		];

		if (event.key === 'Enter') {
			event.preventDefault();
			addCode(code); // Assuming 'code' is available in the outer scope
		} else if (event.key === ' ' || event.key === '-') {
			event.preventDefault();
			if (code.length > 0 && code[code.length - 1] !== '-') {
				// Insert a dash where the cursor is
				code = code.slice(0, input.selectionStart!) + '-' + code.slice(input.selectionStart!);

				const cursorPosition = input.selectionStart!;
				setTimeout(() => {
					if (input) {
						input.selectionStart = input.selectionEnd = cursorPosition + 1;
					}
				}, 0);
			}
		} else if (forbiddenKeys.includes(event.key)) {
			// This just helps prevent typos
			event.preventDefault();
		}
	}
</script>

<div class="grid place-content-center mb-2 sm:mb-4">
	<label class="label">
		<span>Select or Add a Server</span>
		<SelectServer />
	</label>
	<label class="label mt-3">
		<span>Invite Code</span>
		<div class="m-2 sm:md-3">
			<input
				class="input max-w-md mb-2 variant-ghost"
				type="text"
				placeholder="Invite Code"
				bind:value={code}
				on:keydown={(event) => inviteCodeKeyPress(event)}
			/>
			{#if !loading}
				<button
					class="btn variant-ghost-success"
					type="button"
					disabled={!code}
					on:click={() => addCode(code)}>Submit</button
				>
			{:else}
				<p class="italic">Loading...</p>
			{/if}
		</div>
	</label>
	{#if msg}
		<aside class="p">
			<div>{msg}</div>
			<div>
				If you are having trouble and would like help, please message us on <a
					href="https://discord.gg/brJQ36KVxk"
					class="underline link">Discord</a
				>
			</div>
		</aside>
	{/if}
	{#if acceptedRoomNames.length > 0}
		<p class="text-center mt-2">You've been added to:</p>
		<div class="my-2">
			{#each acceptedRoomNames as name}
				<ins class="ins border-y border-success-800">{name}</ins>
			{/each}
		</div>
	{/if}
</div>

<style>
	aside {
		overflow-wrap: normal;
	}
</style>
