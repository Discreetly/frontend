<script lang="ts">
	import { Ratings } from '@skeletonlabs/skeleton';
	import FullCircle from 'svelte-material-icons/Circle.svelte';
	import CircleEmpty from 'svelte-material-icons/CircleOutline.svelte';

	export let health: number;
	export let maxHealth: number;

	$: fullcircles = health;
	$: emptycircles = maxHealth - health;
</script>

<Ratings
	value={health}
	max={maxHealth}
	spacing="space-x-0"
>
	<svelte:fragment slot="empty">
		<CircleEmpty class="w-4 h-4 text-surface-600-300-token" />
	</svelte:fragment>
	<svelte:fragment slot="full">
		<FullCircle class="w-4 h-4 text-green-500" />
	</svelte:fragment>
</Ratings>
