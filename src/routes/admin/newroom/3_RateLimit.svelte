<script lang="ts">
	import type { RoomFormData } from '$lib/types';
	import { Step } from '@skeletonlabs/skeleton';

	export let formData: RoomFormData;
</script>

<Step locked={formData.rateLimit <= 1}>
	<svelte:fragment slot="header">
		<div class="h3 text-center">Rate Limit</div>
	</svelte:fragment>
	<div class="flex flex-col justify-center w-full">
		<i>How long the epochs of the room are in seconds</i>
		<br />
		<input
			name="rateLimit"
			class="text-black"
			type="number"
			bind:value={formData.rateLimit}
		/>
	</div>
</Step>
