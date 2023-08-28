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
	background="bg-surface-50-900-token"
	padding="p-2 md:p-4"
	class="border-b border-surface-500/30"
>
	<svelte:fragment slot="lead">
		<h1 class="h4 text-primary-500">
			<a href="/"><img class="max-h-7" src="/logo-text.png" alt="discreetly" /></a>
		</h1>
	</svelte:fragment>
	<a href="/about" class="btn btn-sm variant-ringed-secondary hidden sm:inline me-2">About</a>
	{#if identityExists}
		<a href="/chat" class="hidden btn btn-sm variant-ringed-secondary sm:inline me-2">Chat</a>
		<a
			class="btn btn-sm variant-ringed-secondary font-medium text-sm inline sm:hidden me-2"
			on:click={drawerOpen}>{roomName}</a
		>
	{:else}
		<a class="btn btn-sm variant-ringed-secondary" href="/signup">Sign Up</a>
	{/if}
	<svelte:fragment slot="trail">
		<div class="hidden sm:inline me-2 text-primary-500">Alpha Version!</div>
		<a href="/about" class="btn-icon btn-icon-sm variant-soft-secondary sm:hidden me-2">?</a>
		{#if identityExists}
			<a href="/identity">⚙</a>
		{/if}
		<LightSwitch />
	</svelte:fragment>
</AppBar>
