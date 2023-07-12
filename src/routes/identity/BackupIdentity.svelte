<script lang="ts">
	import { identityStore } from '$lib/stores';
</script>

<h4 class="h4">Backup Your Identity</h4>
<a
	class="btn variant-ghost-success"
	href={'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify($identityStore))}
	download="identity.json">JSON</a
>
