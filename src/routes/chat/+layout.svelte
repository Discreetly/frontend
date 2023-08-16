<script lang="ts">
	import { serverDataStore } from '$lib/data/stores';
	import { updateServers } from '$lib/utils';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!Object.keys($serverDataStore).length) {
			updateServers();
		}
	});
</script>

{#if Object.keys($serverDataStore).length}
	<slot />
{/if}
