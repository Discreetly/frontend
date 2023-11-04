<script lang="ts">
	export let heading = '';
</script>

<div class="px-2 sm:px-3 my-2 md:my-3 overflow-scroll h-100">
	{#if heading.length > 0}
		<h2 class="h2 my-2 md:my-3 text-center">{heading}</h2>
	{/if}
	<slot name="header" />
	<div class="flex flex-col gap-2 md:gap-5 w-full mx-auto px-2 md:px-10 pb-3">
		<slot />
	</div>
</div>
