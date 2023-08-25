import { formatRelative } from 'date-fns';

export interface State {
	currentEpoch: number;
	lastEpochMessageWasSent: number;
	remainingMessages: number;
}

export interface EpochDetails {
	epoch: number;
	timestamp: number; // Unix epoch time
	relative: string;
}

export function getEpochFromTimestamp(
	ratelimit: number,
	timestamp: number = Date.now()
): EpochDetails {
	const epoch = Math.floor(timestamp / ratelimit);
	let relative = '';
	try {
		relative = formatRelative(new Date(timestamp), new Date());
	} catch (err) {
		relative = 'Unknown';
		console.debug(`${err.message}: ${epoch} * ${ratelimit} = ${timestamp}`);
	}
	return { epoch, relative, timestamp };
}

export function getTimestampFromEpoch(ratelimit: number, epoch: number): EpochDetails {
	let relative = '';
	let timestamp = 0;
	try {
		timestamp = epoch * ratelimit;
		relative = formatRelative(new Date(timestamp), new Date());
	} catch (err) {
		relative = 'Unknown';
		//console.debug(`${err.message}: ${epoch} * ${ratelimit} = ${timestamp}`);
	}

	return { epoch, relative, timestamp };
}
