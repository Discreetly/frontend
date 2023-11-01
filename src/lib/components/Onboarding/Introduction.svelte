<script lang="ts">
	import Card from '$lib/components/Utils/Card.svelte';
	import Button from '$lib/components/Utils/Button.svelte';
	import { identityExists } from '$lib/stores';
</script>

<Card>
	<svelte:fragment slot="header">Discreetly is an anonymous chat app</svelte:fragment>
	<p>
		<b>True Anonymity</b> <span role="img" aria-label="Shield">🛡️</span> Chat without revealing your
		identity, thanks to
		<a class="link" href="semaphore.pse.dev">Semaphore</a>.
	</p>
	<p>
		<b>Zero-Knowledge Spam Prevention</b> <span role="img" aria-label="Detective">🕵️</span> Powered
		by
		<a class="link" href="https://rate-limiting-nullifier.github.io/rln-docs/"
			>Rate Limiting Nullifier</a
		>, an anti-spam technology that ensures everyone can participate fairly.
	</p>
	<p>
		<b>Own Your Identity</b> <span role="img" aria-label="Lock">🔐</span> Be in full control of your
		anonymity. Remember to
		<i class="text-primary-500">backup your credentials</i>—once lost, they're irretrievable.
	</p>
	<p>
		<b>Community-Powered Governance</b> <span role="img" aria-label="Ballot box">🗳️</span> While you're
		anonymous, irresponsible behavior like spamming won't go unnoticed. The community can vote to take
		action.
	</p>
	<svelte:fragment slot="footer">
		{#if !$identityExists}
			<Button link="/signup" cls="variant-ghost-primary btn-sm m-2 sm:m-3">Sign Up</Button>
			<Button link="https://discord.gg/brJQ36KVxk" cls="variant-ghost-tertiary btn-sm m-2 sm:m-3"
				>Join Our Discord</Button
			>
		{:else}
			It looks like you are already signed up!
			<Button link="/chat" cls="variant-ghost-success">Go Chat</Button>
		{/if}
	</svelte:fragment>
</Card>

<style>
	p {
		margin: 1.125rem 0;
	}
	p::before {
		content: '⊙';
		margin-right: 0.55rem;
		color: rgb(var(--color-primary-500));
	}
</style>
