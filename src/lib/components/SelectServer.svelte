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
		value: 'http://discreetly.chat/',
		valueAttr: { type: 'url', required: true },
		// Returns the updated response value
		response: (r: string) => {
			console.log('response:', r);
			if (getServerList().includes(r)) {
				console.warn('Server already exists');
				return;
			}
			updateServer(r);
		}
	};
</script>

<div class=" flex flex-row">
	<select class="select text-primary-500" bind:value={$selectedServer}>
		{#each Object.entries($serverStore) as [key, s]}
			<option value={key}>{s.name}</option>
		{/each}
	</select>
	<button
		type="button"
		class="btn btn-sm variant-ghost-primary ms-2"
		on:click={() => {
			modalStore.trigger(addServerModal);
		}}>+</button
	>
</div>
