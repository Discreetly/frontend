<script lang="ts">
	import type { RoomFormData } from '$lib/types';
	import { Step } from '@skeletonlabs/skeleton';

	export let formData: RoomFormData;

	let bandadaFields = false;

	function toggleBandadaFields(e: any): void {
		if (e.target.value === 'BANDADA_GROUP') {
			bandadaFields = true;
		} else {
			bandadaFields = false;
			formData.bandadaAddress = undefined;
			formData.bandadaGroupId = undefined;
			formData.bandadaApiKey = undefined;
		}
	}
</script>

<Step
	locked={bandadaFields === true &&
		(formData.bandadaAddress === undefined ||
			formData.bandadaGroupId === undefined ||
			formData.bandadaApiKey === undefined)}
>
	<svelte:fragment slot="header">
		<div class="h3 text-center">Membership Type</div>
	</svelte:fragment>
	<div class="flex justify-center">
		<select
			name="membershipType"
			class="text-black"
			bind:value={formData.membershipType}
			on:change={toggleBandadaFields}
		>
			<option
				value="IDENTITY_LIST"
				class="text-black"
			>
				Identity List
			</option>
			<option
				value="BANDADA_GROUP"
				class="text-black"
			>
				Bandada Group
			</option>
		</select>
	</div>
	{#if bandadaFields === true}
		<div class="flex flex-col gap-5 content-center justify-items-center">
			<label for="bandadaAddress">
				Bandada Address:
				<input
					name="bandadaAddress"
					type="text"
					class="text-black"
					bind:value={formData.bandadaAddress}
				/>
			</label>
			<label for="bandadaGroup">
				Bandada Group Id:
				<input
					name="bandadaGroup"
					type="text"
					class="text-black"
					bind:value={formData.bandadaGroupId}
				/>
			</label>
			<label for="bandadaApiKey">
				Bandada Api Key:
				<input
					name="bandadaApiKey"
					type="text"
					class="text-black"
					bind:value={formData.bandadaApiKey}
				/>
			</label>
		</div>
	{/if}
</Step>
