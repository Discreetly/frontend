<script lang="ts">
	import Chat from './Chat.svelte';
	import { serverDataStore } from '$lib/stores';
	import { updateServers } from '$lib/utils';

	if (!Object.keys($serverDataStore).length) {
		updateServers();
	}
</script>

{#if Object.keys($serverDataStore).length}
	<Chat />
{:else}
	<slot />
{/if}
