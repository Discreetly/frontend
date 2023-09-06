<script>
	import ChatRoom from './ChatRoom.svelte';
	import Sidebar from './Sidebar.svelte';
</script>

<section id="chat-wrapper" class="bg-surface-50-900-token">
	<Sidebar />
	<ChatRoom />
</section>

<style>
	#chat-wrapper {
		height: 100vh;
		max-height: calc(100vh - 56px);
		display: grid;
		grid-template-columns: minmax(17%, 300px) 1fr;
		grid-template-rows: auto;
		grid-template-areas: 'sidebar chat';
	}
	@media (max-width: 639px) {
		#chat-wrapper {
			grid-template-columns: 1fr;
			grid-template-areas: 'chat';
		}
	}
</style>
