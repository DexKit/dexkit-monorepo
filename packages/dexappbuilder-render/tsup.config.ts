import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.tsx',
    widget: 'src/widget.tsx',
  },
  outDir: 'dist',
  platform: 'browser',
  dts: true
})

