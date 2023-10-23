<script lang="ts">
	import AP from '$lib/components/ActionPoints/AP.svelte';
	import Clock from '$lib/components/Utils/Clock.svelte';
	import { currentSelectedRoom, configStore } from '$lib/stores';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import FullCircle from 'svelte-material-icons/Circle.svelte';
	import ExperienceMenu from './ExperienceMenu.svelte';
	export let connected: boolean;
	export let currentEpoch: number;
	export let timeLeftInEpoch: string;
	export let userMessageLimit: number;
	export let roomRateLimit: number;
	export let messagesLeft: () => number;
	export let messageId: number;
	$: roomId = $currentSelectedRoom?.roomId!.toString();
	$: roomName = $currentSelectedRoom?.name ?? 'Select Room';
	$: epochLengthSeconds = roomRateLimit / 1000;
	$: timeToNextEpoch = epochLengthSeconds - +timeLeftInEpoch;
</script>

<header
	class="flex flex-col text-xs md:text-base border-b border-surface-500/30 px-2 py-1 md:px-5 md:py-3"
>
	<div class="flex flex-row justify-between place-items-center mb-2">
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
			<div class="hidden sm:block ms-2 text-xs font-mono self-center">
				[{timeToNextEpoch.toFixed(1)}/{epochLengthSeconds}s]
			</div>
		</div>
		<div
			class="flex flex-row place-content-center"
			title={`These are action points, you get ${userMessageLimit} every ${epochLengthSeconds} seconds`}
		>
			{#if $configStore.beta}<ExperienceMenu />{/if}
			<AP health={messagesLeft()} maxHealth={userMessageLimit} />
			<div class="block sm:hidden">
				<Clock time={timeToNextEpoch} maxTime={epochLengthSeconds} />
			</div>
		</div>
	</div>
	<div class="hidden sm:block">
		<ProgressBar value={timeToNextEpoch} max={epochLengthSeconds} />
	</div>
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
