<script lang="ts">
	import { setPassword } from '$lib/utils';

	const minPasswordLength = 4;
	let r = '';

	function onSubmit() {
		if (r != '' && r != null && r != undefined && r.length >= minPasswordLength) {
			setPassword(r);
		}
	}
</script>

<form
	on:submit|preventDefault={() => onSubmit()}
	class="flex flex-col w-full"
>
	<label
		for="setPasswordInput"
		class="label"
	/>
	<input
		id="setPasswordInput"
		type="password"
		name="password"
		inputmode="numeric"
		class="input"
		bind:value={r}
		minlength={minPasswordLength}
		required
	/>
	<small>Minimum length: {minPasswordLength}</small>
	<button
		class="btn variant-filled-primary mt-3"
		disabled={r.length < minPasswordLength}
		type="submit">Set Unlock Code</button
	>
</form>
