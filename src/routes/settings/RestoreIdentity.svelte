<script lang="ts">
	import { identityStore } from '$lib/stores';
	import { alert } from '$lib/utils';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { poseidon2 } from 'poseidon-lite/poseidon2';
	import { poseidon1 } from 'poseidon-lite/poseidon1';
	let files: FileList;
	let status = '';

	function restoreBackup(backup: any) {
		console.debug('Attempting restore of identity from backup file...');
		console.debug(backup);
		const id = JSON.parse(backup);
		if (!id._nullifier) {
			alert("_nullifier doesn't exist in backup");
		}
		if (!id._trapdoor) {
			alert("_trapdoor doesn't exist in backup");
		}
		if (!id._secret) {
			alert("_secret doesn't exist in backup");
		}
		const checkSecret = poseidon2([id._nullifier, id._trapdoor]);
		if (checkSecret != id._secret) {
			alert('Secret does not match secret from backup');
		}
		if (!id._commitment) {
			alert("_commitment doesn't exist in backup");
		}
		const checkCommitment = poseidon1([id._secret]);
		if (checkCommitment != id._commitment) {
			alert('Commitment does not match commitment backup');
		}
		$identityStore = id;
		alert(
			`Identity restored from backup file with identity commitment:
			${$identityStore._commitment}`
		);
	}

	function onChangeHandler(e: Event): void {
		const f = files.item(0);
		console.debug(`Backup/recovery file type detected as ${f?.type}`);
		let unverifiedBackup: any;
		if (!f) {
			alert('No file selected');
			return;
		}
		if (f.type == 'application/json' || f.type == 'text/plain') {
			f.text().then((text) => {
				unverifiedBackup = JSON.parse(text);
				restoreBackup(unverifiedBackup);
			});
		} else {
			alert(
				'Invalid file type, must be a JSON object with the _nullifier, _trapdoor, _secret, and _commitment as stringified bigints'
			);
			console.warn('Invalid file type');
		}
	}
</script>

<div class="card variant-ghost-tertiary">
	<header class="card-header">
		<h3 class="h4">Restore Your Identity</h3>
	</header>
	<section class="px-4 pt-4">
		<label class="label w-full pb-1">
			<span class="h5"> Recover From File:</span>
			<FileDropzone
				class="px-2"
				name="Discreetly_Identity.json"
				bind:files
				on:change={onChangeHandler}
			/></label
		>
	</section>
	<section class="px-4 pt-4">
		<label class="label w-full pb-5 flex flex-col">
			<span class="h5"> Recover From JSON:</span>
			<textarea
				name="textarea"
				id=""
				class="mb-4 p-2 rounded-token"
				cols="30"
				rows="10"
				placeholder="Paste your Identity Here"
			/></label
		>
	</section>
</div>
