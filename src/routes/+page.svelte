<script lang="ts">
	import { identityStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import Loading from '$lib/components/loading.svelte';

	let identityExists: boolean | null = null;

	onMount(() => {
		if ($identityStore.identity == undefined || $identityStore.identity == null) {
			identityExists = false;
		} else {
			identityExists = true;
		}
	});
</script>

{#if identityExists == null}
	<Loading />
{:else if identityExists == false}
	signup
{:else}
	chat button
{/if}
<slot />
