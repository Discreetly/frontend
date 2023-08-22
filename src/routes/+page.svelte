<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import { identityStore } from '$lib/stores';
	$: identityExists = !!$identityStore._commitment;
</script>

<div class="mx-auto mt-10 max-w-[80ch]">
	<h2 class="h2 mb-5">Welcome to Discreetly!</h2>
	{#if !identityExists}
		<p class="mb-5">
			If you have an <code class="code">invite code</code> head over to the <Button
				link="/signup"
				cls="variant-ghost-secondary"
				size="sm">Sign Up</Button
			>
		</p>
		<p>
			Or if you want to request an invite code, join our <Button
				link="https://discord.gg/brJQ36KVxk"
				cls="variant-ghost-tertiary"
				size="sm">Discord</Button
			>
		</p>
	{:else}
		<Button link="/chat" cls="variant-ghost-success" size="sm">Go Chat</Button>
	{/if}
	<slot />
</div>
