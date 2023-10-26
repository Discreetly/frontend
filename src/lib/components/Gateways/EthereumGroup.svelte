<script lang="ts">
	import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
	import { getAccount, signMessage, watchAccount, disconnect, Config } from '@wagmi/core';
	import { mainnet, arbitrum, optimism, base, polygon } from '@wagmi/core/chains';
	import { onMount } from 'svelte';
	import { getCommitment } from '$lib/utils';
	import type { Web3Modal } from '@web3modal/wagmi/dist/types/src/client';
	import { alertQueue, configStore, selectedServer } from '$lib/stores';
	import { getEthAddressRoomNames } from '$lib/services/server';
	import { ethereumGroupRequest } from '$lib/gateways/ethereumGroup';

	const projectId = 'fcc228af1d77425f1482f07a961fb32d';
	let modal: Web3Modal;

	let btnEl: HTMLElement;
	let address: string = '';
	let loadingRooms: boolean = false;
	let groups: { name: string }[] = [];
	let isConnected = false;
	const chains = [mainnet, arbitrum, optimism, base, polygon];
	const metadata = {
		name: 'Discreetly',
		description: 'Join Discreetly via your Ethereum address.',
		url: 'https://app.discreetly.chat',
		icons: ['https://avatars.githubusercontent.com/u/37784886']
	};

	let wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

	async function proveOwnership() {
		const commitment = getCommitment();
		if (commitment) {
			const signature = await signMessage({
				message: commitment
			});
			if (signature) {
				const result = ethereumGroupRequest(commitment, signature);
			}
		} else {
			alertQueue.enqueue("Unable to sign Identity Commitment, can't access identity", 'warning');
		}
	}

	function connect() {
		if (getAccount().isConnected) {
			disconnect();
		} else {
			modal.open();
		}
	}

	onMount(() => {
		modal = createWeb3Modal({ wagmiConfig, projectId, chains });
		btnEl?.addEventListener('click', connect);
		watchAccount((account) => {
			address = account.address ?? '';
			if (account.isConnected) {
				btnEl!.innerText = 'Disconnect';
				loadingRooms = true;
				getEthAddressRoomNames($selectedServer, address)
					.then((groupNames) => {
						console.log(groupNames);
						loadingRooms = false;
						groups = groupNames;
					})
					.finally(() => {
						loadingRooms = false;
					});
				isConnected = true;
			} else {
				btnEl!.innerText = 'Connect';
				isConnected = false;
			}
		});
	});
</script>

<div class="flex flex-col gap-3 justify-between">
	<div>
		<h3 class="h4 mb-2"><span class="text-success-500">Step 1:</span> Connect your wallet</h3>
		<button bind:this={btnEl} class="btn variant-outline-tertiary">Connect</button>
	</div>
	{#if isConnected}
		<div>
			<p class="h6">Your connected address is: {address}</p>
		</div>
		{#if groups.length > 0 || $configStore.beta}
			<p>You are eligible for the following Ethereum Groups:</p>
			<ul>
				{#each groups as group}
					<ins class="ins border-y border-success-800">{group.name}</ins>
				{/each}
			</ul>
			<div>
				<h3 class="h4 my-2">
					<span class="text-success-500">Step 2:</span> Sign your Identity Commitment to prove ownership
					of this address
				</h3>
				<button on:click={proveOwnership} id="btn" class="btn variant-outline-success">Sign</button>
			</div>
		{:else if loadingRooms}
			<p>Loading rooms...</p>
		{:else}
			<p>You are not eligible for any Ethereum Groups.</p>
		{/if}
	{/if}
</div>
