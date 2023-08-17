<script lang="ts">
	import { identityStore, configStore } from '$lib/stores';
</script>

<div class="grid place-content-center">
	<a
		class="btn variant-ghost-success"
		href={'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify($identityStore))}
		download="identity.json"
		on:click={() => ($configStore.signUpStatus.identityBackedUp = true)}>JSON</a
	>
</div>
