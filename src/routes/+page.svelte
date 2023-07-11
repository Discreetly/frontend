<script lang="ts">
	import { identityStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Loading from '$lib/loading.svelte';

	onMount(() => {
		if ($identityStore.identity == undefined || $identityStore.identity == null) {
			goto('/signup');
		} else {
			goto('/chat');
		}
	});
</script>

<Loading />
