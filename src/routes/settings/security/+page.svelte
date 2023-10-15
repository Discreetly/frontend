<script lang="ts">
	import Container from '../../../lib/components/Container.svelte';
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

{#if !$passwordSet}
	<Container heading="Set A Password">
		<p class="mt-3">
			In order to secure your identity and other sensitive data that is stored in your browser, we
			need you to set a password.
		</p>
		<p class="my-3">
			This password is only used locally, there is no username and password for your account, so
			don't forget to <a class="link" href="/settings/identity/backup" title="Backup Identity"
				>backup your identity</a
			>.
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
	</Container>
{:else}
	<Container heading="Password set" />
{/if}
