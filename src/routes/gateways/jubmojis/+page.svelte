<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		const encodedProof = $page.url.searchParams.get('proof');
		if (encodedProof === null) {
			console.error('No proof provided');
			goto('/gateways');
		} else {
			const p = {
				zkp: {},
				R: '',
				msghash: ''
			};
			const decodedProof = decodeURIComponent(encodedProof);
			const step1 = JSON.parse(decodedProof);
			const step2 = JSON.parse(step1.serializedMembershipProof);
			p.zkp = step1.zkp;
			p.R = step2.serializedMembershipProof.R;
			p.msghash = step2.serializedMembershipProof.msghash;
			step2.$configStore.signUpStatus.jubmojiProof = p;
		}
	});
</script>
