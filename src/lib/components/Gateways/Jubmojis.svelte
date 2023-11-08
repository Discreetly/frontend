<script lang="ts">
	import { jubmojiRequest } from '$lib/gateways/jubmojis';
	import type { JubmojiProofI } from '$lib/types';
	import Creation from 'svelte-material-icons/Creation.svelte';
	import MagicStaff from 'svelte-material-icons/MagicStaff.svelte';
	import Loading from '$lib/components/Utils/Loading.svelte';
	import { alertQueue, configStore, identityExists } from '$lib/stores';
	import { onMount } from 'svelte';

	let loading = false;
	let acceptedRoomNames: string[] = [];
	$: proof = $configStore.signUpStatus.jubmojiProof;

	function validateProof(proof: JubmojiProofI) {
		loading = true;
		jubmojiRequest(proof)
			.then((acceptedRoomNames) => {
				if (acceptedRoomNames) {
					acceptedRoomNames = acceptedRoomNames;
				}
			})
			.catch((err) => {
				console.error(err);
				alertQueue.enqueue(`Unexpected error: ${err.message}`, 'error');
			})
			.finally(() => {
				loading = false;
			});
	}

	onMount(() => {
		if ($configStore.signUpStatus.jubmojiProof && $identityExists == 'safe') {
			validateProof($configStore.signUpStatus.jubmojiProof);
		} else if ($configStore.signUpStatus.jubmojiProof && $identityExists == 'encrypted') {
			alertQueue.enqueue('Unlock your identity to claim your Jubmoji Powers', 'warning');
		}
	});
</script>

{#if proof}
	<h3 class="h4 mb-2">Proof Found!</h3>
	{#if !loading}
		<div
			class="btn variant-filled-success"
			on:click={() => proof && validateProof(proof)}
		>
			<Creation class="mr-2" />Prove Your Power<MagicStaff />
		</div>
	{:else}
		<div class="text-primary">Proving Powers...</div>
		<Loading />
	{/if}
{:else}
	<a
		class="btn variant-ghost-secondary"
		href="https://www.jubmoji.quest/powers"
		><Creation class="mr-2" />Harness Your Power<MagicStaff /></a
	>
{/if}
{#if acceptedRoomNames.length > 0}
	<p class="text-center mt-2">You've been added to:</p>
	<div class="my-2">
		{#each acceptedRoomNames as name}
			<ins class="ins border-y border-success-800">{name}</ins>
		{/each}
	</div>
{/if}
