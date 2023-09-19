<script lang="ts">
	import { AppShell, Modal } from '@skeletonlabs/skeleton';
	import { Toast } from '@skeletonlabs/skeleton';
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import { onMount } from 'svelte';
	import AppHeader from './AppHeader.svelte';
	import Loading from '$lib/components/loading.svelte';
	import { selectedServer } from '$lib/stores';
	import { getServerList, setDefaultServers } from '$lib/utils/';
	import { updateServer } from '$lib/utils/';
	import { Drawer } from '@skeletonlabs/skeleton';
	import SelectServer from '$lib/components/SelectServer.svelte';
	import SelectRoom from '$lib/components/SelectRoom.svelte';
	export const prerender = false;
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

<Modal />
<Toast position="t" background="variant-filled-primary" />
<Drawer position="top" padding="p-4" rounded="rounded-token">
	<SelectServer />
	<SelectRoom />
</Drawer>

<AppShell>
	<svelte:fragment slot="header"><AppHeader /></svelte:fragment>
	<slot>
		<Loading />
	</slot>
</AppShell>
