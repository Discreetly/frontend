<script lang="ts">
	import Join from '$lib/components/Join.svelte';
	import { configStore } from '$lib/stores';
</script>

<Join code={$configStore.signUpStatus.inviteCode} />
