<script lang="ts">
	import { identityStore, signUpStatusStore } from '$lib/stores';
	import Loading from '$lib/components/loading.svelte';
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import { Identity } from '@semaphore-protocol/identity';
	import { goto } from '$app/navigation';
	import RestoreIdentity from '../identity/RestoreIdentity.svelte';
	import Join from './Join.svelte';

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

<div class="h-100">
	<Stepper
		class="max-w-3xl mx-auto mt-16"
		on:complete={() => {
			goto('/chat');
		}}
	>
		<Step>
			<svelte:fragment slot="header"
				><div class="h3 text-center">About Discreetly</div></svelte:fragment
			>
			<h5 class="text-center h4 my-7">This app is a little different from what you're used to.</h5>
			<div class="grid place-content-center text-justify text-lg mb-10">
				<p class="text-xl mb-3 italic underline underline-offset-8">
					So please actually read the following:
				</p>
				<p>
					<b class="text-secondary-500">Discreetly</b> is an <b>anonymous</b> chat app
				</p>
				<p>Yes, you are <span class="text-success-500"><i>actually</i> anonymous</span></p>
				<p>
					But you can still get <b class="text-secondary-500">banned</b> if you
					<b class="text-secondary-500">spam</b>, or if you get
					<b class="text-secondary-500">voted out</b>.
				</p>
				<p>
					There is
					<b class="text-secondary-500">no unban</b>
				</p>
				<p>
					<b>Backup your identity</b>, there is
					<i class="text-secondary-500">no account recovery</i> (yet)
				</p>
				<p class="mt-2 mb-4">
					If you want to understand how this works:
					<a href="/about" class="btn btn-sm variant-soft-tertiary ms-2 mt-2">Read More Here</a>
				</p>
			</div>
			<svelte:fragment slot="navigation" />
		</Step>
		<Step locked={!identityExists}>
			<svelte:fragment slot="header"
				><div class="h3 text-center">Create Identity</div></svelte:fragment
			>
			<div class="grid place-content-center gap-5">
				{#if !identityExists}
					<button
						on:click={() => createIdentity()}
						class="btn variant-filled-success"
						type="button"
					>
						Generate Identity
					</button>
					<RestoreIdentity />
				{:else}
					<div class="d-flex justify-content-between gap-2">
						<button
							on:click={() => createIdentity(true)}
							class="btn variant-ghost-warning"
							type="button"
						>
							Re-Generate Identity
						</button>
					</div>
				{/if}
			</div>
		</Step>
		<Step locked={!$signUpStatusStore.accepted}>
			<svelte:fragment slot="header"
				><div class="h3 text-center">Join Communities</div></svelte:fragment
			>
			<Join />
		</Step>
		<Step locked={!$signUpStatusStore.backedUp}>
			<svelte:fragment slot="header"
				><div class="h3 text-center">Backup your identity</div></svelte:fragment
			>
			<div class="grid place-content-center">
				<a
					class="btn variant-ghost-success"
					href={'data:text/json;charset=utf-8,' +
						encodeURIComponent(JSON.stringify($identityStore))}
					download="identity.json"
					on:click={() => ($signUpStatusStore.backedUp = true)}>JSON</a
				>
			</div>
		</Step>
	</Stepper>
	<slot>
		<Loading />
	</slot>
</div>
