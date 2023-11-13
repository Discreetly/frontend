<script lang="ts">
	import { alertQueue } from '$lib/stores';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import Loading from '../Utils/Loading.svelte';
	import { theWordRequest } from '$lib/gateways/theWord';
	let files: FileList;
	let loading = false;
	let acceptedRoomNames: string[] = [];

	function theWordHandler(proof: any) {
		loading = true;
		theWordRequest(proof)
			.then((acceptedRoomNames) => {
				if (acceptedRoomNames) {
					acceptedRoomNames = acceptedRoomNames;
				}
			})
			.catch((err) => {
				console.warn(err);
				alertQueue.enqueue(`Unexpected error: ${err.message}`, 'error');
			})
			.finally(() => {
				loading = false;
			});
	}

	function onChangeHandler(e: Event): void {
		const f = files.item(0);
		console.debug(`Proof File type detected as ${f?.type}`);
		let unverifiedData: any;
		if (!f) {
			alertQueue.enqueue('No file selected', 'warning');
			return;
		}
		if (f.type == 'application/json' || f.type == 'text/plain') {
			f.text().then((text) => {
				unverifiedData = JSON.parse(text);
				theWordHandler(unverifiedData);
			});
		} else {
			alertQueue.enqueue(
				'Invalid file type, must be a JSON object in the SNARKProof format',
				'warning'
			);
			console.warn('Invalid file type');
		}
	}
</script>

<div class="flex flex-col gap-3 justify-between">
	<section class="px-4 pt-4">
		<label class="label w-full pb-1">
			<span class="h5"> Prove From File:</span>
			<FileDropzone
				class="px-2"
				name="the-word-proof.json"
				bind:files
				on:change={onChangeHandler} /></label>
	</section>
	{#if loading}
		<Loading />
	{/if}
	{#if acceptedRoomNames.length > 0}
		<p class="text-center mt-2">You've been added to:</p>
		<div class="my-2">
			{#each acceptedRoomNames as name}
				<ins class="ins border-y border-success-800">{name}</ins>
			{/each}
		</div>
	{/if}
</div>
