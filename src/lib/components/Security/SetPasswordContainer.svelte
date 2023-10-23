<script lang="ts">
	import SetPasswordInput from './SetPasswordInput.svelte';
	import Container from '../Utils/Container.svelte';
</script>

<Container heading="Set A Password">
	<p class="mt-3">
		In order to secure your identity and other sensitive data that is stored in your browser, we
		need you to set a password.
	</p>
	<p class="my-3">
		This password is only used locally, there is no username and password for your account, so don't
		forget to <a class="link" href="/settings/identity/backup" title="Backup Identity"
			>backup your identity</a
		>.
	</p>
	<SetPasswordInput />
</Container>
