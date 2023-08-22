<script lang="ts">
	import { getIdentityBackup } from '$lib/utils/';
	import Loading from '$lib/components/loading.svelte';
	import QRCode from 'qrcode';

	let loading: boolean = false;
	let imageUrl: string | undefined = undefined;

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
