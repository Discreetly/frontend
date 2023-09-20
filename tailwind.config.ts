import { join } from 'path';
import type { Config } from 'tailwindcss';
import { discreetlyTheme } from './theme';
import { skeleton } from '@skeletonlabs/tw-plugin';

const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {}
	},
	plugins: [
		skeleton({
			themes: { custom: [discreetlyTheme] }
		})
	]
} satisfies Config;

export default config;
