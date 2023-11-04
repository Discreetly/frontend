<script lang="ts">
	import { page } from '$app/stores';

	const encodedProof = $page.url.searchParams.get('proof')
	const decodedProof = decodeURIComponent(encodedProof)
	const proof = JSON.parse(decodedProof)
	proof.serializedMembershipProof = JSON.parse(proof.serializedMembershipProof)
	console.log(proof)
</script>
