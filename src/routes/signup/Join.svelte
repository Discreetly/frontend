<script lang="ts">
	import { identityStore, selectedServer, serverDataStore } from '$lib/stores';
	import { updateRooms } from '$lib/utils';

	let code = '';
	let acceptedRoomNames: string[] = [];

	function addCode(code: string) {
		console.log($selectedServer);
		const url = String($selectedServer + 'join');
		const idc = $identityStore.identity._commitment;
		console.log(url);
		const data = JSON.stringify({
			code: code,
			idc: idc
		});
		console.debug(data);
		fetch(url, {
			method: 'POST',
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json'
			},
			body: data
		})
			.then(async (response) => {
				const result = await response.json();
				console.log('INVITE CODE RESPONSE: ', result);
				if (result.status == 'valid' || result.status == 'already-added') {
					updateRooms($selectedServer, result.roomIds).then((roomNames) => {
						acceptedRoomNames = roomNames;
					});
					code = '';
				} else {
					alert('Invalid invite code');
				}
			})
			.catch((err) => {
				console.error(err);
			});
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
