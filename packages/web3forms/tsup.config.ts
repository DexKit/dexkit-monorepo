import { defineConfig } from 'tsup';

/*const replaceNodeBuiltIns = () => {
  const replace = {
    'path': require('path-browserify')
  }
  const filter = RegExp(`^(${Object.keys(replace).join("|")})$`);
  return {
    name: "replaceNodeBuiltIns",
    //@ts-ignore
    setup(build) {
      //@ts-ignore
      build.onResolve({ filter }, arg => ({
        //@ts-ignore
        path: replace[arg.path],
      }));
    },
  };
}*/

export default defineConfig({
  entry: {
    'index': 'index.ts',
    'types': 'types/index.ts',
    'components/ContractFormView': 'components/ContractFormView.tsx',
    'hooks': 'hooks/index.ts',
    'services': 'services/index.ts',
    'utils': 'utils/index.ts',
    'constants': 'constants/index.ts'
  }
})