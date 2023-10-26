<script lang="ts">
	import { goto } from '$app/navigation';
	import { identityExists, serverStore } from '$lib/stores';
	import { updateServer } from '$lib/utils';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!$identityExists) {
			goto('/signup');
		}
		if (!Object.keys($serverStore).length) {
			updateServer();
		}
	});
</script>

{#if Object.keys($serverStore).length}
	<slot />
{/if}
