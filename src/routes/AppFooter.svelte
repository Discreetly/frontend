<script lang="ts">
	import { page } from '$app/stores';
	import { passwordSet, configStore, keyStore } from '$lib/stores';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { deriveKey, hashPassword } from '$lib/crypto/crypto';
	import { onMount } from 'svelte';
	import { TabAnchor, TabGroup } from '@skeletonlabs/skeleton';

	import Chat from 'svelte-material-icons/Chat.svelte';
	import Settings from 'svelte-material-icons/TuneVariant.svelte';
	import Information from 'svelte-material-icons/Information.svelte';
	import Lock from 'svelte-material-icons/Lock.svelte';
	import LockOpen from 'svelte-material-icons/LockOpenVariant.svelte';
	import NoPassword from 'svelte-material-icons/LockOff.svelte';
	import { alertAll } from '$lib/utils';

	const modalStore = getModalStore();

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

<TabGroup
	justify="justify-center"
	active="variant-filled-primary"
	hover="hover:variant-soft-primary"
	flex="flex-1 lg:flex-none"
	class="bg-surface-100-800-token w-full"
>
	<TabAnchor href="/about" selected={$page.url.pathname === '/about'} title="About">
		<svelte:fragment slot="lead"><Information class="rail-icon" /></svelte:fragment>
		<span>About</span>
	</TabAnchor>

	<TabAnchor href="/chat" selected={$page.url.pathname === '/chat'} title="Chat">
		<svelte:fragment slot="lead"><Chat class="rail-icon" /></svelte:fragment>
		<span>Chat</span>
	</TabAnchor>
	{#if $passwordSet}
		{#if $keyStore instanceof CryptoKey}
			<TabAnchor on:click={lock} title="Unlocked, click to lock">
				<svelte:fragment slot="lead">
					<LockOpen class="rail-icon text-warning-300-600-token" />
				</svelte:fragment>
				<span>Lock</span>
			</TabAnchor>
		{:else}
			<TabAnchor on:click={unlock} title="Locked">
				<svelte:fragment slot="lead">
					<Lock class="rail-icon text-success-500" />
				</svelte:fragment>
				<span>Unlock</span>
			</TabAnchor>
		{/if}
	{:else}
		<TabAnchor href="/settings/security" title="Password not set">
			<svelte:fragment slot="lead">
				<NoPassword class="rail-icon text-error-500" />
			</svelte:fragment>
			<span>Secure</span>
		</TabAnchor>
	{/if}
	<TabAnchor href="/settings" selected={$page.url.pathname === '/settings'} title="Settings">
		<svelte:fragment slot="lead"><Settings class="rail-icon" /></svelte:fragment>
		<span>Settings</span>
	</TabAnchor>
</TabGroup>
