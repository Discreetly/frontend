<script lang="ts">
	import Group from 'svelte-material-icons/AccountGroup.svelte';
	import MemberSecret from 'svelte-material-icons/AccountKey.svelte';
	import FingerPrint from 'svelte-material-icons/Fingerprint.svelte';
	import OneToMany from 'svelte-material-icons/RelationOneToMany.svelte';
	import Card from '../Utils/Card.svelte';
</script>

<Card>
	<svelte:fragment slot="header">RLN Simplified</svelte:fragment>
	<div
		id="explainer"
		class="flex flex-col gap-3"
	>
		<div class="flex flex-col">
			<figure class="flex flex-row"><OneToMany /></figure>
			<p>I can prove to you that</p>
		</div>
		<div class="flex flex-col">
			<figure class="flex flex-row">
				<FingerPrint />
				<div class="flex flex-row gap-1">(<MemberSecret />)</div>
			</figure>
			<p>I know some secret whose fingerprint</p>
		</div>

		<div class="flex flex-col">
			<figure class="flex flex-row">∈</figure>
			<p>is in</p>
		</div>

		<div class="flex flex-col">
			<figure class="flex flex-row"><Group /></figure>
			<p>Some Group of fingerprints</p>
		</div>

		<div class="flex flex-col">
			<p>and</p>
		</div>
	</div>
	<svelte:fragment slot="footer">
		<p>
			RLN (Rate-Limiting Nullifier) is a zk-gadget/protocol that enables spam prevention mechanism
			for anonymous environments
		</p>
		<p class="my-3">
			Read more about <a
				class="anchor"
				href="https://rate-limiting-nullifier.github.io/rln-docs/">RLN</a
			>.
		</p>
	</svelte:fragment>
</Card>

<style>
	div {
		@apply place-items-center;
	}

	#explainer figure {
		@apply place-items-center;
		@apply text-2xl;
	}
	#explainer p {
		@apply text-center;
		@apply italic;
		@apply uppercase;
	}
</style>
