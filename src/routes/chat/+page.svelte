<script>
	import ChatRoom from './ChatRoom.svelte';
	import Sidebar from './Sidebar.svelte';
</script>

<section
	id="chat-wrapper"
	class="bg-surface-50-900-token">
	<Sidebar />
	<ChatRoom />
</section>

<style>
	#chat-wrapper {
		height: 100%;
		max-height: calc(100vh - var(--header-height));
		display: grid;
		grid-template-columns: minmax(250px, 17%) 1fr;
		grid-template-rows: auto;
		grid-template-areas: 'sidebar chat';
	}
	@media (max-width: 768px) {
		#chat-wrapper {
			grid-template-columns: 1fr;
			grid-template-areas: 'chat';
		}
	}
</style>
