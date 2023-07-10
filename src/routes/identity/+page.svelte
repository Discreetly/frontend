<script lang="ts">
	import { identityStore } from '$lib/stores';
	import DeleteIdentity from './DeleteIdentity.svelte';
	import { Identity } from '@semaphore-protocol/identity';

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

{#if !identityExists}
	<div class="mb-6">
		<span class="badge variant-ghost-secondary text-sm">Identity Not Found</span>
	</div>
	<button on:click={() => createIdentity()} class="btn variant-filled-success" type="button">
		Generate Identity
	</button>
{:else}
	<DeleteIdentity />
{/if}
