import { randomBigInt, genId } from 'discreetly-interfaces';
import type { ServerI } from 'discreetly-interfaces';

async function fetchServer(server_url: string): Promise<ServerI | void> {
	console.debug(`Fetching server ${server_url}`);
	return fetch(server_url, {
		method: 'GET',
		headers: {
			'Access-Control-Allow-Origin': 'http://localhost:*'
		}
	})
		.then(async (response): Promise<ServerI> => {
			const serverData: ServerI = await response.json();
			return serverData;
		})
		.catch((err) => {
			console.error(err);
		});
}

export { randomBigInt, genId, fetchServer };
