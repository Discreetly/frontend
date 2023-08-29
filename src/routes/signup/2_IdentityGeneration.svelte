<script lang="ts">
	import { identityStore } from '$lib/stores';
	import { createIdentity } from '$lib/utils/';
	import RestoreIdentity from '../identity/RestoreIdentity.svelte';
	$: identityExists = !!$identityStore._commitment;
</script>

<div class="grid place-content-center gap-5">
	{#if !identityExists}
		<button on:click={() => createIdentity()} class="btn variant-ghost-success" type="button">
			Generate Identity
		</button>
		<RestoreIdentity />
	{:else}
		<p class="h4">Identity Created ✅</p>
	{/if}
</div>
