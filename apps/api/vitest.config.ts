import { defineConfig, coverageConfigDefaults } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import swc from 'unplugin-swc';

export default defineConfig({
  plugins: [
    tsconfigPaths(),

    swc.vite({
      module: { type: 'es6' },
      jsc: {
        keepClassNames: true,
        target: 'es2022',
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      exclude: [
        ...coverageConfigDefaults.exclude,
        '**/*.mapper.ts',
        '**/*.contract.ts',
      ],
    },
  },
});
