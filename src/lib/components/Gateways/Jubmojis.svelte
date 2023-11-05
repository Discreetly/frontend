<script lang="ts">
	import { jubmojiRequest } from '$lib/gateways/jubmojis';
	import type { JubmojiProofI } from '$lib/types';
	import Creation from 'svelte-material-icons/Creation.svelte';
	import MagicStaff from 'svelte-material-icons/MagicStaff.svelte';
	import Loading from '$lib/components/Utils/Loading.svelte';
	import { alertQueue, configStore } from '$lib/stores';
	import { onMount } from 'svelte';

	let loading = false;

	function validateProof(proof: JubmojiProofI) {
		loading = true;
		jubmojiRequest(proof)
			.then((acceptedRoomNames) => {
				if (acceptedRoomNames) {
					acceptedRoomNames = acceptedRoomNames;
				}
			})
			.catch((err) => {
				console.log(err);
				alertQueue.enqueue(`Unexpected error: ${err.message}`, 'error');
			})
			.finally(() => {
				loading = false;
			});
	}

	onMount(() => {
		if ($configStore.signUpStatus.jubmojiProof) {
			validateProof($configStore.signUpStatus.jubmojiProof);
		}
	});
</script>

{#if $configStore.signUpStatus.jubmojiProof}
	<h3 class="h4">Proof Found!</h3>
	{#if !loading}
		<div class="btn variant-ghost-secondary" on:click={() => validateProof(proof)}>
			<Creation class="mr-2" />Prove Your Power<MagicStaff />
		</div>
	{:else}
		<div class="text-primary">Proving Powers...</div>
		<Loading />
	{/if}
{:else}
	<a class="btn variant-ghost-secondary" href="https://www.jubmoji.quest/powers"
		><Creation class="mr-2" />Harness Your Power<MagicStaff /></a
	>
{/if}
