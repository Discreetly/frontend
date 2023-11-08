<script>
	import Semaphore from '$lib/components/Explainers/Semaphore.svelte';
	import Introduction from '$lib/components/Onboarding/Introduction.svelte';
</script>

<div class="mx-auto px-4 mt-10 max-w-[80ch]">
	<img
		src="/logo-text.png"
		alt="discreetly"
		class="max-h-20 mb-5"
	/>
	<h5 class="italic mb-4 mt-1">A new take on group chats.</h5>

	<Introduction />
	<div class="m-3">
		<p class="my-3">
			This feels like a mostly familiar chat application, except there aren't user names. Under the
			hood, there is no "login", the server doesn't know who you are, you are anonymous. You're
			completely anonymous. <i class="italic">Unless you break the rules.</i>
		</p>

		<p class="my-3">
			The beauty of this system is that it fosters trust among group members, knowing that everyone
			in the chat is a verified member. At the same time, it provides the freedom to express oneself
			anonymously.
		</p>

		<p class="my-3">
			When you want to send a message in a room, you need to verify your membership in that room,
			but without giving away your identity. This is accomplished using a zero-knowledge proof, a
			clever piece of cryptography that lets you prove you know something, without having to reveal
			what that something is.
		</p>

		<p class="my-3">
			However, there's a small catch. To prevent spam, each time you send a message, you "share" a
			tiny piece of your identity that is only useful for that epoch (time period). If you send too
			many messages during an epoch, someone can reassemble your identity, all of your messages can
			be linked together, and you will be removed from the chat for spamming. This is done
			automatically and permanently, there is no unban.
		</p>
		<a
			href="/about/explainers"
			class="btn btn-sm uppercase variant-ghost-success">Learn More About How this all works</a
		>
	</div>
	<div class="flex gap-3 justify-between my-6 mx-3">
		<a
			href="https://discord.gg/brJQ36KVxk"
			class="btn variant-ghost-secondary">Join our Discord</a
		>
		<a
			href="https://discord.com/api/oauth2/authorize?client_id=1142162852132700200&permissions=2147483648&scope=bot"
			class="btn variant-ghost-primary">Add our Discord Bot to Your Server Today!</a
		>
	</div>
</div>
