<script lang="ts">
	import Introduction from '$lib/components/Onboarding/Introduction.svelte';
	import Button from '$lib/components/Utils/Button.svelte';

	import Mask from 'svelte-material-icons/GuyFawkesMask.svelte';
	import Help from 'svelte-material-icons/ChatQuestion.svelte';
	import { identityExists } from '$lib/stores';
	console.info(
		'I see you are checking out the logs, let us know what you think on our discord: https://discord.gg/brJQ36KVxk'
	);
</script>

<div class="mx-2 md:mx-auto mt-8 md:mt-16 max-w-[80ch]">
	<h1 class="h1 mb-6 md:mb-10 text-center">Welcome to Discreetly!</h1>
	<div class="mb-5">
		<Introduction />
		<div class="flex justify-evenly">
			{#if !$identityExists}
				<Button
					link="https://discord.gg/brJQ36KVxk"
					cls="variant-ghost-tertiary btn-lg m-2 sm:m-3 px-8 min-w-[12rem]"
				>
					<span><Help /></span>
					<span>Join Our Discord</span></Button
				>
				<Button
					link="/signup"
					cls="variant-ghost-primary btn-lg m-2 sm:m-3 px-8 min-w-[12rem]"
				>
					<span><Mask /></span>
					<span>Sign Up</span>
				</Button>
			{:else}
				<Button
					link="https://discord.gg/brJQ36KVxk"
					cls="variant-ghost-tertiary btn-lg m-2 sm:m-3 px-8 min-w-[12rem]"
				>
					<span><Help /></span>
					<span>Join Our Discord</span></Button
				>
				<Button
					link="/chat"
					cls="variant-ghost-success  btn-lg m-2 sm:m-3 px-8 min-w-[12rem]"
				>
					<span><Mask /></span>
					<span>Go Chat</span>
				</Button>
			{/if}
		</div>
	</div>
</div>
