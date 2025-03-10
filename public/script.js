const socket = io("http://localhost:3000")
const textarea = document.getElementById("editor")
const userCountElement = document.getElementById("user-count")
    const cursors = {}

    
socket.on("initial-data", (data) => {
    textarea.value = data.text
    userCountElement.textContent = data.userCount

      
    for (const [id, cursorData] of Object.entries(data.cursors)) {
      if (id !== socket.id) {
          createCursor(id, cursorData)
        }
      }
    })

    
    textarea.addEventListener("input", (e) => {
      const text = e.target.value;
      socket.emit("text-update", text)
    });

    
    socket.on("text-update", (text) => {
      textarea.value = text
    })

    
    socket.on("user-count-update", (count) => {
      userCountElement.textContent = count
    })

   
    textarea.addEventListener("mousemove", (e) => {
      const rect = textarea.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      socket.emit("cursor-move", { x, y })
    })

    
    textarea.addEventListener("mouseleave", () => {
      socket.emit("cursor-hide")
    })

    
    textarea.addEventListener("mouseenter", () => {
      const rect = textarea.getBoundingClientRect();
      const x = rect.width / 2
      const y = rect.height / 2

      socket.emit("cursor-move", { x, y })
    })

    socket.on("cursor-update", (data) => {
      createCursor(data.id, data.position)
    })

    socket.on("cursor-remove", (id) => {
      const cursor = document.getElementById(`cursor-${id}`)
      if (cursor) {
        cursor.remove()
      }
    })

    socket.on("cursor-hide", (id) => {
      const cursor = document.getElementById(`cursor-${id}`)
      if (cursor) {
        cursor.style.display = "none"
      }
    })

    function createCursor(id, position) {
      let cursor = document.getElementById(`cursor-${id}`)
      if (!cursor) {
        cursor = document.createElement("div")
        cursor.id = `cursor-${id}`
        cursor.classList.add("cursor")
        document.body.appendChild(cursor)
      }
      cursor.style.left = `${position.x + textarea.offsetLeft}px`
      cursor.style.top = `${position.y + textarea.offsetTop - 10}px`
      cursor.style.display = position.visible ? "block" : "none"
    }