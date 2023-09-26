<script lang="ts">
	import Introduction from './1_Introduction.svelte';
	import IdentityGeneration from './2_IdentityGeneration.svelte';
	import Join from './3_Join.svelte';
	import Backup from './4_Backup.svelte';
	import { configStore } from '$lib/stores';
	import Loading from '$lib/components/loading.svelte';
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { IdentityStoreE } from '$lib/types';
</script>

<div class="h-100 mx-2 md:mx-4">
	<Stepper
		class="max-w-sm sm:max-w-md md:max-w-3xl mx-auto mt-16"
		on:complete={() => {
			goto('/chat');
		}}
		buttonNext="variant-filled-surface-50-900-token"
		buttonComplete="variant-filled-success"
	>
		<Step>
			<svelte:fragment slot="header"
				><div class="h3 text-center">About Discreetly</div></svelte:fragment
			>
			<Introduction />
			<svelte:fragment slot="navigation" />
		</Step>
		<Step locked={!($configStore.identityStore == IdentityStoreE.NO_IDENTITY)}>
			<svelte:fragment slot="header"
				><div class="h3 text-center">Create Identity</div></svelte:fragment
			>
			<IdentityGeneration />
		</Step>
		<Step locked={!$configStore.signUpStatus.inviteAccepted}>
			<svelte:fragment slot="header"
				><div class="h3 text-center">Join Communities</div></svelte:fragment
			>
			<Join />
		</Step>
		<Step>
			<svelte:fragment slot="header"
				><div class="h3 text-center">Backup your identity</div></svelte:fragment
			>
			<Backup />
		</Step>
	</Stepper>
	<slot>
		<Loading />
	</slot>
</div>
