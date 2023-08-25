import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import sizes from 'rollup-plugin-sizes';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		minify: 'terser',
		cssMinify: 'lightningcss',
		rollupOptions: {
			plugins: [sizes()],
			output: {
				manualChunks: {
					'@sveltejs/kit': ['@sveltejs/kit']
				},
				compact: true
			}
		}
	}
});
