<script lang="ts">
	import {
		currentSelectedRoom,
		rateLimitStore,
		alertQueue,
		identityExists,
		configStore
	} from '$lib/stores';
	import { genProof } from '$lib/crypto/rlnProver';
	import type { Socket } from 'socket.io-client';
	import { getIdentity, clearMessageHistory } from '$lib/utils';
	import Send from 'svelte-material-icons/Send.svelte';
	import { encrypt } from '$lib/crypto/crypto';
	import { onMount } from 'svelte';

	export let socket: Socket;
	export let connected: boolean;
	export let currentEpoch: number;
	export let userMessageLimit: number;
	export let roomId: string;
	export let getKey: () => Promise<CryptoKey>;
	let key: CryptoKey;

	let scrollChatEvent = new CustomEvent('scrollChat', {
		detail: { behavior: 'smooth', delay: 20 }
	});

	let messageText = '';
	let sendingMessage: boolean = false;
	$: messagesLeft = () => {
		if ($rateLimitStore[roomId].lastEpoch !== currentEpoch) {
			$rateLimitStore[roomId] = {
				lastEpoch: currentEpoch,
				messagesSent: 0
			};
			return userMessageLimit;
		} else {
			return userMessageLimit - $rateLimitStore[roomId].messagesSent;
		}
	};

	$: placeholderText = () => {
		if (!connected) {
			return 'Connecting...';
		}
		if (messagesLeft() === 0) {
			return 'Please wait...Rate limit reached for this epoch';
		}
		if (sendingMessage) {
			return 'Sending...';
		}
		if ($identityExists == 'encrypted') {
			return 'Please unlock your identity to send a message';
		}
		return 'Write a message...';
	};

	$: canSendMessage =
		connected && !sendingMessage && ($identityExists == 'safe' || $identityExists == 'unsafe');

	function checkStatus(): boolean {
		if (!connected) {
			alertQueue.enqueue('NOT CONNECTED TO CHAT SERVER', 'error');
			sendingMessage = false;
			return false;
		}
		if (currentEpoch === 0) {
			alertQueue.enqueue('Epoch is 0', 'error');
			sendingMessage = false;
			return false;
		}
		if (messageText.length < 1) {
			alertQueue.enqueue('MESSAGE IS EMPTY', 'warning');
			sendingMessage = false;
			return false;
		}
		if (messageText.length > 2000) {
			alertQueue.enqueue(
				'MESSAGE IS TOO LONG, SENDING MAY FAIL UNDER NETWORK CONSTRAINED CONDITIONS',
				'warning'
			);
			sendingMessage = false;
			return false;
		}
		// This is 100% thanks to Violet for spamming the chat with spaces
		if (messageText.replaceAll(' ', '') == '') {
			alertQueue.enqueue('MESSAGE IS EMPTY', 'warning');
			sendingMessage = false;
			return false;
		}
		return true;
	}

	function help() {
		alertQueue.enqueue('Commands: /clear, /help', 'tertiary');
	}

	function processCommand(value: string) {
		const [cmd, ...args] = value.split(' ');
		switch (cmd) {
			case '/help':
				help();
				break;
			case '/clear':
				clearMessageHistory($currentSelectedRoom.roomId!.toString());
				break;
			default:
				help();
				break;
		}
		messageText = '';
	}

	// Helper function to handle encrypted room messages
	async function handleEncryptedMessage(messageText: string, roomId: string): Promise<string> {
		const encryptedMessage = await encrypt(messageText, key);
		if (encryptedMessage == null) {
			throw new Error('ENCRYPTION FAILED');
		} else {
			console.debug(encryptedMessage);
			return encryptedMessage;
		}
	}

	// Helper function to handle rate limiting
	function handleRateLimiting(currentEpoch: number, roomId: string) {
		if ($rateLimitStore[roomId].lastEpoch === currentEpoch) {
			$rateLimitStore[roomId].messagesSent++;
		} else {
			$rateLimitStore[roomId].lastEpoch = currentEpoch;
			$rateLimitStore[roomId].messagesSent = 1;
		}
		console.debug($rateLimitStore[roomId].messagesSent, 'messages sent this epoch');
	}

	async function sendMessage() {
		try {
			sendingMessage = true;
			console.debug('Sending message: ', messageText);

			if (!checkStatus()) return;

			const identity = getIdentity();
			const room = $currentSelectedRoom;

			if (!identity) {
				throw new Error('NO IDENTITY FOUND');
			}

			let messageToSend: string = messageText;

			if (room.encrypted === 'AES') {
				messageToSend = await handleEncryptedMessage(messageText, room.roomId!.toString());
			}

			const msg = await genProof(
				room,
				messageToSend,
				identity,
				currentEpoch,
				messagesLeft() - 1,
				userMessageLimit
			);

			handleRateLimiting(currentEpoch, room.roomId!.toString());
			msg.messageType = 'TEXT';

			socket.emit('validateMessage', msg);
			console.debug('Sending message: ', msg);
			messageText = '';
		} catch (err: any) {
			console.error('Error sending message: ', err);
			if (err.message.includes('Merkle Proof')) {
				alertQueue.enqueue(
					"Couldn't generate Merkle Proof. Maybe you don't belong in the room or don't have an updated member list.",
					'warning'
				);
			} else {
				alertQueue.enqueue(err as string, 'error');
			}
		} finally {
			sendingMessage = false;
			document.getElementById('prompt')?.focus();
			document.dispatchEvent(scrollChatEvent);
		}
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.key) && !event.shiftKey) {
			const value = (event.currentTarget as HTMLInputElement).value;
			event.preventDefault();
			if (value.startsWith('/')) {
				processCommand(value);
			} else {
				sendMessage();
			}
		}
	}

	onMount(() => {
		getKey().then((k) => {
			key = k;
		});
	});
</script>

<section class="border-t border-surface-500/30 p-2 md:p-4 !border-dashed">
	<div class="input-group input-group-divider grid-cols-[1fr_auto] rounded-container-token">
		<textarea
			bind:value={messageText}
			maxlength="2000"
			class=" p-1 md:p-2 text-surface-900-50-token border-none"
			class:bg-surface-300-600-token={!canSendMessage}
			class:bg-surface-200-700-token={canSendMessage}
			name="prompt"
			id="prompt"
			placeholder={placeholderText()}
			rows="1"
			on:keydown={onPromptKeydown}
			disabled={!canSendMessage} />
		<button
			class:hidden={!canSendMessage}
			class={canSendMessage && messageText
				? 'border-none text-xs md:text-base variant-soft-success'
				: 'border-none text-xs md:text-base variant-soft-secondary'}
			disabled={!canSendMessage}
			on:click={sendMessage}>
			<Send />
			{#if $configStore.beta}
				<span class="ps-1">{messagesLeft()}</span>
			{/if}
		</button>
	</div>
</section>
