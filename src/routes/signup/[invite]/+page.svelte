<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { configStore, identityExists } from '$lib/stores';
	import { onMount } from 'svelte';

	$configStore.signUpStatus.inviteCode = $page.params.invite;
	console.log(`Invited with code: ${$page.params.invite}`);

	onMount(() => {
		if ($identityExists) {
			console.warn('Invite code saved, routing to /gateways from /signup/[inviteCode]');
			goto('/gateways');
		} else {
			console.warn('Identity not detected, redirecting to signup page from /signup/[inviteCode]');
			goto('/signup');
		}
	});
</script>
