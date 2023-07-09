<script lang="ts">
	import { goto } from '$app/navigation';
	import { serverDataStore, selectedServer, serverListStore, identityStore } from '$lib/stores';
	import type { IdentityStoreI } from '$lib/types';
	import IdentityDropdown from './IdentityDropdown.svelte';
	export let setSelectedServer: (server: number) => void;
	function deleteIdentity() {
		console.log('deleting identity');
		$identityStore = { identity: null, rooms: {} } as IdentityStoreI;
		goto('/');
	}
</script>

<header>
	<nav class="navbar fixed-top navbar-dark bg-dark navbar-expand-lg">
		<div class="container-fluid d-flex align-content-between">
			<div class="d-flex">
				<div class="navbar-nav">
					<a class="navbar-brand d-none d-md-block" href="/">Discreetly</a>
					<li class="nav-item d-none d-lg-block">
						<a href="/about" class="nav-link">About</a>
					</li>
				</div>

				<div class="collapse navbar-collapse" id="navbarText">
					<ul class="navbar-nav me-auto mb-2 mb-lg-0">
						<a class="navbar-brand d-block d-md-none" href="/">Discreetly</a>
						<IdentityDropdown />
						<li class="nav-item d-block d-lg-none">
							<a href="/about" class="nav-link">About</a>
						</li>
					</ul>
				</div>
			</div>
			{#if $serverDataStore[$selectedServer] != undefined}
				<div class="navbar-brand dropdown" id="server-title">
					<a
						class="nav-link dropdown-toggle"
						href="#"
						role="button"
						data-bs-toggle="dropdown"
						aria-expanded="false"
						title={String($serverDataStore[$selectedServer].name + ' (' + $selectedServer + ')')}
					>
						{$serverDataStore[$selectedServer].name}
					</a>
					<ul class="dropdown-menu">
						{#each $serverListStore as key}
							<li>
								<div
									aria-label={'select ' + $serverDataStore[key].name}
									class="dropdown-item"
									on:click={() => setSelectedServer(key)}
									on:keydown={(event) => {
										if (event.key === 'Enter' || event.key === ' ') {
											setSelectedServer(key);
										}
									}}
									role="button"
									tabindex="0"
									title={String($serverDataStore[key].name + ' (' + key + ')')}
								>
									{$serverDataStore[key].name}
								</div>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
			<div>
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<IdentityDropdown hide={true} />
				</ul>
				<button
					class="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarText"
					aria-controls="navbarText"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span class="navbar-toggler-icon" />
				</button>
			</div>
		</div>
	</nav>
</header>
<div class="modal fade" id="deleteIdentity" tabindex="-1">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Delete Identity???</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<p>Are you ABSOLUTELY sure you want to delete your identity?</p>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
					>Take me back to safety</button
				>
				<button
					type="button"
					class="btn btn-danger"
					on:click={() => deleteIdentity()}
					data-bs-dismiss="modal">Delete Identity</button
				>
			</div>
		</div>
	</div>
</div>

<style>
	.navbar-dark .navbar-brand {
		color: var(--orangered);
	}
	#server-title {
		font-family: 'Space Mono';
		color: var(--steel-light);
	}

	.nav-link {
		color: var(--steel);
		text-decoration: none;
	}

	.nav-link:hover {
		color: var(--steel-bright);
		text-decoration: none;
	}

	.dropdown-item:focus,
	.dropdown-item:hover {
		color: var(--blackish);
		background-color: var(--steel-bright);
	}
</style>
