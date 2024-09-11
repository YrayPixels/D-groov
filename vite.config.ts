import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import csp from 'vite-plugin-csp';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


export default defineConfig({
  plugins: [react(),
  nodePolyfills({
    globals: {
      Buffer: true,
    },
    protocolImports: true,
  }),

  ],
  build: {
    // Ensure the build does not use inline scripts
    rollupOptions: {
      output: {
        inlineDynamicImports: false
      }
    }
  },
  server: {
    hmr: true, // Disable HMR to avoid inline script injection
    headers: {
      'Content-Security-Policy': "default-src 'self'; connect-src 'self' wss://mainnet.helius-rpc.com/ wss://api.devnet.solana.com/ wss://devnet.helius-rpc.com/ https://api.devnet.solana.com/ https://devnet.helius-rpc.com/ https://blinks.ytechno.com.ng https://api.solana.fm/ https://rpc.shyft.to https://api.shyft.to/sol/  https://api.mainnet-beta.solana.com/  http://localhost:* https://*.dial.to/ https://proxy.dial.to/; img-src 'self' https://img-cdn.magiceden.dev/ https://*.dial.to/ https://proxy.dial.to/ https://img-cdn.magiceden.dev/ https://updg8.storage.googleapis.com/ https://shdw-drive.genesysgo.net/ https://nfts.dscvr.one/  https://*.arweave.net/ https://arweave.net; script-src 'self'; style-src 'self' 'unsafe-inline';"
    }
  },
})
