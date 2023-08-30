<script lang="ts">
	import Hearts from '$lib/components/Hearts.svelte';
	import AP from '$lib/components/AP.svelte';
	import FullCircle from 'svelte-material-icons/Circle.svelte';
	import { configStore, currentSelectedRoom } from '$lib/stores';
	import { onMount } from 'svelte';
	import { ActionRepresentationE } from '$lib/types';
	export let connected: boolean;
	export let currentEpoch: number;
	export let timeLeftInEpoch: string;
	export let userMessageLimit: number;
	export let roomRateLimit: number;
	export let messagesLeft: () => number;
	export let messageId: number;
	$: roomId = $currentSelectedRoom?.roomId!.toString();
	$: roomName = $currentSelectedRoom?.name ?? 'Select Room';
</script>

<header
	class="hidden border-b border-surface-500/30 px-2 py-1 md:px-5 md:py-3 sm:flex flex-row justify-between place-items-center text-xs md:text-base"
>
	<div class="flex flex-row">
		<span class="place-self-center mr-2">
			{#if connected}
				<FullCircle class="w-4 h-4 text-green-500" />
			{:else}
				<FullCircle class="w-4 h-4 text-error-500" />
			{/if}
		</span>
		<h2 class="h5 text-secondary-800-100-token" title={roomId}>
			{roomName}
		</h2>
	</div>

	{#if $configStore.actionRepresentation == ActionRepresentationE.AP}
		<AP health={messagesLeft()} maxHealth={userMessageLimit} reverse={true} />
	{:else if $configStore.actionRepresentation == ActionRepresentationE.Hearts}
		<Hearts health={messagesLeft()} maxHealth={userMessageLimit} />
	{:else}
		<AP health={messagesLeft()} maxHealth={userMessageLimit} reverse={true} />
	{/if}
</header>

<style>
	#connection::before {
		vertical-align: 0.125rem;
		margin-right: 0.5em;
		font-size: 0.75em;
		content: '⬤';
		color: rgb(var(--color-error-500));
	}
	#connection.connected::before {
		color: rgb(var(--color-success-500));
	}
</style>
