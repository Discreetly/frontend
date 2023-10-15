<div class="card">
	{#if $$slots.header}
		<header class="card-header h3"><slot name="header" /></header>
	{/if}
	{#if $$slots.description}
		<aside class="p italic px-4 pt-3"><slot name="description" /></aside>
	{/if}
	<section class="p-4"><slot /></section>
	{#if $$slots.footer}
		<footer class="card-footer"><slot name="footer" /></footer>
	{/if}
</div>
