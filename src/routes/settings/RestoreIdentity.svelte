<script lang="ts">
	import { identityKeyStore, keyStore } from '$lib/stores';
	import { alertAll } from '$lib/utils';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { poseidon2 } from 'poseidon-lite/poseidon2';
	import { poseidon1 } from 'poseidon-lite/poseidon1';
	import { onMount } from 'svelte';
	let files: FileList;

	function restoreBackup(backup: any) {
		console.debug('Attempting restore of identity from backup file...');
		console.debug(backup);
		let id;
		try {
			id = JSON.parse(backup);
		} catch (e) {
			console.warn('Could not parse json as string');
			try {
				id = backup;
			} catch (e) {
				console.warn('Could not parse json as object');
				alertAll('Invalid JSON detected');
				return;
			}
		}
		if (!id._nullifier) {
			alertAll("_nullifier doesn't exist in backup");
		}
		if (!id._trapdoor) {
			alertAll("_trapdoor doesn't exist in backup");
		}
		if (!id._secret) {
			alertAll("_secret doesn't exist in backup");
		}
		const checkSecret = poseidon2([id._nullifier, id._trapdoor]);
		if (checkSecret != id._secret) {
			alertAll('Secret does not match secret from backup');
		}
		if (!id._commitment) {
			alertAll("_commitment doesn't exist in backup");
		}
		const checkCommitment = poseidon1([id._secret]);
		if (checkCommitment != id._commitment) {
			alertAll('Commitment does not match commitment backup');
		}
		console.log('Restoring identity from backup file...');
		if ($keyStore !== undefined || $keyStore !== null) {
			$identityKeyStore = id;
		} else {
			alertAll('Please set a password or unlock before restoring your identity');
		}
		alertAll(
			`Identity restored from backup file with identity commitment:
			${$identityKeyStore._commitment}`
		);
	}

	function onChangeHandler(e: Event): void {
		const f = files.item(0);
		console.debug(`Backup/recovery file type detected as ${f?.type}`);
		let unverifiedBackup: any;
		if (!f) {
			alertAll('No file selected');
			return;
		}
		if (f.type == 'application/json' || f.type == 'text/plain') {
			f.text().then((text) => {
				unverifiedBackup = JSON.parse(text);
				restoreBackup(unverifiedBackup);
			});
		} else {
			alertAll(
				'Invalid file type, must be a JSON object with the _nullifier, _trapdoor, _secret, and _commitment as stringified bigints'
			);
			console.warn('Invalid file type');
		}
	}

	function recoverFromJSON() {
		const textBox = document.getElementById('jsonRecovery') as HTMLInputElement;
		const json = textBox.value;
		if (!json || json == '') {
			alertAll('No JSON detected');
			return;
		} else {
			restoreBackup(json);
		}
	}

	onMount(() => {});
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
				id="jsonRecovery"
				class="mb-2 p-2 rounded-token"
				cols="30"
				rows="10"
				placeholder="Paste your Identity Here"
			/></label
		>
		<a class="btn btn-sm variant-ringed-success mb-5" on:click={recoverFromJSON}>Recover</a>
	</section>
</div>
