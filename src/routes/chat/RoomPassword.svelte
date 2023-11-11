<script lang="ts">
	import { enterRoomPassword } from '$lib/utils';
	import Container from '$lib/components/Utils/Container.svelte';

	export let roomId: string;

	const minPasswordLength = 4;
	let r = '';

	function onSubmit() {
		if (r != '' && r != null && r != undefined && r.length >= minPasswordLength) {
			enterRoomPassword(r, roomId);
		}
	}
</script>

<Container heading="Enter Room Password">
	<form
		on:submit|preventDefault={() => onSubmit()}
		class="flex flex-col w-full">
		<label
			for="enterRoomPassword"
			class="label" />
		<input
			id="enterRoomPassword"
			type="password"
			name="password"
			class="input"
			bind:value={r}
			required />
		<button
			class="btn variant-filled-primary mt-3"
			type="submit">Enter Room Password</button>
	</form>
</Container>
