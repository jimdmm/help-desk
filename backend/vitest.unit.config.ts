import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  oxc: false,
  plugins: [swc.vite({ module: { type: 'es6' } })],
  test: {
    name: 'unit',
    include: ['src/**/*.spec.ts'],
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/index.ts',
        'src/main.ts',
        'src/infra/database/prisma/**',
      ],
    },
  },
})