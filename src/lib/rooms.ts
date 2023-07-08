import type { RoomGroupI } from 'discreetly-interfaces';
export const roomGroups: RoomGroupI[] = [
	{
		name: 'Loading...',
		rooms: [
			{
				id: BigInt(0),
				name: 'Loading Rooms',
				membership: {
					identityCommitments: [BigInt(0)]
				}
			}
		]
	}
];
