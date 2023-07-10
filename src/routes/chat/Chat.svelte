<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Avatar, ListBox } from '@skeletonlabs/skeleton';
	import type { RoomGroupI, RoomI, MessageI } from 'discreetly-interfaces';
	import { identityStore, selectedServer, messageStore, serverDataStore } from '$lib/stores';
	import { io } from 'socket.io-client';
	import { genProof } from '$lib/prover';
	import { Identity } from '@semaphore-protocol/identity';

	export let setRoom: (id: RoomI['id']) => any;
	let messageText = '';
	let sendButtonText = 'Send';
	let connected: boolean = false;
	$: server = $serverDataStore[$selectedServer];
	$: roomGroups = server.roomGroups;
	$: selectedRoom = server.selectedRoom;
	$: room = $serverDataStore[$selectedServer].roomGroups
		.map((group: RoomGroupI) => group.rooms)
		.flat()
		.find((room: RoomI) => room.id === selectedRoom);
	$: roomMessageStore = $messageStore[selectedRoom];
	$: () => {
		if (!$messageStore[selectedRoom]) {
			$messageStore[selectedRoom] = { messages: [] };
		}
	};

	function getMembers(room: RoomI): string {
		let total = 0;
		total = room.membership?.identityCommitments?.length || 0;
		if (!(total > 0)) {
			return 'Cooming soon...';
		}
		return String(total.toString() + ' members');
	}

	const socketURL: string = $serverDataStore[$selectedServer].messageHandlerSocket || '';

	const socket = io(socketURL);

	socket.on('connect', () => {
		connected = true;
		const engine = socket.io.engine;

		engine.once('upgrade', () => {
			console.debug('Upgraded connection to', engine.transport.name);
		});

		engine.on('close', (reason) => {
			console.debug('socket-io-transport-closed', reason);
		});

		socket.emit('joiningRoom', room?.id);
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
		if (!$messageStore[data.room]) {
			$messageStore[data.room] = { messages: [] };
		}
		$messageStore[data.room].messages = [data, ...$messageStore[data.room].messages];
		$messageStore[data.room].messages = $messageStore[data.room].messages.slice(0, 500);
		scrollChatBottom();
	});

	function sendMessage() {
		const identity = new Identity($identityStore.toString());
		genProof(room, messageText, identity).then((msg) => {
			socket.emit('validateMessage', msg);
		});
		scrollChatBottom();
	}

	let elemChat: HTMLElement;

	// For some reason, eslint thinks ScrollBehavior is undefined...
	// eslint-disable-next-line no-undef
	function scrollChatBottom(behavior: ScrollBehavior = 'smooth'): void {
		setTimeout(() => {
			elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
		}, 1);
	}

	function getEpochTimestamp(epoch?: number | bigint): string {
		const time = epoch ? Number(epoch) * room.rateLimit : new Date();
		return new Date(time).toLocaleString('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		});
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			sendMessage();
		}
	}

	onMount(() => {
		scrollChatBottom('instant');
	});
	onDestroy(() => {
		socket.emit('leavingRoom', room?.id);
		socket.disconnect();
	});
</script>

<section class="card">
	<div class="chat w-full h-full grid grid-cols-1 lg:grid-cols-[30%_1fr]">
		<!-- Navigation -->
		<div class="hidden lg:grid grid-rows-[auto_1fr_auto] border-r border-surface-500/30">
			<!-- Header -->
			<header class="border-b border-surface-500 p-4">
				<select
					class="select text-primary-500"
					on:change={(event) => {
						console.log('Setting server to: ', event.target.value);
						$selectedServer = event.target.value;
					}}
				>
					{#each Object.entries($serverDataStore) as [key, s]}
						<option value={key}>{s.name}</option>
					{/each}
					<option value={'http://localhost:3001/api/'}>TESTING LOCALHOST</option>
				</select>
			</header>
			<!-- List -->
			<div class="p-4 space-y-4 overflow-y-auto">
				<select
					class="select text-primary-500"
					size="8"
					on:change={(event) => {
						setRoom(event.target.value);
					}}
				>
					{#each roomGroups as group}
						{#each group.rooms as room}
							{#if room.id == selectedRoom}
								<option value={room.id} selected>{room.name}</option>
							{:else}
								<option value={room.id}>{room.name}</option>
							{/if}
						{/each}
					{/each}
				</select>
			</div>
			<!-- Footer -->
			<!-- <footer class="border-t border-surface-500/30 p-4">(footer)</footer> -->
		</div>
		<!-- Chat -->
		<div class="grid grid-row-[1fr_auto]">
			<!-- Conversation -->
			<section bind:this={elemChat} class="max-h-[1000px] p-4 overflow-y-auto space-y-4">
				{#each roomMessageStore.messages.reverse() as bubble}
					<div class="grid grid-cols-[1fr_auto] gap-2">
						<div class="card p-4 rounded-tr-none space-y-2">
							<header class="flex justify-between items-center">
								<small class="text-primary-500 opacity-50">nullifier {bubble.id}</small>
								<small class="opacity-50 text-primary-500">{getEpochTimestamp(bubble.epoch)}</small>
							</header>
							<p class="text-primary-500">{bubble.message}</p>
						</div>
					</div>
				{/each}
			</section>
			<!-- Prompt -->
			<section class="border-t border-surface-500/30 p-2 !border-dashed">
				<div class="input-group input-group-divider grid-cols-[1fr_auto] rounded-container-token">
					<textarea
						bind:value={messageText}
						class="bg-transparent p-2 text-primary-400"
						name="prompt"
						id="prompt"
						placeholder="Write a message..."
						rows="1"
						on:keydown={onPromptKeydown}
					/>
					<button
						class={messageText ? 'variant-filled-primary' : 'input-group-shim'}
						on:click={sendMessage}
					>
						Send
					</button>
				</div>
			</section>
		</div>
	</div>
</section>
