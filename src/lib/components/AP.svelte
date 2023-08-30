<script lang="ts">
	import FullCircle from 'svelte-material-icons/Circle.svelte';
	import CircleEmpty from 'svelte-material-icons/CircleOutline.svelte';

	export let health: number;
	export let maxHealth: number;
	export let reverse: boolean = false;

	$: fullcircles = health;
	$: emptycircles = maxHealth - health;
</script>

<div class="flex flex-row ms-2 place-items-center">
	{#if reverse}
		{#each { length: emptycircles } as _, i}
			<CircleEmpty class="w-4 h-4 text-surface-600-300-token" />
		{/each}
		{#each { length: fullcircles } as _, i}
			<FullCircle class="w-4 h-4 text-green-500" />
		{/each}
	{:else}
		{#each { length: fullcircles } as _, i}
			<FullCircle class="w-4 h-4 text-green-500" />
		{/each}
		{#each { length: emptycircles } as _, i}
			<CircleEmpty class="w-4 h-4 text-surface-600-300-token" />
		{/each}
	{/if}
</div>
