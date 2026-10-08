/// <reference types="vitest/config" />

import { getViteConfig } from 'astro/config';

export default getViteConfig({
	test: {
		environment: 'node',
		include: ['tests/**/*.test.ts', 'engine/agents/**/__tests__/**/*.test.ts'],
	},
});
