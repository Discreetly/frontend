<script lang="ts">
	import { currentSelectedRoom, rateLimitStore } from '$lib/stores';
	import { genProof } from '$lib/crypto/prover';
	import type { Socket } from 'socket.io-client';
	import { getIdentity } from '$lib/utils';
	import { toastStore } from '@skeletonlabs/skeleton';

	export let socket: Socket;
	export let connected: boolean;
	export let currentEpoch: number;

	let messageText = '';
	let sendingMessage: boolean = false;
	$: if (!$rateLimitStore[$currentSelectedRoom.roomId!.toString()]) {
		$rateLimitStore[$currentSelectedRoom.roomId!.toString()] = {
			lastEpoch: currentEpoch,
			messagesSent: 0
		};
	}

	$: currentRateLimit = $rateLimitStore[$currentSelectedRoom.roomId!.toString()];
	$: userMessageLimit = $currentSelectedRoom.userMessageLimit ?? 1;
	$: messagesLeft = () => {
		if (currentRateLimit.lastEpoch !== currentEpoch) {
			currentRateLimit.lastEpoch = currentEpoch;
			currentRateLimit.messagesSent = 0;
			return userMessageLimit;
		} else {
			return userMessageLimit - currentRateLimit.messagesSent;
		}
	};
	$: messageId = userMessageLimit - messagesLeft();
	$: placeholderText = () => {
		if (!connected) {
			return 'Connecting...';
		}
		if (messagesLeft() === 0) {
			return 'Rate limit reached for this epoch';
		}
		if (sendingMessage) {
			return 'Sending...';
		}
		return 'Write a message...';
	};
	$: sendButtonText = messagesLeft() > 0 ? 'Send (' + messagesLeft() + ' left)' : 'X';
	$: canSendMessage = connected && !sendingMessage;

	function alert(alertMessage: string) {
		toastStore.trigger({ message: alertMessage, timeout: 1000 });
		console.warn(alertMessage);
	}

	function checkStatus(): boolean {
		if (!connected) {
			alert('NOT CONNECTED TO CHAT SERVER');
			sendingMessage = false;
			return false;
		}
		if (messageText.length === 0) {
			alert('MESSAGE IS EMPTY');
			sendingMessage = false;
			return false;
		}
		return true;
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
		genProof(room, messageText, identity, currentEpoch, messageId, userMessageLimit).then((msg) => {
			socket.emit('validateMessage', msg);
			console.debug('Sending message: ', msg);
			if (currentRateLimit.lastEpoch == currentEpoch) {
				currentRateLimit.messagesSent++;
			}
			messageText = '';
			sendingMessage = false;
		});
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.key)) {
			event.preventDefault();
			sendMessage();
		}
	}
</script>

<section class="border-t border-surface-500/30 p-4 !border-dashed">
	<div class="input-group input-group-divider grid-cols-[1fr_auto] rounded-container-token">
		<textarea
			bind:value={messageText}
			class="p-2 text-primary-400 border"
			class:bg-surface-900={!canSendMessage}
			class:bg-surface-500={canSendMessage}
			name="prompt"
			id="prompt"
			placeholder={placeholderText()}
			rows="1"
			on:keydown={onPromptKeydown}
			disabled={!canSendMessage}
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
