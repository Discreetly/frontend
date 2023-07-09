<script>
	import { identityStore } from '$lib/stores';

	let identityExists = false;
	$: if ($identityStore.identity == undefined) {
		identityExists = false;
		console.debug('identity does not exist');
	} else {
		identityExists = true;
		console.debug('identity exists');
	}

	export let hide = false;
</script>

{#if identityExists}
	<li
		class="nav-item dropdown"
		class:d-none={hide}
		class:d-lg-block={hide}
		class:d-block={!hide}
		class:d-lg-none={!hide}
	>
		<a
			class="nav-link dropdown-toggle"
			href="#"
			id="navbarDropdown"
			role="button"
			data-bs-toggle="dropdown"
			aria-expanded="false"
		>
			Identity
		</a>
		<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
			<li class="nav-item">
				<a href="/identity" class="dropdown-item">Manage Identity</a>
			</li>
			<li>
				<button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#deleteIdentity"
					>Delete Identity</button
				>
			</li>
		</ul>
	</li>
{:else}
	<li
		class="nav-item"
		class:d-none={hide}
		class:d-lg-block={hide}
		class:d-block={!hide}
		class:d-lg-none={!hide}
	>
		<a href="/signup" class="nav-link">Signup</a>
	</li>
{/if}
