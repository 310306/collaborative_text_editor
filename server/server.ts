import express from "express"
import http from "http"
import { Server } from "socket.io"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import setupSocket from "./socketHandlers.js"


const __filename: string = fileURLToPath(import.meta.url)
export const __dirname: string = dirname(__filename)

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(join(__dirname, "../public")))

setupSocket(io)

const PORT: number = 3000
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})