<script lang="ts">
	import { messageStore, serverStore, selectedServer, identityStore } from '$lib/stores';
	import { getServerList, updateServer } from '$lib/stores/servers';
	import { genProof } from '$lib/crypto/prover';
	import { io } from 'socket.io-client';
	import BackupIdentity from '../identity/BackupIdentity.svelte';
	import DeleteIdentity from '../identity/DeleteIdentity.svelte';
	import RestoreIdentity from '../identity/RestoreIdentity.svelte';
	import { Identity } from '@semaphore-protocol/identity';
	import RateLimiter from '$lib/utils/rateLimit';
	import { onMount } from 'svelte';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	let messageText = '';
	let connected: boolean = false;
	let rateManager: RateLimiter;
	let currentEpoch: number = 0;
	let messagesLeft: number = 0;
	const socketURL: string = $selectedServer || '';

	const socket = io(socketURL);

	function sendMessage() {
		if (!connected) {
			console.debug('Not connected to chat server');
			return;
		}
		if (messageText.length === 0) {
			console.debug('Message is empty');
			return;
		}
		const identity = new Identity($identityStore.toString());
		const messageID = rateManager.useMessage();
		if (messageID == -1) {
			console.debug('Rate limit exceeded');
			return;
		} else {
			messagesLeft = messageID;
		}
		genProof(room, messageText, identity).then((msg) => {
			socket.emit('validateMessage', msg);
			console.debug('Sending message: ', msg);
			messageText = '';
		});
	}

	function updateServerData() {
		console.debug('UPDATING SERVERS');
		updateServer($selectedServer);
	}

	function deleteMessages() {
		console.debug('DELETING MESSAGES');
		$messageStore = {};
	}

	onMount(() => {
		rateManager = new RateLimiter(room.userMessageLimit, room.rateLimit);
		socket.on('connect', () => {
			connected = true;
		});

		setInterval(() => {
			currentEpoch = rateManager.getCurrentEpoch();
			messagesLeft = rateManager.getRemainingMessages();
		}, 1000);
	});
</script>

<div class="grid grid-cols-1 gap-5">
	<button class="btn variant-ghost-success" on:click={() => updateServerData()}
		>Update server data</button
	>
	<button class="btn variant-ghost-secondary" on:click={() => deleteMessages()}
		>Delete messages</button
	>
	<BackupIdentity />
	<RestoreIdentity />
	<DeleteIdentity />
	<h4 class="h4 mt-4">Refresh Rooms</h4>
	<RadioGroup active="variant-filled-success" display="flex-col" hover="hover:variant-soft-primary">
		{#each getServerList() as serverUrl}
			<RadioItem
				on:change={selectServer}
				bind:group={$selectedServer}
				name="server"
				value={$serverStore[serverUrl]}>{$serverStore[serverUrl].name}</RadioItem
			>
		{/each}
	</RadioGroup>
	<div>
		<div class="btn variant-filled-success btn-sm" on:click={refreshRooms}>Refresh Rooms</div>
	</div>
</div>
