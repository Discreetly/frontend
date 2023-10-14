<script lang="ts">
	import { passwordSet, configStore, keyStore } from '$lib/stores';
	import Lock from 'svelte-material-icons/Lock.svelte';
	import LockOpen from 'svelte-material-icons/LockOpenVariant.svelte';
	import NoPassword from 'svelte-material-icons/LockOff.svelte';

	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { deriveKey, hashPassword } from '$lib/crypto/crypto';
	import { onMount } from 'svelte';
	import { alertAll, setPassword } from '$lib/utils';
	const modalStore = getModalStore();
	export let cls: string = '';

	let minPasswordLength = 3;

	function setPasswordModal() {
		const modal: ModalSettings = {
			type: 'prompt',
			title: 'Set a Password',
			body: 'Set a password or pin to encrypt your identity and room passwords',
			value: '',
			valueAttr: { type: 'password', minlength: minPasswordLength, required: true },
			response: async (r: string) => {
				if (r != '' && r != null && r != undefined && r.length >= minPasswordLength) {
					setPassword(r);
				}
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
			valueAttr: { type: 'password', minlength: 4, required: true },
			response: async (r: string) => {
				if (r != 'false' && r != '' && r != null && r != undefined) {
					const hashedPassword = await hashPassword(r);
					if ($configStore.hashedPwd == hashedPassword) {
						$keyStore = await deriveKey(r);
					} else {
						alertAll('Incorrect Password');
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
			'PadLock:',
			$passwordSet ? 'password set,' : 'password not set,',
			$keyStore !== null && $keyStore !== undefined ? 'unlocked' : 'locked'
		);
	});
</script>

<div class={cls} id="lock">
	{#if $passwordSet}
		{#if $keyStore instanceof CryptoKey}
			<div on:click={lock} title="Unlocked, click to lock">
				<LockOpen class="w-full text-warning-300-600-token" />
			</div>
		{:else}
			<div on:click={unlock} title="Locked" class="w-full text-success-500"><Lock /></div>
		{/if}
	{:else}
		<div on:click={setPasswordModal} title="Password not set">
			<NoPassword class="w-full text-error-500" />
		</div>
	{/if}
</div>

<style>
	#lock {
		cursor: pointer;
	}
</style>
