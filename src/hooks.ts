// FIXME: This is a potential hack to get proofs to generate on the front end
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handle({ event, resolve }: { event: unknown; resolve: any }) {
	return resolve(event, { ssr: false });
}
