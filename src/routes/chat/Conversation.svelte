<script lang="ts">
	import { currentRoomMessages } from '$lib/stores';
	import { getEpochFromTimestamp, getTimestampFromEpoch } from '$lib/utils/rateLimit';
	import type { MessageI } from 'discreetly-interfaces';
	import { onMount } from 'svelte';
	import BubbleText from './BubbleText.svelte';
	import { minidenticon } from 'minidenticons';
	import { bubbleBgFromSessionId, colorFromSessionId } from '$lib/utils/color';

	export let roomRateLimit: number;

	let elemChat: HTMLElement;

	// For some reason, eslint thinks ScrollBehavior is undefined...
	// eslint-disable-next-line no-undef
	export function scrollChatBottom(behavior: ScrollBehavior = 'smooth', delay = 1): void {
		setTimeout(() => {
			elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
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
		scrollChatBottom('instant', 10);
	});
</script>

<section
	id="conversation"
	bind:this={elemChat}
	class="p-2 md:p-4 overflow-y-auto space-y-2 md:space-y-4"
>
	{#if $currentRoomMessages}
		{#each $currentRoomMessages as msg}
			<div class="flex flex-col items-start">
				<div
					class="card px-2 md:px-3 space-y-1 md:space-y-2 border border-surface-500/30 border-x-transparent"
					style={bubbleBgFromSessionId(msg.sessionId)}
				>
					<div class="pt-2 md:pt-4 flex gap-2 md:gap-3 pr-1">
						{#if msg.sessionId}
							<div
								title="avatar"
								class="flex-none w-[2.5rem] h-[2.5rem] bg-surface-500/40 rounded-full p-1"
							>
								{@html getAvatar(msg.sessionId)}
							</div>
						{/if}
						{#key msg}
							<BubbleText bubbleText={String(msg.message)} />
						{/key}
					</div>
					<footer class="flex justify-between items-center text-xs md:text-sm pb-1">
						<small class="opacity-50 text-surface-600-300-token mr-2 md:mr-4">{getTime(msg)}</small>
						{#if msg.epoch}
							<small class="hidden md:block opacity-50 text-surface-500-400-token">
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
</style>
