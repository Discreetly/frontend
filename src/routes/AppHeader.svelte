<script lang="ts">
	import { AppBar, type DrawerSettings } from '@skeletonlabs/skeleton';
	import { currentSelectedRoom, identityExists } from '$lib/stores';
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	$: roomName = $currentSelectedRoom?.name ?? 'Select Room';

	const drawerStore = getDrawerStore();

	const settings: DrawerSettings = { id: 'roomselect' };

	function drawerOpen(): void {
		drawerStore.open(settings);
	}
</script>

<AppBar
	gridColumns="grid-cols-3"
	slotDefault="place-self-center"
	slotTrail="place-content-end"
	background="bg-surface-50-900-token"
	padding="p-2 md:p-4"
	class="border-b border-surface-500/30">
	<svelte:fragment slot="lead">
		<h1 class="h4 text-primary-500">
			{#if $identityExists}
				<a
					href="/chat"
					role="button"
					tabindex="0">
					<img
						class="max-h-7"
						src="/logo-text.png"
						alt="discreetly" />
				</a>
			{:else}
				<a
					href="/"
					role="button"
					tabindex="0">
					<img
						class="max-h-7"
						src="/logo-text.png"
						alt="discreetly" />
				</a>
			{/if}
		</h1>
	</svelte:fragment>

	{#if $identityExists}
		<a
			href="/chat"
			role="button"
			tabindex="0"
			class="hidden btn btn-sm variant-ringed-secondary md:inline">Chat</a>
		<!-- svelte-ignore a11y-missing-attribute -->
		<a
			class="btn btn-sm variant-ringed-secondary font-medium text-sm inline md:hidden"
			on:click={drawerOpen}
			on:keypress={() => {
				drawerOpen();
			}}
			role="button"
			tabindex="0">
			{roomName}
		</a>
	{:else}
		<a
			class="btn btn-sm variant-ringed-secondary"
			href="/signup"
			role="button"
			tabindex="0">
			Sign Up
		</a>
	{/if}
	<svelte:fragment slot="trail">
		<div class="hidden sm:inline text-primary-500">Alpha V2!</div>
	</svelte:fragment>
</AppBar>
