<script lang="ts">
	import Introduction from '$lib/components/Onboarding/Introduction.svelte';

	console.info(
		'I see you are checking out the logs, let us know what you think on our discord: https://discord.gg/brJQ36KVxk'
	);
</script>

<div class="mx-5 lg:mx-auto mt-8 md:mt-16 max-w-[80ch]">
	<h1 class="h1 mb-6 md:mb-10 text-center">Welcome to Discreetly!</h1>
	<div class="mb-5">
		<Introduction />
	</div>
</div>
