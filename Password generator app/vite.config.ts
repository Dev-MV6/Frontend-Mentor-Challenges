import { defineConfig } from "vite"
import preact from "@preact/preset-vite"

declare const process: any

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  base: process.env.NODE_ENV === "production" ? "/Frontend-Mentor-Challenges/Password generator app/" : "",
})
