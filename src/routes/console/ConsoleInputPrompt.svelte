<script lang="ts">
	import { deriveKey, hashPassword } from '$lib/crypto/crypto';
	import { configStore, keyStore, passwordSet } from '$lib/stores';
	import { addConsoleMessage, clearConsoleMessages } from '$lib/utils/';
	import { inviteCode } from '$lib/utils/inviteCode';

	function help() {
		addConsoleMessage('/clear Clears the console', 'info');
		addConsoleMessage(' ', 'space');
		addConsoleMessage('/join Joins a room via invite code, Example:', 'info');
		addConsoleMessage('/join apple-banana-candy-donut', 'info');
		addConsoleMessage(' ', 'space');
		addConsoleMessage('Commands: /clear, /join, /help', 'info');
	}

	async function processCommand(command: string) {
		const [cmd, ...args] = command.split(' ');
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
							addConsoleMessage(`Added to: ${acceptedRoomNames.join(', ')}`, 'info');
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
					addConsoleMessage('New Password Set', 'info');
				} else {
					addConsoleMessage('Invalid Old Password', 'error');
					addConsoleMessage('/password OLDPASSWORD NEWPASSWORD', 'warning');
				}
				break;
			case '/unlock':
				const hashedPwd = await hashPassword(args[0]);
				if (hashedPwd === $configStore.hashedPwd) {
					if ($keyStore && !(args[1] === 'force')) {
						addConsoleMessage(
							'Already Unlocked! use `/unlock PASSWORD force` to override this and derive the key again',
							'warning'
						);
						break;
					}
					deriveKey(args[0])
						.then((key) => {
							$keyStore = key;
							addConsoleMessage('Unlocked!', 'info');
						})
						.catch((err) => {
							addConsoleMessage(`Could NOT derive key from password: ${err}`, 'error');
						});
				} else {
					addConsoleMessage(`Invalid password!`, 'warning');
				}
				break;
			case '/export' || '/backup':
				addConsoleMessage('Exporting Identity', 'info');
				if ($passwordSet) {
					const identity = await decryptData($identityKeyStore, $keyStore);
					const blob = new Blob([identity], { type: 'text/plain;charset=utf-8' });
					saveAs(blob, 'identity.json');
					addConsoleMessage('Identity Exported', 'info');
				} else {
					addConsoleMessage('Password not set!', 'error');
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
				addConsoleMessage(value, 'userinput');
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
