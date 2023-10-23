<script lang="ts">
	import { alertQueue, identityKeyStore, lockStateStore } from '$lib/stores';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import { poseidon2 } from 'poseidon-lite/poseidon2';
	import { poseidon1 } from 'poseidon-lite/poseidon1';
	import { onMount } from 'svelte';
	let files: FileList;

	function restoreBackup(backup: any) {
		console.debug('Attempting restore of identity from backup file...');
		let id;
		try {
			id = JSON.parse(backup);
		} catch (e) {
			console.warn('Could not parse json as string');
			try {
				id = backup;
			} catch (e) {
				console.warn('Could not parse json as object');
				alertQueue.enqueue('Invalid JSON detected', 'warning');
				return;
			}
		}
		if (!id._nullifier) {
			alertQueue.enqueue("_nullifier doesn't exist in backup", 'error');
		}
		if (!id._trapdoor) {
			alertQueue.enqueue("_trapdoor doesn't exist in backup", 'error');
		}
		if (!id._secret) {
			alertQueue.enqueue("_secret doesn't exist in backup", 'error');
		}
		const checkSecret = poseidon2([id._nullifier, id._trapdoor]);
		if (checkSecret != id._secret) {
			alertQueue.enqueue('Secret does not match secret from backup', 'error');
		}
		if (!id._commitment) {
			alertQueue.enqueue("_commitment doesn't exist in backup", 'error');
		}
		const checkCommitment = poseidon1([id._secret]);
		if (checkCommitment != id._commitment) {
			alertQueue.enqueue('Commitment does not match commitment backup', 'error');
		}
		if ($lockStateStore == 'unlocked') {
			$identityKeyStore = id;
			alertQueue.enqueue(
				`Identity restored from backup file with identity commitment:
			${$identityKeyStore._commitment}`
			);
		} else if ($lockStateStore == 'locked') {
			alertQueue.enqueue('Please 🔑 UNLOCK before restoring your identity', 'warning');
		} else {
			alertQueue.enqueue(
				'Please set a password using the padlock icon before restoring your identity',
				'warning'
			);
		}
	}

	function onChangeHandler(e: Event): void {
		const f = files.item(0);
		console.debug(`Backup/recovery file type detected as ${f?.type}`);
		let unverifiedBackup: any;
		if (!f) {
			alertQueue.enqueue('No file selected');
			return;
		}
		if (f.type == 'application/json' || f.type == 'text/plain') {
			f.text().then((text) => {
				unverifiedBackup = JSON.parse(text);
				restoreBackup(unverifiedBackup);
			});
		} else {
			alertQueue.enqueue(
				'Invalid file type, must be a JSON object with the _nullifier, _trapdoor, _secret, and _commitment as stringified bigints'
			);
			console.warn('Invalid file type');
		}
	}

	function recoverFromJSON() {
		const textBox = document.getElementById('jsonRecovery') as HTMLInputElement;
		const json = textBox.value;
		if (!json || json == '') {
			alertQueue.enqueue('No JSON detected');
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
				class="mb-2 p-2 rounded-token max-h-24"
				cols="30"
				rows="10"
				placeholder="Paste your Identity Here"
			/></label
		>
		<a class="btn btn-sm variant-ringed-success mb-5" on:click={recoverFromJSON}>Recover</a>
	</section>
</div>
