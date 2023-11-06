<script lang="ts">
	import { identityExists, configStore } from '$lib/stores';
	import Settings from 'svelte-material-icons/TuneVariant.svelte';
	import Console from 'svelte-material-icons/Console.svelte';
	import Plus from 'svelte-material-icons/Plus.svelte';
	import Information from 'svelte-material-icons/Information.svelte';
</script>

<div class="flex flex-col mx-3 mt-4 text-center">
	<h3 class="h4">Sorry this is a hack until I get the mobile menu working</h3>
	<div class="card p-4 w-72 shadow-xl">
		<nav class="list-nav">
			<!-- (optionally you can provide a label here) -->
			<ul>
				<li id="will-close">
					<a href="/about">
						<Information />
						<span class="flex-auto">About</span>
					</a>
				</li>
				{#if $identityExists}
					<li id="will-close">
						<a href="/gateways"
							><Plus />
							<span class="flex-auto">Join More</span>
						</a>
					</li>
					{#if $configStore.beta}
						<li id="will-close">
							<a href="/console">
								<Console />
								<span class="flex-auto">Console</span>
							</a>
						</li>
					{/if}

					<li id="will-close">
						<a href="/settings">
							<Settings />
							<span class="flex-auto">Settings</span>
						</a>
					</li>
				{/if}
			</ul>
		</nav>
		<div class="arrow bg-surface-100-800-token" />
	</div>
</div>
