<script lang="ts">
	import { Modal, getToastStore, initializeStores } from '@skeletonlabs/skeleton';
	import { Toast, storePopup } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import '../app.postcss';
	import { onMount } from 'svelte';
	import AppHeader from './AppHeader.svelte';
	import Loading from '$lib/components/Utils/Loading.svelte';
	import { selectedServer, alertQueue, numberServers } from '$lib/stores';
	import { getServerList, isInputFieldFocused, setDefaultServers } from '$lib/utils/';
	import { updateServer } from '$lib/utils/';
	import { Drawer, getDrawerStore } from '@skeletonlabs/skeleton';
	import SelectServer from '$lib/components/Server/SelectServer.svelte';
	import SelectRoom from '$lib/components/Server/SelectRoom.svelte';
	import Console from './console/Console.svelte';
	import Sidebar from './Sidebar.svelte';
	import AppFooter from './Footer.svelte';

	initializeStores();

	const toastStore = getToastStore();
	let loaded = false;

	const drawerStore = getDrawerStore();
	// Hack to get BigInt <-> JSON compatibility
	(BigInt.prototype as any).toJSON = function () {
		return this.toString();
	};

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	onMount(async () => {
		console.info('Starting Up Application');
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
					console.debug('Input field focused, not opening console');
				}
			}
		});
		setInterval(() => {
			const toast = alertQueue.dequeue();
			let bg = '';
			if (toast) {
				switch (toast.type) {
					case 'error':
						bg = 'variant-filled-error';
						break;
					case 'warning':
						bg = 'variant-filled-warning';
						break;
					case 'success':
						bg = 'variant-filled-success';
						break;
					case 'info':
						bg = 'variant-filled-info';
						break;
					case 'tertiary':
						bg = 'variant-filled-tertiary';
						break;
					default:
						bg = 'variant-filled-primary';
						break;
				}
				toastStore.trigger({
					message: toast.data,
					background: bg,
					timeout: 3500,
					hoverable: true
				});
			}
		}, 500);
	});

	onMount(() => {
		loaded = true;
	});
</script>

<Modal />
<Toast
	position="t"
	background="variant-filled-primary" />
<Drawer
	position="top"
	padding="p-4"
	rounded="rounded-token">
	{#if $drawerStore.id === 'roomselect'}
		{#if $numberServers > 1}
			<h3 class="h5 p-2">Change Server:<SelectServer /></h3>
		{/if}
		<h3 class="h5 p-2">Select Room:<SelectRoom /></h3>
	{:else if $drawerStore.id === 'console'}
		<Console />
	{/if}
</Drawer>

<div
	class="w-full h-screen max-h-screen"
	id="pagewrapper">
	<div id="headerwrapper"><AppHeader /></div>
	<main>
		<slot class="flex flex-col justify-center">
			<Loading />
		</slot>
	</main>
	<div id="footer">
		<AppFooter {loaded} />
	</div>
	<div
		id="sidebar"
		class="hidden lg:block">
		<Sidebar {loaded} />
	</div>
</div>

<style>
	#pagewrapper {
		display: grid;
		grid-template-areas: 'header header' 'main sidebar' 'footer sidebar';
		grid-template-rows: auto 1fr auto;
		grid-template-columns: 1fr auto;
		grid-column-gap: 0px;
		grid-row-gap: 0px;
	}
	#headerwrapper {
		grid-area: header;
		max-height: var(--header-height);
		position: sticky;
		top: 0;
		z-index: 1;
	}
	main {
		grid-area: main;
		overflow-y: auto;
	}
	#sidebar {
		grid-area: sidebar;
		position: sticky;
	}

	@media screen and (max-width: 768px) {
		#pagewrapper {
			grid-template-areas: 'header header' 'main main' 'footer footer';
			grid-template-rows: auto 1fr auto;
			grid-template-columns: 1fr;
		}
		#sidebar {
			display: none;
		}

		#footer {
			display: block;
		}
	}

	@media screen and (min-width: 768px) {
		#pagewrapper {
			grid-template-areas: 'header header' 'main sidebar' 'main sidebar';
			grid-template-rows: auto 1fr auto;
			grid-template-columns: 1fr auto;
		}
		#sidebar {
			display: block;
		}

		#footer {
			display: none;
		}
	}
</style>
