import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: { '@': path.resolve(__dirname, './src') }
    },
    server: {
        host: true,
        port: process.env.PORT ? Number(process.env.PORT) : undefined,
        strictPort: !!process.env.PORT
    }
});
