<script lang="ts">
	import ChatRoomHeader from './ChatRoomHeader.svelte';
	import {
		currentSelectedRoom,
		rateLimitStore,
		selectedServer,
		configStore,
		currentRoomsStore,
		roomPasswordSet,
		identityExists,
		roomKeyStore,
		roomPassStore
	} from '$lib/stores';
	import RoomPassword from './RoomPassword.svelte';
	import { Experiences } from '$lib/types';
	import { addMessageToRoom, getTimestampFromEpoch, updateMessages, updateRooms } from '$lib/utils';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { MessageI } from 'discreetly-interfaces';
	import type { Socket } from 'socket.io-client';
	import { io } from 'socket.io-client';
	import { onDestroy, onMount } from 'svelte';
	import Conversation from './Conversation.svelte';
	import Draw from './Draw.svelte';
	import InputPrompt from './ChatInputPrompt.svelte';
	import { deriveKey } from '$lib/crypto/crypto';

	const toastStore = getToastStore();

	// Define a custom event
	let scrollChatEvent = new CustomEvent('scrollChat', {
		detail: { behavior: 'smooth', delay: 20 }
	});

	let socket: Socket;
	let connected: boolean = false;
	let lastRoom = '';
	let onlineMembers = '?';
	let epochUpdater: NodeJS.Timeout;
	let currentEpoch = 0;
	let key: CryptoKey | undefined = undefined;
	$: timeLeftInEpoch = '0';
	$: roomId = $currentSelectedRoom?.roomId!.toString();
	$: userMessageLimit = $currentSelectedRoom?.userMessageLimit ?? 1;
	$: roomRateLimit = $currentSelectedRoom?.rateLimit ?? 0;
	$: if (!$rateLimitStore[roomId]) {
		$rateLimitStore[roomId] = {
			lastEpoch: currentEpoch,
			messagesSent: 0
		};
	}

	let unsubscribeStore = currentSelectedRoom.subscribe(async (currentValue) => {
		await Promise.resolve();
		updateMessages($selectedServer, roomId);

		getKey().then((k) => {
			key = k;
		});
	});

	$: try {
		if (lastRoom) {
			socket.emit('leavingRoom', lastRoom);
		}
		socket.emit('joiningRoom', $currentSelectedRoom?.roomId.toString());
	} catch {
	} finally {
	}

	$: updateRooms($selectedServer, [roomId]);

	async function getKey(): Promise<CryptoKey> {
		let key: CryptoKey;
		if (!$roomPassStore[roomId]) {
			throw new Error('ROOM IS ENCRYPTED BUT NO PASSWORD WAS FOUND');
		}
		if (!$roomKeyStore[roomId]) {
			key = await deriveKey($roomPassStore[roomId].password, roomId);
			$roomKeyStore[roomId] = key;
		} else {
			key = $roomKeyStore[roomId];
		}
		return key;
	}

	function updateEpoch() {
		if ($currentSelectedRoom === undefined) {
			if ($currentRoomsStore[0] === undefined) {
				console.warn('No rooms available');
				clearInterval(epochUpdater);
				return;
			}
			$currentSelectedRoom = $currentRoomsStore[0];
		}
		currentEpoch = Math.floor(Date.now() / $currentSelectedRoom.rateLimit!);
		timeLeftInEpoch = (
			($currentSelectedRoom.rateLimit! -
				(Date.now() -
					getTimestampFromEpoch($currentSelectedRoom.rateLimit!, currentEpoch).timestamp)) /
			1000
		).toFixed(1);
	}

	onMount(() => {
		if (!$currentSelectedRoom) {
			$currentSelectedRoom = $currentRoomsStore[0];
		}
		console.debug('Chat room mounted with', $currentSelectedRoom?.roomId.toString());
		socket = io($selectedServer);
		socket.on('connect', () => {
			connected = true;
			const engine = socket.io.engine;
			if ($currentSelectedRoom?.ephemeral == 'PERSISTENT') {
				updateMessages($selectedServer, $currentSelectedRoom?.roomId.toString());
			}
			if ($configStore.experience == Experiences.Chat) {
				document.dispatchEvent(scrollChatEvent);
			}

			engine.once('upgrade', () => {
				console.debug('Connected to the server over', engine.transport.name);
			});

			engine.on('close', (reason) => {
				console.debug('socket-io-transport-closed:', reason);
			});

			socket.emit('joiningRoom', $currentSelectedRoom?.roomId.toString());
		});

		socket.on('disconnected', () => {
			connected = false;
			console.debug('disconnected');
		});

		socket.on('connect_error', (err) => {
			console.debug('chat connection error', err.message);
		});

		socket.on('connect_timeout', (err) => {
			console.debug('chat connection timeout', err.message);
		});

		socket.on('error', (err) => {
			console.debug('chat websocket error', err.message);
		});

		socket.on('Members', (data: string) => {
			onlineMembers = data;
		});

		socket.on('systemBroadcast', (data: string) => {
			toastStore.trigger({ message: data, timeout: 3000 });
			console.debug('Received System Message: ', data);
		});

		socket.on('messageBroadcast', (data: MessageI) => {
			console.debug('Received Message: ', data);
			const roomId = data.roomId?.toString();
			if (roomId) {
				addMessageToRoom(roomId, data);
				document.dispatchEvent(scrollChatEvent);
			}
		});

		epochUpdater = setInterval(() => {
			updateEpoch();
		}, 100);
		getKey().then((k) => {
			key = k;
		});
	});

	onDestroy(() => {
		unsubscribeStore();
		socket.emit('leavingRoom', $currentSelectedRoom?.roomId);
		socket.disconnect();
	});
</script>

{#if $currentSelectedRoom}
	{#if $roomPasswordSet}
		<div
			id="chat"
			class="grid grid-rows-[auto,1fr,auto]">
			<ChatRoomHeader
				{connected}
				{currentEpoch}
				{timeLeftInEpoch}
				{userMessageLimit}
				{roomRateLimit}
				{onlineMembers} />
			{#if $configStore.experience == Experiences.Chat}
				{#key $currentSelectedRoom.roomId}
					<Conversation
						{roomRateLimit}
						{getKey}
						{roomId} />
				{/key}
				<InputPrompt
					{socket}
					{connected}
					{currentEpoch}
					{userMessageLimit}
					{roomId}
					{getKey} />
			{:else if $configStore.experience == Experiences.Draw}
				<Draw />
			{:else}
				{#key $currentSelectedRoom.roomId}
					<Conversation
						{roomRateLimit}
						{getKey}
						{roomId} />
				{/key}
				<InputPrompt
					{socket}
					{connected}
					{currentEpoch}
					{userMessageLimit}
					{roomId}
					{getKey} />
			{/if}
			<!-- Conversation -->

			<!-- Prompt -->
		</div>
	{:else if $identityExists == 'encrypted'}
		<h3 class="h3 my-5 text-center text-primary-500">Unlock your credentials to see this room.</h3>
	{:else}
		<div><RoomPassword {roomId} /></div>
	{/if}
{:else}
	<div class="grid place-content-center">
		<h6 class="h2 text-center mb-10">You aren't in any rooms...yet</h6>
		<a
			href="https://discord.gg/brJQ36KVxk"
			class="h2 btn btn-sm variant-ringed-secondary">Join our Discord for help</a>
	</div>
{/if}

<style>
	#chat {
		max-height: calc(100vh - var(--header-height));
		grid-area: chat;
	}
</style>
