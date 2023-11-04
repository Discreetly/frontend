<script lang="ts">
	import ChatRoomHeader from './ChatRoomHeader.svelte';
	import {
		currentSelectedRoom,
		rateLimitStore,
		selectedServer,
		configStore,
		currentRoomsStore
	} from '$lib/stores';
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

	const toastStore = getToastStore();

	let scrollChatToBottom: () => {};
	let socket: Socket;
	let connected: boolean = false;
	let lastRoom = '';
	let onlineMembers = '?';
	let epochUpdater: NodeJS.Timeout;
	let currentEpoch = 0;
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

	let unsubscribeStore = currentSelectedRoom.subscribe((currentValue) => {
		updateMessages($selectedServer, roomId);
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
		socket = io($selectedServer);
		socket.on('connect', () => {
			connected = true;
			const engine = socket.io.engine;

			updateMessages($selectedServer, $currentSelectedRoom?.roomId.toString());
			if ($configStore.experience == Experiences.Chat) {
				scrollChatToBottom();
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

		socket.on('messageBroadcast', (data: MessageI) => {
			console.debug('Received Message: ', data);
			const roomId = data.roomId?.toString();
			if (roomId) {
				addMessageToRoom(roomId, data);
				scrollChatToBottom();
			}
			socket.on('Members', (data: string) => {
				console.debug(`Members Online: ${data}`);
				onlineMembers = data;
			});

			socket.on('systemBroadcast', (data: string) => {
				toastStore.trigger({ message: data, timeout: 3000 });
				console.debug('Received System Message: ', data);
			});

			scrollChatToBottom();
		});

		epochUpdater = setInterval(() => {
			updateEpoch();
		}, 100);
	});
	onDestroy(() => {
		unsubscribeStore();
		socket.emit('leavingRoom', $currentSelectedRoom?.roomId);
		socket.disconnect();
	});
</script>

{#if $currentSelectedRoom}
	<div id="chat" class="grid grid-rows-[auto,1fr,auto]">
		<ChatRoomHeader
			{connected}
			{currentEpoch}
			{timeLeftInEpoch}
			{userMessageLimit}
			{roomRateLimit}
			{onlineMembers}
		/>
		{#if $configStore.experience == Experiences.Chat}
			{#key $currentSelectedRoom.roomId}
				<Conversation bind:scrollChatBottom={scrollChatToBottom} {roomRateLimit} />
			{/key}
			<InputPrompt {socket} {connected} {currentEpoch} {userMessageLimit} {roomId} />
		{:else if $configStore.experience == Experiences.Draw}
			<Draw />
		{:else}
			{#key $currentSelectedRoom.roomId}
				<Conversation bind:scrollChatBottom={scrollChatToBottom} {roomRateLimit} />
			{/key}
			<InputPrompt {socket} {connected} {currentEpoch} {userMessageLimit} {roomId} />
		{/if}
		<!-- Conversation -->

		<!-- Prompt -->
	</div>
{:else}
	<div class="grid place-content-center">
		<h6 class="h2 text-center mb-10">You aren't in any rooms...yet</h6>
		<a href="https://discord.gg/brJQ36KVxk" class="h2 btn btn-sm variant-ringed-secondary"
			>Join our Discord for help</a
		>
	</div>
{/if}

<style>
	#chat {
		max-height: calc(100vh - 56px);
		grid-area: chat;
	}
</style>
