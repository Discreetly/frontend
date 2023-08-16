<script lang="ts">
	import { identityStore } from '$lib/stores';
	import Loading from '$lib/components/loading.svelte';
	import QRCode from 'qrcode';
	import type { Identity } from '@semaphore-protocol/identity';

	let loading: boolean = false;
	let imageUrl: string | undefined = undefined;

	function getIdentityBackup() {
		const idBackup = $identityStore.identity as Identity;
		return idBackup.toString();
	}

	function generateQR() {
		loading = true;
		const opts = {
			type: 'image/jpeg',
			errorCorrectionLevel: 'M',
			mode: 'Alphanumeric',
			color: {
				dark: '#202626',
				light: '#ffffff'
			}
		};

		QRCode.toDataURL(getIdentityBackup(), opts).then((response) => {
			imageUrl = response;
		});
		setTimeout(() => {
			imageUrl = undefined;
			loading = false;
		}, 15000);
	}
</script>

<h4 class="h4">Backup Your Identity</h4>
<a
	class="btn variant-ghost-success"
	href={'data:text/json;charset=utf-8,' + encodeURIComponent(getIdentityBackup())}
	download="identity.json">JSON</a
>
<a class="btn variant-ghost-success" on:click={generateQR}>QR Code</a>

{#if loading && !imageUrl}
	<Loading />
{:else}
	<img src={imageUrl} class="mx-auto" />
{/if}
