<script lang="ts">
	import SelectServer from '$lib/components/SelectServer.svelte';
	import { inviteCode } from '$lib/utils/inviteCode';

	export let code = '';
	let acceptedRoomNames: string[] = [];
	let loading = false;
	let err: string | undefined;

	function addCode(code: string) {
		loading = true;
		inviteCode(code)
			.then(({ acceptedRoomNames, err }) => {
				if (err) {
					alert(err);
				} else {
					acceptedRoomNames = acceptedRoomNames;
				}
			})
			.catch((err) => {
				alert(err);
			})
			.finally(() => {
				loading = false;
			});
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

<div class="flex flex-col items-center px-2 mb-2 sm:mb-4">
	<label class="label w-full" for="selectServer"
		><span class="h5">Select or Add a Server</span>
		<SelectServer />
	</label>
	<label class="label mt-3" for="inviteCode">
		<span class="h5">Invite Code</span>
		<input
			class="input"
			type="text"
			placeholder="Invite Code"
			id="inviteCode"
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
	</label>

	{#if err}
		<aside class="p">
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
