<script lang="ts">
	import Card from '$lib/card.svelte';
	import Button from '$lib/button.svelte';
	import { Identity } from '@semaphore-protocol/identity';
	import { identityStore } from '$lib/stores';

	let identityExists = false;
	$: if ($identityStore.identity == undefined) {
		identityExists = false;
		console.debug('identity does not exist');
	} else {
		identityExists = true;
		console.debug('identity exists');
	}

	function createIdentity(regenerate = false) {
		console.log('Creating identity');
		if (!identityExists || regenerate) {
			$identityStore.identity = new Identity();
			return 'created';
		} else {
			console.log('Identity already exists');
			return 'exists';
		}
	}
</script>

<Card title="Your Identity">
	<p>Discreetly is a bit different than other applications</p>
	{#if !identityExists}
		<div
			on:click={() => createIdentity()}
			class="btn btn-lg px-4 d-inline-flex align-items-center btn-primary"
			type="button"
		>
			Generate Identity
		</div>
	{:else}
		<div class="d-flex justify-content-between gap-2">
			<div on:click={() => createIdentity(true)} class="btn btn-secondary" type="button">
				Re-Generate Identity
			</div>
			<a href="/signup/gates" class="btn btn-primary" type="button"> Next Step </a>
		</div>
	{/if}
</Card>
