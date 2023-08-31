<script lang="ts">
	import FullHeart from 'svelte-material-icons/Heart.svelte';
	import HeartHalfFullHalfEmpty from 'svelte-material-icons/HeartHalfFull.svelte';
	import HeartEmpty from 'svelte-material-icons/HeartOutline.svelte';
	import HeartHalfFull from 'svelte-material-icons/HeartHalf.svelte';
	import HeartHalfEmpty from 'svelte-material-icons/HeartHalfOutline.svelte';

	export let health: number;
	export let maxHealth: number;

	$: totalHearts = Math.ceil(maxHealth / 2);
	$: isLastHeartHalf = maxHealth % 2 === 1;
</script>

<div class="flex flex-row ms-2 place-items-center">
	{#each Array(totalHearts).fill(null) as _, i}
		{#if 2 * i < health && 2 * i + 1 < health}
			<FullHeart class="w-5 h-5 text-red-500" />
		{:else if 2 * i < health && 2 * i + 1 === health && i === totalHearts - 1 && isLastHeartHalf}
			<HeartHalfFull class="w-5 h-5 text-red-500" />
		{:else if 2 * i < health && 2 * i + 1 === health}
			<HeartHalfFullHalfEmpty class="w-5 h-5 text-red-500" />
		{:else if i === totalHearts - 1 && isLastHeartHalf}
			<HeartHalfEmpty class="w-5 h-5 text-red-500" />
		{:else}
			<HeartEmpty class="w-5 h-5 text-red-500" />
		{/if}
	{/each}
</div>
