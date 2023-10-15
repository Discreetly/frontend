<script lang="ts">
	import { deriveKey, hashPassword } from '$lib/crypto/crypto';
	import {
		configStore,
		identityKeyStore,
		keyStore,
		passwordSet,
		identityExists
	} from '$lib/stores';
	import { addConsoleMessage, clearConsoleMessages, setPassword, unlockPadlock } from '$lib/utils/';
	import { inviteCode } from '$lib/gateways/inviteCode';
	import { createIdentity } from '$lib/utils/';

	export let placeholder: string = 'Enter / Command';

	function help() {
		addConsoleMessage('-----HELP-----');
		addConsoleMessage('`/clear` Clears the console');
		addConsoleMessage('`/join invite-code` Joins a room via invite code, Example:');
		addConsoleMessage('`/password Password`');
		addConsoleMessage('`/unlock Password`');
		addConsoleMessage('`/lock`');
		addConsoleMessage('`/backup`');
		addConsoleMessage('`/status`');
	}

	async function processCommand(command: string) {
		const [cmd, ...args] = command.split(' ');
		if (['/unlock', '/password'].includes(cmd)) {
			addConsoleMessage(cmd, 'userinput');
		} else {
			addConsoleMessage(command, 'userinput');
		}
		switch (cmd) {
			case '/help':
				help();
				break;
			case '/clear':
				clearConsoleMessages();
				break;
			case '/join':
				addConsoleMessage(`Attempting to join via invite code ${args[0]}`, 'warning');
				inviteCode(args[0])
					.then(({ acceptedRoomNames, err }) => {
						if (err) {
							addConsoleMessage(err, 'error');
							console.log(err.toString());
						} else {
							addConsoleMessage(`Added to: ${acceptedRoomNames.join(', ')}`);
						}
					})
					.catch((err) => {
						console.log(err);
						addConsoleMessage(err, 'error');
					});
				break;
			case '/password':
				const hashedOldPwd = await hashPassword(args[0]);
				if (hashedOldPwd === $configStore.hashedPwd) {
					const status = await setPassword(args[1]);
					if (status === 'success') {
						addConsoleMessage('Password Changed');
					} else {
						addConsoleMessage(`Error Changing Password: ${status}`, 'error');
					}
				} else if ($configStore.hashedPwd === null || $configStore.hashedPwd === undefined) {
					const status = await setPassword(args[0]);
					if (status === 'success') {
						addConsoleMessage('New Password Set');
					} else {
						addConsoleMessage(`Error Changing Password: ${status}`, 'error');
					}
				} else {
					addConsoleMessage('Invalid Old Password', 'error');
					addConsoleMessage('/password OLDPASSWORD NEWPASSWORD', 'warning');
				}
				break;
			case '/lock':
				$keyStore = null;
				addConsoleMessage('Locked!');
				break;
			case '/unlock':
				unlockPadlock(args[0]);
				break;
			case '/export':
				addConsoleMessage('Exporting Identity');
				if ($passwordSet) {
					if ($keyStore) {
						const identity = $identityKeyStore;
						if (identity) {
							addConsoleMessage(JSON.stringify(identity));
						}
					} else {
						addConsoleMessage('Please Unlock Keystore!', 'error');
					}
				} else {
					addConsoleMessage('Password not set!', 'error');
				}
				addConsoleMessage('Exporting Identity Complete');
				break;
			case '/status':
				addConsoleMessage('Identity Status');
				addConsoleMessage(`Password Set: ${$configStore.hashedPwd}`);
				addConsoleMessage(`Keystore: ${JSON.stringify($keyStore)}`);
				addConsoleMessage(`Identity: ${$identityKeyStore}`);
				break;
			case '/createIdentity':
				const idStatus = $identityExists;
				if (idStatus === 'safe') {
					addConsoleMessage('✅ Identity Exists Already');
				} else if (idStatus === 'unsafe') {
					addConsoleMessage('⚠️ Identity Unsafe! Please set a password using /password');
				} else {
					addConsoleMessage('Creating Identity...');
					const idStatus = createIdentity();
					if (idStatus === 'created') {
						addConsoleMessage('🎉 Identity Generated ');
					} else if (idStatus == 'exists') {
						addConsoleMessage('✅ Identity Exists Already');
					} else if (idStatus == 'unsafe') {
						addConsoleMessage('⚠️ Identity Unsafe! Please set a password using /password');
					} else {
						addConsoleMessage('❌ Error Creating Identity', 'error');
					}
				}
				break;
			default:
				help();
				break;
		}
	}

	function handleInput(event: KeyboardEvent) {
		if (['Enter'].includes(event.key)) {
			if ((event.currentTarget as HTMLInputElement).value) {
				const value = (event.currentTarget as HTMLInputElement).value;
				if (value.startsWith('/')) {
					processCommand(value);
				}
				(event.currentTarget as HTMLInputElement).value = '';
			}
		}
	}
</script>

<input
	id="commandInput"
	class="input py-1 px-2"
	type="text"
	{placeholder}
	on:keypress={handleInput}
/>
