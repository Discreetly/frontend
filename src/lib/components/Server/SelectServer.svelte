<script lang="ts">
	import { serverStore, selectedServer } from '$lib/stores';
	import { getServerList, updateServer } from '$lib/utils';

	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

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

<div class="input-group input-group-divider grid-cols-[1fr_auto]">
	<select
		class="select"
		bind:value={$selectedServer}
		title="Choose a server"
		id="selectServer"
	>
		{#each Object.entries($serverStore) as [key, s]}
			<option
				value={key}
				title={key}>{s.name}</option
			>
		{/each}
	</select>
	<button
		type="button"
		title="Add Server"
		class="text-xl input-group-shim"
		on:click={() => {
			modalStore.trigger(addServerModal);
		}}>+</button
	>
</div>
