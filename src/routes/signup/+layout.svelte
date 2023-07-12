<script lang="ts">
	import { identityStore, selectedServer, serverDataStore } from '$lib/stores';
	import Loading from '$lib/loading.svelte';
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import { Identity } from '@semaphore-protocol/identity';
	import { goto } from '$app/navigation';
	import type { RoomI } from 'discreetly-interfaces';
	import BackupIdentity from '../identity/BackupIdentity.svelte';

	let identityExists = false;
	let code = '';
	let accepted = false;
	let acceptedRoomNames: string[] = [];
	let backedUp = false;

	$: if ($identityStore.identity == undefined) {
		identityExists = false;
		console.debug('identity does not exist');
	} else {
		identityExists = true;
		console.debug('identity exists');
	}

	function createIdentity(regenerate = false) {
		console.log('Creating identity');
		if (!identityExists || regenerate) {
			$identityStore.identity = new Identity();
			$identityStore.rooms = {};
			return 'created';
		} else {
			console.log('Identity already exists');
			return 'exists';
		}
	}

	function addCode(code: string) {
		const url = String('http://' + $serverDataStore[$selectedServer].serverInfoEndpoint + '/join');
		const idc = $identityStore.identity._commitment;
		const data = JSON.stringify({
			code: code,
			idc: idc
		});
		console.log(data);
		fetch(url, {
			method: 'POST',
			headers: {
				'Access-Control-Allow-Origin': 'http://localhost:*',
				'Content-Type': 'application/json'
			},
			body: data
		})
			.then(async (response) => {
				const result = await response.json();
				console.log('INVITE CODE RESPONSE: ', result);
				if (result.status == 'valid' || result.status == 'already-added') {
					result.rooms.forEach((r: RoomI) => {
						if (!$identityStore.rooms.hasOwnProperty($selectedServer)) {
							$identityStore.rooms[$selectedServer] = [];
						}
						$identityStore.rooms[$selectedServer] = [
							...$identityStore.rooms[$selectedServer],
							r.id
						];
						acceptedRoomNames = [...acceptedRoomNames, r.name];
					});
					accepted = true;
					code = '';
				} else {
					alert('Invalid invite code');
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}
</script>

<div class="h-100">
	<Stepper
		class="max-w-3xl mx-auto mt-16"
		on:complete={() => {
			goto('/');
		}}
	>
		<Step>
			<svelte:fragment slot="header"
				><div class="text-center">About Discreetly</div></svelte:fragment
			>
			<h5 class="text-center h4 my-7">This app is a little different from what you're used to.</h5>
			<div class="grid place-content-center text-justify text-lg mb-10">
				<p class="text-xl mb-3 italic underline underline-offset-8">
					So please actually read the following:
				</p>
				<p>
					<b class="text-secondary-500">Discreetly</b> is an <b>anonymous</b> chat app
				</p>
				<p>Yes, you are <span class="text-success-500"><i>actually</i> anonymous</span></p>
				<p>
					But you can still get <b class="text-secondary-500">banned</b> if you
					<b class="text-secondary-500">spam</b>, or if you get
					<b class="text-secondary-500">voted out</b>.
				</p>
				<p>
					There is
					<b class="text-secondary-500">no unban</b>
				</p>
				<p>
					<b>Backup your identity</b>, there is
					<i class="text-secondary-500">no account recovery</i> (yet)
				</p>
				<p class="mt-2 mb-4">
					If you want to understand how this works:
					<a href="/about" class="btn btn-sm variant-soft-tertiary ms-2 mt-2">Read More Here</a>
				</p>
			</div>
			<svelte:fragment slot="navigation" />
		</Step>
		<Step locked={!identityExists}>
			<svelte:fragment slot="header"><div class="text-center">Create Identity</div></svelte:fragment
			>
			<div class="grid place-content-center">
				{#if !identityExists}
					<button on:click={() => createIdentity()} class="btn variant-ghost-success" type="button">
						Generate Identity
					</button>
				{:else}
					<div class="d-flex justify-content-between gap-2">
						<button
							on:click={() => createIdentity(true)}
							class="btn variant-ghost-warning"
							type="button"
						>
							Re-Generate Identity
						</button>
					</div>
				{/if}
			</div>
		</Step>
		<Step locked={!accepted}>
			<svelte:fragment slot="header"
				><div class="text-center">Join Communities</div></svelte:fragment
			>
			<div class="grid place-content-center">
				<label class="label">
					<span>Invite Code</span>
					<input
						class="input max-w-md"
						type="text"
						placeholder="Invite Code"
						bind:value={code}
						on:keydown={(event) => {
							if (event.key === 'Enter') {
								event.preventDefault();
								addCode(code);
							} else if ([' ', '-'].includes(event.key)) {
								event.preventDefault();
								if (code.length > 0 && code[code.length - 1] !== '-') {
									code += '-';
								}
							} else if (
								[
									'`',
									'=',
									'+',
									'[',
									']',
									'\\',
									';',
									"'",
									',',
									'.',
									'/',
									'?',
									'1',
									'2',
									'3',
									'4',
									'5',
									'6',
									'7',
									'8',
									'9',
									'0'
								].includes(event.key)
							) {
								// This just helps prevent typos
								event.preventDefault();
							}
						}}
					/>
					<button
						class="btn variant-ghost-success"
						type="button"
						disabled={!code}
						on:click={() => addCode(code)}>Submit</button
					>
				</label>
				{#if acceptedRoomNames.length > 0}
					<p class="text-center mt-2">You've been added to:</p>
					<div class="my-2">
						{#each acceptedRoomNames as name}
							<ins class="ins border-y border-success-800">{name}</ins>
						{/each}
					</div>
				{/if}
			</div>
		</Step>
		<Step locked={!backedUp}>
			<svelte:fragment slot="header"
				><div class="text-center">Backup your identity</div></svelte:fragment
			>
			<div class="grid place-content-center">
				<a
					class="btn variant-ghost-success"
					href={'data:text/json;charset=utf-8,' +
						encodeURIComponent(JSON.stringify($identityStore))}
					download="identity.json"
					on:click={() => (backedUp = true)}>JSON</a
				>
			</div>
		</Step>
	</Stepper>
	<slot>
		<Loading />
	</slot>
</div>
