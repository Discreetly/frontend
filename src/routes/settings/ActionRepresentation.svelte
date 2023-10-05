<script lang="ts">
	import AP from '$lib/components/AP.svelte';
	import { configStore } from '$lib/stores';
	import { ActionRepresentationE } from '$lib/types';
	$: if ($configStore.actionRepresentation == undefined) {
		$configStore.actionRepresentation = ActionRepresentationE.AP;
	}

	let health = 4;
	let maxHealth = 5;
</script>

<div class="card variant-soft-secondary">
	<header class="card-header">
		<h4 class="h4">Action Representation</h4>
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

			<div class="border-t mt-2 pt-2 mb-2 sm:mb-4 flex flex-col place-items-center">
				<h6 class="h6">Demo</h6>
				<AP {health} {maxHealth} />
				<label
					><div>Health: {health}</div>
					<input type="range" min="0" max={maxHealth} bind:value={health} />
				</label>
				<label
					><div>Max Health: {maxHealth}</div>
					<input type="range" min="1" max={10} bind:value={maxHealth} />
				</label>
			</div>
		</div>
	</section>
</div>
