<script lang="ts">
	import { alertQueue } from '$lib/stores';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import Loading from '../Utils/Loading.svelte';
	import { theWordRequest } from '$lib/gateways/theWord';
	let files: FileList;
	let loading = false;

	function theWordHandler(proof: any) {
		loading = true;
		theWordRequest(proof)
			.then(({ acceptedRoomNames, err }) => {
				if (err && err.status === 'already-added') {
					alertQueue.enqueue('Already added to room', 'error');
				} else if (err && err.status === 'unlock') {
					alertQueue.enqueue(`Please Unlock your identity`, 'error');
				} else if (err && err.status === 'no-idc') {
					alertQueue.enqueue(`Please Create an Identity`, 'error');
				} else {
					alertQueue.enqueue(`Accepted into ${acceptedRoomNames}`, 'success');
					acceptedRoomNames = acceptedRoomNames;
				}
			})
			.catch((err) => {
				console.log(err);
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
				on:change={onChangeHandler}
			/></label
		>
	</section>
	{#if loading}
		<Loading />
	{/if}
</div>
