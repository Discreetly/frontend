<script lang="ts">
	import InputPrompt from './ConsoleInputPrompt.svelte';
	import { consoleStore } from '$lib/stores';
	import { clearConsoleMessages } from '$lib/utils';
	import TrashCan from 'svelte-material-icons/TrashCanOutline.svelte';
	import { onMount } from 'svelte';
	let elemChat: HTMLElement;
	export let placeholder: string = 'Enter / Command';

	function scrollChatBottom(behavior?: ScrollBehavior): void {
		setTimeout(() => {
			elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
		}, 0);
	}

	onMount(() => {
		scrollChatBottom('smooth');
	});
</script>

<div class="p-4 small:p-2 h-full overflow-y-hidden grid grid-rows-[auto,1fr,auto]">
	<header class="flex flex-row justify-between px-2">
		<h6 class="h4">Console</h6>
		<button
			class="btn btn-sm variant-ghost-primary float-right"
			on:click={() => clearConsoleMessages()}
		>
			<TrashCan />
		</button>
	</header>
	<section class="p-4 overflow-y-scroll overflow-x-hidden" bind:this={elemChat}>
		{#each $consoleStore.messages as line, idx}
			<p class={line.type}>{line.message}</p>
		{/each}
	</section>
	<footer>
		<InputPrompt {placeholder} />
	</footer>
</div>

<style>
	.primary::before {
		color: rgb(var(--color-primary-500));
		content: '>';
		padding-right: 0.75rem;
	}
	.error::before {
		color: rgb(var(--color-error-500));
		content: '#';
		padding-right: 0.75rem;
	}
	.warning::before {
		color: rgb(var(--color-warning-500));
		content: '#';
		padding-right: 0.75rem;
	}
	.success::before {
		color: rgb(var(--color-success-500));
		content: '#';
		padding-right: 0.75rem;
	}
	.space::before {
		content: '#';
		color: rgb(var(--color-surface-500));
	}
</style>
