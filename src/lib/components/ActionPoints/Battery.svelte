<script lang="ts">
	import Battery0 from 'svelte-material-icons/BatteryOutline.svelte';
	import Battery10 from 'svelte-material-icons/Battery10.svelte';
	import Battery20 from 'svelte-material-icons/Battery20.svelte';
	import Battery30 from 'svelte-material-icons/Battery30.svelte';
	import Battery40 from 'svelte-material-icons/Battery40.svelte';
	import Battery50 from 'svelte-material-icons/Battery50.svelte';
	import Battery60 from 'svelte-material-icons/Battery60.svelte';
	import Battery70 from 'svelte-material-icons/Battery70.svelte';
	import Battery80 from 'svelte-material-icons/Battery80.svelte';
	import Battery90 from 'svelte-material-icons/Battery90.svelte';
	import Battery100 from 'svelte-material-icons/Battery.svelte';

	export let health: number;
	export let maxHealth: number;

	$: battery = (health / maxHealth) * 100;
</script>

<div class="flex flex-row ms-2 place-items-center">
	{#if battery === 0}
		<Battery0 class="w-5 h-5 text-yellow-500" />
	{:else if battery <= 10}
		<Battery10 class="w-5 h-5 text-yellow-500" />
	{:else if battery <= 20}
		<Battery20 class="w-5 h-5 text-yellow-500" />
	{:else if battery <= 30}
		<Battery30 class="w-5 h-5 text-yellow-500" />
	{:else if battery <= 40}
		<Battery40 class="w-5 h-5 text-yellow-500" />
	{:else if battery <= 50}
		<Battery50 class="w-5 h-5 text-yellow-500" />
	{:else if battery <= 60}
		<Battery60 class="w-5 h-5 text-yellow-500" />
	{:else if battery <= 70}
		<Battery70 class="w-5 h-5 text-yellow-500" />
	{:else if battery <= 80}
		<Battery80 class="w-5 h-5 text-yellow-500" />
	{:else if battery <= 90}
		<Battery90 class="w-5 h-5 text-yellow-500" />
	{:else if battery <= 100}
		<Battery100 class="w-5 h-5 text-yellow-500" />
	{:else}
		<Battery100 class="w-5 h-5 text-yellow-500" />
	{/if}
</div>
