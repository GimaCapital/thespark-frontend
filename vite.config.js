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
        
        // ✅ Code splitting configuration - UPDATED to function format
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Split React into its own chunk
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                            return 'react-vendor';
                        }
                        if (id.includes('firebase') || id.includes('@firebase')) {
                            return 'firebase-vendor';
                        }
                        if (id.includes('axios') || id.includes('framer-motion') || id.includes('react-hot-toast')) {
                            return 'utils-vendor';
                        }
                        // Everything else in node_modules
                        return 'vendor';
                    }
                }
            }
        }
    }
});