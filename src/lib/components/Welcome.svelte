<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import { identityExists } from '$lib/stores';
</script>

{#if !$identityExists}
	<p class="card py-2 px-4 md:px-5 mb-3">
		If you have an <code class="code">invite code</code> head over to the <Button
			link="/signup"
			cls="variant-ghost-primary btn-sm m-2 sm:m-3">Sign Up</Button
		>
	</p>
	<p class="card py-2 px-4 md:px-5">
		Or if you want to request an invite code, join our <Button
			link="https://discord.gg/brJQ36KVxk"
			cls="variant-ghost-tertiary btn-sm m-2 sm:m-3">Discord</Button
		>
	</p>
{:else}
	<p>
		It looks like you are already signed up!
		<Button link="/chat" cls="variant-ghost-success">Go Chat</Button>
	</p>
{/if}
