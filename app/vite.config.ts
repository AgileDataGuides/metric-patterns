import adapterStatic from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import path from 'path';

const isDemo = process.env.DEMO_BUILD === 'true';

// The app has no server routes: a person's marks live in the browser. So
// every build is a static site. GitHub Pages serves it under the repo path
// (DEMO_BUILD=true). BASE_PATH overrides that, for any other folder the build
// is copied to.
const base = (process.env.BASE_PATH ?? (isDemo ? '/metric-patterns' : '')) as '' | `/${string}`;

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			dynamicCompileOptions: ({ filename }) => filename.includes('node_modules') ? undefined : { runes: true },

			adapter: adapterStatic({
				pages: 'build',
				assets: 'build',
				fallback: 'index.html',
				precompress: false,
				strict: false
			}),
			paths: { base }
		})
	],
	server: { port: 5126, host: '127.0.0.1' },
	resolve: { alias: { '$data': path.resolve('..', 'data') } }
});
