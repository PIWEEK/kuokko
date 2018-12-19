import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'kuokko',
  srcDir: 'src/components',
  devServer: {
    openBrowser: false
  },
  outputTargets: [
    {
      type: 'dist',
      dir: 'out/components'
    }
  ]
};
