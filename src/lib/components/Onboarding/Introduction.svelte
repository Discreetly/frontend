<script lang="ts">
	import Card from '$lib/components/Utils/Card.svelte';
	import { configStore } from '$lib/stores';
</script>

<Card>
	<svelte:fragment slot="header">Discreetly is an anonymous chat app</svelte:fragment>
	{#if $configStore.beta}
		<i>Dance like no one is watching, and encrypt like everyone is.</i>
	{/if}

	<p>
		<b>True Anonymity</b>
		<span
			role="img"
			aria-label="Shield">🛡️</span
		>
		Chat without revealing your identity, thanks to
		<a
			class="link"
			href="semaphore.pse.dev">Semaphore</a
		>.
	</p>
	<p>
		<b>Zero-Knowledge Spam Prevention</b>
		<span
			role="img"
			aria-label="Detective">🕵️</span
		>
		Powered by
		<a
			class="link"
			href="https://rate-limiting-nullifier.github.io/rln-docs/">Rate Limiting Nullifier</a
		>, an anti-spam technology that ensures everyone can participate fairly.
	</p>
	<p>
		<b>Own Your Identity</b>
		<span
			role="img"
			aria-label="Lock">🔐</span
		>
		Be in full control of your anonymity. Remember to
		<i class="text-primary-500">backup your credentials</i>—once lost, they're irretrievable.
	</p>
	<p>
		<b>Gated Communities</b>
		<span
			role="img"
			aria-label="Lock">🔏</span
		> Most communities can only be joined once, use it wisely.
	</p>
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
