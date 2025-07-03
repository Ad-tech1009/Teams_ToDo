import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // server: {
  //   proxy:
  //   {
  //     "/api":{
  //       target: "https://teams-todo-back.onrender.com",
  //       changeOrigin: false,
  //       secure: true,
  //       rewrite: (path) => path.replace(/^\/api/,''),
  //     }
  //   },
  //   },
})
