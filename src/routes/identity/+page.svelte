<script lang="ts">
	import { identityStore } from '$lib/stores';
	import DeleteIdentity from './DeleteIdentity.svelte';
	import BackupIdentity from './BackupIdentity.svelte';
	import RestoreIdentity from './RestoreIdentity.svelte';
	import Join from '../signup/3_Join.svelte';
	import { createIdentity } from '$lib/utils/';
</script>

{#if !$identityStore.identity}
	<div class="mb-8 text-center">
		<span class="badge variant-ghost-secondary text-sm px-4 py-2">Identity Not Found</span>
	</div>
{/if}
<div class="grid grid-flow-rows gap-5 my-5 max-w-md mx-auto">
	{#if !$identityStore.identity}
		<button on:click={() => createIdentity()} class="btn variant-filled-success" type="button">
			Generate Identity
		</button>
		<RestoreIdentity />
	{:else}
		<BackupIdentity />
		<DeleteIdentity />
		<h4 class="h4 mt-4">Join More Rooms</h4>
		<Join />
	{/if}
</div>
