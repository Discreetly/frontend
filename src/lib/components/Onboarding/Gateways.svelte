<script lang="ts">
	import EthereumGroupGateway from '$lib/components/Gateways/EthereumGroup.svelte';
	import InviteCodeGateway from '$lib/components/Gateways/InviteCode.svelte';
	import TheWord from '$lib/components/Gateways/TheWord.svelte';
	import SelectServer from '$lib/components/Server/SelectServer.svelte';
	import Card from '$lib/components/Utils/Card.svelte';
	import { configStore, serverStore } from '$lib/stores';
</script>

{#if Object.keys($serverStore).length > 1}
	<div class="variant-ghost-success p-4 rounded-token">
		<h3 class="h4">Select Server, or add a new Server:</h3>
		<SelectServer />
	</div>
{/if}
<div class="mx-auto grid grid-cols-2 gap-4">
	<Card>
		<svelte:fragment slot="header">Join via invite code:</svelte:fragment>
		<svelte:fragment slot="description">If you were given an invite code, you can</svelte:fragment>
		<InviteCodeGateway code={$configStore.signUpStatus.inviteCode} />
	</Card>
	<Card>
		<svelte:fragment slot="header">Join the alpha testing room:</svelte:fragment>
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
			href="https://discord.com/api/oauth2/authorize?client_id=1142162852132700200&permissions=2147483648&scope=bot"
			class="btn variant-ghost-primary">Invite Discord Bot!</a
		>
	</Card>
	<Card>
		<svelte:fragment slot="header">Join via Jubmoji:</svelte:fragment>
		<svelte:fragment slot="description">Coming Soon!</svelte:fragment>
	</Card>
	<Card>
		<svelte:fragment slot="header">Join via Ethereum Address:</svelte:fragment>
		<svelte:fragment slot="description"
			>Are you a genesis validator? You can join using your Ethereum address.
		</svelte:fragment>
		<EthereumGroupGateway />
	</Card>
	<Card>
		<svelte:fragment slot="header">The Word</svelte:fragment>
		<svelte:fragment slot="description"
			>Do you know <a class="link" href="https://github.com/Mach-34/the-word/">the word</a>? Prove
			it.
		</svelte:fragment>
		<TheWord />
	</Card>
</div>
