<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import { identityStore } from '$lib/stores';
	$: identityExists = !!$identityStore._commitment;
</script>

<div class="mx-5 lg:mx-auto mt-10 max-w-[80ch]">
	<h2 class="h2 mb-5">Welcome to Discreetly!</h2>
	{#if !identityExists}
		<p class="card py-2 px-4 md:px-5 mb-3">
			If you have an <code class="code">invite code</code> head over to the <Button
				link="/signup"
				cls="variant-ghost-secondary m-2 sm:m-3"
				size="sm">Sign Up</Button
			>
		</p>
		<p class="card py-2 px-4 md:px-5">
			Or if you want to request an invite code, join our <Button
				link="https://discord.gg/brJQ36KVxk"
				cls="variant-ghost-tertiary m-2 sm:m-3"
				size="sm">Discord</Button
			>
		</p>
	{:else}
		<Button link="/chat" cls="variant-ghost-success" size="sm">Go Chat</Button>
	{/if}
	<slot />
</div>
