<script lang="ts">
	import { identityStore } from '$lib/stores';
	import { AppBar } from '@skeletonlabs/skeleton';
</script>

<AppBar padding="p-3">
	<svelte:fragment slot="lead">
		<a href="/">Home</a>
		{#if $identityStore.identity != undefined && $identityStore.identity != null}
			<a href="/chat">Chat</a>
		{:else}
			<a href="/signup">Sign Up</a>
		{/if}
		<a href="/about">About</a>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<p>© 2023 Privacy & Scaling Explorations</p>
	</svelte:fragment>
</AppBar>

<style>
	a {
		margin-right: 1.5rem;
	}
</style>
