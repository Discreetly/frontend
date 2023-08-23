<script lang="ts">
	import { autoModeWatcher } from '@skeletonlabs/skeleton';
	import { Modal } from '@skeletonlabs/skeleton';
	import { Toast } from '@skeletonlabs/skeleton';
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import { onMount } from 'svelte';
	import AppHeader from './AppHeader.svelte';
	import AppFooter from './AppFooter.svelte';
	import Loading from '$lib/components/loading.svelte';
	import { selectedServer } from '$lib/stores';
	import { getServerList, setDefaultServers } from '$lib/utils/';
	import { updateServer } from '$lib/utils/';
	import { Drawer } from '@skeletonlabs/skeleton';
	import SelectServer from '$lib/components/SelectServer.svelte';
	import SelectRoom from '$lib/components/SelectRoom.svelte';

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
<Toast />
<Drawer position="top" padding="p-4">
	<SelectServer />
	<SelectRoom />
</Drawer>
<app id="app">
	<div id="header">
		<AppHeader />
	</div>
	<div id="main">
		<slot>
			<Loading />
		</slot>
	</div>
	<div id="footer">
		<AppFooter />
	</div>
</app>

<style>
	#app {
		height: 100vh;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto 1fr auto;
		grid-template-areas: 'head' 'main' 'foot';
	}
	#app > #header {
		grid-area: head;
	}

	#app > #main {
		grid-area: main;
		height: 100%;
	}

	#app > #footer {
		grid-area: foot;
	}
</style>
