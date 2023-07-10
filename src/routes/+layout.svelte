<script lang="ts">
	import { ProgressRadial, autoModeWatcher } from '@skeletonlabs/skeleton';
	import { AppShell } from '@skeletonlabs/skeleton';
	import { Modal } from '@skeletonlabs/skeleton';
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import { onMount } from 'svelte';
	import AppHeader from './AppHeader.svelte';
	import AppFooter from './AppFooter.svelte';
	import { serverListStore, serverDataStore, selectedServer } from '$lib/stores';
	import type { ServerI } from 'discreetly-interfaces';
	import { fetchServer } from '$lib/utils';
	import type { ServerListI } from '$lib/types';

	// Hack to get BigInt <-> JSON compatibility
	(BigInt.prototype as any).toJSON = function () {
		return this.toString();
	};

	onMount(async () => {
		$serverListStore.forEach((server: ServerListI) => {
			console.log('fetching server data');
			fetchServer(server.url).then((data) => {
				console.log('setting server data');
				Object.assign($serverDataStore[server.url], data as ServerI);
			});
		});
		if ($selectedServer.name == undefined) {
			$selectedServer = $serverListStore[0].url;
		}
	});
</script>

<svelte:head
	>{@html `
			<script>
				${autoModeWatcher.toString()} autoModeWatcher();
			</script>
			`}</svelte:head
>
<Modal />
<AppShell slotPageContent="my-6 mx-3">
	<svelte:fragment slot="header"><AppHeader /></svelte:fragment>
	<!-- <svelte:fragment slot="sidebarLeft">Sidebar Left</svelte:fragment> -->
	<slot class="m-4">
		<ProgressRadial />
	</slot>
	<svelte:fragment slot="footer"><AppFooter /></svelte:fragment>
</AppShell>
