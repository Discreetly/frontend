<script lang="ts">
	import { identityStore } from '$lib/stores';
	import Loading from '$lib/loading.svelte';
	import QRCode from 'qrcode';

	let loading: boolean = false;
	let imageUrl: string | undefined = undefined;

	function generateQR() {
		loading = true;
		const opts = {
			type: 'image/jpeg',
			color: {
				dark: '#ffffff',
				light: '#202626'
			}
		};
		QRCode.toDataURL(JSON.stringify($identityStore), opts).then((response) => {
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
	href={'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify($identityStore))}
	download="identity.json">JSON</a
>
<a class="btn variant-ghost-success" on:click={generateQR}>QR Code</a>

{#if loading && !imageUrl}
	<Loading />
{:else}
	<img src={imageUrl} class="mx-auto" />
{/if}
