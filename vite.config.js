import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
//for some commonjs (by require('module'))
import commonjs from 'vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/desk/',
    plugins: [react(), tsconfigPaths(), commonjs()],
    build: {
        outDir: './dist/desk',
        rollupOptions: {
            output: {
                entryFileNames: ({ name }) => {
                    return 'assets/[name].[hash].js'
                },
                chunkFileNames: ({ name }) => {
                    return 'assets/[name].[hash].js'
                },
                assetFileNames: ({ name }) => {
                    if (/\.(woff2?|ttf|otf)$/.test(name ?? '')) {
                        return 'assets/fonts/[name].[hash].[ext]';
                    }
                    // if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
                    //     return 'assets/[name].[hash].[ext]';
                    // }
                    // if (/\.css$/.test(name ?? '')) {
                    //     return 'assets/[name].[hash].[ext]';
                    // }
                    return 'assets/[name].[hash].[ext]';
                }
            }
        }
    }
})
