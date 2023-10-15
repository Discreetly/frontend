<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import EthereumWallet from '$lib/components/Gateways/EthereumWallet.svelte';
	import InviteCodeGateway from '$lib/components/Gateways/InviteCode.svelte';
	import SelectServer from '$lib/components/SelectServer.svelte';
	import Card from '$lib/components/card.svelte';
	import { configStore } from '$lib/stores';
</script>

<Container heading="Join More Communities">
	<div class="variant-ghost-success p-4 rounded-token">
		<h3 class="h4">Select Server, or add a new Server:</h3>
		<SelectServer />
	</div>
	<div class="flex flex-row flex-wrap gap-5 justify-evenly">
		<Card>
			<svelte:fragment slot="header">Join via invite code:</svelte:fragment>
			<svelte:fragment slot="description"
				>If you were given an invite code, you can
			</svelte:fragment>
			<InviteCodeGateway code={$configStore.signUpStatus.inviteCode} />
		</Card>
		<Card>
			<svelte:fragment slot="header">Discord Bot</svelte:fragment>
			<svelte:fragment slot="description"
				>Add the discord bot to your server Today!
			</svelte:fragment>
			<a
				href="https://discord.com/api/oauth2/authorize?client_id=1142162852132700200&permissions=2147483648&scope=bot"
				class="btn variant-ghost-primary">Invite Discord Bot!</a
			>
		</Card>
		<Card>
			<svelte:fragment slot="header">Join via Jubmojii:</svelte:fragment>
			<svelte:fragment slot="description">Coming Soon!</svelte:fragment>
		</Card>
		<Card>
			<svelte:fragment slot="header">Join via Ethereum Address:</svelte:fragment>
			<svelte:fragment slot="description"
				>Are you a genesis validator, daohack survivor, nouns holder? You can join using your
				Ethereum address.
			</svelte:fragment>
			<EthereumWallet />
		</Card>
	</div>
</Container>
