import { defineConfig } from 'vite';
import path from 'path';
import nesting from 'postcss-nesting';
import autoprefixer from 'autoprefixer';
import dts from 'vite-plugin-dts';

export default defineConfig({
    server: {
        host: '0.0.0.0',
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'wc',
            fileName: 'index',
        },
    },
    plugins: [dts({ include: [path.resolve(__dirname, 'src/index.ts')] })],
    css: {
        postcss: {
            plugins: [nesting, autoprefixer],
        },
    },
});
