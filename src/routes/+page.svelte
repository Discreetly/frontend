<script lang="ts">
	import Welcome from '$lib/components/Onboarding/Welcome.svelte';

	console.info(
		'I see you are checking out the logs, let us know what you think on our discord: https://discord.gg/brJQ36KVxk'
	);
</script>

<div class="mx-5 lg:mx-auto mt-10 max-w-[80ch]">
	<h2 class="h2 mb-5">Welcome to Discreetly!</h2>
	<Welcome />
	<slot />
</div>
