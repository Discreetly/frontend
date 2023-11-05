<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { configStore, identityExists } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		const encodedProof = $page.url.searchParams.get('proof');
		if (encodedProof === null) {
			console.error('No proof provided');
			goto('/gateways');
		} else {
			const decodedProof = decodeURIComponent(encodedProof);
			const stage1 = JSON.parse(decodedProof);
			const stage2 = JSON.parse(stage1.serializedMembershipProof);
			$configStore.signUpStatus.jubmojiProof = stage2;

			if ($identityExists) {
				goto('/gateways');
			} else {
				goto('/signup');
			}
		}
	});
</script>
