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

/**
 * Encrypts a plain text using AES-GCM algorithm.
 *
 * @param {string} plainText - The text to encrypt.
 * @param {CryptoKey} key - The cryptographic key for encryption.
 * @returns {Promise<string>} - Returns the encrypted text as a Promise.
 */
export async function encryptData(plainText: string, key: CryptoKey): Promise<string> {
	// Generate initialization vector (iv) for AES-GCM
	const iv = window.crypto.getRandomValues(new Uint8Array(12));

	// Convert plain text to byte array
	const encoded = new TextEncoder().encode(plainText);

	// Encrypt the text
	const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

	// Convert encrypted data to Uint8Array and concatenate it with iv
	const encryptedData = new Uint8Array(encrypted);

	// Return encrypted data as a base64 encoded string
	return btoa(String.fromCharCode(...iv) + String.fromCharCode(...encryptedData));
}

/**
 * Decrypts an encrypted text using AES-GCM algorithm.
 *
 * @param {string} encryptedData - The encrypted text.
 * @param {CryptoKey} key - The cryptographic key for decryption.
 * @returns {Promise<string>} - Returns the decrypted text as a Promise.
 */
export async function decryptData(encryptedData: string, key: CryptoKey): Promise<string> {
	// Decode the base64 encrypted string
	const rawData = atob(encryptedData);

	// Extract Initialization Vector (iv) and encrypted data
	const rawIv = rawData.slice(0, 12);
	const rawEncryptedData = rawData.slice(12);

	// Convert them to byte arrays
	const iv = new TextEncoder().encode(rawIv);
	const encrypted = new TextEncoder().encode(rawEncryptedData).buffer;

	// Decrypt the data
	const decrypted = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);

	// Return the decrypted text
	return new TextDecoder().decode(decrypted);
}

/**
 * Hashes a value using the SHA-256 algorithm.
 *
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} - Returns the hashed password as a Promise.
 */
export async function hashPassword(password: string): Promise<string> {
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
