<script lang="ts">
	import { messageStore, serverListStore, serverDataStore, selectedServer } from '$lib/stores';
	import { updateServers } from '$lib/utils';

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
	<button class="btn variant-ghost-secondary" on:click={() => deleteMessages()}
		>Delete messages</button
	>

	<button class="btn variant-ghost-secondary" on:click={() => updateServerData()}
		>Update server data</button
	>
</div>
