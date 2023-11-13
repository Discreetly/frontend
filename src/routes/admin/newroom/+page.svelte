<script lang="ts">
	import { createRoom } from '$lib/services/server';
	import { getCommitment, getIdentity } from '$lib/utils';
	import { selectedServer, configStore, alertQueue } from '$lib/stores';
	import { Stepper } from '@skeletonlabs/skeleton';
	import RoomName from './1_RoomName.svelte';
	import MembershipType from './2_MembershipType.svelte';
	import RateLimit from './3_RateLimit.svelte';
	import MessageLimit from './4_MessageLimit.svelte';
	import ClaimCodes from './5_ClaimCodes.svelte';
	import type { RoomFormData } from '$lib/types';

	let formData: RoomFormData = {
		roomName: '',
		membershipType: 'IDENTITY_LIST',
		rateLimit: 10,
		messageLimit: 3,
		claimCodes: 0,
		roomType: 'PUBLIC',
		bandadaAddress: undefined,
		bandadaGroupId: undefined,
		bandadaApiKey: undefined
	};

	let createdCodes: string[] | undefined = [];
	let submitted = false;

	function handleSubmit(): void {
		const idc = getCommitment();
		if (idc) {
			createRoom(
				$selectedServer,
				formData.roomName,
				$configStore.apiUsername as string,
				$configStore.apiPassword as string,
				formData.rateLimit * 1000,
				formData.messageLimit,
				formData.claimCodes,
				[idc],
				formData.membershipType,
				formData.roomType,
				formData.bandadaAddress,
				formData.bandadaGroupId,
				formData.bandadaApiKey
			).then((res) => {
				console.debug(res);
				submitted = true;
				createdCodes = res.claimCodes;
				console.info(createdCodes);
			});
		} else {
			alertQueue.enqueue('You must create an identity before creating a room', 'error');
		}
	}
</script>

<div class="grid grid-flow-rows gap-7 my-5 max-w-md mx-auto">
	<h1 class="text-3xl text-center">Create a Room</h1>
	<Stepper
		class="max-w-sm sm:max-w-md md:max-w-3xl mx-auto mt-16"
		on:complete={() => {
			handleSubmit();
		}}
		buttonNext="variant-filled-surface-50-900-token"
		buttonComplete="variant-filled-success">
		<RoomName {formData} />
		<MembershipType {formData} />
		<RateLimit {formData} />
		<MessageLimit {formData} />
		<ClaimCodes {formData} />
	</Stepper>
	{#if submitted && createdCodes}
		<div class="grid grid-flow-rows gap-7 my-5 max-w-md mx-auto">
			<h1 class="text-3xl text-center">Your Room Codes</h1>
			<div class="grid grid-flow-rows gap-7 my-5 max-w-md mx-auto">
				{#each createdCodes as code}
					<div class="grid grid-flow-rows gap-7 my-5 max-w-md mx-auto">
						<i class="text-center">https://app.discreetly.chat/signup/{Object.values(code)}</i>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
