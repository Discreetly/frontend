<script lang="ts">
	import { identityStore, selectedServer, serverStore } from '$lib/stores';
	import DeleteIdentity from './DeleteIdentity.svelte';
	import BackupIdentity from './BackupIdentity.svelte';
	import RestoreIdentity from './RestoreIdentity.svelte';
	import { Identity } from '@semaphore-protocol/identity';
	import Join from '../signup/Join.svelte';
	import { __updateRooms } from '$lib/utils';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { getServerList } from '$lib/stores/servers';

	let identityExists = false;
	$: if ($identityStore.identity == undefined) {
		identityExists = false;
	} else {
		identityExists = true;
	}

	function selectServer(event: Event) {
		const target = event.target as HTMLInputElement;
		console.log('Selected server', target.value);
		console.log(target.value);
		$selectedServer = target.value;
	}

	function refreshRooms() {
		console.log('Refreshing rooms');
		__updateRooms($selectedServer);
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
		<h4 class="h4 mt-4">Join More Rooms</h4>
		<Join />
		<h4 class="h4 mt-4">Refresh Rooms</h4>
		<RadioGroup
			active="variant-filled-success"
			display="flex-col"
			hover="hover:variant-soft-primary"
		>
			{#each getServerList() as serverUrl}
				<RadioItem
					on:change={selectServer}
					bind:group={$selectedServer}
					name="server"
					value={$serverStore[serverUrl]}>{$serverStore[serverUrl].name}</RadioItem
				>
			{/each}
		</RadioGroup>
		<div>
			<div class="btn variant-filled-success btn-sm" on:click={refreshRooms}>Refresh Rooms</div>
		</div>
	{/if}
</div>
