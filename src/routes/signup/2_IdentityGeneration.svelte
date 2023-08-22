<script lang="ts">
	import { identityStore } from '$lib/stores';
	import { createIdentity } from '$lib/utils/';
	import RestoreIdentity from '../identity/RestoreIdentity.svelte';
	$: identityExists = !!$identityStore._commitment;
</script>

<div class="grid place-content-center gap-5">
	{#if !identityExists}
		<button on:click={() => createIdentity()} class="btn variant-filled-success" type="button">
			Generate Identity
		</button>
		<RestoreIdentity />
	{:else}
		<button on:click={() => createIdentity(true)} class="btn variant-ghost-warning" type="button">
			Re-Generate Identity
		</button>
		<RestoreIdentity />
	{/if}
</div>
