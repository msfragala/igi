import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import node from '@rollup/plugin-node-resolve';
import externals from 'rollup-plugin-node-externals';

export default {
   input: 'src/igi.ts',
   output: {
      dir: 'dist',
      format: 'cjs',
   },
   plugins: [typescript(), json(), node(), commonjs(), externals()],
   onwarn(warning, warn) {
      if (warning.code !== 'CIRCULAR_DEPENDENCY') {
         warn(warning);
      }
   },
};
