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
                manualChunks: {
                    lodash: ['lodash'],
                    moment: ['moment', 'moment-timezone'],
                    i18next: ['i18next'],
                    d3: ['d3-color', 'd3-delaunay', 'd3-interpolate', 'd3-scale', 'd3-shape', 'd3-time'],

                    //before mui
                    react: ['react', 'react-dom', 'react-error-boundary', 'react-icons', 'react-router-dom'],
                    mobx: ['mobx', 'mobx-react-lite'],
                    emotion: ['@emotion/css', '@emotion/react', '@emotion/styled'],
                    font: ['@fontsource/roboto'],
                    mui: ['@mui/material', '@mui/icons-material', '@mui/system'],
                    'mui-ext': ['@mui/x-charts', '@mui/x-date-pickers'],

                },
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
