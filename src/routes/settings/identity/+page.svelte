<script>
	import Container from '../../../lib/components/Container.svelte';
	import BackupIdentity from './BackupIdentity.svelte';
	import DeleteIdentity from './DeleteIdentity.svelte';
	import RestoreIdentity from './RestoreIdentity.svelte';
</script>

<Container heading="Manage Your Identity">
	<BackupIdentity />
	<DeleteIdentity />
	<RestoreIdentity />
</Container>
