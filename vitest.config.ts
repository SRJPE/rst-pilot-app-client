import { defineConfig } from 'vitest/config'

/**
 * Unit tests for PURE logic only — no React Native, no Expo, no native modules.
 *
 * The app itself is bundled by Metro; this config exists solely so data-shaping
 * helpers (which have no RN imports) can be tested in plain node. Keep the
 * `include` glob narrow on purpose: widening it to component tests would pull
 * in the whole native surface and require a much heavier setup.
 */
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/utils/**/__tests__/**/*.test.ts'],
  },
})
