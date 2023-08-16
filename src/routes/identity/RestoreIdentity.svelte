<script lang="ts">
	import { identityStore } from '$lib/data/stores';
	import { Identity } from '@semaphore-protocol/identity';
	import QrScanner from 'qr-scanner';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	let files: FileList;
	let status = '';
	let hasCamera = false;

	QrScanner.hasCamera().then((result) => {
		hasCamera = result;
	});

	function restoreBackup(backup: any) {
		console.debug('Attempting restore of identity from backup file...');
		console.debug(backup);
		$identityStore.identity = new Identity(JSON.stringify(backup));
		console.log($identityStore.identity);
		console.log(
			'Identity restored from backup file with identity commitment:',
			$identityStore.identity._commitment
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
				console.debug(unverifiedBackup);
				restoreBackup(unverifiedBackup);
			});
		} else if (f.type == 'image/jpeg' || f.type == 'image/png') {
			QrScanner.scanImage(f)
				.then((result) => {
					unverifiedBackup = JSON.parse(result);
					console.debug(unverifiedBackup);
					restoreBackup(unverifiedBackup);
				})
				.catch((error) => {
					status = error || 'No QR code found.';
					console.log(error || 'No QR code found.');
				});
		} else {
			status = 'Invalid file type, must be JSON or QR code in jpeg or png.';
			console.warn('Invalid file type');
		}
	}

	function scanQR() {
		const videoDiv = document.getElementById('qr-camera');
		if (!videoDiv) return;
		const video = videoDiv.getElementsByTagName('video')[0];
		const qrScanner = new QrScanner(video, (result) => restoreBackup(JSON.parse(result.data)), {
			highlightCodeOutline: true
		});
		qrScanner.start();
		setTimeout(() => qrScanner.stop(), 30000);
	}
</script>

<h4 class="h4">Restore Your Identity</h4>
<FileDropzone name="identity.json" bind:files on:change={onChangeHandler} />
{#if hasCamera}
	<div id="qr-camera" class="flex flex-col justify-center">
		<button on:click={scanQR} class="btn variant-filled-success" type="button"
			>Scan a QR Code</button
		>
		<video />
	</div>
{/if}

<div class="">{status}</div>
