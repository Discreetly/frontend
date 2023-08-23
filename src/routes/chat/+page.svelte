<script>
	import ChatRoom from './ChatRoom.svelte';
	import Sidebar from './Sidebar.svelte';
</script>

<section id="chat-wrapper" class="bg-surface-100-800-token">
	<Sidebar />
	<ChatRoom />
</section>

<style>
	#chat-wrapper {
		height: 100%;
		display: grid;
		grid-template-columns: minmax(30%, 200px) 1fr;
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
