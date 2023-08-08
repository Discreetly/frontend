<script lang="ts">
	import { identityStore, selectedServer, serverDataStore } from '$lib/stores';
	import { setRooms } from '$lib/utils';
	import { postAddCode } from '../../services/server';

	let code = '';
	let acceptedRoomNames: string[] = [];

	async function addCode(newCode: string) {
		console.log($selectedServer);
		const url = String($selectedServer);
		const idc = $identityStore.identity._commitment;
		const result = await postAddCode($selectedServer, { code: newCode, idc });
		console.log('INVITE CODE RESPONSE: ', result);
		if (result.status == 'valid' || result.status == 'already-added') {
			acceptedRoomNames = await setRooms($selectedServer, result.roomIds);
			// updateRooms($selectedServer, result.roomIds).then((roomNames) => { // TODO remove this call
				// acceptedRoomNames = roomNames;
			// });
			code = '';
		} else {
			alert('Invalid invite code');
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
			on:keydown={(event) => {
				const input = event.target;
				if (event.key === 'Enter') {
					event.preventDefault();
					addCode(code);
				} else if ([' ', '-'].includes(event.key)) {
					event.preventDefault();
					if (code.length > 0 && code[code.length - 1] !== '-') {
						// inserts a - where the cursor is
						code = code.slice(0, input.selectionStart) + '-' + code.slice(input.selectionStart);
						const _cursor_position = input.selectionStart;
						setTimeout(function () {
							input.selectionStart = input.selectionEnd = _cursor_position + 1;
						}, 0);
					}
				} else if (
					[
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
					].includes(event.key)
				) {
					// This just helps prevent typos
					event.preventDefault();
				}
			}}
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
