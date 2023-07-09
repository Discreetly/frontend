<script lang="ts">
	import Card from '$lib/card.svelte';
	import Button from '$lib/button.svelte';
	import { identityStore, selectedServer, serverDataStore } from '$lib/stores';

	let links = [
		{
			link: '/signup/ceremony',
			text: 'Continue ➡',
			cls: 'btn-primary'
		}
	];
	let code = '';
	let accepted = false;

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
				if (result.groupID) {
					$identityStore.rooms[result.groupID] = idc;
					accepted = true;
				} else {
					code = '';
					alert('Invalid invite code');
				}
			})
			.catch((err) => {
				console.error(err);
			});
	}
</script>

<Card title="Join Communities">
	<p>Right now we are only accepting users with an invite code</p>
	{#if accepted != true}
		Invite Code:<input
			type="text"
			placeholder="Invite Code"
			bind:value={code}
			on:keydown={(event) => {
				if (event.key === 'Enter') {
					event.preventDefault();
					addCode(code);
				} else if (event.key === ' ' || event.key === '-') {
					event.preventDefault();
					if (code.length > 0 && code[code.length - 1] !== '-') {
						code += '-';
					}
				}
			}}
		/>
	{:else}
		<Button link={'/signup/backup'} text={'Continue ➡'} cls={'btn-primary mt-4'} />
	{/if}
</Card>
