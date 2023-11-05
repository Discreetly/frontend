<script lang="ts">
	import EthereumGroupGateway from '$lib/components/Gateways/EthereumGroup.svelte';
	import InviteCodeGateway from '$lib/components/Gateways/InviteCode.svelte';
	import TheWord from '$lib/components/Gateways/TheWord.svelte';
	import SelectServer from '$lib/components/Server/SelectServer.svelte';
	import JubmojiGateway from '$lib/components/Gateways/Jubmojis.svelte';
	import Card from '$lib/components/Utils/Card.svelte';
	import BullHorn from 'svelte-material-icons/Bullhorn.svelte';
	import { configStore, numberServers } from '$lib/stores';
</script>

{#if $numberServers > 1}
	<div class="variant-ghost-success p-4 rounded-token w-lg self-center">
		<h3 class="h4">Select Server, or add a new Server</h3>
		<SelectServer />
	</div>
{/if}
<div id="gateway-cards" class="grid">
	<Card>
		<svelte:fragment slot="header">Join via invite code</svelte:fragment>
		<svelte:fragment slot="description">If you were given an invite code, you can</svelte:fragment>
		<InviteCodeGateway code={$configStore.signUpStatus.inviteCode} />
	</Card>
	<Card>
		<svelte:fragment slot="header">Join Alpha Testers</svelte:fragment>
		<svelte:fragment slot="description"
			>Test things out, let us know if you have any issues</svelte:fragment
		>
		<InviteCodeGateway
			code={'layer-spot-gravity-fossil'}
			hideInput={true}
			buttonText="Join Alpha Testers"
		/>
	</Card>
	<Card>
		<svelte:fragment slot="header">Discord Bot</svelte:fragment>
		<svelte:fragment slot="description">Add the discord bot to your server Today!</svelte:fragment>
		<a
			target="_blank"
			href="https://discord.com/api/oauth2/authorize?client_id=1142162852132700200&permissions=2147483648&scope=bot"
			class="btn variant-ghost-primary">Invite Discord Bot!</a
		>
	</Card>
	<Card>
		<svelte:fragment slot="header">Join via Jubmoji</svelte:fragment>
		<svelte:fragment slot="description"
			>Prove your collection and get access to special rooms</svelte:fragment
		>
		<JubmojiGateway />
	</Card>
	<Card>
		<svelte:fragment slot="header">Join via Ethereum</svelte:fragment>
		<svelte:fragment slot="description"
			>Are you a genesis staker? Stateful works funder? Join the conversation!
		</svelte:fragment>
		<EthereumGroupGateway />
	</Card>
	<Card>
		<svelte:fragment slot="header"
			><span class="flex gap-3">The Word <BullHorn /></span></svelte:fragment
		>
		<svelte:fragment slot="description"
			>Do you know <a class="link" target="_blank" href="https://github.com/Mach-34/the-word/"
				>the word</a
			>? Prove it.
		</svelte:fragment>
		<TheWord />
	</Card>
</div>

<style global>
	#gateway-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 350px), 1fr));
		grid-auto-rows: auto auto auto;
		container-type: inline-size;
		gap: 0.1rem;
	}

	:global(.card) {
		display: grid;
		margin: 0.5rem;
		grid-row: span 3;
		grid-template-rows: subgrid;
	}
</style>
