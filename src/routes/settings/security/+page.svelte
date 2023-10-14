<script lang="ts">
	import { setPassword } from '$lib/utils';
	import { passwordSet } from '$lib/stores';

	const minPasswordLength = 4;
	let r = '';

	function onSubmit() {
		if (r != '' && r != null && r != undefined && r.length >= minPasswordLength) {
			setPassword(r);
		}
	}
</script>

<div class="max-w-lg mx-auto">
	{#if !$passwordSet}
		<h2 class="h3 mb-3">Set A Password!</h2>
		<p class="mt-3">
			In order to secure your identity and other sensitive data that is stored in your browser, we
			need you to set a password.
		</p>
		<p class="my-3">
			This password is only used locally, there is not username and password for your account, so
			don't forget to <a href="/settings/backup" title="Backup Identity">backup your identity</a>.
		</p>
		<form on:submit|preventDefault={() => onSubmit()} class="flex flex-col w-full">
			<label for="setPasswordInput" class="label" />
			<input
				id="setPasswordInput"
				type="password"
				name="password"
				class="input"
				bind:value={r}
				minlength={minPasswordLength}
				required
			/>
			<small>Minimum password length: {minPasswordLength}</small>
			<button
				class="btn variant-filled-primary mt-3"
				disabled={r.length < minPasswordLength}
				type="submit">Set Password</button
			>
		</form>
	{:else}
		<h2 class="h3">Password Set!</h2>
	{/if}
</div>
