<script lang="ts">
	import { deriveKey, hashPassword } from '$lib/crypto/crypto';
	import { configStore, keyStore } from '$lib/stores';
	import { addConsoleMessage, clearConsoleMessages } from '$lib/utils/';
	import { inviteCode } from '$lib/utils/inviteCode';

	function help(args?: string[]) {
		args = args ?? [];
		switch (args[0]) {
			case 'clear' || '/clear':
				addConsoleMessage('Clears the console', 'info');
				break;
			case 'join' || '/join':
				addConsoleMessage('Joins a room via invite code', 'info');
				addConsoleMessage('/join apple-banana-candy-donut', 'info');
				break;
			case 'help':
				addConsoleMessage('Displays this message', 'info');
				break;
			default:
				addConsoleMessage('Commands: /clear, /join, /help', 'info');
				break;
		}
	}

	async function processCommand(command: string) {
		const [cmd, ...args] = command.split(' ');
		switch (cmd) {
			case '/help':
				help(args);
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
