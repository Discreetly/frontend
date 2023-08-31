<script lang="ts">
	import JoinMore from './JoinMore.svelte';
	import { identityStore } from '$lib/stores';
	import { page } from '$app/stores';
	import DeleteIdentity from './DeleteIdentity.svelte';
	import BackupIdentity from './BackupIdentity.svelte';
	import RestoreIdentity from './RestoreIdentity.svelte';
	import { createIdentity } from '$lib/utils/';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import ActionRepresentation from './ActionRepresentation.svelte';
	import { onMount } from 'svelte';
	$: identityExists = !!$identityStore._commitment;
	let tabSet: number = 0;
	onMount(() => {
		console.log('Page: ', $page);
		if ($page.url.hash) {
			const hash = $page.url.hash.replace('#', '');
			console.log('Hash: ', hash);
			if (hash === 'join-more') {
				console.log('setting tab to join');
				tabSet = 1;
			}
		}
	});
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
		<TabGroup
			justify="justify-around"
			active="variant-soft-secondary"
			flex="flex-1 lg:flex-none"
			class="w-full"
		>
			<Tab bind:group={tabSet} name="id" value={0} class="center">
				<span>Identity</span>
			</Tab>
			<Tab bind:group={tabSet} name="server" value={1}>Server</Tab>
			<Tab bind:group={tabSet} name="misc" value={2}>Settings</Tab>
			<!-- Tab Panels --->
			<svelte:fragment slot="panel">
				{#if tabSet === 0}
					<BackupIdentity />
					<DeleteIdentity />
				{:else if tabSet === 1}
					<JoinMore />
				{:else if tabSet === 2}
					<ActionRepresentation />
				{/if}
			</svelte:fragment>
		</TabGroup>
	{/if}
</div>
