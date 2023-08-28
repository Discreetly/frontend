<script lang="ts">
	import { getIdentityBackup } from '$lib/utils/';
	let revealIdentity = false;
	let id = '';
	function reveal() {
		id = getIdentityBackup();
		if (revealIdentity == false) {
			revealIdentity = true;
			setTimeout(() => {
				revealIdentity = false;
				id = '';
			}, 60000);
		} else {
			revealIdentity = false;
		}
	}
</script>

<div class="card variant-ghost-secondary">
	<header class="card-header">
		<h4 class="h4">Backup Your Identity</h4>
	</header>
	<section class="px-4 pt-4 mb-5">
		<div class="m-2 sm:m-3 flex flex-col gap-4">
			<a
				class="btn variant-ghost-success"
				href={'data:text/json;charset=utf-8,' +
					encodeURIComponent(JSON.stringify(getIdentityBackup()))}
				download="identity.json">Download Identity Backup as JSON</a
			>
			{#if !revealIdentity}
				<div class="btn variant-ghost-success" on:click={reveal}>Show Identity</div>
			{:else}
				<div class="btn variant-ghost-success" on:click={reveal}>Hide Identity</div>
				<div id="reveleadIdentity" class="text-sm p-2 sm:p-4 bg-error-300-600-token max-w-sm">
					Identity:{id}
				</div>
			{/if}
		</div>
	</section>
</div>

<style>
	#reveleadIdentity {
		overflow-wrap: break-word;
	}
</style>
