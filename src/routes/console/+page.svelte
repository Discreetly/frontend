<script lang="ts">
	import InputPrompt from './ConsoleInputPrompt.svelte';
	import { consoleStore } from '$lib/stores';
	import { clearConsoleMessages } from '$lib/utils';
	import TrashCan from 'svelte-material-icons/TrashCanOutline.svelte';
</script>

<div class="mx-3 my-2">
	<div class="card variant-ghost-surface">
		<header class="card-header">
			<button
				class="btn btn-sm variant-ghost-primary float-right"
				on:click={() => clearConsoleMessages()}
			>
				<TrashCan />
			</button>
		</header>
		<section class="p-4">
			{#each $consoleStore.messages as line, idx}
				<p class={line.type}>{line.message}</p>
			{/each}
		</section>
		<footer class="card-footer">
			<InputPrompt />
		</footer>
	</div>
</div>

<style>
	.userinput::before {
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
	.info::before {
		color: rgb(var(--color-success-500));
		content: '#';
		padding-right: 0.75rem;
	}
</style>
