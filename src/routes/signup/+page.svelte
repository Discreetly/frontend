<script lang="ts">
	import { identityStore, configStore, consoleStore } from '$lib/stores';
	import { createIdentity } from '$lib/utils/';
	import { onMount } from 'svelte';
	import ArrowRight from 'svelte-material-icons/ArrowRightBold.svelte';
	import Text from 'svelte-material-icons/TextBox.svelte';
	import Account from 'svelte-material-icons/AccountHardHat.svelte';
	import { inviteCode } from '$lib/utils/inviteCode';
	import { addConsoleMessage } from '$lib/utils/console';
	import Console from '../console/Console.svelte';
	$: identityExists = !!$identityStore._commitment;
	// index of console messages that is awaiting a response
	function identity() {
		const idStatus = createIdentity();
		if (idStatus === 'created') {
			addConsoleMessage('Identity Generated 🎉');
		} else if (idStatus == 'exists') {
			addConsoleMessage('Identity Exists Already ✅');
		} else {
			addConsoleMessage('Error Creating Identity ❌', 'error');
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
		if (identityExists) {
			addConsoleMessage('Identity Exists Already ✅');
		} else {
			addConsoleMessage('Creating Identity...');
			identity();
		}

		code();
	});
</script>

<Console placeholder="/join invite-code-goes-here" />
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
