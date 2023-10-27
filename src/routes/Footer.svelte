<script lang="ts">
	import { page } from '$app/stores';
	import { passwordSet, keyStore } from '$lib/stores';
	import {
		getModalStore,
		TabAnchor,
		TabGroup,
		popup,
		type PopupSettings,
		type ModalSettings,
		getDrawerStore
	} from '@skeletonlabs/skeleton';

	import Chat from 'svelte-material-icons/Chat.svelte';
	import Settings from 'svelte-material-icons/TuneVariant.svelte';
	import Console from 'svelte-material-icons/Console.svelte';
	import Menu from 'svelte-material-icons/Menu.svelte';
	import Plus from 'svelte-material-icons/Plus.svelte';
	import Information from 'svelte-material-icons/Information.svelte';
	import Lock from 'svelte-material-icons/Lock.svelte';
	import LockOpen from 'svelte-material-icons/LockOpenVariant.svelte';
	import NoPassword from 'svelte-material-icons/LockOff.svelte';
	import Door from 'svelte-material-icons/Door.svelte';
	import { unlockPadlock } from '$lib/utils';

	export let loaded: boolean;

	const modalStore = getModalStore();
	const drawerStore = getDrawerStore();
	// Open the drawer:
	function drawerOpen(): void {
		drawerStore.open({ id: 'roomselect' });
	}

	const popupMenu: PopupSettings = {
		event: 'click',
		target: 'popupMenu',
		placement: 'top',
		closeQuery: '#will-close'
	};

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

<div class="card p-4 w-72 shadow-xl" data-popup="popupMenu">
	<nav class="list-nav">
		<!-- (optionally you can provide a label here) -->
		<ul>
			<li id="will-close">
				<a href="/about">
					<Information />
					<span class="flex-auto">About</span>
				</a>
			</li>

			<li id="will-close">
				<a href="/gateways"
					><Plus />
					<span class="flex-auto">Join More</span>
				</a>
			</li>

			<li id="will-close">
				<a href="/console">
					<Console />
					<span class="flex-auto">Console</span>
				</a>
			</li>

			<li id="will-close">
				<a href="/settings">
					<Settings />
					<span class="flex-auto">Settings</span>
				</a>
			</li>
		</ul>
	</nav>
	<div class="arrow bg-surface-100-800-token" />
</div>
<TabGroup
	justify="justify-center"
	active="variant-filled-primary"
	hover="hover:variant-soft-primary"
	flex="flex-1 lg:flex-none"
	class="bg-surface-100-800-token w-full"
>
	<TabAnchor href="/chat" selected={$page.url.pathname === '/chat'} title="Chat">
		<svelte:fragment slot="lead"><Chat class="rail-icon" /></svelte:fragment>
		<span>Chat</span>
	</TabAnchor>
	{#if $page.url.pathname === '/chat'}
		<TabAnchor on:click={drawerOpen} title="Select Room">
			<svelte:fragment slot="lead"><Door class="rail-icon" /></svelte:fragment>
			<span>Select Room</span>
		</TabAnchor>
	{/if}
	{#if loaded}
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
	{/if}
	<a
		class="tab-anchor text-center cursor-pointer transition-colors duration-100 flex-1 lg:flex-none px-4 py-2 rounded-tl-container-token rounded-tr-container-token hover:variant-soft-primary"
		use:popup={popupMenu}
		title="Menu"
	>
		<Menu class="rail-icon" />
		<span>Menu</span>
	</a>
</TabGroup>
