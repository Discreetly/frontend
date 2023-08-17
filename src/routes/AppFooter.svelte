<script lang="ts">
	import { identityStore } from '$lib/stores';
	import { AppBar } from '@skeletonlabs/skeleton';
</script>

<AppBar padding="py-3 px-8">
	<svelte:fragment slot="lead">
		<a href="/">Home</a>
		{#if $identityStore != undefined && $identityStore != null}
			<a href="/chat">Chat</a>
		{:else}
			<a href="/signup">Sign Up</a>
		{/if}
		<a href="/about">About</a>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<p><a href="/testing" style="margin:0 !important">© 2023 Privacy & Scaling Explorations</a></p>
	</svelte:fragment>
</AppBar>

<style>
	a {
		margin-right: 1.5rem;
	}
</style>
