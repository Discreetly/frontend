<script lang="ts">
	import SelectRoom from '$lib/components/Server/SelectRoom.svelte';
	import SelectServer from '$lib/components/Server/SelectServer.svelte';
	import { numberServers } from '$lib/stores';
</script>

<div
	id="sidebar"
	class="hidden sm:grid grid-rows-[auto_1fr_auto] border-r border-surface-500/30">
	<!-- Header -->
	{#if $numberServers > 1}
		<header class="border-b border-surface-500/30 p-1">
			<SelectServer />
		</header>
	{/if}
	<!-- List -->
	<div class="p-1 md:p-2 overflow-y-auto">
		<h6 class="h6 mx-3">Rooms</h6>
		<SelectRoom />
	</div>
	<!-- Footer -->
	<footer class="border-t border-surface-500/30 p-4">© 2023 Privacy & Scaling Explorations</footer>
</div>

<style>
	#sidebar {
		grid-area: sidebar;
		max-height: calc(100vh - var(--header-height));
	}

	@media screen and (max-width: 768px) {
		#sidebar {
			display: none;
		}
	}
</style>
