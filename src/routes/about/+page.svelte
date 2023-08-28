<script>
	import Button from '$lib/components/button.svelte';
</script>

<div class="mx-auto mt-10 max-w-[80ch]">
	<img src="/logo-text.png" alt="discreetly" class="max-h-20 mb-5" />
	<h5 class="italic mb-4 mt-1">A new take on anonymous communication.</h5>
	<p class="text-justify my-3">
		This feels like a mostly familiar chat application, with random numbers as usernames, but I
		assure you there is more going on here.
	</p>
	<p class="text-justify my-3">
		Under the hood, there is no "login", the server doesn't know who you are, you are anonymous.
	</p>
	<p class="text-justify my-3">
		There is one catch, if you send messages too fast, someone can figure out which identity you
		are, and remove you from the chat. So if you try to break the rules, you will be removed, and
		there is no undo.
	</p>
	<p>
		When you send a message, your device generates a zk proof that you are a member of that room,
		and that you haven't sent too many messages during some time period (an epoch), but doesn't
		reveal which member you are.
	</p>
	<p class="text-justify my-3">
		Read more about <a class="anchor" href="https://rate-limiting-nullifier.github.io/rln-docs/"
			>RLN</a
		>.
	</p>
	<a href="https://discord.gg/brJQ36KVxk" class="btn variant-ghost-secondary">Join our Discord</a>
</div>
