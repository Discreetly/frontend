<script lang="ts">
	import ChatRoomHeader from './ChatRoomHeader.svelte';

	import InputPrompt from './InputPrompt.svelte';
	import Conversation from './Conversation.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { selectedServer, currentSelectedRoom, messageStore } from '$lib/stores';
	import { io } from 'socket.io-client';
	import type { Socket } from 'socket.io-client';
	import type { MessageI } from 'discreetly-interfaces';
	import { getTimestampFromEpoch } from '$lib/utils';
	import { getMessages } from '$lib/services/server';

	let scrollChatToBottom: () => {};
	let socket: Socket;
	let connected: boolean = false;
	$: currentEpoch = 0;
	$: timeLeftInEpoch = '0';

	function updateEpoch() {
		currentEpoch = Math.floor(Date.now() / $currentSelectedRoom.rateLimit!);
		timeLeftInEpoch = (
			($currentSelectedRoom.rateLimit! -
				(Date.now() -
					getTimestampFromEpoch(currentEpoch, $currentSelectedRoom.rateLimit!).unixEpochTime)) /
			1000
		).toFixed(1);
	}

	onMount(() => {
		socket = io($selectedServer);
		socket.on('connect', () => {
			connected = true;
			const engine = socket.io.engine;

			engine.once('upgrade', () => {
				console.debug('Upgraded connection to', engine.transport.name);
			});

			engine.on('close', (reason) => {
				console.debug('socket-io-transport-closed', reason);
			});

			socket.emit('joiningRoom', $currentSelectedRoom?.roomId);
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
			console.debug('Received Message: ', data.message);
			const roomId = data.roomId?.toString();
			if (roomId) {
				if (!$messageStore[roomId]) {
					console.debug('Creating room in message store', roomId);
					$messageStore[roomId] = [] as MessageI[];
				}
				if (typeof data.proof === 'string') {
					data.proof = JSON.parse(data.proof as string);
				}
				$messageStore[roomId].unshift(data);
				$messageStore[roomId] = $messageStore[roomId].slice(0, 500); // Keep only the latest 500 messages
				scrollChatToBottom();
			}
		});
		getMessages($selectedServer, $currentSelectedRoom?.roomId.toString()).then((messages) => {
			$messageStore[$currentSelectedRoom?.roomId.toString()] = messages;
		});
		scrollChatToBottom();
		setInterval(() => {
			updateEpoch();
		}, 100);
	});
	onDestroy(() => {
		socket.emit('leavingRoom', $currentSelectedRoom?.roomId);
		socket.disconnect();
	});
</script>

<div id="chat" class="grid grid-rows-[auto_1fr_auto]">
	<!-- Header -->
	<ChatRoomHeader {currentEpoch} {timeLeftInEpoch} />
	<!-- Conversation -->
	<Conversation bind:scrollChatBottom={scrollChatToBottom} />
	<!-- Prompt -->
	<InputPrompt {socket} {connected} {currentEpoch} />
</div>

<style>
	#chat {
		max-height: calc(100vh - 101px);
		grid-area: chat;
	}
</style>
