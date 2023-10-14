<script lang="ts">
	import { getIdentityBackup } from '$lib/utils/';

	$: id = getIdentityBackup();
	$: identityBackupExists = id ? true : false;
	$: encodedIdentity = 'data:text/json;charset=utf-8,' + encodeURIComponent(id!);

	let revealIdentity = false;

	function reveal() {
		id = getIdentityBackup();
		if (id === undefined || id === null) {
			id = 'No Identity Backup Found';
		} else {
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
	}
</script>

<div class="m-2 sm:m-3 flex flex-col gap-4">
	{#if identityBackupExists}
		<a class="btn variant-ghost-success" href={encodedIdentity} download="Discreetly_Identity.json"
			>Download Identity Backup as JSON</a
		>
	{:else}
		<div class="text-sm text-primary-500">
			Error getting your identity backup. Please contact the developers for help.
		</div>
	{/if}

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
