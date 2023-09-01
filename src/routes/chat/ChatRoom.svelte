<script lang="ts">
	import ChatRoomHeader from './ChatRoomHeader.svelte';

	import InputPrompt from './InputPrompt.svelte';
	import Conversation from './Conversation.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { selectedServer, currentSelectedRoom, messageStore, rateLimitStore } from '$lib/stores';
	import { io } from 'socket.io-client';
	import type { Socket } from 'socket.io-client';
	import type { MessageI } from 'discreetly-interfaces';
	import { getEpochFromTimestamp, getTimestampFromEpoch, updateMessages } from '$lib/utils';
	import Loading from '$lib/components/loading.svelte';
	import { toastStore } from '@skeletonlabs/skeleton';

	let scrollChatToBottom: () => {};
	let socket: Socket;
	let connected: boolean = false;
	let lastRoom = '';
	$: currentEpoch = 0;
	$: timeLeftInEpoch = '0';
	$: roomId = $currentSelectedRoom.roomId!.toString();
	$: userMessageLimit = $currentSelectedRoom.userMessageLimit ?? 1;
	$: roomRateLimit = $currentSelectedRoom.rateLimit ?? 0;
	$: if (!$rateLimitStore[roomId]) {
		console.debug('Resetting rate limit store for room', roomId);
		$rateLimitStore[roomId] = {
			lastEpoch: currentEpoch,
			messagesSent: 0
		};
	}

	let unsubscribeStore = currentSelectedRoom.subscribe((currentValue) => {
		updateMessages($selectedServer, roomId);
	});

	$: messagesLeft = () => {
		if (currentEpoch > 0) {
			if ($rateLimitStore[roomId].lastEpoch !== currentEpoch) {
				$rateLimitStore[roomId] = {
					lastEpoch: currentEpoch,
					messagesSent: 0
				};
				console.debug('MessagesLeft() resetting epoch for room', roomId);
			return userMessageLimit;
		} else {
				console.debug('MessagesLeft() returning messages left for room', roomId);
				return userMessageLimit - $rateLimitStore[roomId].messagesSent;
			}
		}
		return 0;
	};
	$: messageId = userMessageLimit - messagesLeft();
	$: try {
		if (lastRoom) {
			socket.emit('leavingRoom', lastRoom);
		}
		socket.emit('joiningRoom', $currentSelectedRoom?.roomId.toString());
		console.debug('Joining room', $currentSelectedRoom?.roomId.toString());
	} catch {
	} finally {
	}

	function updateEpoch() {
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
			scrollChatToBottom();

			engine.once('upgrade', () => {
				console.debug('Upgraded connection to', engine.transport.name);
			});

			engine.on('close', (reason) => {
				console.debug('socket-io-transport-closed', reason);
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
				if (!$messageStore[roomId]) {
					console.debug('Creating room in message store', roomId);
					$messageStore[roomId] = [] as MessageI[];
				}
				if (typeof data.proof === 'string') {
					data.proof = JSON.parse(data.proof as string);
				}
				if (!data.epoch) {
					data.epoch = getEpochFromTimestamp(
						$currentSelectedRoom.rateLimit!,
						+data.timeStamp!
					).epoch;
				}
				$messageStore[roomId] = [...$messageStore[roomId], data];
				if ($messageStore[roomId].length > 500) {
					$messageStore[roomId] = $messageStore[roomId].slice(-500); // Keep only the latest 500 messages
				}
				scrollChatToBottom();
			}
			socket.on('Members', (data: string) => {
				console.debug(data);
			});

			socket.on('systemBroadcast', (data: string) => {
				toastStore.trigger({ message: data, timeout: 3000 });
				console.debug('Received System Message: ', data);
			});
		});

		setInterval(() => {
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
		<!-- Header -->
		<ChatRoomHeader
			{connected}
			{currentEpoch}
			{timeLeftInEpoch}
			{userMessageLimit}
			{messageId}
			{messagesLeft}
			{roomRateLimit}
		/>
		<!-- Conversation -->
		{#key $currentSelectedRoom.roomId}
			<Conversation bind:scrollChatBottom={scrollChatToBottom} {roomRateLimit} />
		{/key}
		<!-- Prompt -->
		<InputPrompt
			{socket}
			{connected}
			{currentEpoch}
			{userMessageLimit}
			{messageId}
			{messagesLeft}
		/>
	</div>
{:else}
	<Loading />
{/if}

<style>
	#chat {
		max-height: calc(100vh - 56px);
		grid-area: chat;
	}
</style>
