<script lang="ts">
	import Hearts from '$lib/components/ActionPoints/Hearts.svelte';
	import AP from '$lib/components/ActionPoints/ActionPoints.svelte';
	import { ActionRepresentationE } from '$lib/types';
	import Shields from '$lib/components/ActionPoints/Shields.svelte';
	import { configStore } from '$lib/stores';
	import Battery from './ActionPoints/Battery.svelte';
	export let health: number;
	export let maxHealth: number;
</script>

{#if $configStore.actionRepresentation == ActionRepresentationE.AP}
	<AP {health} {maxHealth} />
{:else if $configStore.actionRepresentation == ActionRepresentationE.Hearts}
	<Hearts {health} {maxHealth} />
{:else if $configStore.actionRepresentation == ActionRepresentationE.Shields}
	<Shields {health} {maxHealth} />
{:else if $configStore.actionRepresentation == ActionRepresentationE.Battery}
	<Battery {health} {maxHealth} />
{:else}
	<AP {health} {maxHealth} />
{/if}
