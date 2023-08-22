import _sodium from 'libsodium-wrappers';
import {
	base64_variants,
	from_base64,
	from_hex,
	from_string,
	to_base64,
	to_hex,
	to_string
} from 'libsodium-wrappers';

async function initSodium() {
	await _sodium.ready;
	return _sodium;
}

type Sodium = Awaited<ReturnType<typeof getSodium>>;
