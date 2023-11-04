<script lang="ts">
	import { configStore } from '$lib/stores';
	import Card from '$lib/components/Utils/Card.svelte';
</script>

<Card>
	<label class="label">
		<span>Username</span>
		<input type="text" class="input" bind:value={$configStore.apiUsername} />
	</label>
	<label class="label">
		<span>Password</span>
		<input type="password" class="input" bind:value={$configStore.apiPassword} />
	</label>
</Card>
<div class="flex gap-1 justify-around">
	<a class="btn variant-filled-primary" href="/admin/newroom">Create Room</a>
	<a class="btn variant-filled-primary" href="/admin/join">Join Room</a>
	<a class="btn variant-filled-primary" href="/admin/invite">Create Invites</a>
</div>
