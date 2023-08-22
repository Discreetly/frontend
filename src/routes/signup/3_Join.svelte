<script lang="ts">
	import { identityStore, selectedServer, configStore } from '$lib/stores';
	import { postInviteCode } from '$lib/services/server';
	import type { JoinResponseI } from '$lib/types';
	import { getCommitment, updateRooms } from '$lib/utils/';

	let code = '';
	let acceptedRoomNames: string[] = [];

	async function addCode(newCode: string) {
		console.log($selectedServer);
		const idc = getCommitment();
		const result = (await postInviteCode($selectedServer, { code: newCode, idc })) as JoinResponseI;
		console.log('INVITE CODE RESPONSE: ', result);
		if (result.status == 'valid' || result.status == 'already-added') {
			acceptedRoomNames = await updateRooms($selectedServer, result.roomIds);
			code = '';
			$configStore.signUpStatus.inviteAccepted = true;
		} else {
			alert('Invalid invite code');
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

<div class="grid place-content-center">
	<label class="label">
		<span>Invite Code</span>
		<input
			class="input max-w-md"
			type="text"
			placeholder="Invite Code"
			bind:value={code}
			on:keydown={(event) => inviteCodeKeyPress(event)}
		/>
		<button
			class="btn variant-ghost-success"
			type="button"
			disabled={!code}
			on:click={() => addCode(code)}>Submit</button
		>
	</label>
	{#if acceptedRoomNames.length > 0}
		<p class="text-center mt-2">You've been added to:</p>
		<div class="my-2">
			{#each acceptedRoomNames as name}
				<ins class="ins border-y border-success-800">{name}</ins>
			{/each}
		</div>
	{/if}
</div>
