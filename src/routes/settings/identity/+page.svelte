<script>
	import Container from '$lib/components/Utils/Container.svelte';
	import BackupIdentity from './BackupIdentityWrapper.svelte';
	import DeleteIdentity from '$lib/components/Identity/DeleteIdentity.svelte';
	import RestoreIdentity from '$lib/components/Identity/RestoreIdentity.svelte';
</script>

<Container heading="Manage Your Identity">
	<BackupIdentity />
	<DeleteIdentity />
	<RestoreIdentity />
</Container>
