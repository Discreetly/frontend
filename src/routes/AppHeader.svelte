<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { currentSelectedRoom, identityStore } from '$lib/stores';
	import { drawerStore } from '@skeletonlabs/skeleton';
	$: identityExists = !!$identityStore._commitment;
	$: roomName = $currentSelectedRoom?.name ?? 'Select Room';

	// Open the drawer:
	function drawerOpen(): void {
		drawerStore.open();
	}
</script>

<AppBar
	gridColumns="grid-cols-3"
	slotDefault="place-self-center"
	slotTrail="place-content-end"
	background="bg-surface-50-800-token"
	padding="p-2 md:p-4"
>
	<svelte:fragment slot="lead">
		<h1 class="h4 text-secondary-500">
			<a href="/"><img class="max-h-7" src="/logo-text.png" alt="discreetly" /></a>
		</h1>
	</svelte:fragment>
	<a href="/about" class="hidden sm:inline me-2">About</a>
	{#if identityExists}
		<a href="/chat" class="hidden sm:inline me-2">Chat</a>
		<a class="btn inline sm:hidden me-2" on:click={drawerOpen}>{roomName}</a>
	{:else}
		<a href="/signup">Sign Up</a>
	{/if}
	<svelte:fragment slot="trail">
		<div class="hidden sm:inline me-2 text-secondary-500">Alpha Version!</div>
		{#if identityExists}
			<a href="/identity">⚙️</a>
		{/if}
		<LightSwitch />
	</svelte:fragment>
</AppBar>
