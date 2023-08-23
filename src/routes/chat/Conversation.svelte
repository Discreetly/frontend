<script lang="ts">
	import { currentRoomMessages, currentSelectedRoom } from '$lib/stores';
	import { getTimestampFromEpoch } from '$lib/utils/rateLimit';

	$: rateLimit = $currentSelectedRoom?.rateLimit!;

	let elemChat: HTMLElement;

	// For some reason, eslint thinks ScrollBehavior is undefined...
	// eslint-disable-next-line no-undef
	export function scrollChatBottom(behavior: ScrollBehavior = 'smooth'): void {
		setTimeout(() => {
			elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
		}, 1);
	}
</script>

<section
	id="conversation"
	bind:this={elemChat}
	class="p-2 md:p-4 overflow-y-auto space-y-2 md:space-y-4"
>
	{#if $currentRoomMessages}
		{#each $currentRoomMessages as bubble}
			<div class="flex flex-col items-start">
				<div class="card p-2 md:p-4 space-y-1 md:space-y-2 bg-surface-200-700-token">
					<header class="flex justify-between items-center text-xs md:text-sm">
						<small class="opacity-50 text-primary-500 mr-2 md:mr-4"
							>{getTimestampFromEpoch(Number(bubble.epoch), rateLimit).DateString}</small
						>
						<small class="hidden md:block opacity-50 text-primary-500">epoch: {bubble.epoch}</small>
					</header>
					<p class="text-primary-500">{bubble.message}</p>
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
