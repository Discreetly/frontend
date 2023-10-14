<script lang="ts">
	import Join from '$lib/components/Join.svelte';
	import { configStore } from '$lib/stores';
</script>

<div class="card variant-ghost-tertiary">
	<header class="card-header">
		<h4 class="h4">Join More Rooms</h4>
	</header>
	<section class="p-2 mb-2">
		<Join code={$configStore.signUpStatus.inviteCode} />
	</section>
</div>
