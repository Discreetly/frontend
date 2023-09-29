<script lang="ts">
	import {
		passwordSet,
		keyExists,
		configStore,
		keyStore,
		identityStore,
		identityKeyStore
	} from '$lib/stores';
	import Lock from 'svelte-material-icons/Lock.svelte';
	import LockOpen from 'svelte-material-icons/LockOpenVariant.svelte';
	import NoPassword from 'svelte-material-icons/LockOff.svelte';

	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { deriveKey, encryptData, hashPassword } from '$lib/crypto/crypto';
	import { onMount } from 'svelte';

	const modalStore = getModalStore();

	export const cls: string = '';

	function setPassword() {
		const modal: ModalSettings = {
			type: 'prompt',
			title: 'Set a Password',
			body: 'Set a password to encrypt your identity and room passwords',
			value: 'Discreetly',
			valueAttr: { type: 'password', minlength: 3, required: true },
			response: async (r: string) => {
				console.log('Prompt Response: ', r);
				const hashedPassword = await hashPassword(r);
				$configStore.hashedPwd = hashedPassword;
				console.debug(`Hashed Password: ${hashedPassword}`);
				$keyStore = await deriveKey(r);
				console.debug(`Derived Key: ${$keyStore}`);
			}
		};
		modalStore.trigger(modal);
	}

	function unlock() {
		const modal: ModalSettings = {
			type: 'prompt',
			title: 'Unlock',
			body: 'Enter your password to unlock your keystores',
			value: '',
			valueAttr: { type: 'password', minlength: 3, required: true },
			response: async (r: string) => {
				if (r != 'false') {
					console.log('Prompt Response: ', r);
					const hashedPassword = await hashPassword(r);
					if ($configStore.hashedPwd == hashedPassword) {
						$keyStore = await deriveKey(r);
					} else {
						$keyStore = null;
					}
				}
			}
		};
		modalStore.trigger(modal);
	}

	function lock() {
		$keyStore = null;
	}
	onMount(() => {
		console.debug(
			'PasswordLock: ',
			$passwordSet ? 'password set,' : 'password not set,',
			$keyExists ? 'unlocked' : 'locked'
		);
	});
</script>

<div class={cls} id="lock">
	{#if $passwordSet}
		{#if $keyExists}
			<div on:click={lock} title="Unlocked, click to lock">
				<LockOpen class="text-warning-300-600-token" />
			</div>
		{:else}
			<div on:click={unlock} title="Locked" class="text-success-500"><Lock /></div>
		{/if}
	{:else}
		<div on:click={setPassword} title="Password not set">
			<NoPassword class="text-primary-500" />
		</div>
	{/if}
</div>

<style>
	#lock {
		cursor: pointer;
	}
</style>
