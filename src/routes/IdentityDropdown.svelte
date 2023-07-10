<script lang="ts">
	import { goto } from '$app/navigation';
	import { identityStore } from '$lib/stores';
	import type { IdentityStoreI } from '$lib/types';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';

	let identityExists = false;
	$: if ($identityStore.identity == undefined) {
		identityExists = false;
		console.debug('identity does not exist');
	} else {
		identityExists = true;
		console.debug('identity exists');
	}

	export let hide = false;

	const modal: ModalSettings = {
		type: 'confirm',
		// Data
		title: 'Please Confirm',
		body: 'Are you sure you wish to delete your identity? This is permanent',
		// TRUE if confirm pressed, FALSE if cancel pressed
		response: (r: boolean) => {
			if (r) {
				deleteIdentity();
			}
		}
	};

	function deleteIdentity() {
		console.log('deleting identity');
		$identityStore = { identity: null, rooms: {} } as IdentityStoreI;
		goto('/');
	}
</script>

{#if identityExists}
	<li>
		<a href="#" role="button" aria-expanded="false"> Identity </a>
		<ul>
			<li>
				<a href="/identity">Manage Identity</a>
			</li>
			<li>
				<button on:click={() => modalStore.trigger(modal)}>Delete Identity</button>
			</li>
		</ul>
	</li>
{:else}
	<li>
		<a href="/signup">Signup</a>
	</li>
{/if}
