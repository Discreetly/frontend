<script lang="ts">
	import { Modal, initializeStores } from '@skeletonlabs/skeleton';
	import { Toast } from '@skeletonlabs/skeleton';
	import '../app.postcss';
	import { onMount } from 'svelte';
	import AppHeader from './AppHeader.svelte';
	import Loading from '$lib/components/loading.svelte';
	import { selectedServer } from '$lib/stores';
	import { getServerList, isInputFieldFocused, setDefaultServers } from '$lib/utils/';
	import { updateServer } from '$lib/utils/';
	import { Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	import SelectServer from '$lib/components/SelectServer.svelte';
	import SelectRoom from '$lib/components/SelectRoom.svelte';
	import Console from './console/Console.svelte';
	import Sidebar from './Sidebar.svelte';
	import AppFooter from './AppFooter.svelte';

	initializeStores();

	const drawerStore = getDrawerStore();
	// Hack to get BigInt <-> JSON compatibility
	(BigInt.prototype as any).toJSON = function () {
		return this.toString();
	};

	onMount(async () => {
		console.log('Starting Up Application');
		if (getServerList().length === 0) {
			setDefaultServers();
		}
		updateServer($selectedServer);
		document.addEventListener('keydown', function (event) {
			if (event.key === '`') {
				if (!isInputFieldFocused()) {
					event.preventDefault();
					if ($drawerStore.open !== true) {
						drawerStore.open({ id: 'console' });
					} else {
						drawerStore.close();
					}
				} else {
					console.log('Input field focused, not opening console');
				}
			}
		});
	});
</script>

<Modal />
<Toast position="t" background="variant-filled-primary" />
<Drawer position="top" padding="p-4" rounded="rounded-token">
	{#if $drawerStore.id === 'roomselect'}
		<SelectServer />
		<SelectRoom />
	{:else if $drawerStore.id === 'console'}
		<Console />
	{/if}
</Drawer>

<div class="w-full h-screen flex flex-col overflow-hidden">
	<div class="flex-none z-10"><AppHeader /></div>
	<div class="grid grid-cols-[1fr,auto] h-full min-w-full justify-between">
		<main class="flex flex-col justify-between">
			<slot class="flex flex-col justify-center">
				<Loading />
			</slot>
			<div class="block lg:hidden">
				<AppFooter />
			</div>
		</main>
		<div class="hidden lg:block"><Sidebar /></div>
	</div>
</div>

<style>
</style>
