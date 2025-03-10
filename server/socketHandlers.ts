import { Server, Socket } from "socket.io"
import { loadInitialText, saveTextToFile } from "./utils.js"

interface CursorPosition {
  x: number;
  y: number;
  visible: boolean;
}

interface InitialData {
  text: string;
  userCount: number;
  cursors: { [key: string]: CursorPosition }
}

let currentText: string = loadInitialText();
let userCount: number = 0;
const userCursors: { [key: string]: CursorPosition } = {}

export default function setupSocket(io: Server): void {
  io.on("connection", (socket: Socket) => {
    userCount++;
    console.log("A user connected. Total users:", userCount)

    userCursors[socket.id] = { x: 0, y: 0, visible: false }

    socket.emit("initial-data", {
      text: currentText,
      userCount: userCount,
      cursors: userCursors,
    } as InitialData)

    io.emit("user-count-update", userCount)

    socket.on("cursor-move", (position: CursorPosition) => {
      userCursors[socket.id] = { ...position, visible: true }
      socket.broadcast.emit("cursor-update", {
        id: socket.id,
        position: userCursors[socket.id],
      })
    })

    socket.on("cursor-hide", () => {
      userCursors[socket.id].visible = false
      socket.broadcast.emit("cursor-hide", socket.id)
    })

    socket.on("text-update", (text: string) => {
      currentText = text
      saveTextToFile(text)
      socket.broadcast.emit("text-update", text)
    })

    socket.on("disconnect", () => {
      userCount--
      console.log("A user disconnected. Total users:", userCount)
      delete userCursors[socket.id]
      io.emit("user-count-update", userCount)
      io.emit("cursor-remove", socket.id)
    })
  })
}