<script lang="ts">
	import ActionPoints from '$lib/components/AP.svelte';
	import Hearts from '$lib/components/Hearts.svelte';
	import { configStore } from '$lib/stores';
	import { ActionRepresentationE } from '$lib/types';

	$: ap = $configStore.actionRepresentation;
	$: if ($configStore.actionRepresentation == undefined) {
		$configStore.actionRepresentation = ActionRepresentationE.AP;
	}
</script>

<div class="card variant-soft-secondary">
	<header class="card-header">
		<h4 class="h4">Action Representation</h4>
	</header>
	<section class="p-2 mb-2 sm:p-4 sm:mb-4">
		<div class="flex flex-col">
			<div class="mb-2 sm:mb-4">
				{#if $configStore.actionRepresentation == ActionRepresentationE.AP}
					<ActionPoints health={4} maxHealth={5} />
				{:else if $configStore.actionRepresentation == ActionRepresentationE.Hearts}
					<Hearts health={4} maxHealth={5} />
				{/if}
			</div>
			<select
				id="action-representation"
				class="select"
				bind:value={$configStore.actionRepresentation}
			>
				<option value={ActionRepresentationE.AP}>Action Points</option>
				<option value={ActionRepresentationE.Hearts}>Hearts</option>
			</select>
		</div>
	</section>
</div>
