<script lang="ts">
	import { page } from '$app/stores';
	import {
		AppRail,
		AppRailAnchor,
		getModalStore,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import Chat from 'svelte-material-icons/Chat.svelte';
	import Settings from 'svelte-material-icons/TuneVariant.svelte';
	import Information from 'svelte-material-icons/Information.svelte';
	import Console from 'svelte-material-icons/Console.svelte';
	import Lock from 'svelte-material-icons/Lock.svelte';
	import LockOpen from 'svelte-material-icons/LockOpenVariant.svelte';
	import NoPassword from 'svelte-material-icons/LockOff.svelte';
	import Plus from 'svelte-material-icons/Plus.svelte';
	import { keyStore, passwordSet } from '$lib/stores';
	import { unlockPadlock } from '$lib/utils';

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
					unlockPadlock(r);
				}
			}
		};
		modalStore.trigger(modal);
	}

	function lock() {
		$keyStore = null;
	}
</script>

<AppRail height="h-full">
	<AppRailAnchor href="/about" selected={$page.url.pathname === '/about'} title="About">
		<svelte:fragment slot="lead"><Information class="rail-icon" /></svelte:fragment>
		<span>About</span>
	</AppRailAnchor>

	<AppRailAnchor href="/chat" selected={$page.url.pathname === '/chat'} title="Chat">
		<svelte:fragment slot="lead"><Chat class="rail-icon" /></svelte:fragment>
		<span>Chat</span>
	</AppRailAnchor>

	<AppRailAnchor href="/gateways" selected={$page.url.pathname === '/gateways'} title="About">
		<svelte:fragment slot="lead"><Plus class="rail-icon" /></svelte:fragment>
		<span>Join More</span>
	</AppRailAnchor>

	<AppRailAnchor href="/console" selected={$page.url.pathname === '/console'} title="About">
		<svelte:fragment slot="lead"><Console class="rail-icon" /></svelte:fragment>
		<span>Console</span>
	</AppRailAnchor>

	<svelte:fragment slot="trail">
		{#if $passwordSet}
			{#if $keyStore instanceof CryptoKey}
				<AppRailAnchor on:click={lock} title="Unlocked, click to lock">
					<svelte:fragment slot="lead">
						<LockOpen class="rail-icon text-warning-300-600-token" />
					</svelte:fragment>
					<span>Lock</span>
				</AppRailAnchor>
			{:else}
				<AppRailAnchor on:click={unlock} title="Locked">
					<svelte:fragment slot="lead">
						<Lock class="rail-icon text-success-500" />
					</svelte:fragment>
					<span>Unlock</span>
				</AppRailAnchor>
			{/if}
		{:else}
			<AppRailAnchor href="/settings/security" title="Password not set">
				<svelte:fragment slot="lead">
					<NoPassword class="rail-icon text-error-500" />
				</svelte:fragment>
				<span>Secure</span>
			</AppRailAnchor>
		{/if}
		<AppRailAnchor href="/settings" selected={$page.url.pathname === '/settings'} title="Settings">
			<svelte:fragment slot="lead"><Settings class="rail-icon" /></svelte:fragment>
			<span>Settings</span>
		</AppRailAnchor>
	</svelte:fragment>
</AppRail>
