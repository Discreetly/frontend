<script lang="ts">
	import { identityStore } from '$lib/stores';
	import DeleteIdentity from './DeleteIdentity.svelte';
	import BackupIdentity from './BackupIdentity.svelte';
	import RestoreIdentity from './RestoreIdentity.svelte';
	import { Identity } from '@semaphore-protocol/identity';

	let identityExists = false;
	$: if ($identityStore.identity == undefined) {
		identityExists = false;
	} else {
		identityExists = true;
	}

	function createIdentity(regenerate = false) {
		console.log('Creating identity');
		if (!identityExists || regenerate) {
			$identityStore.identity = new Identity();
			return 'created';
		} else {
			console.warn('Identity already exists');
			return 'exists';
		}
	}
</script>

{#if !identityExists}
	<div class="mb-8 text-center">
		<span class="badge variant-ghost-secondary text-sm px-4 py-2">Identity Not Found</span>
	</div>
{/if}
<div class="grid grid-flow-rows gap-5 my-5 max-w-md mx-auto">
	{#if !identityExists}
		<button on:click={() => createIdentity()} class="btn variant-filled-success" type="button">
			Generate Identity
		</button>
		<RestoreIdentity />
	{:else}
		<BackupIdentity />
		<DeleteIdentity />
	{/if}
</div>
