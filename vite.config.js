import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
//for some commonjs (by require('module'))
import commonjs from 'vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths(), commonjs()],
    build: {
        rollupOptions: {
            output: {
                entryFileNames: ({ name, facadeModuleId }) => {
                    console.log(">>>entryFileNames>", name, facadeModuleId)
                    return 'assets/[name].[hash].js'
                },
                chunkFileNames: ({ name, facadeModuleId }) => {
                    console.log(">>chunkFileNames>", name, facadeModuleId)
                    return 'assets/[name].[hash].js'
                },
                assetFileNames: ({ name, facadeModuleId }) => {
                    console.log(">>>assetFileNames>", name, facadeModuleId)
                    if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
                        return 'assets/[name].[hash].[ext]';
                    }
                    if (/\.css$/.test(name ?? '')) {
                        return 'assets/[name].[hash].[ext]';
                    }
                    return 'assets/[name].[hash].[ext]';
                }
            }
        }
    }
})
