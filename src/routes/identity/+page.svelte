<script lang="ts">
	import JoinMore from './JoinMore.svelte';
	import { identityStore } from '$lib/stores';
	import DeleteIdentity from './DeleteIdentity.svelte';
	import BackupIdentity from './BackupIdentity.svelte';
	import RestoreIdentity from './RestoreIdentity.svelte';
	import { createIdentity } from '$lib/utils/';
	$: identityExists = !!$identityStore._commitment;
</script>

{#if !identityExists}
	<div class="mb-8 text-center">
		<span class="text-base italic px-4 py-2 font-mono badge variant-outline-error"
			>Identity Not Found!</span
		>
	</div>
{/if}
<div class="grid grid-flow-rows gap-5 my-5 max-w-md mx-auto">
	{#if !identityExists}
		<button
			on:click={() => createIdentity()}
			class="btn variant-ghost-primary font-medium"
			type="button"
		>
			Generate Identity
		</button>
		<RestoreIdentity />
	{:else}
		<BackupIdentity />
		<DeleteIdentity />
		<JoinMore />
	{/if}
</div>
