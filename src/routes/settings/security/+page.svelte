<script lang="ts">
	import SetPassword from '$lib/components/Security/SetPasswordContainer.svelte';

	import Container from '$lib/components/Utils/Container.svelte';
	import { passwordSet } from '$lib/stores';
</script>

{#if !$passwordSet}
	<SetPassword />
{:else}
	<Container heading="Password set" />
{/if}
