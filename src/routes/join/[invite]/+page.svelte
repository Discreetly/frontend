<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { configStore, identityExists } from '$lib/stores';
	import { onMount } from 'svelte';

	$configStore.signUpStatus.inviteCode = $page.params.invite;
	console.log(`Invited with code: ${$page.params.invite}`);

	onMount(() => {
		if ($identityExists) {
			goto('/settings#join-more');
		} else {
			goto('/signup');
		}
	});
</script>
