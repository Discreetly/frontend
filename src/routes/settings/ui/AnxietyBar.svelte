<script lang="ts">
	import { configStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import AP from '$lib/components/ActionPoints/AP.svelte';
	import Clock from '$lib/components/Utils/Clock.svelte';
	import Person from 'svelte-material-icons/Account.svelte';
	import FullCircle from 'svelte-material-icons/Circle.svelte';
	import { ProgressBar } from '@skeletonlabs/skeleton';

	let timeToNextEpoch = 0;
	let epochLengthSeconds = 20;

	onMount(() => {
		setInterval(() => {
			timeToNextEpoch += 0.1;
			if (timeToNextEpoch >= epochLengthSeconds) {
				timeToNextEpoch = 0;
			}
		}, 100);
	});
</script>

<div class="card variant-soft-secondary">
	<header class="card-header">
		<h3 class="h4">Anxiety Bar</h3>
	</header>
	<section class="p-2 mb-2 sm:p-4 sm:mb-4">
		<div class="flex flex-col border-b mb-3 pb-2">
			<p class="mb-5">
				This shows a progress bar in the chat room that represents how much time has ellapsed in an
				epoch. This was hidden because it gives some users anxiety, but we wanted to leave it as an
				option for those that think its fun.
			</p>
			<select
				id="anxiety-bar"
				class="select py-4"
				size="2"
				bind:value={$configStore.anxietyBar}
			>
				<option value={true}>Anxiety On</option>
				<option value={false}>Anxiety Off (Default)</option>
			</select>
		</div>
		<h6 class="h6 text-center mb-2">Demo</h6>
		<header
			class="flex flex-col text-xs my-5 md:text-base border border-surface-800/30 px-2 py-1 md:px-5 md:py-3 bg-surface-800"
		>
			<div class="flex flex-row justify-between place-items-center mb-2">
				<div class="flex flex-row">
					<span class="place-self-center mr-2">
						<FullCircle class="w-4 h-4 text-green-500" />
					</span>
					<h2
						class="h5 text-secondary-800-100-token"
						title="Example Room"
					>
						Example Room
					</h2>
					<div class="hidden sm:block ms-2 text-xs font-mono self-center">
						[{timeToNextEpoch.toFixed(1)}/{epochLengthSeconds}s]
					</div>
				</div>
				<div class="flex flex-row">
					<span
						class="flex flex-row align-middle text-sm font-mono text-secondary-300-600-token"
						title="Online Users"
					>
						<Person />
						37
					</span>
				</div>
				<div
					class="flex flex-row place-content-center"
					title={`These are action points, you get 4 messages every 20 seconds`}
				>
					<AP
						health={4}
						maxHealth={6}
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
	</section>
</div>
