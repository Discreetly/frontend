<script lang="ts">
	import { identityExists } from '$lib/stores';
	import DeleteIdentity from './identity/DeleteIdentity.svelte';
	import BackupIdentity from './identity/BackupIdentity.svelte';
	import RestoreIdentity from './identity/RestoreIdentity.svelte';
	import { createIdentity } from '$lib/utils/';
	import ActionRepresentation from './ui/ActionRepresentation.svelte';
	import IdentityIcon from 'svelte-material-icons/Account.svelte';
	import Eye from 'svelte-material-icons/Eye.svelte';
	import Container from '../../lib/components/Container.svelte';
</script>

<Container heading="Manage Settings">
	{#if !$identityExists}
		<div class="mb-3 sm:mb-8 text-center">
			<span class="text-base italic px-4 py-2 font-mono badge variant-outline-error"
				>Identity Not Found!</span
			>
		</div>
	{/if}
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
		<Container>
			<svelte:fragment slot="header">
				<h3 class="h3 flex flex-row gap-2 items-center"><IdentityIcon /> Identity</h3>
			</svelte:fragment>
			<BackupIdentity />
			<DeleteIdentity />
			<RestoreIdentity />
		</Container>
		<Container>
			<svelte:fragment slot="header">
				<h3 class="h3 flex flex-row gap-2 items-center"><Eye /> UI</h3></svelte:fragment
			>
			<ActionRepresentation />
		</Container>
	{/if}
</Container>
