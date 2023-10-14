<script>
	import { page } from '$app/stores';
	import { error } from '@sveltejs/kit';
</script>

<div class="m-3 sm:my-8 max-w-xl mx-auto">
	<h1 class="h3 my-3 sm:my-5">Error {$page.status}: {$page.error?.message}</h1>
	<p class="p mb-5">error: {error}</p>
	<p class="p">page store: {JSON.stringify($page)}</p>
	<a href="/" class="btn variant-filled-success mt-5" title="homepage">Take Me Home</a>
</div>
