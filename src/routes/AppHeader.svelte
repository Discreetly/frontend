<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { identityStore } from '$lib/stores';
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<h1 class="h4 text-secondary-500">
			<a href="/">Discreetly</a>
		</h1>
	</svelte:fragment>
	{#if $identityStore.identity != undefined && $identityStore.identity != null}
		<a href="/chat" class="me-2">Chat</a>
	{/if}
	<a href="/about" class="me-2">About</a>

	<svelte:fragment slot="trail">
		<div class="me-2 text-secondary-500">Alpha Version!</div>
		{#if $identityStore.identity != undefined && $identityStore.identity != null}
			<a href="/identity">Identity</a>
		{:else}
			<a href="/signup">Sign Up</a>
		{/if}
		<LightSwitch />
	</svelte:fragment>
</AppBar>
