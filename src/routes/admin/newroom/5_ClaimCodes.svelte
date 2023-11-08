<script lang="ts">
	import type { RoomFormData } from '$lib/types';
	import { Step } from '@skeletonlabs/skeleton';

	export let formData: RoomFormData;
</script>

<Step locked={formData.claimCodes < 0}>
	<svelte:fragment slot="header">
		<div class="h3 text-center">Number of Claim Codes for {formData.roomName}</div>
	</svelte:fragment>
	<div class="flex flex-col justify-center w-full">
		<i class="text-center">Number of claim codes to create for {formData.roomName}</i>
		<br />
		<input
			name="claimCodes"
			class="text-black"
			type="number"
			bind:value={formData.claimCodes}
		/>
	</div>
</Step>
