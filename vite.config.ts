import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import narrationHandler from './api/narration.js'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(),{name:'teacher-narration',configureServer(server){server.middlewares.use('/api/narration',(req,res)=>{void narrationHandler(req,res);});}}],
  server: {
    port: 3000,
    open: false
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        chimNoi: resolve(__dirname, 'chim-noi.html'),
        phaMau: resolve(__dirname, 'pha-mau.html'),
        denDungNham: resolve(__dirname, 'den-dung-nham.html'),
        beCuuSinh: resolve(__dirname, 'be-cuu-sinh.html'),
        doLuong: resolve(__dirname, 'do-luong.html'),
      }
    }
  }
})
