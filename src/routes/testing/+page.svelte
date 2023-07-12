<script lang="ts">
	import { messageStore, serverListStore, serverDataStore, selectedServer } from '$lib/stores';
	import { updateServers } from '$lib/utils';
	import BackupIdentity from '../identity/BackupIdentity.svelte';
	import DeleteIdentity from '../identity/DeleteIdentity.svelte';
	import RestoreIdentity from '../identity/RestoreIdentity.svelte';

	function updateServerData() {
		console.debug('UPDATING SERVERS');
		$serverDataStore = updateServers($serverListStore, $serverDataStore);
		if ($selectedServer.name == undefined) {
			$selectedServer = $serverListStore[0].url;
		}
	}

	function deleteMessages() {
		console.debug('DELETING MESSAGES');
		$messageStore = [];
	}
</script>

<div class="grid grid-cols-1 gap-5">
	<button class="btn variant-ghost-success" on:click={() => updateServerData()}
		>Update server data</button
	>
	<button class="btn variant-ghost-secondary" on:click={() => deleteMessages()}
		>Delete messages</button
	>
	<BackupIdentity />
	<RestoreIdentity />
	<DeleteIdentity />
</div>
