<script lang="ts">
	import type { RoomI } from 'discreetly-interfaces';
	import { roomPassStore, roomKeyStore, keyStore } from '$lib/stores';
	import { decrypt } from '$lib/crypto/crypto';
	export let room: RoomI;

	$: if (room.encrypted) {
		if ($roomPassStore[room.roomId.toString()] && $keyStore) {
			console.log('Room is encrypted and encrypted password is stored');
			decrypt($roomPassStore[room.roomId.toString()], $keyStore);
		} else {
			console.log('Room is encrypted and password is not stored');
		}
	} else {
		console.log('Room is not encrypted');
	}
</script>
