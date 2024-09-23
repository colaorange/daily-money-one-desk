import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
//for some commonjs (by require('module'))
import commonjs from 'vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/desktop/',
    plugins: [react(), tsconfigPaths(), commonjs()],
    build: {
        outDir: './dist/desktop',
        rollupOptions: {
            output: {
                // fail on dmo env
                // manualChunks(id) {
                //     if (id.includes('/node_modules/')) {
                //         if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/')) {
                //             return 'react';
                //         } else if (id.includes('/node_modules/@mui/') || id.includes('/node_modules/@emotion/')) {
                //             return 'mui';
                //         } else if (id.includes('/node_modules/d3-')) {
                //             return 'd3';
                //         } else if (id.includes('/node_modules/moment/')) {
                //             return 'moment';
                //         } else {
                //             return 'other';
                //         }
                //     }
                // },
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
