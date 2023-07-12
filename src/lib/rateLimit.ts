class RateLimiter {
	numberMessages: number;
	milliSecondsPerEpoch: number;
	lastEpochMessageWasSent: number;
	remainingMessages: number;
	constructor(numberMessages: number, milliSecondsPerEpoch: number) {
		this.numberMessages = numberMessages;
		this.milliSecondsPerEpoch = milliSecondsPerEpoch;
		this.lastEpochMessageWasSent = this.getCurrentEpoch();
		this.remainingMessages = this.numberMessages;
	}

	public getCurrentEpoch() {
		return Math.floor(new Date().getTime() / this.milliSecondsPerEpoch);
	}

	public updateState(): {
		currentEpoch: number;
		lastEpochMessageWasSent: number;
		remainingMessages: number;
	} {
		const currentEpoch = this.getCurrentEpoch();
		if (currentEpoch > this.lastEpochMessageWasSent) {
			this.remainingMessages = this.numberMessages;
			this.lastEpochMessageWasSent = currentEpoch;
		}
		return {
			currentEpoch,
			lastEpochMessageWasSent: this.lastEpochMessageWasSent,
			remainingMessages: this.remainingMessages
		};
	}

	public getRemainingMessages() {
		this.updateState();
		return this.remainingMessages;
	}

	// Returns the number of remaining messages
	// -1 means you have no more messages left
	public useMessage(): number {
		this.updateState();
		if (this.remainingMessages > 0) {
			this.remainingMessages--;
			return this.remainingMessages;
		} else {
			return -1;
		}
	}

	public getEpochFromTimestamp(timestamp: number): {
		epoch: number;
		timestamp: number; // Unix epoch time
		local: string;
	} {
		const _timestamp = timestamp ? new Date(timestamp).toString() : Date.now().toString();
		const epoch = Math.floor(Number(_timestamp) / this.milliSecondsPerEpoch);
		const local = new Date(_timestamp).toLocaleString('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		});
		return { epoch, timestamp, local };
	}

	public getTimestampFromEpoch(epoch?: number | bigint): string {
		const time = epoch ? Number(epoch) * this.milliSecondsPerEpoch : new Date();
		return new Date(time).toLocaleString('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		});
	}
}

export default RateLimiter;
