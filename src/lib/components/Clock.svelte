<script lang="ts">
	import Clock0 from 'svelte-material-icons/ClockTimeTwelve.svelte';
	import Clock1 from 'svelte-material-icons/ClockTimeOne.svelte';
	import Clock2 from 'svelte-material-icons/ClockTimeTwo.svelte';
	import Clock3 from 'svelte-material-icons/ClockTimeThree.svelte';
	import Clock4 from 'svelte-material-icons/ClockTimeFour.svelte';
	import Clock5 from 'svelte-material-icons/ClockTimeFive.svelte';
	import Clock6 from 'svelte-material-icons/ClockTimeSix.svelte';
	import Clock7 from 'svelte-material-icons/ClockTimeSeven.svelte';
	import Clock8 from 'svelte-material-icons/ClockTimeEight.svelte';
	import Clock9 from 'svelte-material-icons/ClockTimeNine.svelte';
	import Clock10 from 'svelte-material-icons/ClockTimeTen.svelte';
	import Clock11 from 'svelte-material-icons/ClockTimeEleven.svelte';
	export let time: number;
	export let maxTime: number;

	$: clockTime = (time / maxTime) * 100;
</script>

<div class="flex flex-row ms-2 place-items-center place-content-center">
	{#if clockTime < 8.333}
		<Clock0 class="w-5 h-5 text-surface-700-200-token" />
	{:else if clockTime < 16.666}
		<Clock1 class="w-5 h-5 text-surface-700-200-token" />
	{:else if clockTime < 25}
		<Clock2 class="w-5 h-5 text-surface-700-200-token" />
	{:else if clockTime < 33.333}
		<Clock3 class="w-5 h-5 text-surface-700-200-token" />
	{:else if clockTime < 41.666}
		<Clock4 class="w-5 h-5 text-surface-700-200-token" />
	{:else if clockTime < 50}
		<Clock5 class="w-5 h-5 text-surface-700-200-token" />
	{:else if clockTime < 58.333}
		<Clock6 class="w-5 h-5 text-surface-700-200-token" />
	{:else if clockTime < 66.666}
		<Clock7 class="w-5 h-5 text-surface-700-200-token" />
	{:else if clockTime < 75}
		<Clock8 class="w-5 h-5 text-surface-700-200-token" />
	{:else if clockTime < 83.333}
		<Clock9 class="w-5 h-5 text-surface-700-200-token" />
	{:else if clockTime < 91.666}
		<Clock10 class="w-5 h-5 text-surface-700-200-token" />
	{:else if clockTime < 100}
		<Clock11 class="w-5 h-5 text-surface-700-200-token" />
	{:else}
		<Clock0 class="w-5 h-5 text-surface-700-200-token" />
	{/if}
</div>
