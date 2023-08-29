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

<div class="m-2 sm:m-3 flex flex-col gap-4">
	<a
		class="btn variant-ghost-success"
		href={'data:text/json;charset=utf-8,' + encodeURIComponent(getIdentityBackup())}
		download="Discreetly_Identity.json">Download Identity Backup as JSON</a
	>
	{#if !revealIdentity}
		<div class="btn variant-ghost-success" on:click={reveal}>Show Identity</div>
	{:else}
		<div class="btn variant-ghost-success" on:click={reveal}>Hide Identity</div>
		<textarea id="reveleadIdentity" class="textarea text-sm" rows="9" value={id} />
	{/if}
</div>

<style>
	#reveleadIdentity {
		overflow-wrap: break-word;
	}
</style>
