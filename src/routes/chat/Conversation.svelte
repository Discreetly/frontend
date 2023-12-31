<script lang="ts">
	import { currentRoomMessages, roomKeyStore, roomPassStore } from '$lib/stores';
	import { getEpochFromTimestamp, getTimestampFromEpoch } from '$lib/utils/rateLimit';
	import type { MessageI } from 'discreetly-interfaces';
	import { onMount } from 'svelte';
	import BubbleText from './BubbleText.svelte';
	import { minidenticon } from 'minidenticons';
	import { bubbleBgFromSessionId } from '$lib/utils/color';
	import { decrypt, deriveKey } from '$lib/crypto/crypto';

	export let roomRateLimit: number;
	export let getKey: () => Promise<CryptoKey>;
		export let roomId: string;
	let key: CryptoKey;
	let elemChat: HTMLElement;

	$: {
		if ($currentRoomMessages) {
			try {
				scrollChatBottom('instant');
			} catch {
				console.warn('Could not scroll to bottom');
			}
		}
	}

	async function decryptText(text: string): Promise<string> {
		if (!key) {
			key = await getKey();
				const result = await decrypt(text, key);
				return result ? result : text;
		} else if (key) {
			key = await deriveKey($roomPassStore[roomId].password, roomId);
			const result = await decrypt(text, key);
			return result ? result : text;
		} else {
			return text;
		}
	}

	function scrollChatBottom(behavior: ScrollBehavior = 'smooth', delay = 20, count = 0): void {
		if (count > 10) {
			console.warn('scrollChatBottom: elemChat is not defined after multiple attempts, giving up');
			return;
		}

		setTimeout(() => {
			if (!elemChat) {
				scrollChatBottom(behavior, delay * 4, count + 1);
			} else {
				elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
			}
		}, delay);
	}

	function getTime(bubble: MessageI): string {
		let r = getTimestampFromEpoch(roomRateLimit, Number(bubble.epoch)).relative;
		if (r === 'Unknown') {
			r = getEpochFromTimestamp(roomRateLimit, Number(bubble.timeStamp)).relative;
		}
		return r;
	}

	function getAvatar(sessionID: string): string {
		return minidenticon(sessionID, 90, 60);
	}

	onMount(() => {
		scrollChatBottom('instant');
		document.addEventListener('scrollChat', (e: Event) => {
			const customEvent = e as CustomEvent;
			const behavior = customEvent.detail.behavior ? customEvent.detail.behavior : 'smooth';
			const delay = customEvent.detail.delay ? customEvent.detail.delay : 20;
			scrollChatBottom(behavior, delay);
		});
		getKey().then((k) => {
			key = k;
		});
	});
</script>

<section
	id="conversation"
	bind:this={elemChat}
	class="p-2 md:p-4 overflow-y-auto space-y-2 md:space-y-4">
	{#if $currentRoomMessages}
		{#each $currentRoomMessages as msg}
			<div class="flex flex-col items-start">
				<div
					class="card px-2 md:px-3 space-y-1 md:space-y-2 border border-surface-500/30 border-x-transparent"
					style={bubbleBgFromSessionId(msg.sessionId)}>
					<div class="pt-2 md:pt-4 flex gap-2 md:gap-3 pr-1">
						{#if msg.sessionId}
							<div
								class="flex-none w-[2.5rem] h-[2.5rem] bg-surface-500/40 rounded-full p-1"
								title={String(msg.sessionId)}>
								{@html getAvatar(msg.sessionId)}
							</div>
						{/if}
						{#key msg}
							{#await decryptText(String(msg.message))}
								<p>Decrypting...</p>
							{:then decryptedText}
								<span
									title="Encrypted Message"
									class="secure">
									<BubbleText bubbleText={decryptedText} />
								</span>
							{:catch error}
								<span
									title="Not Encrypted Message"
									class="insecure">
									<BubbleText bubbleText={String(msg.message)} />
								</span>
								<!-- You can customize this error state -->
							{/await}
						{/key}
					</div>
					<footer class="flex justify-between items-center text-xs md:text-sm pb-1">
						<small
							class="opacity-50 text-surface-600-300-token mr-2 md:mr-4"
							title={String(msg.timeStamp)}>{getTime(msg)}</small>
						{#if msg.epoch}
							<small
								class="hidden md:block opacity-50 text-surface-500-400-token"
								title={JSON.stringify(msg.proof)}>
								epoch: {msg.epoch}
							</small>
						{:else}
							<small class="hidden md:block opacity-70 text-error-500-400-token">
								SYSTEM MESSAGE
							</small>
						{/if}
					</footer>
				</div>
			</div>
		{/each}
	{/if}
</section>

<style>
	#conversation {
		overflow: scroll;
	}

	.secure {
		display: flex;
		flex-direction: row;
		align-self: center;
	}
</style>
