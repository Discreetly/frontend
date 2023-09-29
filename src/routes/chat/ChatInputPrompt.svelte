<script lang="ts">
	import { currentSelectedRoom, rateLimitStore } from '$lib/stores';
	import { genProof } from '$lib/crypto/rlnProver';
	import type { Socket } from 'socket.io-client';
	import { getIdentity, alert, clearMessageHistory } from '$lib/utils';
	import Send from 'svelte-material-icons/Send.svelte';

	export let socket: Socket;
	export let connected: boolean;
	export let currentEpoch: number;
	export let userMessageLimit: number;
	export let messageId: number;
	export let messagesLeft: () => number;

	let messageText = '';
	let sendingMessage: boolean = false;

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
		return 'Write a message...';
	};
	$: canSendMessage = connected && !sendingMessage;

	function checkStatus(): boolean {
		if (!connected) {
			alert('NOT CONNECTED TO CHAT SERVER');
			sendingMessage = false;
			return false;
		}
		if (messageText.length < 1) {
			alert('MESSAGE IS EMPTY');
			sendingMessage = false;
			return false;
		}
		if (messageText.length > 2000) {
			alert('MESSAGE IS TOO LONG');
			sendingMessage = false;
			return false;
		}
		// This is 100% thanks to Violet for spamming the chat with spaces
		if (messageText.replaceAll(' ', '') == '') {
			alert('MESSAGE IS EMPTY');
			sendingMessage = false;
			return false;
		}
		return true;
	}

	function help() {
		alert('Commands: /clear, /help');
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
	}

	function sendMessage() {
		sendingMessage = true;
		console.debug('Sending message: ', messageText);
		setTimeout(() => {
			sendingMessage = false;
		}, 2500);

		if (!checkStatus()) return;

		const identity = getIdentity();
		const room = $currentSelectedRoom;
		if (room.encrypted) {
		}
		genProof(room, messageText, identity, currentEpoch, messageId, userMessageLimit)
			.then((msg) => {
				if ($rateLimitStore[$currentSelectedRoom.roomId!.toString()].lastEpoch == currentEpoch) {
					$rateLimitStore[$currentSelectedRoom.roomId!.toString()].messagesSent++;
					console.debug(
						$rateLimitStore[$currentSelectedRoom.roomId!.toString()].messagesSent,
						'messages sent this epoch'
					);
				} else {
					$rateLimitStore[$currentSelectedRoom.roomId!.toString()].lastEpoch = currentEpoch;
					$rateLimitStore[$currentSelectedRoom.roomId!.toString()].messagesSent = 1;
					console.debug(
						$rateLimitStore[$currentSelectedRoom.roomId!.toString()].messagesSent,
						'messages sent this epoch'
					);
				}
				socket.emit('validateMessage', msg);
				console.debug('Sending message: ', msg);
				messageText = '';
				sendingMessage = false;
			})
			.catch((err) => {
				if (err.message.includes('Merkle Proof')) {
					alert(
						"Could not generate Merkle Proof. You either don't belong in the room or you don't have an updated member list."
					);
				} else {
					alert(err);
				}
				console.error('Error sending message: ', err);
				sendingMessage = false;
			});
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.key)) {
			const value = (event.currentTarget as HTMLInputElement).value;
			event.preventDefault();
			if (value.startsWith('/')) {
				processCommand(value);
			} else {
				sendMessage();
			}
		}
	}
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
			disabled={!canSendMessage}
		/>
		<button
			class:hidden={!canSendMessage}
			class={canSendMessage && messageText
				? 'border-none text-xs md:text-base variant-soft-success'
				: 'border-none text-xs md:text-base variant-soft-secondary'}
			disabled={!canSendMessage}
			on:click={sendMessage}
		>
			<Send />
		</button>
	</div>
</section>