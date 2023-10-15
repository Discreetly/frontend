<script lang="ts">
	import { configStore, identityExists } from '$lib/stores';
	import { onMount } from 'svelte';
	import ArrowRight from 'svelte-material-icons/ArrowRightBold.svelte';
	import Text from 'svelte-material-icons/TextBox.svelte';
	import Account from 'svelte-material-icons/AccountHardHat.svelte';
	import { inviteCode } from '$lib/gateways/inviteCode';
	import { addConsoleMessage } from '$lib/utils/console';

	function checkForIdentity() {
		const idStatus = $identityExists;
		if (idStatus === 'safe') {
			addConsoleMessage('✅ Identity Found');
		} else if (idStatus === 'encrypted') {
			addConsoleMessage('⚠️ Identity Found, but it is encrypted');
		} else if (idStatus === 'unsafe') {
			addConsoleMessage('⚠️ Identity Found, but it is unsafe');
		} else if (idStatus === null) {
			addConsoleMessage('❌ No Identity Found');
		}
	}

	async function code() {
		if (!$configStore.signUpStatus.inviteCode) {
			addConsoleMessage(
				'No Invite Code Provided ❌ please use `/join INVITE-CODE` to join via invite code',
				'warning'
			);
		} else {
			let { acceptedRoomNames, err } = await inviteCode($configStore.signUpStatus.inviteCode);
			if (acceptedRoomNames) {
				addConsoleMessage('Invite Code Accepted 🎉');
				acceptedRoomNames.forEach((roomName) => {
					addConsoleMessage(`Joined Room: ${roomName}`);
				});
			}
			if (err) {
				addConsoleMessage(`Invite Code Error: ${err}`, 'error');
			}
		}
	}

	onMount(() => {
		checkForIdentity();
		code();
	});
</script>

<div>
	<a href="/settings" class="btn btn-sm variant-ghost-primary">
		<span>Restore Identity</span>
		<Account />
	</a>
	<a href="/about" class="btn btn-sm variant-ghost-secondary ms-2 mt-2">
		<span>Read More</span>
		<Text />
	</a>
	<a href="/chat" class="btn btn-sm variant-ghost-success ms-2 mt-2">
		<span>Continue</span>
		<ArrowRight />
	</a>
</div>
