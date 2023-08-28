<script lang="ts">
	import { identityStore } from '$lib/stores';
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
			console.error("_nullifier doesn't exist in backup");
		}
		if (!id._trapdoor) {
			console.error("_trapdoor doesn't exist in backup");
		}
		if (!id._secret) {
			console.error("_secret doesn't exist in backup");
		}
		const checkSecret = poseidon2([id._nullifier, id._trapdoor]);
		if (checkSecret != id._secret) {
			console.error('Secret does not match secret from backup');
		}
		if (!id._commitment) {
			console.error("_commitment doesn't exist in backup");
		}
		const checkCommitment = poseidon1([id._secret]);
		if (checkCommitment != id._commitment) {
			console.error('Commitment does not match commitment backup');
		}
		$identityStore = id;
		console.log(
			'Identity restored from backup file with identity commitment:',
			$identityStore._commitment
		);
	}

	function onChangeHandler(e: Event): void {
		const f = files.item(0);
		console.debug(`Backup/recovery file type detected as ${f?.type}`);
		let unverifiedBackup: any;
		if (!f) {
			status = 'No file selected';
			return;
		}
		if (f.type == 'application/json' || f.type == 'text/plain') {
			f.text().then((text) => {
				unverifiedBackup = JSON.parse(text);
				restoreBackup(unverifiedBackup);
			});
		} else {
			status =
				'Invalid file type, must be a JSON object with the _nullifier, _trapdoor, _secret, and _commitment as stringified bigints';
			console.warn('Invalid file type');
		}
	}
</script>

<h4 class="h4">Restore Your Identity</h4>
<FileDropzone name="identity.json" bind:files on:change={onChangeHandler} />

<div class="">{status}</div>
