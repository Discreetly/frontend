<script lang="ts">
	import { configStore, identityKeyStore, identityStore, serverStore } from '$lib/stores';
	import { IdentityStoreE } from '$lib/types';
</script>

<div id="status" class="flex flex-col gap-5">
	<div>
		<h2 class="h3">configStore</h2>
		<div>Completed Signup: {JSON.stringify($configStore.signUpStatus.completedSignup)}</div>
		<div>Identity Backedup: {JSON.stringify($configStore.signUpStatus.identityBackedUp)}</div>
		<div>IdentityStore Type: {IdentityStoreE[$configStore.identityStore]}</div>
		<div>Beta: {JSON.stringify($configStore.beta)}</div>
		<div>Hashed Password: {JSON.stringify($configStore.hashedPwd)}</div>
	</div>
	<div>
		<h2 class="h3">Identity Data</h2>
		{#each Object.keys($identityStore) as key}
			<div>Unprotected {key}: {JSON.stringify($identityStore[key])}</div>
		{/each}
		{#each Object.keys($identityKeyStore) as key}
			<div>Protected {key}: {JSON.stringify($identityKeyStore[key])}</div>
		{/each}
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
</div>

<style>
	#status div div {
		margin-left: 1.25rem;
	}
</style>
