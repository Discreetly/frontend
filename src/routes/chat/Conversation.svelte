<script lang="ts">
	import { currentRoomMessages } from '$lib/stores';
	import { getEpochFromTimestamp, getTimestampFromEpoch } from '$lib/utils/rateLimit';
	import type { MessageI } from 'discreetly-interfaces';
	import { onMount } from 'svelte';
	import BubbleText from './BubbleText.svelte';

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

	onMount(() => {
		scrollChatBottom('instant', 1);
	});
</script>

<section
	id="conversation"
	bind:this={elemChat}
	class="p-2 md:p-4 overflow-y-auto space-y-2 md:space-y-4"
>
	{#if $currentRoomMessages}
		{#each $currentRoomMessages as bubble}
			<div class="flex flex-col items-start">
				<div
					class="card p-2 md:p-4 space-y-1 md:space-y-2 bg-surface-100-800-token border-1 border-secondary-500/30"
				>
					<header class="flex justify-between items-center text-xs md:text-sm">
						<small class="opacity-50 text-surface-700-200-token mr-2 md:mr-4"
							>{getTime(bubble)}</small
						>
						{#if bubble.epoch}
							<small class="hidden md:block opacity-50 text-surface-700-200-token"
								>epoch: {bubble.epoch}</small
							>
						{:else}
							<small class="hidden md:block opacity-70 text-error-500-400-token"
								>SYSTEM MESSAGE</small
							>
						{/if}
					</header>
					{#key bubble}
						<BubbleText bubbleText={String(bubble.message)} />
					{/key}
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
