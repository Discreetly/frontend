<script lang="ts">
	console.info(
		'I see you are checking out the logs, let us know what you think on our discord: https://discord.gg/brJQ36KVxk'
	);
</script>

<h5 class="text-center h4 my-4 md:my-7">
	This app is a little different from what you're used to.
</h5>
<div class="grid place-content-center md:text-lg mb-6 md:mb-10 px-2 md:px-0">
	<div id="info">
		<p>
			<b class="text-primary-500">Discreetly</b> is an <b>anonymous</b> chat app
		</p>
		<p>Yes, you are <i>actually</i> anonymous, don't abuse it</p>
		<p>
			But you can still get <b class="text-primary-500">banned</b> if you
			<b class="text-primary-500">spam</b>, or if you get
			<b class="text-primary-500">voted out</b>
			<small class="text-surface-400 italic">coming soon</small>.
		</p>
		<p>
			There is
			<b class="text-primary-500">no unban</b>
		</p>
		<p>
			<b>Backup your identity</b>, there is
			<i class="text-primary-500">no account recovery</i>
		</p>
		<p class="mt-2 mb-4">
			If you want to understand how this works:
			<a href="/about" class="btn btn-sm variant-ghost-tertiary ms-2 mt-2">Read More Here</a>
		</p>
	</div>
</div>

<style>
	#info p {
		margin-bottom: 0.7rem;
	}
	#info p::before {
		content: '•';
		padding-right: 0.45em;
		color: rgb(var(--color-primary-500));
	}
</style>
