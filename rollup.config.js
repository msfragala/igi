import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import externals from 'rollup-plugin-node-externals';
import shebang from 'rollup-plugin-preserve-shebang';
import { terser } from 'rollup-plugin-terser';

export default {
   input: 'src/igi.ts',
   output: {
      dir: 'dist',
      format: 'cjs',
   },
   plugins: [
      externals(),
      typescript(),
      json(),
      resolve(),
      commonjs(),
      shebang(),
      terser(),
   ],
   onwarn(warning, warn) {
      if (warning.code !== 'CIRCULAR_DEPENDENCY') {
         warn(warning);
      }
   },
};
