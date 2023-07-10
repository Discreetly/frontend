<script lang="ts">
	import { identityStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	onMount(() => {
		if ($identityStore.identity == undefined || $identityStore.identity == null) {
			goto('/signup');
		} else {
			goto('/chat');
		}
	});
</script>

<ProgressRadial ... stroke={100} meter="stroke-primary-500" track="stroke-primary-500/30" />
