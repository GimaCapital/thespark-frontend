// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['icons/*.png'],
            manifest: {
                name: 'TheSpark',
                short_name: 'TheSpark',
                description: 'Save daily. Earn 5%. Rise together.',
                theme_color: '#F97316',
                background_color: '#FFFFFF',
                display: 'standalone',
                icons: [
                    {
                        src: '/icons/icon-72x72.png',
                        sizes: '72x72',
                        type: 'image/png'
                    },
                    {
                        src: '/icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true
            }
        }
    },
    build: {
        // ✅ Increase chunk size warning limit
        chunkSizeWarningLimit: 1500,
        
        // ✅ Code splitting configuration
        rollupOptions: {
            output: {
                manualChunks: {
                    // Split React into its own chunk
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    
                    // Split Firebase into its own chunk
                    'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
                    
                    // Split other large libraries
                    'utils-vendor': ['axios', 'framer-motion', 'react-hot-toast'],
                }
            }
        }
    }
});