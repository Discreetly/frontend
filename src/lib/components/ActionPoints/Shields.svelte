<script lang="ts">
	import FullShield from 'svelte-material-icons/Shield.svelte';
	import ShieldHalfFullHalfEmpty from 'svelte-material-icons/ShieldHalfFull.svelte';
	import ShieldEmpty from 'svelte-material-icons/ShieldOutline.svelte';

	export let health: number;
	export let maxHealth: number;

	$: totalShields = Math.ceil(maxHealth / 2);
	$: isLastShieldHalf = maxHealth % 2 === 1;
</script>

<div class="flex flex-row ms-2 place-items-center">
	{#each Array(totalShields).fill(null) as _, i}
		{#if 2 * i < health && 2 * i + 1 < health}
			<FullShield class="w-5 h-5 text-red-500" />
		{:else if 2 * i < health && 2 * i + 1 === health && i === totalShields - 1 && isLastShieldHalf}
			<ShieldHalfFullHalfEmpty class="w-5 h-5 text-red-500" />
		{:else if 2 * i < health && 2 * i + 1 === health}
			<ShieldHalfFullHalfEmpty class="w-5 h-5 text-red-500" />
		{:else if i === totalShields - 1 && isLastShieldHalf}
			<ShieldEmpty class="w-5 h-5 text-red-500" />
		{:else}
			<ShieldEmpty class="w-5 h-5 text-red-500" />
		{/if}
	{/each}
</div>
