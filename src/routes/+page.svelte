<script lang="ts">
	import { identityStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		if ($identityStore.identity == undefined || $identityStore.identity == null) {
			goto('/signup');
		} else {
			goto('/chat');
		}
	});
</script>

<div class="spinner-border text-danger" role="status">
	<span class="visually-hidden">Loading...</span>
</div>
