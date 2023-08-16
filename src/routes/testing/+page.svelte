<script lang="ts">
	import {
		messageStore,
		serverListStore,
		serverDataStore,
		selectedServer,
		identityStore
	} from '$lib/data/stores';
	import { updateServers } from '$lib/utils';
	import { genProof } from '$lib/crypto/prover';
	import { io } from 'socket.io-client';
	import BackupIdentity from '../identity/BackupIdentity.svelte';
	import DeleteIdentity from '../identity/DeleteIdentity.svelte';
	import RestoreIdentity from '../identity/RestoreIdentity.svelte';
	import { Identity } from '@semaphore-protocol/identity';
	import RateLimiter from '$lib/rateLimit';
	import { onMount } from 'svelte';

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
		$serverDataStore = updateServers();
		if ($selectedServer.name == undefined) {
			$selectedServer = $serverListStore[0].url;
		}
	}

	function deleteMessages() {
		console.debug('DELETING MESSAGES');
		$messageStore = [];
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
	<h3 class="h3">Send Test Message</h3>
</div>
