<script lang="ts">
	import { identityStore, configStore } from '$lib/stores';

	import { Identity } from '@semaphore-protocol/identity';
	import RestoreIdentity from '../identity/RestoreIdentity.svelte';

	let identityExists = false;

	$: if ($identityStore.identity == undefined) {
		identityExists = false;
		console.debug('identity does not exist');
	} else {
		identityExists = true;
		console.debug('identity exists');
	}

	function createIdentity(regenerate = false) {
		console.log('Creating identity');
		if (!identityExists || regenerate) {
			$identityStore.identity = new Identity();
			return 'created';
		} else {
			console.log('Identity already exists');
			return 'exists';
		}
	}
</script>

<div class="grid place-content-center gap-5">
	{#if !identityExists}
		<button on:click={() => createIdentity()} class="btn variant-filled-success" type="button">
			Generate Identity
		</button>
		<RestoreIdentity />
	{:else}
		<div class="d-flex justify-content-between gap-2">
			<button on:click={() => createIdentity(true)} class="btn variant-ghost-warning" type="button">
				Re-Generate Identity
			</button>
		</div>
	{/if}
</div>
