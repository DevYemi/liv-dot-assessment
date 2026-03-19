import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart({
      router: {
        routesDirectory: './views/routes',
        entry: './router.tsx',
        generatedRouteTree: './routeTree.gen.ts',
      },
    }),
    nitro(),
    viteReact(),
  ],
})

export default config
