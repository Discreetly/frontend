<script lang="ts">
	import SelectRoom from '../../lib/components/SelectRoom.svelte';
	import SelectServer from '$lib/components/SelectServer.svelte';
</script>

<div id="sidebar" class="hidden sm:grid grid-rows-[auto_1fr_auto] border-r border-surface-500/30">
	<!-- Header -->
	<header class="border-b border-surface-500/30 p-4">
		<SelectServer />
	</header>
	<!-- List -->
	<div class="p-4 space-y-4 overflow-y-auto">
		<SelectRoom />
	</div>
	<!-- Footer -->
	<!-- <footer class="border-t border-surface-500/30 p-4">(footer)</footer> -->
</div>

<style>
	#sidebar {
		grid-area: sidebar;
	}
</style>
