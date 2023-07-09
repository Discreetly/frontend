<script lang="ts">
	import Card from '$lib/card.svelte';
	let links = [
		{
			link: '/signup/ceremony',
			text: 'I Understand ➡',
			cls: 'btn-primary'
		}
	];
</script>

<Card title="Welcome to Discreetly" buttons={links}>
	<h5>This app is a little different from what you're used to.</h5>
	<div class="obnoxious">So please actually read the following:</div>
	<br />
	<ul class="list-group list-group-flush">
		<li class="list-group-item">
			<b class="obnoxious">Discreetly</b> is an <b>anonymous</b> chat app
		</li>
		<li class="list-group-item">Yes, you are <i>actually</i> anonymous</li>
		<li class="list-group-item">
			But you can still get <b class="obnoxious">banned</b> if you <b>spam</b>, or if you get
			<b>voted out</b>. There is no <b>unban</b>
		</li>
		<li class="list-group-item">
			Any <i>accounts</i>, <i>reputation</i>, or <i>invite codes</i> you used to join, are spent
		</li>
		<li class="list-group-item">
			<b>Backup your identity</b>, there is <i>no account recovery</i> (yet)
		</li>
		<li class="list-group-item">
			If you want to understand how this works <br />
			<a href="/about" class="btn btn-secondary mt-2">Read More Here</a>
		</li>
	</ul>
	<br />
</Card>

<style>
	h5,
	h6 {
		color: var(--steel-light);
	}

	.list-group-item {
		color: var(--steel-light);
		background-color: transparent;
	}

	b,
	i {
		color: var(--steel-light-bright);
	}
</style>
