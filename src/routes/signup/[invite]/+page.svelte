<script lang="ts">
	import { page } from '$app/stores';
	import { configStore } from '$lib/stores';
	$configStore.signUpStatus.inviteCode = $page.params.invite;
	console.log(`Invited with code: ${$page.params.invite}`);
</script>
