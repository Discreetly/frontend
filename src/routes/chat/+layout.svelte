<script lang="ts">
	import { goto } from '$app/navigation';
	import { identityExists, serverStore } from '$lib/stores';
	import { updateServer } from '$lib/utils';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!$identityExists) {
			console.warn('Identity not detected, redirecting to signup page from /chat');
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
