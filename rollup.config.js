// import sass from 'rollup-plugin-sass';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import scss from 'rollup-plugin-scss';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: './src/index.ts',
    output: [
      {
        file: 'lib/index.ts',
        format: 'cjs'
      },
      {
        file: 'lib/index.es.ts',
        format: 'es',
        exports: 'named'
      }
    ],
    plugins: [
      typescript({
        tsconfigOverride: { exclude: ['**/*.test.tsx', '**/*.test.ts', '**/*.spec.tsx', '**/*.spec.ts'] }
      }),
      external(),
      resolve(),
      terser(),
      scss({
        output: 'lib/styles/bundle.css'
      })
    ]
  }
];
