<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { configStore, currentSelectedRoom, identityStore, keyStore } from '$lib/stores';
	import { getDrawerStore } from '@skeletonlabs/skeleton';
	import Settings from 'svelte-material-icons/TuneVariant.svelte';
	import Information from 'svelte-material-icons/Information.svelte';
	import Console from 'svelte-material-icons/Console.svelte';
	import PasswordLock from '$lib/components/Padlock.svelte';
	import Chat from 'svelte-material-icons/Chat.svelte';
	$: identityExists = !!$identityStore._commitment;
	$: roomName = $currentSelectedRoom?.name ?? 'Select Room';

	const drawerStore = getDrawerStore();
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
			{#if identityExists}
				<a href="/chat"><img class="max-h-7" src="/logo-text.png" alt="discreetly" /></a>
			{:else}
				<a href="/"><img class="max-h-7" src="/logo-text.png" alt="discreetly" /></a>
			{/if}
		</h1>
	</svelte:fragment>

	<a href="/about" class="btn btn-sm variant-ringed-secondary hidden sm:inline">About</a>
	{#if identityExists}
		<a href="/chat" class="hidden btn btn-sm variant-ringed-secondary sm:inline">Chat</a>
		<a
			class="btn btn-sm variant-ringed-secondary font-medium text-sm inline sm:hidden"
			on:click={drawerOpen}>{roomName}</a
		>
	{:else}
		<a class="btn btn-sm variant-ringed-secondary" href="/signup">Sign Up</a>
	{/if}
	<a
		class="btn btn-sm variant-ringed-secondary font-medium text-sm hidden sm:inline"
		href="/console">Console</a
	>
	<svelte:fragment slot="trail">
		<a href="/about" class="hidden sm:inline"><Information size="1.2em" /></a>
		{#if identityExists && $page.url.pathname !== '/chat'}
			<a href="/chat" class="inline"><Chat size="1.2em" /></a>
		{/if}
		{#if $page.url.pathname !== '/console'}
			<a href="/console" class="inline"><Console size="1.2em" /></a>
		{/if}

		<PasswordLock cls="hidden sm:inline" />
		{#if identityExists}
			<a href="/settings"><Settings size="1.2em" /></a>
		{/if}
		<div class="hidden sm:inline">
			<LightSwitch />
		</div>
	</svelte:fragment>
</AppBar>
