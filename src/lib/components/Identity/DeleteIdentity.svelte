<script lang="ts">
	import { configDefaults } from '$lib/defaults';
	import {
		configStore,
		identityStore,
		identityKeyStore,
		messageStore,
		roomsStore,
		selectedRoom,
		saltStore
	} from '$lib/stores';
	import type { IdentityStoreI } from '$lib/types';
	import { onMount } from 'svelte';

	let isCheckboxChecked = false;
	let isButtonDisabled = true;

	function deleteIdentity() {
		console.warn('DELETING IDENTITY');
		$identityStore = {} as IdentityStoreI;
		$identityKeyStore = {} as IdentityStoreI;
		$saltStore = '';
		$configStore = configDefaults;
		$roomsStore = {};
		$selectedRoom = {};
		$messageStore = {};
	}

	onMount(() => {
		const checkbox = document.getElementById('checkbox') as HTMLInputElement;
		if (checkbox) {
			checkbox.addEventListener('change', () => {
				isCheckboxChecked = checkbox.checked;
				isButtonDisabled = !isCheckboxChecked;
			});
			checkbox.addEventListener('keydown', (e: KeyboardEvent) => {
				if (e.key === 'Escape') {
					checkbox.checked = false;
				}
			});
		}
	});
</script>

<div class="card variant-ghost-error">
	<header class="card-header">
		<h3 class="h4">Delete Your Identity & Reset Application</h3>
	</header>
	<section class="px-4 pt-4">
		<input
			type="checkbox"
			id="checkbox"
			class="mx-2 p-1"
		/>
		<span class="ms-2"
			>I promise I backed up my identity, or I really want to destroy it forever.</span
		>
	</section>
	<footer class="card-footer text-center">
		{#if !isButtonDisabled}
			<button
				id="delete-identity"
				on:click={deleteIdentity}
				disabled={isButtonDisabled}
				class="btn btn-sm variant-ghost-error mt-8 text-sm font-bold">Delete Identity</button
			>
		{/if}
	</footer>
</div>
