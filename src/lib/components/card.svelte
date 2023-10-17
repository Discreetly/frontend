<div class="card px-2 border-token border-surface-400-500-token pb-3">
	{#if $$slots.header}
		<header class="card-header h3 mb-2 pb-2 border-surface-400-500-token border-b">
			<slot name="header" />
		</header>
	{/if}
	{#if $$slots.description}
		<aside class="p italic px-4 pt-3"><slot name="description" /></aside>
	{/if}
	<section class="p-4"><slot /></section>
	{#if $$slots.footer}
		<footer class="card-footer"><slot name="footer" /></footer>
	{/if}
</div>
