<script lang="ts">
	import type { RoomFormData } from '$lib/types';
	import { Step } from '@skeletonlabs/skeleton';

	export let formData: RoomFormData;
</script>

<Step locked={formData.messageLimit <= 1}>
	<svelte:fragment slot="header">
		<div class="h3 text-center">User Message Limit</div>
	</svelte:fragment>
	<div class="flex flex-col justify-center w-full">
		<i class="text-center"
			>Number of messages a user can send in an epoch before being rate limited</i
		>
		<br />
		<input
			name="messageLimit"
			class="text-black"
			type="number"
			bind:value={formData.messageLimit}
		/>
	</div>
</Step>
