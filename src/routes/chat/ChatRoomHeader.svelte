<script lang="ts">
	import AP from '$lib/components/ActionPoints/AP.svelte';
	import Clock from '$lib/components/Utils/Clock.svelte';
	import { currentSelectedRoom, configStore, rateLimitStore, messagesSent } from '$lib/stores';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import FullCircle from 'svelte-material-icons/Circle.svelte';
	import Person from 'svelte-material-icons/Account.svelte';
	import ExperienceMenu from './ExperienceMenu.svelte';

	export let connected: boolean;
	export let currentEpoch: number;
	export let timeLeftInEpoch: string;
	export let userMessageLimit: number;
	export let roomRateLimit: number;
	export let onlineMembers: string;

	$: roomId = $currentSelectedRoom?.roomId!.toString();
	$: encrypted = $currentSelectedRoom?.encrypted == 'AES' ?? false;
	$: ephemeral = $currentSelectedRoom?.ephemeral == 'EPHEMERAL' ?? false;
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
					<FullCircle
						class="w-4 h-4 text-green-500"
						title="Connected to Server"
					/>
				{:else}
					<FullCircle
						class="w-4 h-4 text-error-500"
						title="Not Connected to Server"
					/>
				{/if}
			</span>
			<h2
				class="h5 text-secondary-800-100-token"
				title={roomId}
			>
				{#if encrypted}
					<span title="Room is encrypted">🔒</span>
				{/if}
				{#if ephemeral}
					<span title="Room is ephemeral">⏳</span>
				{/if}
				{roomName}
			</h2>
			{#if $configStore.beta}
				<div class="hidden sm:block ms-2 text-xs font-mono self-center">
					[{timeToNextEpoch.toFixed(0)}/{epochLengthSeconds}s]
				</div>
			{/if}
		</div>
		<div class="flex flex-row">
			{#if connected && onlineMembers !== '?'}
				<span
					class:connected
					class="flex flex-row align-middle text-sm font-mono text-secondary-300-600-token"
					title="Online Users"
				>
					<Person />
					{onlineMembers}
				</span>
			{/if}
		</div>
		<div
			class="flex flex-row place-content-center"
			title={`These are action points, you get ${userMessageLimit} every ${epochLengthSeconds} seconds. [${timeToNextEpoch.toFixed(
				0
			)}/${epochLengthSeconds}s]`}
		>
			{#if $configStore.beta === true}<ExperienceMenu />{/if}
			<AP
				health={userMessageLimit - $messagesSent}
				maxHealth={userMessageLimit}
			/>
			{#if $configStore.anxietyBar === false}
				<Clock
					time={timeToNextEpoch}
					maxTime={epochLengthSeconds}
				/>
			{/if}
		</div>
	</div>
	{#if $configStore.anxietyBar === true}
		<ProgressBar
			value={timeToNextEpoch}
			max={epochLengthSeconds}
		/>
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
