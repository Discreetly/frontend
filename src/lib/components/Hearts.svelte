<script lang="ts">
	import FullHeart from 'svelte-material-icons/Heart.svelte';
	import HeartHalfFullHalfEmpty from 'svelte-material-icons/HeartHalfFull.svelte';
	import HeartEmpty from 'svelte-material-icons/HeartOutline.svelte';
	import HeartHalfFull from 'svelte-material-icons/HeartHalf.svelte';
	import HeartHalfEmpty from 'svelte-material-icons/HeartHalfOutline.svelte';

	export let health: number;
	export let maxHealth: number;
	export let reverse: boolean = false;

	$: fullhearts = Math.floor(health / 2);
	$: halffullhearts = health % 2;
	$: maxHealthMod2 = maxHealth % 2;
	$: emptyhalfhearts = (maxHealth - health) % 2;
	$: emptyfullhearts = Math.floor((maxHealth - health) / 2);
</script>

<div class="flex flex-row ms-2 place-items-center">
	{#if reverse}
		{#if maxHealthMod2 === 1}
			{#each { length: halffullhearts } as _, i}
				<HeartHalfFull class="w-5 h-5 text-red-500 mirror" />
			{/each}
			{#each { length: emptyhalfhearts } as _, i}
				<HeartHalfEmpty class="w-5 h-5 text-red-500 mirror" />
			{/each}
		{:else}
			{#each { length: halffullhearts } as _, i}
				<HeartHalfFullHalfEmpty class="w-5 h-5 text-red-500 mirror" />
			{/each}
			{#each { length: emptyfullhearts } as _, i}
				<HeartEmpty class="w-5 h-5 text-red-500 mirror" />
			{/each}
		{/if}
		{#each { length: fullhearts } as _, i}
			<FullHeart class="w-5 h-5 text-red-500 mirror" />
		{/each}
	{:else}
		{#each { length: fullhearts } as _, i}
			<FullHeart class="w-5 h-5 text-red-500" />
		{/each}
		{#if maxHealthMod2 === 1}
			{#each { length: halffullhearts } as _, i}
				<HeartHalfFull class="w-5 h-5 text-red-500" />
			{/each}
			{#each { length: emptyhalfhearts } as _, i}
				<HeartHalfEmpty class="w-5 h-5 text-red-500" />
			{/each}
		{:else}
			{#each { length: halffullhearts } as _, i}
				<HeartHalfFullHalfEmpty class="w-5 h-5 text-red-500" />
			{/each}
			{#each { length: emptyfullhearts } as _, i}
				<HeartEmpty class="w-5 h-5 text-red-500" />
			{/each}
		{/if}
	{/if}
</div>
