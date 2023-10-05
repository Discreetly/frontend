import { addConsoleMessage } from '$lib/utils';

/**
 * Derives an encryption key from a given password using PBKDF2.
 * The key is derived on password entry and stays in memory until page refresh
 * @param {string} password - The password to derive the encryption key from.
 * @returns {Promise<CryptoKey>} - Returns the derived key as a Promise.
 */
export async function deriveKey(password: string): Promise<CryptoKey> {
	// TextEncoder will be used for converting strings to byte arrays
	const textEncoder = new TextEncoder();

	// Salt for PBKDF2. 420+69+a bunch of randomness from my laptop
	const salt = textEncoder.encode('42069210482402528527906392650230853');

	// Importing the password as a cryptographic key
	const passwordKey = await window.crypto.subtle.importKey(
		'raw',
		textEncoder.encode(password),
		{ name: 'PBKDF2' },
		false,
		['deriveKey']
	);

	// Deriving the encryption key using PBKDF2 algorithm with SHA-256 and 100000 iterations
	return window.crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt: salt,
			iterations: 100000,
			hash: 'SHA-256'
		},
		passwordKey,
		{ name: 'AES-GCM', length: 256 },
		true,
		['encrypt', 'decrypt']
	);
}

export async function encrypt(plainText: string, key: CryptoKey): Promise<string | null> {
	if (key instanceof CryptoKey) {
		const encoder = new TextEncoder();
		const iv = window.crypto.getRandomValues(new Uint8Array(12));

		const encryptedContent = await window.crypto.subtle.encrypt(
			{ name: 'AES-GCM', iv: iv },
			key,
			encoder.encode(plainText)
		);
		console.log(encryptedContent);

		const encryptedContentArr = new Uint8Array(encryptedContent);
		const encryptedBytes = [...iv, ...encryptedContentArr];

		return btoa(String.fromCharCode(...encryptedBytes));
	} else {
		addConsoleMessage('No Password Set, please set a password with /setpassword', 'error');
		console.error('No password set, please set a password first');
		return 'nopassword';
	}
}

export async function decrypt(cipherText: string, key: CryptoKey): Promise<string> {
	if (cipherText === '') {
		return '';
	}
	if (key instanceof CryptoKey) {
		const decoder = new TextDecoder();
		console.log(cipherText);
		const encryptedBytes = Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0));

		const iv = encryptedBytes.slice(0, 12);
		const encryptedContent = encryptedBytes.slice(12);

		const decryptedContent = await window.crypto.subtle.decrypt(
			{ name: 'AES-GCM', iv: iv },
			key as CryptoKey,
			encryptedContent
		);

		return decoder.decode(decryptedContent);
	} else {
		addConsoleMessage('No Password Set, please set a password with /setpassword', 'error');
		console.error('No password set, please set a password first');
		return 'nopassword';
	}
}

/**
 * Hashes a value using the SHA-256 algorithm.
 *
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} - Returns the hashed password as a Promise.
 */
export async function hashPassword(password: string): Promise<string | null> {
	// Convert the password to a byte array
	const textEncoder = new TextEncoder();
	const passwordBytes = textEncoder.encode(password);

	// Hash the password using SHA-256
	const hashBuffer = await window.crypto.subtle.digest('SHA-256', passwordBytes);

	// Convert the hash to a hex string for easier storage and comparison
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

	return hashHex;
}
