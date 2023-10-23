<script lang="ts">
	import AP from '$lib/components/ActionPoints/AP.svelte';
	import { configStore } from '$lib/stores';
	import { ActionRepresentationE } from '$lib/types';
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { max } from 'date-fns';
	$: if ($configStore.actionRepresentation == undefined) {
		$configStore.actionRepresentation = ActionRepresentationE.AP;
	}

	let health = 4;
	let maxHealth = 5;
</script>

<div class="card variant-soft-secondary">
	<header class="card-header">
		<h3 class="h4">Action Representation</h3>
	</header>
	<section class="p-2 mb-2 sm:p-4 sm:mb-4">
		<div class="flex flex-col">
			<select
				id="action-representation"
				class="select py-2"
				size="5"
				bind:value={$configStore.actionRepresentation}
			>
				<option value={ActionRepresentationE.AP}>Action Points</option>
				<option value={ActionRepresentationE.Hearts}>Hearts</option>
				<option value={ActionRepresentationE.Shields}>Shields</option>
				<option value={ActionRepresentationE.Battery}>Battery</option>
			</select>

			<div class="border-t mt-3 pt-2 mb-2 sm:mb-4 flex flex-col place-items-center">
				<div class="my-2">
					<h6 class="h6 text-center mb-2">Demo</h6>
					<AP {health} {maxHealth} />
				</div>
				<RangeSlider name="range-slider" bind:value={health} max={maxHealth} step={1} ticked>
					<div class="flex justify-between items-center">
						<div class="font-bold">Health</div>
						<div class="text-xs">{health} / {maxHealth}</div>
					</div>
				</RangeSlider>
				<RangeSlider name="range-slider" bind:value={maxHealth} max={10} step={1} ticked>
					<div class="flex justify-between items-center">
						<div class="font-bold">Max Health</div>
						<div class="text-xs">{maxHealth} / {10}</div>
					</div>
				</RangeSlider>
			</div>
		</div>
	</section>
</div>
