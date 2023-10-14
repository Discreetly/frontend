<script lang="ts">
	import { identityExists } from '$lib/stores';
	import DeleteIdentity from './identity/DeleteIdentity.svelte';
	import BackupIdentity from './identity/BackupIdentity.svelte';
	import RestoreIdentity from './identity/RestoreIdentity.svelte';
	import { createIdentity } from '$lib/utils/';
	import ActionRepresentation from './ui/ActionRepresentation.svelte';
	import IdentityIcon from 'svelte-material-icons/Account.svelte';
	import Eye from 'svelte-material-icons/Eye.svelte';
</script>

<h2 class="h2 mb-3 sm:mb-5 text-center">Manage Settings</h2>
{#if !$identityExists}
	<div class="mb-3 sm:mb-8 text-center">
		<span class="text-base italic px-4 py-2 font-mono badge variant-outline-error"
			>Identity Not Found!</span
		>
	</div>
{/if}
<div class="flex flex-row flex-wrap gap-5 my-5 mx-auto justify-center">
	{#if !$identityExists}
		<button
			on:click={() => createIdentity()}
			class="btn variant-ghost-primary font-medium"
			type="button"
		>
			Generate New Identity
		</button>
		<RestoreIdentity />
	{:else}
		<div>
			<h3 class="h3 flex flex-row gap-2 items-center"><IdentityIcon /> Identity</h3>
			<div class="flex flex-col gap-3 sm:gap-5 items-stretch">
				<BackupIdentity />
				<DeleteIdentity />
				<RestoreIdentity />
			</div>
		</div>
		<div>
			<h3 class="h3 flex flex-row gap-2 items-center"><Eye /> UI</h3>
			<div class="flex flex-col gap-3 sm:gap-5 items-stretch">
				<ActionRepresentation />
				<BackupIdentity />
				<DeleteIdentity />
				<RestoreIdentity />
			</div>
		</div>
	{/if}
</div>
