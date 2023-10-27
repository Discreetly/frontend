<script>
	import ChatRoom from './ChatRoom.svelte';
	import Sidebar from './Sidebar.svelte';
	import { onMount } from 'svelte';
	import { updateRooms } from '$lib/utils';

	onMount(() => {
		updateRooms();
	});
</script>

<section id="chat-wrapper" class="bg-surface-50-900-token">
	<Sidebar />
	<ChatRoom />
</section>

<style>
	#chat-wrapper {
		height: 100%;
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
