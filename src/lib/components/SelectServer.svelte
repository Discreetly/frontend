<script lang="ts">
	import { serverStore, selectedServer } from '$lib/stores';
	import { getServerList, updateServer } from '$lib/utils';

	import { Modal, modalStore, type ModalSettings } from '@skeletonlabs/skeleton';

	const addServerModal: ModalSettings = {
		type: 'prompt',
		// Data
		title: 'Enter Server Address',
		body: 'Provide the server address.',
		// Populates the input value and attributes
		value: 'https://server.discreetly.chat/',
		valueAttr: { type: 'url', required: true },
		// Returns the updated response value
		response: (r: string) => {
			console.debug('response:', r);
			if (getServerList().includes(r)) {
				console.warn('Server already exists');
				return;
			}
			updateServer(r);
		}
	};
</script>

<div class="m-2 sm:md-3 flex flex-row">
	<select class="select variant-ghost" bind:value={$selectedServer} title="Choose a server">
		{#each Object.entries($serverStore) as [key, s]}
			<option value={key} title={key}>{s.name}</option>
		{/each}
	</select>
	<button
		type="button"
		title="Add Server"
		class="btn btn-sm variant-ghost ms-2 text-xl"
		on:click={() => {
			modalStore.trigger(addServerModal);
		}}>+</button
	>
</div>
