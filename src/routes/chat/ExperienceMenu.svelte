<script lang="ts">
	import { Experiences } from '$lib/types';
	import Palette from 'svelte-material-icons/Palette.svelte';
	import Chat from 'svelte-material-icons/Chat.svelte';
	import { configStore } from '$lib/stores';

	$: experience = $configStore.experience;
	function nextExperience() {
		if (experience == Experiences.Chat) {
			$configStore.experience = Experiences.Draw;
		} else if (experience == Experiences.Draw) {
			$configStore.experience = Experiences.Chat;
		} else {
			$configStore.experience = Experiences.Chat;
		}
	}
</script>

<span on:click={nextExperience} class="flex flex-row ms-2 place-items-center">
	{#if experience == Experiences.Chat}
		<Palette class="w-5 h-5" />
	{:else if experience == Experiences.Draw}
		<Chat class="w-5 h-5" />
	{:else}
		<Palette class="w-5 h-5" />
	{/if}
</span>
