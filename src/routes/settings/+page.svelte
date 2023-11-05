<script lang="ts">
	import DeleteIdentity from '$lib/components/Identity/DeleteIdentity.svelte';
	import BackupIdentity from './identity/BackupIdentityWrapper.svelte';
	import RestoreIdentity from '$lib/components/Identity/RestoreIdentity.svelte';
	import { createIdentity } from '$lib/utils/';
	import ActionRepresentation from './ui/ActionRepresentation.svelte';
	import IdentityIcon from 'svelte-material-icons/Account.svelte';
	import Eye from 'svelte-material-icons/Eye.svelte';
	import Container from '$lib/components/Utils/Container.svelte';
	import { identityExists } from '$lib/stores';
	import AnxietyBar from './ui/AnxietyBar.svelte';
	import SelectServer from '$lib/components/Server/SelectServer.svelte';
</script>

<Container heading="Manage Settings">
	{#if !$identityExists}
		<div class="mb-3 sm:mb-8 text-center">
			<span class="text-base italic px-4 py-2 font-mono badge variant-outline-error"
				>Identity Not Found!
			</span>
		</div>
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
				<h3 class="h3 flex flex-row gap-2 items-center mb-3"><IdentityIcon /> Identity</h3>
			</svelte:fragment>
			<BackupIdentity />
			<DeleteIdentity />
			<RestoreIdentity />
		</Container>
		<Container>
			<svelte:fragment slot="header">
				<h3 class="h3 flex flex-row gap-2 items-center mb-3"><Eye /> UI</h3></svelte:fragment
			>
			<ActionRepresentation />
			<AnxietyBar />
		</Container>
	{/if}
	<Container>
		<svelte:fragment slot="header">
			<h3 class="h3 flex flex-row gap-2 items-center mb-3">
				<Eye /> Select Your Server
			</h3></svelte:fragment
		>
		<SelectServer />
	</Container>
</Container>
