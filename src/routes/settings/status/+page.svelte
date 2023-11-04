<script lang="ts">
	import {
		configStore,
		identityExists,
		identityKeyStore,
		identityStore,
		lockStateStore,
		passwordSet,
		serverStore
	} from '$lib/stores';
	import { IdentityStoreE } from '$lib/types';
	import { alertQueue } from '$lib/stores';
	let c = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error'];
	let t = c[0];
	function toggleBeta() {
		$configStore.beta = !$configStore.beta;
	}

	function toggleAnxiety() {
		$configStore.anxietyBar = !$configStore.anxietyBar;
	}

	function triggerAlert() {
		alertQueue.enqueue('TEST', t as any);
	}

	$: identityStoreEntries = Object.entries($identityStore).map(([key, value]) => ({
		key,
		value: JSON.stringify(value)
	}));

	$: identityKeyStoreEntries = Object.entries($identityKeyStore).map(([key, value]) => ({
		key,
		value: JSON.stringify(value)
	}));
</script>

<div class="p-4">
	<div id="status" class="flex flex-col gap-5">
		<div>
			<h2 class="h3">configStore</h2>
			<div>Completed Signup: {JSON.stringify($configStore.signUpStatus.completedSignup)}</div>
			<div>Identity Backedup: {JSON.stringify($configStore.signUpStatus.identityBackedUp)}</div>
			<div>IdentityStore Type: {IdentityStoreE[$configStore.identityStore]}</div>
			<div on:click={toggleBeta}>Beta: {JSON.stringify($configStore.beta)}</div>
			<div on:click={toggleAnxiety}>Beta: {JSON.stringify($configStore.anxietyBar)}</div>
			<div>Hashed Password: {JSON.stringify($configStore.hashedPwd)}</div>
		</div>
		<div>
			<h2 class="h3">Identity Data</h2>
			{#if $identityExists == 'safe' || $identityExists == 'unsafe'}
				{#each identityStoreEntries as { key, value }}
					<div>Unprotected {key}: {value}</div>
				{/each}

				{#each identityKeyStoreEntries as { key, value }}
					<div>Protected {key}: {value}</div>
				{/each}
			{:else if $identityExists == 'encrypted'}
				<div>Identity Exists but is encrypted</div>
			{:else}
				<div>No Identity Found</div>
			{/if}
		</div>
		<div>
			<h2 class="h3">Server Data</h2>
			{#each Object.keys($serverStore) as key}
				<div>{$serverStore[key].name}:</div>
				<div class="ps-5">id: {$serverStore[key].id}</div>
				<div class="ps-5">version: {$serverStore[key].version}</div>
				<div class="ps-5">url: {key}</div>
			{/each}
		</div>
		<div>
			<h2 class="h3">Status States</h2>
			<div>identityExists: {$identityExists}</div>
			<div>Password Set: {$passwordSet}</div>
			<div>Lock State: {$lockStateStore}</div>
		</div>
	</div>
	<button class="btn variant-outline-primary m-4" on:click={triggerAlert}>Test Alert</button>
	<select class="select" name="alertType" id="alertType" bind:value={t}>
		{#each c as choice}
			<option value={choice}>{choice}</option>
		{/each}
	</select>
</div>

<style>
	#status div div {
		margin-left: 1.25rem;
	}
</style>
