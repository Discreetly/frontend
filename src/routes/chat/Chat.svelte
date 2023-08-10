<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import type { RoomI, MessageI } from 'discreetly-interfaces';
	import {
		identityStore,
		messageStore,
		serverDataStore,
		serverListStore,
		roomsStore
	} from '$lib/stores';
	import { io } from 'socket.io-client';
	import { genProof } from '$lib/prover';
	import { Identity } from '@semaphore-protocol/identity';
	import RateLimiter from '$lib/rateLimit';
	import {
		getRoomsForServer,
		getServerForSelectedRoom,
		updateServers,
		setSelectedRoomId
	} from '$lib/utils';

	const setRoom = (roomId: string) => {
		if (roomId) {
			setSelectedRoomId(roomId);
		}
	};
	let messageText = '';
	let connected: boolean = false;
	let rateManager: RateLimiter;
	let currentEpoch: number = 0;
	let messagesLeft: number = 0;

	const selectedRoomsServer = getServerForSelectedRoom();
	let serverSelection = selectedRoomsServer;

	$: selectedRoomId = $roomsStore.selectedRoomId; 
	$: selectedRoomData = $roomsStore.roomsData[selectedRoomId];
	$: roomListForServer = getRoomsForServer(serverSelection);

	$: () => {
		if (!$messageStore[selectedRoomId]) {
			$messageStore[selectedRoomId] = { messages: [] };
		}
	};

	$: sendButtonText = messagesLeft > 0 ? 'Send (' + messagesLeft + ' left)' : 'X';
	$: inRoom = true; // TODO fix this: $identityStore.rooms.hasOwnProperty(selectedRoom);
	$: canSendMessage = inRoom && connected;

	let elemChat: HTMLElement;

	// For some reason, eslint thinks ScrollBehavior is undefined...
	// eslint-disable-next-line no-undef
	function scrollChatBottom(behavior: ScrollBehavior = 'smooth'): void {
		setTimeout(() => {
			elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
		}, 1);
	}

	const socketURL: string = selectedRoomsServer;
	
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
		genProof(selectedRoomData, messageText, identity).then((msg) => {
			socket.emit('validateMessage', msg);
			console.debug('Sending message: ', msg);
			messageText = '';
		});

		scrollChatBottom();
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			sendMessage();
		}
	}

	const addServerModal: ModalSettings = {
		type: 'prompt',
		// Data
		title: 'Enter Server Address',
		body: 'Provide the server address.',
		// Populates the input value and attributes
		value: 'http://discreetly.chat/',
		valueAttr: { type: 'url', required: true },
		// Returns the updated response value
		response: (r: string) => {
			console.log('response:', r);
			if ($serverListStore.includes(r)) {
				console.warn('Server already exists');
				return;
			}
			$serverListStore.push({ url: r, name: 'LOADING...' + r });
			$serverDataStore = updateServers();
		}
	};

	onMount(() => {
		rateManager = new RateLimiter(selectedRoomData.userMessageLimit, selectedRoomData.rateLimit);
		scrollChatBottom('instant');
		socket.on('connect', () => {
			connected = true;
			const engine = socket.io.engine;

			engine.once('upgrade', () => {
				console.debug('Upgraded connection to', engine.transport.name);
			});

			engine.on('close', (reason) => {
				console.debug('socket-io-transport-closed', reason);
			});

			socket.emit('joiningRoom', selectedRoomData?.roomId);
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
					$messageStore[roomId] = { messages: [] };
				}
				$messageStore[roomId].messages = [data, ...$messageStore[roomId].messages.reverse()].slice(
					0,
					500
				);
				scrollChatBottom();
			}
		});

		setInterval(() => {
			currentEpoch = rateManager.getCurrentEpoch();
			messagesLeft = rateManager.getRemainingMessages();
		}, 1000);
	});
	onDestroy(() => {
		socket.emit('leavingRoom', selectedRoomData?.roomId);
		socket.disconnect();
	});
</script>

<section id="chat-wrapper" class="bg-surface-100-800-token">
	<!-- Navigation -->
	<div id="sidebar" class="hidden lg:grid grid-rows-[auto_1fr_auto] border-r border-surface-500/30">
		<!-- Header -->
		<header class="border-b border-surface-500/30 p-4 flex flex-row">
			<select
				class="select text-primary-500"
				bind:value={serverSelection}
				on:change={(event) => {
					console.log('Setting server to: ', event.target?.value);
					serverSelection = event.target?.value;
				}}
			>
				{#each Object.entries($serverDataStore) as [key, s]}
					<option value={key}>{s.name}</option>
				{/each}
			</select>
			<button
				type="button"
				class="btn btn-sm variant-ghost-primary ms-2"
				on:click={() => {
					modalStore.trigger(addServerModal);
				}}>+</button
			>
		</header>
		<!-- List -->
		<div class="p-4 space-y-4 overflow-y-auto">
			<select
				class="select text-primary-500"
				size="8"
				on:change={(event) => {
					setRoom(event.target?.value);
				}}
			>
				{#each roomListForServer as room}
					{#if room.roomId == selectedRoomId}
						<option value={room.roomId} title={room.roomId ? room.roomId : ''} selected
							>{room.name}</option
						>
					{:else}
						<option value={room.roomId} title={room.roomId ? room.roomId : ''}>{room.name}</option>
					{/if}
				{/each}
			</select>
		</div>
		<!-- Footer -->
		<!-- <footer class="border-t border-surface-500/30 p-4">(footer)</footer> -->
	</div>
	<!-- Chat -->
	<div id="chat" class="grid grid-rows-[auto_1fr_auto]">
		<!-- Header -->
		<header
			class="border-b border-surface-500/30 px-5 py-3 flex flex-row justify-between place-items-center"
		> 
			<h2 class="h5 text-primary-500" title={selectedRoomData?.roomId ? selectedRoomData.roomId : ''}>{selectedRoomData?.name}</h2>
			<small title={selectedRoomData?.roomId ? selectedRoomData.roomId : ''}>Epoch: {currentEpoch}</small>
		</header>
		<!-- Conversation -->
		<section id="conversation" bind:this={elemChat} class="p-4 overflow-y-auto space-y-4">
			{#if $messageStore[selectedRoomId]}
				{#each $messageStore[selectedRoomId].messages.reverse() as bubble}
					<div class="flex">
						<div class="card p-4 space-y-2 bg-surface-200-700-token">
							<header class="flex justify-between items-center">
								<small class="opacity-50 text-primary-500"
									>{rateManager.getTimestampFromEpoch(bubble.epoch)}</small
								>
								<small class="opacity-50 text-primary-500">epoch: {bubble.epoch}</small>
							</header>
							<p class="text-primary-500">{bubble.message}</p>
						</div>
					</div>
				{/each}
			{/if}
		</section>
		<!-- Prompt -->
		<section class="border-t border-surface-500/30 p-4 !border-dashed">
			<div class="input-group input-group-divider grid-cols-[1fr_auto] rounded-container-token">
				<textarea
					bind:value={messageText}
					class="p-2 text-primary-400 border"
					class:bg-surface-900={!canSendMessage}
					class:bg-surface-500={canSendMessage}
					name="prompt"
					id="prompt"
					placeholder={canSendMessage
						? 'Write a message...'
						: connected
						? 'Not a member of this room'
						: 'Connecting...'}
					rows="1"
					on:keydown={onPromptKeydown}
					disabled={!connected || !inRoom}
				/>
				<button
					class:hidden={!canSendMessage}
					class={canSendMessage && messageText ? 'variant-ghost-primary' : 'variant-ghost-surface'}
					disabled={!canSendMessage}
					on:click={sendMessage}
				>
					{sendButtonText}
				</button>
			</div>
		</section>
	</div>
</section>

<style>
	#chat-wrapper {
		height: 100%;
		display: grid;
		grid-template-columns: minmax(25%, 200px) 1fr;
		grid-template-rows: auto;
		grid-template-areas: 'sidebar chat';
	}
	#sidebar {
		grid-area: sidebar;
	}
	#chat {
		max-height: calc(100vh - 101px);
		grid-area: chat;
	}

	#conversation {
		overflow: scroll;
	}
</style>
