<script lang="ts">
	import { decryptData, deriveKey, hashPassword } from '$lib/crypto/crypto';
	import {
		configStore,
		identityKeyStore,
		identityKeyStoreDecrypted,
		keyExists,
		keyStore,
		passwordSet
	} from '$lib/stores';
	import { addConsoleMessage, clearConsoleMessages } from '$lib/utils/';
	import { inviteCode } from '$lib/utils/inviteCode';

	function help() {
		addConsoleMessage(' ', 'space');
		addConsoleMessage('Commands: /clear, /join, /help, /unlock, /export');
		addConsoleMessage(' ', 'space');
		addConsoleMessage('`/clear` Clears the console');
		addConsoleMessage(' ', 'space');
		addConsoleMessage('`/join invite-code` Joins a room via invite code, Example:');
		addConsoleMessage(' ', 'space');
		addConsoleMessage('`/password Password`');
		addConsoleMessage(' ', 'space');
		addConsoleMessage('`/clearPassword`');
		addConsoleMessage(' ', 'space');
		addConsoleMessage('`/unlock Password`');
		addConsoleMessage(' ', 'space');
		addConsoleMessage('`/lock`');
		addConsoleMessage(' ', 'space');
		addConsoleMessage('`/backup`');
	}

	async function processCommand(command: string) {
		const [cmd, ...args] = command.split(' ');
		if (['/unlock', '/password'].includes(cmd)) {
			addConsoleMessage(cmd, 'userinput');
		} else {
			addConsoleMessage(command, 'userinput');
		}
		switch (cmd) {
			case 'help' || '/help':
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
				const hashedNewPwd = await hashPassword(args[1]);
				if (hashedOldPwd === $configStore.hashedPwd || $configStore.hashedPwd === undefined) {
					$configStore.hashedPwd = hashedNewPwd;
					addConsoleMessage('New Password Set');
				} else {
					addConsoleMessage('Invalid Old Password', 'error');
					addConsoleMessage('/password OLDPASSWORD NEWPASSWORD', 'warning');
				}
				break;
			case '/clearPassword':
				$configStore.hashedPwd = null;
				addConsoleMessage('Password Cleared');
				break;
			case '/lock':
				$keyStore = null;
				addConsoleMessage('Locked!');
				break;
			case '/unlock':
				const hashedPwd = await hashPassword(args[0]);
				if (hashedPwd === $configStore.hashedPwd) {
					if ($keyExists && $keyStore && !(args[1] === 'force')) {
						addConsoleMessage(
							'Already Unlocked! use `/unlock PASSWORD force` to override this and derive the key again',
							'warning'
						);
						break;
					}
					deriveKey(args[0])
						.then((key) => {
							$keyStore = key;
							addConsoleMessage('Unlocked!');
						})
						.catch((err) => {
							addConsoleMessage(`Could NOT derive key from password: ${err}`, 'error');
						});
				} else {
					addConsoleMessage(`Invalid password!`, 'warning');
				}
				break;
			case '/export' || '/backup':
				addConsoleMessage('Exporting Identity');
				if ($passwordSet) {
					if ($keyExists && $keyStore) {
						addConsoleMessage('Decrypting Data');
						console.log($identityKeyStore, $keyStore);
						const identity = $identityKeyStoreDecrypted;
						if (identity) {
							addConsoleMessage(identity);
						}
					} else {
						addConsoleMessage('Please Unlock Keystore!', 'error');
					}
				} else {
					addConsoleMessage('Password not set!', 'error');
				}
				addConsoleMessage('Exporting Identity Complete');
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
	placeholder="Enter / Command"
	on:keypress={handleInput}
/>
