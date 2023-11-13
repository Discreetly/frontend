<script lang="ts">
	import type { RoomI } from 'discreetly-interfaces';
	import { roomPassStore, roomKeyStore, keyStore } from '$lib/stores';
	import { decrypt } from '$lib/crypto/crypto';
	export let room: RoomI;

	$: if (room.encrypted) {
		if ($roomPassStore[room.roomId.toString()] && $keyStore) {
			console.debug('Room is encrypted and encrypted password is stored');
			decrypt($roomPassStore[room.roomId.toString()].password, $keyStore);
		} else {
			console.debug('Room is encrypted and password is not stored');
		}
	} else {
		console.debug('Room is not encrypted');
	}
</script>
