<script lang="ts">
	import { goto } from '$app/navigation';
	import { identityStore } from '$lib/data/stores';
	import type { IdentityStoreI } from '$lib/types';
	import { onMount } from 'svelte';

	let isCheckboxChecked = false;
	let isButtonDisabled = true;

	function deleteIdentity() {
		console.warn('DELETING IDENTITY');
		$identityStore = { identity: null, rooms: {} } as IdentityStoreI;
	}

	onMount(() => {
		const checkbox = document.getElementById('checkbox') as HTMLInputElement;
		if (checkbox) {
			checkbox.addEventListener('change', () => {
				isCheckboxChecked = checkbox.checked;
				isButtonDisabled = !isCheckboxChecked;
			});
		}
	});
</script>

<div class="card variant-soft-error">
	<header class="card-header">
		<h3 class="h4">Delete Your Identity</h3>
	</header>
	<section class="px-4 pt-4">
		<input type="checkbox" id="checkbox" class="mx-2 p-1" />
		<span class="ms-2 text-error-500"
			>I promise I backed up my identity, or I really want to destroy it.</span
		>
	</section>
	<footer class="card-footer text-center">
		<button
			id="delete-identity"
			on:click={deleteIdentity}
			disabled={isButtonDisabled}
			class="btn btn-sm variant-ghost-error mt-8 text-sm font-bold text-warning-100"
			>Delete Identity</button
		>
	</footer>
</div>
