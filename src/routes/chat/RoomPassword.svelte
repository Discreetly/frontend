<script lang="ts">
	import { enterRoomPassword, getCommitment } from '$lib/utils';
	import Container from '$lib/components/Utils/Container.svelte';
	import { postDoesRoomPasswordExist, postSetRoomPassword } from '$lib/services/server';
	import { roomPassStore, selectedServer, roomsStore } from '$lib/stores';
	import { onMount } from 'svelte';
	import { hashPassword } from '$lib/crypto/crypto';
	import Loading from '$lib/components/Utils/Loading.svelte';

	export let roomId: string;
	let _passwordSet: boolean;
	let r = '';
	let admin = false;
	let loaded = false;

	function enterPassword() {
		enterRoomPassword(r, roomId);
	}

	async function setRoomPassword() {
		const hashedSaltedPassword = await hashPassword(r + roomId);
		if (hashedSaltedPassword) {
			postSetRoomPassword($selectedServer, roomId, hashedSaltedPassword).then((answer) => {
				if (answer) {
					roomPassStore.update((roomPass) => {
						roomPass[roomId] = { password: r, hashedSaltedPassword };
						return roomPass;
					});
				}
			});
		} else {
			console.error('Failed to hash password');
		}
	}

	function isPasswordSet() {
		try {
			postDoesRoomPasswordExist($selectedServer, roomId).then((answer) => {
				_passwordSet = answer;
			});
		} catch (e) {
			console.warn(e);
		}
	}

	function isAdmin() {
		const idc = getCommitment();
		$roomsStore[roomId].adminIdentities?.forEach((id) => {
			if (id === idc) {
				admin = true;
			}
		});
	}

	onMount(() => {
		isPasswordSet();
		isAdmin();
		loaded = true;
	});
</script>

{#if loaded}
	{#if _passwordSet}
		<Container heading="Enter Room Password">
			<form
				on:submit|preventDefault={() => enterPassword()}
				class="flex flex-col w-full">
				<label
					for="enterRoomPassword"
					class="label" />
				<input
					id="enterRoomPassword"
					type="password"
					name="password"
					class="input"
					bind:value={r}
					required />
				<button
					class="btn variant-filled-primary mt-3"
					type="submit">Enter Room Password</button>
			</form>
		</Container>
	{:else if admin}
		<Container heading="Set Room Password">
			<form
				on:submit|preventDefault={() => setRoomPassword()}
				class="flex flex-col w-full">
				<label
					for="setRoomPassword"
					class="label" />
				<input
					id="setRoomPassword"
					type="password"
					name="password"
					class="input"
					bind:value={r}
					required />
				<button
					class="btn variant-filled-primary mt-3"
					type="submit">Set Room Password</button>
			</form>
		</Container>
	{:else}
		<Container heading="Password Not Set">
			<p class="text-center">
				The room you are trying to enter requires a password, but the password has not been set yet.
				Annoy the administrators who created this room!
			</p>
		</Container>
	{/if}
{:else}
	<Loading />
{/if}
