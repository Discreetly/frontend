export interface State {
	currentEpoch: number;
	lastEpochMessageWasSent: number;
	remainingMessages: number;
}

export interface EpochDetails {
	epoch: number;
	timestamp: number; // Unix epoch time
	local: string;
}

// class RateLimiter {
// 	private numberMessages: number;
// 	private milliSecondsPerEpoch: number;
// 	private lastEpochMessageWasSent: number;
// 	private remainingMessages: number;

// 	constructor(numberMessages: number, milliSecondsPerEpoch: number) {
// 		this.numberMessages = numberMessages;
// 		this.milliSecondsPerEpoch = milliSecondsPerEpoch;
// 		this.lastEpochMessageWasSent = this.getCurrentEpoch();
// 		this.remainingMessages = this.numberMessages;
// 	}

// 	getCurrentEpoch(): number {
// 		return Math.floor(Date.now() / this.milliSecondsPerEpoch);
// 	}

// 	private updateState(): State {
// 		const currentEpoch = this.getCurrentEpoch();
// 		if (currentEpoch > this.lastEpochMessageWasSent) {
// 			this.remainingMessages = this.numberMessages;
// 			this.lastEpochMessageWasSent = currentEpoch;
// 		}
// 		return {
// 			currentEpoch,
// 			lastEpochMessageWasSent: this.lastEpochMessageWasSent,
// 			remainingMessages: this.remainingMessages
// 		};
// 	}

// 	public getRemainingMessages(): number {
// 		this.updateState();
// 		return this.remainingMessages;
// 	}

// 	public useMessage(): number {
// 		this.updateState();
// 		if (this.remainingMessages > 0) {
// 			this.remainingMessages--;
// 		}
// 		return this.remainingMessages > 0 ? this.remainingMessages : -1;
// 	}

// 	public getEpochFromTimestamp(timestamp: number = Date.now()): EpochDetails {
// 		const epoch = Math.floor(timestamp / this.milliSecondsPerEpoch);
// 		const local = new Date(timestamp).toLocaleString('en-US', {
// 			hour: 'numeric',
// 			minute: 'numeric',
// 			hour12: true
// 		});
// 		return { epoch, timestamp, local };
// 	}

// 	public getTimestampFromEpoch(epoch: number = this.getCurrentEpoch()): string {
// 		const time = epoch * this.milliSecondsPerEpoch;
// 		return new Date(time).toLocaleString('en-US', {
// 			hour: 'numeric',
// 			minute: 'numeric',
// 			hour12: true
// 		});
// 	}
// }

export function getEpochFromTimestamp(
	ratelimit: number,
	timestamp: number = Date.now()
): EpochDetails {
	const epoch = Math.floor(timestamp / ratelimit);
	const local = new Date(timestamp).toLocaleString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true
	});
	return { epoch, timestamp, local };
}

export function getTimestampFromEpoch(
	epoch: number,
	ratelimit: number
): { DateString: string; unixEpochTime: number } {
	const unixEpochTime = epoch * ratelimit;
	const DateString = new Date(unixEpochTime).toLocaleString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true
	});
	return { DateString, unixEpochTime };
}
