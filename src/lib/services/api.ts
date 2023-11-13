/**
 * Joins an array of URL parts into a single URL.
 *
 * This function ensures that each part is separated by a single slash,
 * without any two slashes appearing next to each other.
 *
 * @param {string[]} parts - An array of URL parts to join.
 * @returns {string} The combined URL.
 *
 * @example
 * const parts = ['http://example.com/', '/path/', 'to/', '/resource'];
 * joinUrlParts(parts);  // Returns: 'http://example.com/path/to/resource'
 */
function cleanURL(parts: string[] | string): string {
	let url = '';
	if (typeof parts == 'string') {
		url = parts.replace(/\/\/+/g, '/'); // Replace any sequence of multiple slashes with a single slash
	} else {
		url = parts
			.map((part) => part.replace(/^\/+|\/+$/g, '')) // Remove leading and trailing slashes
			.join('/'); // Join the parts with a single slash
	}
	if (url.startsWith('http://') || url.startsWith('https://')) {
		return url;
	} else {
		return 'https://' + url;
	}
}

/**
 * @description - makes a get request to the api
 * @param {string[] | string} urlParts - the url parts to be joined to form the url
 * @returns {object} - the response from the api
 * @throws {Error} - if the request fails
 */
export async function get(urlParts: string[] | string): Promise<object> {
	const url = cleanURL(urlParts);
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	});
	if (res.ok) {
		return res.json();
	}
	throw new Error(`Failed to fetch ${url}`);
}

/**
 * @description - makes a get request to the api
 * @param {string[] | string} urlParts - the url parts to be joined to form the url
 * @param {object} data - the data to be sent to the api
 * @returns {object} - the response from the api
 * @throws {Error} - if the request fails
 */
export async function post(urlParts: string[] | string, data: object): Promise<object> {
	const url = cleanURL(urlParts);
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	if (res.ok) {
		return res.json();
	} else {
		throw new Error(`Failed to post to ${url}`);
	}
}

/**
 * @description - makes a post request to the api with admin credentials
 * @param {string[] | string} urlParts - the url parts to be joined to form the url
 * @param {object} data - the data to be sent to the api
 * @returns {object} - the response from the api
 * @throws {Error} - if the request fails
 */
export async function postAuth(
	urlParts: string[] | string,
	data: object,
	username: string,
	password: string
): Promise<object> {
	const url = cleanURL(urlParts);
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json',
			Authorization: 'Basic ' + btoa(username + ':' + password)
		},
		body: JSON.stringify(data)
	});
	if (res.ok) {
		return res.json();
	} else {
		throw new Error(`Failed to post to ${url}`);
	}
}

/**
 * @description - makes a get request to the api with admin credentials
 * @param {string[] | string} urlParts - the url parts to be joined to form the url
 * @param {object} data - the data to be sent to the api
 * @returns {object} - the response from the api
 * @throws {Error} - if the request fails
 */
export async function getAuth(
	urlParts: string[] | string,
	username: string,
	password: string
): Promise<object> {
	const url = cleanURL(urlParts);
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json',
			Authorization: 'Basic ' + btoa(username + ':' + password)
		}
	});
	if (res.ok) {
		return res.json();
	} else {
		throw new Error(`Failed to post to ${url}`);
	}
}

/**
 * @description - makes a get request to the api
 * @param {string[] | string} urlParts - the url parts to be joined to form the url
 * @param {object} data - the data to be sent to the api
 * @returns {object} - the response from the api
 * @throws {Error} - if the request fails
 */
export async function postRaw(urlParts: string[] | string, data: object): Promise<Response> {
	const url = cleanURL(urlParts);
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});
	return res;
}
