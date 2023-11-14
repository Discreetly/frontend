<script lang="ts">
	import { configStore, identityExists, passwordSet } from '$lib/stores';
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { Stepper, Step, getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { createIdentity, addConsoleMessage, unlockPadlock, getIdentityBackup } from '$lib/utils';
	import Lock from 'svelte-material-icons/Lock.svelte';
	import Introduction from '$lib/components/Onboarding/Introduction.svelte';
	import SetPassword from '$lib/components/Security/SetPasswordInput.svelte';
	import RestoreIdentity from '$lib/components/Identity/RestoreIdentity.svelte';
	import Backup from '$lib/components/Identity/BackupIdentity.svelte';
	import Gateways from '$lib/components/Onboarding/Gateways.svelte';
	import Mask from 'svelte-material-icons/GuyFawkesMask.svelte';
	import Magic from 'svelte-material-icons/MagicStaff.svelte';
	import BackupRestore from 'svelte-material-icons/BackupRestore.svelte';

	const modalStore = getModalStore();
	let restoreIdentity = false;

	function createAndBackupIdentity() {
		createIdentity();
		$configStore.signUpStatus.identityBackedUp = true;
		const id = getIdentityBackup();
		const a = document.createElement('a');
		const url = 'data:text/json;charset=utf-8,' + encodeURIComponent(id!);
		a.href = url;
		a.download = 'Discreetly_Identity.json';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	function unlock() {
		const modal: ModalSettings = {
			type: 'prompt',
			title: 'Unlock',
			body: 'Enter your code to unlock your keystores',
			value: '',
			valueAttr: { type: 'password', minlength: 4, required: true },
			response: async (r: string) => {
				if (r != 'false' && r != '' && r != null && r != undefined) {
					unlockPadlock(r);
				}
			}
		};
		modalStore.trigger(modal);
	}

	function checkForIdentity() {
		const idStatus = $identityExists;
		if (idStatus === 'safe') {
			addConsoleMessage('✅ Identity Found');
		} else if (idStatus === 'encrypted') {
			addConsoleMessage('⚠️ Identity Found, but it is encrypted');
		} else if (idStatus === 'unsafe') {
			addConsoleMessage('⚠️ Identity Found, but it is unsafe');
		} else if (idStatus === null) {
			addConsoleMessage('❌ No Identity Found');
		}
	}

	onMount(() => {
		addConsoleMessage('👋 Welcome to Discreetly');
		checkForIdentity();
	});
</script>

<Stepper
	class="px-3 sm:max-w-md md:max-w-3xl mx-auto mt-16"
	on:complete={() => {
		goto('/chat');
	}}
	buttonCompleteLabel="Lets Go Chat Anon"
	buttonNext="variant-filled-success"
	buttonComplete="variant-filled-success">
	<Step class="px-10">
		<svelte:fragment slot="header"
			><h2 class="h2 text-center">Welcome to Discreetly</h2>
		</svelte:fragment>
		<Introduction />
	</Step>
	<Step locked={!$passwordSet}>
		<svelte:fragment slot="header">
			{#if !$passwordSet}
				<h2 class="h2 text-center">Set Unlock Code</h2>
			{:else}
				<h2 class="h2 text-center">Unlock Code has been set ✅ Press Next to Continue</h2>
			{/if}
		</svelte:fragment>
		{#if !$passwordSet}
			<SetPassword />
		{:else}
			<p class="h4 text-center mt-5">Press next to continue, you are almost done</p>
		{/if}
	</Step>
	<Step locked={$identityExists !== 'safe'}>
		<svelte:fragment slot="header">
			{#if !$identityExists}
				<h2 class="h2 text-center">Generate or Restore an Identity</h2>
			{:else if $identityExists == 'encrypted'}
				<h2 class="h2 text-center">Identity Wallet Locked</h2>
			{:else}
				<h2 class="h2 text-center">Identity Created ✅</h2>
			{/if}
		</svelte:fragment>
		{#if $identityExists == null}
			<div class="flex flex-col gap-3">
				<button
					on:click={() => createAndBackupIdentity()}
					class="btn btn-lg variant-ghost-success"
					type="button">
					<span><Mask /></span>
					<span>Generate New Identity</span>
					<span><Magic /></span>
				</button>
				<button
					on:click={() => (restoreIdentity = !restoreIdentity)}
					class="btn variant-ghost-primary"
					type="button">
					<span id="backup"><BackupRestore /></span>
					<span>Restore Identity</span>
				</button>
			</div>
			{#if restoreIdentity == true}
				<RestoreIdentity />
			{/if}
		{:else if $identityExists == 'encrypted'}
			<div on:click={unlock}>
				<p class="h4 text-center">Please unlock your wallet</p>
				<Lock class="h3 m-auto" />
			</div>
		{:else}
			<p class="text-xl text-center">
				We have <span class="text-primary-500">downloaded your identity</span> for you
				<span class="text-primary-500">save it somewhere safe</span>
			</p>
			<p class="text-xl text-center">
				and then <span class="text-success-500">press next</span> to continue, last step
			</p>
			<Backup />
		{/if}
	</Step>
	<Step>
		<svelte:fragment slot="header"
			><div class="h3 text-center">Join Communities</div></svelte:fragment>
		<Gateways />
	</Step>
</Stepper>
