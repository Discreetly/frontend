<script lang="ts">
	import { serverStore } from '$lib/stores';
	import { updateServers } from '$lib/utils';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!Object.keys($serverStore).length) {
			updateServers();
		}
	});
</script>

{#if Object.keys($serverStore).length}
	<slot />
{/if}
