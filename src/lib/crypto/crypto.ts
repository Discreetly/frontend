import { alertQueue, configStore, saltStore } from '$lib/stores';
import { get } from 'svelte/store';

/**
 * Retrieves a salt value. If a salt is not present in the store,
 * it generates a new 16-byte salt using the window.crypto API,
 * converts it to a hexadecimal string, and stores it. If a salt
 * is present in the store, it converts the stored hexadecimal
 * string back to a Uint8Array.
 *
 * @returns {Uint8Array} A 16-byte salt value.
 */
function getSalt(): Uint8Array {
	const salt: Uint8Array = new Uint8Array(16);

	const saltFromStore = get(saltStore);

	// Generate new salt if salt is not set
	if (saltFromStore === '') {
		window.crypto.getRandomValues(salt);

		// Convert to hexadecimal string
		const saltString = Array.from(salt)
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');

		saltStore.set(saltString);
	} else {
		for (let i = 0; i < salt.length; i++) {
			salt[i] = parseInt(saltFromStore.substring(i * 2, i * 2 + 2), 16);
		}
	}
	return salt;
}

/**
 * Derives an encryption key from a given password using PBKDF2.
 * The key is derived on password entry and stays in memory until page refresh
 * @param {string} password - The password to derive the encryption key from.
 * @returns {Promise<CryptoKey>} - Returns the derived key as a Promise.
 */
export async function deriveKey(password: string, saltString?: string): Promise<CryptoKey> {
	// TextEncoder will be used for converting strings to byte arrays
	const textEncoder = new TextEncoder();

	// Salt for PBKDF2 stored in local storage
	const salt = saltString ? textEncoder.encode(saltString) : getSalt();

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

		const encryptedContentArr = new Uint8Array(encryptedContent);
		const encryptedBytes = [...iv, ...encryptedContentArr];

		return btoa(String.fromCharCode(...encryptedBytes));
	} else if (get(configStore).hashedPwd) {
		alertQueue.enqueue('Unlock your identity with /unlock or click on the lock', 'warning');
		console.error('Unlock your identity with /unlock or click on the lock');
		return null;
	} else {
		alertQueue.enqueue('No Password Set, please set a password with /setpassword', 'warning');
		console.error('No password set, please set a password first');
		return null;
	}
}

export async function decrypt(cipherText: string, key: CryptoKey): Promise<string | null> {
	if (cipherText === '') {
		return '';
	}
	if (key instanceof CryptoKey) {
		const decoder = new TextDecoder();
		const encryptedBytes = Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0));

		const iv = encryptedBytes.slice(0, 12);
		const encryptedContent = encryptedBytes.slice(12);

		const decryptedContent = await window.crypto.subtle.decrypt(
			{ name: 'AES-GCM', iv: iv },
			key as CryptoKey,
			encryptedContent
		);

		return decoder.decode(decryptedContent);
	} else if (get(configStore).hashedPwd) {
		alertQueue.enqueue('Unlock your identity with /unlock or click on the lock', 'warning');
		console.error('Unlock your identity with /unlock or click on the lock');
		return null;
	} else {
		alertQueue.enqueue('No Password Set, please set a password with /setpassword', 'warning');
		console.error('No password set, please set a password first');
		return null;
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
