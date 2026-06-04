import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  oxc: false,
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    name: 'e2e',
    include: ['test/E2E/**/*.e2e-spec.ts'],
    globalSetup: ['./test/E2E/global-setup.ts'],
    environment: 'node',
    globals: true,
    testTimeout: 30000,
    hookTimeout: 60000,
    pool: 'forks',
    maxWorkers: 1,
    minWorkers: 1,
    sequence: {
      concurrent: false,
    },
  },
})
